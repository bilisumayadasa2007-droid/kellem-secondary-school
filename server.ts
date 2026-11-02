import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { Resend } from 'resend';
import { GoogleGenAI } from '@google/genai';
import { buildCurriculumExam, EXAM_SUBJECTS } from './src/data/examQuestionBank.ts';
import { ExamSubject, ExamTargetRole, GeneratedExam, InstitutionalAnnouncement } from './src/types.ts';
import { INITIAL_ANNOUNCEMENTS } from './src/data/institutionalAnnouncements.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let geminiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    geminiClient = new GoogleGenAI();
  } catch (e) {
    console.warn('Could not initialize GoogleGenAI client:', e);
  }
}

const PORT = 3000;
const ADMIN_EMAIL = 'Bilisatech4@gmail.com'.toLowerCase();

// Persistent storage setup
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'kellem_db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export type UserStatus = 'pending' | 'approved' | 'rejected';
export type UserRole = 'admin' | 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  className: string;
  status: UserStatus;
  registrationDate: string;
  decisionDate: string | null;
  decisionBy: string | null;
  decisionReason: string | null;
  approvalToken: string;
  rejectionToken: string;
  points: number;
  quizPoints: number;
  quizzesCompleted: number;
  accuracy: number;
  bestStreak: number;
  photoUrl?: string;
  age?: number;
  phone?: string;
  approvalNotificationSent?: boolean;
  approvalNotificationSentAt?: string | null;
}

export interface EmailRecord {
  id: string;
  type: 'admin_approval_request' | 'student_approval_notification' | 'student_rejection_notification' | 'system';
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
  timestamp: string;
  studentId: string;
  studentName: string;
  actionTaken?: boolean;
  deliveryStatus?: 'delivered' | 'failed' | 'unconfigured' | 'skipped_duplicate';
  deliveryError?: string | null;
  resendMessageId?: string | null;
  provider?: 'resend' | 'system';
}

export interface ResendConfigStatus {
  hasKey: boolean;
  source: 'secret_manager' | 'environment_variable' | 'none';
  projectId: string | null;
  secretName: string;
  fromEmail: string;
  adminEmail: string;
  secretManagerStatus: 'connected' | 'disabled_or_permission_denied' | 'not_found' | 'error';
  secretManagerMessage: string;
}

export interface Session {
  userId: string;
  token: string;
  createdAt: string;
  expiresAt: string;
}

interface Database {
  users: User[];
  sessions: Record<string, Session>;
  emails: EmailRecord[];
  announcements: InstitutionalAnnouncement[];
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password.trim()).digest('hex');
}

const INITIAL_APPROVED_STUDENTS = [
  { name: 'Bilisummaa Yaadasaa', email: 'bilisummaa@kellem.edu.et', className: 'Natural Science', points: 98, quizPoints: 360, quizzesCompleted: 8, accuracy: 96, bestStreak: 12 },
  { name: "Raajii Amanu'e", email: 'raajii@kellem.edu.et', className: 'Natural Science', points: 96, quizPoints: 320, quizzesCompleted: 7, accuracy: 93, bestStreak: 10 },
  { name: 'Feeneet Yooseef', email: 'feeneet@kellem.edu.et', className: 'Natural Science', points: 94, quizPoints: 290, quizzesCompleted: 6, accuracy: 90, bestStreak: 8 },
  { name: 'Israel Kassahuun', email: 'israel@kellem.edu.et', className: 'Natural Science', points: 91, quizPoints: 270, quizzesCompleted: 6, accuracy: 88, bestStreak: 7 },
  { name: 'Eebbisa Beekaa', email: 'eebbisa@kellem.edu.et', className: 'Social Science', points: 90, quizPoints: 250, quizzesCompleted: 5, accuracy: 86, bestStreak: 7 },
  { name: 'Guutuu Aboomaa', email: 'guutuu@kellem.edu.et', className: 'Natural Science', points: 89, quizPoints: 230, quizzesCompleted: 5, accuracy: 85, bestStreak: 6 },
  { name: 'Caaltuu Kennaa', email: 'caaltuu@kellem.edu.et', className: 'Social Science', points: 88, quizPoints: 210, quizzesCompleted: 4, accuracy: 84, bestStreak: 5 },
  { name: 'Taliilaa Jaallataa', email: 'taliilaa@kellem.edu.et', className: 'Natural Science', points: 87, quizPoints: 190, quizzesCompleted: 4, accuracy: 82, bestStreak: 5 },
  { name: 'Atinaboon Rattaa', email: 'atinaboon@kellem.edu.et', className: 'Natural Science', points: 85, quizPoints: 170, quizzesCompleted: 3, accuracy: 80, bestStreak: 4 },
  { name: 'Feeneet Gaaromaa', email: 'feeneet.g@kellem.edu.et', className: 'Natural Science', points: 84, quizPoints: 160, quizzesCompleted: 3, accuracy: 78, bestStreak: 4 },
  { name: 'Nabiyyuu Sulxaan', email: 'nabiyyuu@kellem.edu.et', className: 'Natural Science', points: 82, quizPoints: 140, quizzesCompleted: 3, accuracy: 76, bestStreak: 3 },
  { name: 'Toleeraa Tatikuu', email: 'toleeraa@kellem.edu.et', className: 'Natural Science', points: 80, quizPoints: 120, quizzesCompleted: 2, accuracy: 74, bestStreak: 3 },
  { name: 'Lammii Xilahuun', email: 'lammii@kellem.edu.et', className: 'Natural Science', points: 78, quizPoints: 110, quizzesCompleted: 2, accuracy: 72, bestStreak: 3 },
  { name: 'Gammachuu Takkaa', email: 'gammachuu@kellem.edu.et', className: 'Natural Science', points: 76, quizPoints: 90, quizzesCompleted: 2, accuracy: 70, bestStreak: 2 },
  { name: 'Fatiyaa Yaasiin', email: 'fatiyaa@kellem.edu.et', className: 'Natural Science', points: 74, quizPoints: 80, quizzesCompleted: 1, accuracy: 68, bestStreak: 2 },
  { name: 'Siifan Efreem', email: 'siifan@kellem.edu.et', className: 'Natural Science', points: 72, quizPoints: 60, quizzesCompleted: 1, accuracy: 65, bestStreak: 1 }
];

function initDatabase(): Database {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.users)) {
        // Ensure administrator exists
        const adminFound = parsed.users.find((u: User) => u.email.toLowerCase() === ADMIN_EMAIL);
        if (!adminFound) {
          parsed.users.unshift(createAdminUser());
          saveDb(parsed);
        }
        if (!Array.isArray(parsed.announcements) || parsed.announcements.length === 0) {
          parsed.announcements = INITIAL_ANNOUNCEMENTS;
          saveDb(parsed);
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error reading DB, re-initializing:', e);
    }
  }

  const db: Database = {
    users: [
      createAdminUser(),
      ...INITIAL_APPROVED_STUDENTS.map(s => ({
        id: `stu_${s.name.toLowerCase().replace(/[^a-z]/g, '_')}`,
        name: s.name,
        email: s.email,
        passwordHash: hashPassword('Kellem@2026'),
        role: 'student' as UserRole,
        className: s.className,
        status: 'approved' as UserStatus,
        registrationDate: new Date('2026-09-01T08:00:00Z').toISOString(),
        decisionDate: new Date('2026-09-01T09:00:00Z').toISOString(),
        decisionBy: ADMIN_EMAIL,
        decisionReason: 'Pre-enrolled school honor student',
        approvalToken: crypto.randomBytes(24).toString('hex'),
        rejectionToken: crypto.randomBytes(24).toString('hex'),
        points: s.points,
        quizPoints: s.quizPoints,
        quizzesCompleted: s.quizzesCompleted,
        accuracy: s.accuracy,
        bestStreak: s.bestStreak
      }))
    ],
    sessions: {},
    emails: [],
    announcements: INITIAL_ANNOUNCEMENTS
  };

  saveDb(db);
  return db;
}

function createAdminUser(): User {
  return {
    id: 'admin_bilisatech',
    name: 'Administrator (Bilisatech)',
    email: ADMIN_EMAIL,
    passwordHash: hashPassword('Admin@Kellem2026'),
    role: 'admin',
    className: 'School Administration & Governance',
    status: 'approved',
    registrationDate: new Date().toISOString(),
    decisionDate: new Date().toISOString(),
    decisionBy: 'system',
    decisionReason: 'Super Administrator',
    approvalToken: 'admin_token',
    rejectionToken: 'admin_token',
    points: 100,
    quizPoints: 500,
    quizzesCompleted: 10,
    accuracy: 99,
    bestStreak: 15
  };
}

let db = initDatabase();

function saveDb(dataToSave?: Database) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save database file:', err);
  }
}

// -------------------------------------------------------------
// GOOGLE CLOUD SECRET MANAGER & RESEND API INTEGRATION
// Requirement 10: Use the Resend API from the Cloud Run backend only.
// Requirement 11: Read the RESEND_API_KEY from Google Cloud Secret Manager.
// Requirement 12: Add proper error handling, logging and duplicate notification prevention.
// -------------------------------------------------------------

let cachedResendApiKey: string | null = null;
let lastSecretCheckTime = 0;
const SECRET_CACHE_TTL = 60 * 1000; // 1 minute cache

export async function getResendApiKey(): Promise<{
  key: string | null;
  source: 'secret_manager' | 'environment_variable' | 'none';
  errorDetail?: string;
  projectId?: string | null;
}> {
  // 1. Check environment variable first (standard Cloud Run mapping for Secret Manager secrets)
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim()) {
    return {
      key: process.env.RESEND_API_KEY.trim(),
      source: 'environment_variable',
      projectId: process.env.GOOGLE_CLOUD_PROJECT || 'ais-europe-west1-18466e18a1c84'
    };
  }

  // 2. Check cached key
  if (cachedResendApiKey && Date.now() - lastSecretCheckTime < SECRET_CACHE_TTL) {
    return {
      key: cachedResendApiKey,
      source: 'secret_manager',
      projectId: process.env.GOOGLE_CLOUD_PROJECT || 'ais-europe-west1-18466e18a1c84'
    };
  }

  // 3. Attempt to fetch from Google Cloud Secret Manager
  let detectedProject: string | null = null;
  try {
    const client = new SecretManagerServiceClient();
    detectedProject =
      process.env.GOOGLE_CLOUD_PROJECT ||
      process.env.GCP_PROJECT ||
      process.env.GCLOUD_PROJECT ||
      (await client.getProjectId().catch(() => null));

    if (!detectedProject) {
      detectedProject = 'ais-europe-west1-18466e18a1c84';
    }

    const secretPath = `projects/${detectedProject}/secrets/RESEND_API_KEY/versions/latest`;
    console.log(`[SECRET_MANAGER] Attempting to read secret: ${secretPath}`);
    const [version] = await client.accessSecretVersion({ name: secretPath });
    const payload = version.payload?.data?.toString('utf8')?.trim();

    if (payload) {
      cachedResendApiKey = payload;
      lastSecretCheckTime = Date.now();
      console.log(`[SECRET_MANAGER] Successfully retrieved RESEND_API_KEY from Secret Manager (Project: ${detectedProject})`);
      return {
        key: payload,
        source: 'secret_manager',
        projectId: detectedProject
      };
    } else {
      return {
        key: null,
        source: 'none',
        errorDetail: 'Secret "RESEND_API_KEY" exists in Secret Manager but payload is empty.',
        projectId: detectedProject
      };
    }
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    console.warn(`[SECRET_MANAGER] Could not read secret RESEND_API_KEY: ${errMsg}`);
    return {
      key: null,
      source: 'none',
      errorDetail: errMsg,
      projectId: detectedProject
    };
  }
}

export async function getEmailConfigStatus(): Promise<ResendConfigStatus> {
  const secretResult = await getResendApiKey();
  const projectId = secretResult.projectId || process.env.GOOGLE_CLOUD_PROJECT || 'ais-europe-west1-18466e18a1c84';

  let smStatus: 'connected' | 'disabled_or_permission_denied' | 'not_found' | 'error' = 'error';
  let smMsg = secretResult.errorDetail || 'Secret Manager not configured';

  if (secretResult.source === 'secret_manager') {
    smStatus = 'connected';
    smMsg = `RESEND_API_KEY successfully accessed from Google Cloud Secret Manager in project ${projectId}.`;
  } else if (secretResult.source === 'environment_variable') {
    smStatus = 'connected';
    smMsg = 'RESEND_API_KEY provided via environment variable (Cloud Run secret mount).';
  } else if (secretResult.errorDetail?.includes('PERMISSION_DENIED') || secretResult.errorDetail?.includes('disabled')) {
    smStatus = 'disabled_or_permission_denied';
    smMsg = `Secret Manager API is disabled or permission denied in project ${projectId}. Enable it via Google Cloud Console or gcloud services enable secretmanager.googleapis.com`;
  } else if (secretResult.errorDetail?.includes('NOT_FOUND') || secretResult.errorDetail?.includes('not found')) {
    smStatus = 'not_found';
    smMsg = `Secret named "RESEND_API_KEY" was not found in project ${projectId}.`;
  }

  return {
    hasKey: !!secretResult.key,
    source: secretResult.source,
    projectId,
    secretName: 'RESEND_API_KEY',
    fromEmail: process.env.RESEND_FROM_EMAIL || 'Kellem Secondary School <onboarding@resend.dev>',
    adminEmail: ADMIN_EMAIL,
    secretManagerStatus: smStatus,
    secretManagerMessage: smMsg
  };
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  status: 'delivered' | 'failed' | 'unconfigured' | 'skipped_duplicate';
  source?: string;
}

export async function sendActualResendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<SendEmailResult> {
  const { key, source, errorDetail, projectId } = await getResendApiKey();

  // STRICT REQUIREMENT: If the API key is missing, DO NOT SIMULATE SUCCESSFUL DELIVERY!
  if (!key) {
    const errorMsg = `Cannot send email via Resend: RESEND_API_KEY is not configured in Google Cloud Secret Manager (Project: ${projectId || 'ais-europe-west1-18466e18a1c84'}) or environment variables. Detail: ${errorDetail || 'Key missing'}`;
    console.error(`[RESEND_ERROR] ${errorMsg}`);
    return {
      success: false,
      status: 'unconfigured',
      error: errorMsg,
      source: 'none'
    };
  }

  try {
    const resend = new Resend(key);
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'Kellem Secondary School <onboarding@resend.dev>';

    console.log(`[RESEND_DISPATCH] Dispatching email to ${params.to} using Resend (From: ${fromAddress}, Source: ${source})...`);

    const response = await resend.emails.send({
      from: fromAddress,
      to: [params.to],
      subject: params.subject,
      html: params.html,
      text: params.text || ''
    });

    if (response.error) {
      console.error(`[RESEND_API_ERROR] Resend API returned error:`, response.error);
      return {
        success: false,
        status: 'failed',
        error: `${response.error.name || 'ResendError'}: ${response.error.message}`,
        source
      };
    }

    const resendId = response.data?.id;
    console.log(`[RESEND_SUCCESS] Email dispatched successfully! Resend Message ID: ${resendId}`);
    return {
      success: true,
      status: 'delivered',
      messageId: resendId,
      source
    };
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    console.error(`[RESEND_EXCEPTION] Exception during Resend dispatch:`, errMsg);
    return {
      success: false,
      status: 'failed',
      error: errMsg,
      source
    };
  }
}

// Helper: dispatch approval request email to administrator (Requirement 1 & 4)
async function sendApprovalRequestEmailToAdmin(student: User, appUrl: string): Promise<EmailRecord> {
  // Requirement 12: Duplicate notification prevention
  if (student.approvalNotificationSent) {
    console.log(`[DUPLICATE_PREVENTION] Approval notification already dispatched for student ${student.name} (${student.email}), skipping duplicate.`);
    const existing = db.emails.find(e => e.studentId === student.id && e.type === 'admin_approval_request');
    if (existing) return existing;
  }

  const approvalLink = `${appUrl}/api/admin/quick-action?token=${student.approvalToken}&action=approve`;
  const rejectionLink = `${appUrl}/api/admin/quick-action?token=${student.rejectionToken}&action=reject`;
  const portalLink = `${appUrl}/#student-login`;

  const subject = `[ACTION REQUIRED] New Student Registration Approval: ${student.name} (${student.email})`;
  const photoHtml = student.photoUrl ? `
    <tr>
      <td style="padding: 10px 0; color: #64748b; width: 140px; font-weight: 600; vertical-align: middle;">Student Photo:</td>
      <td style="padding: 10px 0;">
        <img src="${student.photoUrl}" alt="${student.name}" style="width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 3px solid #08b48f; box-shadow: 0 4px 10px rgba(0,0,0,0.15);" />
      </td>
    </tr>
  ` : `
    <tr>
      <td style="padding: 10px 0; color: #64748b; width: 140px; font-weight: 600; vertical-align: middle;">Student Photo:</td>
      <td style="padding: 10px 0; color: #64748b; font-style: italic;">
        No photo uploaded yet (student can upload in Settings)
      </td>
    </tr>
  `;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06);">
      <div style="background: linear-gradient(135deg, #072439, #094732); color: #ffffff; padding: 24px 32px; text-align: left; display: flex; align-items: center; gap: 16px;">
        <img src="${appUrl}/assets/aistudio/kss_best_logo_9d217f0f.png" alt="KSS Logo" style="width: 60px; height: 60px; border-radius: 50%; background: #ffffff; padding: 2px; border: 2px solid #08b48f; object-fit: contain;" />
        <div>
          <div style="display: inline-block; background: #08b48f; color: #072439; font-size: 11px; font-weight: 900; padding: 3px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">
            Admissions & Student Identification
          </div>
          <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #ffffff;">Kellem Secondary School</h1>
          <p style="margin: 3px 0 0; font-size: 13px; color: #a9d8c2;">Mana Barumsaa Qellem Sad 2ffaa • Dambi Dollo, Ethiopia</p>
        </div>
      </div>

      <div style="padding: 32px; color: #1e293b; line-height: 1.6;">
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid #f59e0b; padding: 14px 18px; border-radius: 8px; margin-bottom: 24px;">
          <strong style="color: #92400e; font-size: 15px;">Pending Student Registration Request</strong>
          <p style="margin: 4px 0 0; color: #b45309; font-size: 13px;">A new student has registered and requires administrator approval before accessing protected portal pages. Students can manually upload their profile photo, age, and phone number in their Account Settings.</p>
        </div>

        <h3 style="margin: 0 0 16px; font-size: 17px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Applicant Identity & Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
          ${photoHtml}
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 140px; font-weight: 600;">Student Name:</td>
            <td style="padding: 8px 0; color: #0f172a; font-weight: 700; font-size: 15px;">${student.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Age:</td>
            <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${student.age ? `${student.age} years old` : 'Not specified yet (can be added in Settings)'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Phone Number:</td>
            <td style="padding: 8px 0; color: #087a69; font-weight: 700;">
              ${student.phone ? `<a href="tel:${student.phone}" style="color: #087a69; text-decoration: none;">📞 ${student.phone}</a>` : '<span style="color:#64748b;font-weight:normal;font-style:italic;">Not provided yet (can be added in Settings)</span>'}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Email Address:</td>
            <td style="padding: 8px 0; color: #0f172a; font-weight: 700;">${student.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Academic Stream:</td>
            <td style="padding: 8px 0; color: #087a69; font-weight: 700;">${student.className}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Registration Date:</td>
            <td style="padding: 8px 0; color: #0f172a;">${new Date(student.registrationDate).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Current Status:</td>
            <td style="padding: 8px 0;"><span style="background: #fef3c7; color: #92400e; font-size: 12px; font-weight: 800; padding: 3px 8px; border-radius: 6px;">PENDING APPROVAL</span></td>
          </tr>
        </table>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
          <h4 style="margin: 0 0 12px; font-size: 14px; color: #334155;">1-Click Administrator Action:</h4>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <a href="${approvalLink}" style="display: inline-block; background: #08a989; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; margin: 4px;">
              ✓ APPROVE Student Account
            </a>
            <a href="${rejectionLink}" style="display: inline-block; background: #dc2626; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; margin: 4px;">
              ✕ REJECT Registration
            </a>
          </div>
          <p style="margin: 12px 0 0; font-size: 12px; color: #64748b;">Clicking either button will instantly update the student's status and dispatch an official notification email to ${student.email}.</p>
        </div>

        <p style="font-size: 13px; color: #64748b; margin: 0;">
          You can also log into the <a href="${portalLink}" style="color: #08a989; font-weight: 600;">Kellem Administrator Console</a> with <strong>${ADMIN_EMAIL}</strong> to manage all student records, view audit logs, and monitor Kellem AI learning activity.
        </p>
      </div>

      <div style="background: #f1f5f9; padding: 16px 32px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
        Kellem Secondary School Portal • Dambi Dollo, Oromia, Ethiopia • Administrator: ${ADMIN_EMAIL}
      </div>
    </div>
  `;
  const text = `New student registration: ${student.name} (${student.email}) stream: ${student.className}. Approve: ${approvalLink} | Reject: ${rejectionLink}`;

  // Dispatch via Resend API
  console.log(`[EMAIL DISPATCH] Triggering Resend notification to administrator: ${ADMIN_EMAIL}`);
  const deliveryResult = await sendActualResendEmail({
    to: ADMIN_EMAIL,
    subject,
    html,
    text
  });

  const emailRecord: EmailRecord = {
    id: `email_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type: 'admin_approval_request',
    to: ADMIN_EMAIL,
    from: process.env.RESEND_FROM_EMAIL || '"Kellem Secondary School Admissions" <onboarding@resend.dev>',
    subject,
    html,
    text,
    timestamp: new Date().toISOString(),
    studentId: student.id,
    studentName: student.name,
    actionTaken: false,
    deliveryStatus: deliveryResult.status,
    deliveryError: deliveryResult.error || null,
    resendMessageId: deliveryResult.messageId || null,
    provider: 'resend'
  };

  student.approvalNotificationSent = true;
  student.approvalNotificationSentAt = new Date().toISOString();

  db.emails.unshift(emailRecord);
  saveDb();
  return emailRecord;
}

// Helper: dispatch approval/rejection notification email to student (Requirement 8)
async function sendDecisionNotificationToStudent(student: User, decision: 'approved' | 'rejected', reason: string | null | undefined, appUrl: string): Promise<EmailRecord> {
  const isApproved = decision === 'approved';
  const loginLink = `${appUrl}/#student-login`;

  const subject = isApproved
    ? `[Welcome to Kellem] Your Student Account has been APPROVED!`
    : `[Kellem Secondary School] Registration Status Update: Application Declined`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06);">
      <div style="background: ${isApproved ? 'linear-gradient(135deg, #072439, #094732)' : 'linear-gradient(135deg, #381212, #5a1e1e)'}; color: #ffffff; padding: 28px 32px;">
        <div style="display: inline-block; background: ${isApproved ? '#08b48f' : '#ef4444'}; color: #ffffff; font-size: 11px; font-weight: 900; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">
          ${isApproved ? 'Registration Approved' : 'Registration Declined'}
        </div>
        <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff;">Kellem Secondary School</h1>
        <p style="margin: 4px 0 0; font-size: 14px; color: ${isApproved ? '#a9d8c2' : '#fca5a5'};">Mana Barumsaa Qellem Sad 2ffaa • Dambi Dollo, Ethiopia</p>
      </div>

      <div style="padding: 32px; color: #1e293b; line-height: 1.6;">
        <h2 style="margin: 0 0 14px; font-size: 18px; color: #0f172a;">
          ${isApproved ? `Congratulations, ${student.name}!` : `Dear ${student.name},`}
        </h2>

        ${isApproved ? `
          <p style="margin: 0 0 16px; font-size: 15px; color: #334155;">
            We are pleased to inform you that your student account registration for <strong>${student.className}</strong> has been <strong>APPROVED</strong> by the school administrator (<strong>${ADMIN_EMAIL}</strong>).
          </p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #16a34a; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
            <strong style="color: #15803d; font-size: 14px;">Full Access Granted:</strong>
            <ul style="margin: 8px 0 0; padding-left: 20px; font-size: 13px; color: #166534;">
              <li>24/7 access to <strong>Kellem AI Learning Assistant</strong> for entrance revision and homework help</li>
              <li>Interactive Practice Quizzes across Beginner, Intermediate, and Advanced difficulty tiers</li>
              <li>Daily Streak Tracker with cumulative bonuses and Top Performers Olympic Podium ranking</li>
              <li>Curriculum study guides for Natural Science and Social Science</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${loginLink}" style="display: inline-block; background: #08a989; color: #ffffff; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 800; font-size: 15px; box-shadow: 0 4px 14px rgba(8,169,137,0.3);">
              Sign In to Kellem Portal Now →
            </a>
          </div>
        ` : `
          <p style="margin: 0 0 16px; font-size: 15px; color: #334155;">
            Thank you for your interest in Kellem Secondary School. After review, your registration could not be approved at this time.
          </p>
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-left: 4px solid #dc2626; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
            <strong style="color: #991b1b; font-size: 14px;">Administrator Note:</strong>
            <p style="margin: 6px 0 0; font-size: 13px; color: #7f1d1d;">${reason || 'Registration details could not be verified against the school enrollment register.'}</p>
          </div>
          <p style="font-size: 13px; color: #64748b;">
            If you are an enrolled student at Kellem Secondary School in Dambi Dollo and believe this is an error, please visit the directorate office or contact the administrator at <a href="mailto:${ADMIN_EMAIL}" style="color: #dc2626;">${ADMIN_EMAIL}</a>.
          </p>
        `}
      </div>

      <div style="background: #f1f5f9; padding: 16px 32px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
        Kellem Secondary School Directorate • Dambi Dollo, Oromia, Ethiopia • Leadership: 1st Director Zarihuun
      </div>
    </div>
  `;
  const text = isApproved
    ? `Congratulations ${student.name}! Your Kellem Secondary School registration has been approved. Sign in at: ${loginLink}`
    : `Dear ${student.name}, your registration was not approved. Note: ${reason || 'Details could not be verified.'}`;

  // Dispatch via Resend API
  console.log(`[EMAIL DISPATCH] Triggering Resend decision notification to student: ${student.email}`);
  const deliveryResult = await sendActualResendEmail({
    to: student.email,
    subject,
    html,
    text
  });

  const emailRecord: EmailRecord = {
    id: `email_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type: isApproved ? 'student_approval_notification' : 'student_rejection_notification',
    to: student.email,
    from: process.env.RESEND_FROM_EMAIL || '"Kellem Secondary School Admissions" <onboarding@resend.dev>',
    subject,
    html,
    text,
    timestamp: new Date().toISOString(),
    studentId: student.id,
    studentName: student.name,
    actionTaken: true,
    deliveryStatus: deliveryResult.status,
    deliveryError: deliveryResult.error || null,
    resendMessageId: deliveryResult.messageId || null,
    provider: 'resend'
  };

  db.emails.unshift(emailRecord);
  saveDb();
  return emailRecord;
}

// Authentication Middlewares
function getAuthUser(req: express.Request): User | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  const session = db.sessions[token];
  if (!session) return null;
  const user = db.users.find(u => u.id === session.userId);
  return user || null;
}

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }
  (req as any).user = user;
  next();
}

function requireApproved(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }
  if (user.role === 'admin') {
    (req as any).user = user;
    return next();
  }
  if (user.status === 'pending') {
    return res.status(403).json({
      error: 'ACCOUNT_PENDING',
      message: `Your student account is pending approval by Administrator (${ADMIN_EMAIL}). Protected school pages and features remain locked until approved.`
    });
  }
  if (user.status === 'rejected') {
    return res.status(403).json({
      error: 'ACCOUNT_REJECTED',
      message: `Your account registration was rejected by the administrator. Access is denied.`
    });
  }
  (req as any).user = user;
  next();
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = getAuthUser(req);
  if (!user || (user.role !== 'admin' && user.email.toLowerCase() !== ADMIN_EMAIL)) {
    return res.status(403).json({
      error: 'FORBIDDEN',
      message: `Administrator authorization required. Access is restricted to ${ADMIN_EMAIL}.`
    });
  }
  (req as any).user = user;
  next();
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Determine current App URL for email links
  const getAppUrl = (req: express.Request): string => {
    if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, '');
    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host || `localhost:${PORT}`;
    return `${proto}://${host}`;
  };

  // -------------------------------------------------------------
  // API ROUTES
  // -------------------------------------------------------------

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      admin: ADMIN_EMAIL,
      usersCount: db.users.length,
      emailsDispatched: db.emails.length
    });
  });

  // 1. REGISTER NEW STUDENT
  // Requirement 1: Send approval request email to administrator ONLY when a new student registers
  // Requirement 3: New student accounts must have PENDING status
  // Requirement 10: Use Resend API from Cloud Run backend only
  app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, role, className, photoUrl, age, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = String(name).trim();
    const parsedAge = age && !isNaN(Number(age)) ? Math.max(10, Math.min(80, Number(age))) : undefined;
    const cleanPhone = phone && String(phone).trim().length > 0 ? String(phone).trim() : undefined;
    const cleanPhoto = photoUrl && String(photoUrl).trim().length > 0 ? String(photoUrl).trim() : undefined;

    // Check existing
    const existing = db.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email address already exists. Please sign in.' });
    }

    const isStudent = (role || 'student') === 'student';
    const initialStatus: UserStatus = isStudent ? 'pending' : 'approved';

    const approvalToken = crypto.randomBytes(24).toString('hex');
    const rejectionToken = crypto.randomBytes(24).toString('hex');

    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: cleanName,
      email: cleanEmail,
      passwordHash: hashPassword(password),
      role: (role === 'teacher' ? 'teacher' : 'student') as UserRole,
      className: className || (isStudent ? 'Grade 12 Natural Science' : 'Faculty Staff'),
      status: initialStatus,
      registrationDate: new Date().toISOString(),
      decisionDate: null,
      decisionBy: null,
      decisionReason: null,
      approvalToken,
      rejectionToken,
      points: 50,
      quizPoints: 0,
      quizzesCompleted: 0,
      accuracy: 0,
      bestStreak: 0,
      photoUrl: cleanPhoto || undefined,
      age: parsedAge || undefined,
      phone: cleanPhone || undefined,
      approvalNotificationSent: false,
      approvalNotificationSentAt: null
    };

    db.users.push(newUser);
    saveDb();

    // Requirement 1 & 4 & 10: Send approval request email to administrator ONLY when a new student registers via Resend API
    let dispatchedEmail: EmailRecord | null = null;
    if (isStudent) {
      const appUrl = getAppUrl(req);
      dispatchedEmail = await sendApprovalRequestEmailToAdmin(newUser, appUrl);
      console.log(`[EMAIL DISPATCH RESULT] Approval request for ${newUser.name} (${newUser.email}) - Delivery Status: ${dispatchedEmail.deliveryStatus}`);
    }

    // Generate session token so newly registered user can also immediately manage their settings
    const regSessionToken = `sess_${crypto.randomBytes(32).toString('hex')}`;
    const regExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    db.sessions[regSessionToken] = {
      userId: newUser.id,
      token: regSessionToken,
      createdAt: new Date().toISOString(),
      expiresAt: regExpiresAt
    };

    // Return pending status to client with real delivery diagnostics
    const totalStudentCount = db.users.filter(u => u.role === 'student').length;
    return res.status(201).json({
      success: true,
      status: initialStatus,
      isPending: initialStatus === 'pending',
      token: regSessionToken,
      totalStudentsCount: totalStudentCount,
      message: isStudent
        ? `Registration received! Account is PENDING administrator approval. An official approval request email has been dispatched to ${ADMIN_EMAIL} via Resend.`
        : 'Account created successfully!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        className: newUser.className,
        status: newUser.status,
        photoUrl: newUser.photoUrl,
        age: newUser.age,
        phone: newUser.phone,
        registrationDate: newUser.registrationDate
      },
      emailDelivery: dispatchedEmail ? {
        status: dispatchedEmail.deliveryStatus,
        resendMessageId: dispatchedEmail.resendMessageId,
        error: dispatchedEmail.deliveryError,
        recipient: ADMIN_EMAIL,
        provider: 'resend'
      } : null,
      approvalEmailDispatchedTo: isStudent ? ADMIN_EMAIL : null
    });
  });

  // 2. SIGN IN
  // Requirement 2: Do NOT send approval requests when existing students sign in
  // Requirement 5: Pending students cannot access protected website pages
  // Requirement 6: Approved students can sign in normally without additional approval
  // Requirement 7: Rejected students cannot access the website
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    // Special check for administrator
    const user = db.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }

    if (user.passwordHash !== hashPassword(cleanPassword)) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }

    // STRICT CHECK: DO NOT SEND APPROVAL REQUEST EMAIL ON SIGN IN (Requirement 2)

    // Check account status
    if (user.status === 'pending') {
      // Requirement 5: Pending students cannot access protected website pages
      return res.status(403).json({
        success: false,
        status: 'pending',
        error: 'ACCOUNT_PENDING',
        message: `Your registration is currently PENDING approval by Administrator (${ADMIN_EMAIL}). You cannot access protected website pages until approved.`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          className: user.className,
          status: user.status,
          registrationDate: user.registrationDate
        }
      });
    }

    if (user.status === 'rejected') {
      // Requirement 7: Rejected students cannot access the website
      return res.status(403).json({
        success: false,
        status: 'rejected',
        error: 'ACCOUNT_REJECTED',
        message: `Your student registration was REJECTED by the school administrator. Access is denied.`,
        reason: user.decisionReason || 'Registration application declined by administration.'
      });
    }

    // Requirement 6: Approved students can sign in normally without additional approval
    const token = `sess_${crypto.randomBytes(32).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    db.sessions[token] = {
      userId: user.id,
      token,
      createdAt: new Date().toISOString(),
      expiresAt
    };
    saveDb();

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        className: user.className,
        status: user.status,
        points: user.points,
        quizPoints: user.quizPoints,
        quizzesCompleted: user.quizzesCompleted,
        accuracy: user.accuracy,
        bestStreak: user.bestStreak,
        photoUrl: user.photoUrl,
        age: user.age,
        phone: user.phone,
        registrationDate: user.registrationDate
      }
    });
  });

  // Check Current Session Profile
  app.get('/api/auth/me', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'No active session.' });
    }
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        className: user.className,
        status: user.status,
        points: user.points,
        quizPoints: user.quizPoints,
        quizzesCompleted: user.quizzesCompleted,
        accuracy: user.accuracy,
        bestStreak: user.bestStreak,
        photoUrl: user.photoUrl,
        age: user.age,
        phone: user.phone,
        registrationDate: user.registrationDate
      }
    });
  });

  // Update Profile & Settings (Strictly self-managed: ONLY the student themselves can change their own photo, phone, and age)
  const handleUpdateSettings = (req: express.Request, res: express.Response) => {
    let authUser = getAuthUser(req);
    const { userId, email, name, className, age, phone, photoUrl, token: bodyToken } = req.body || {};

    // Allow session token in header or body as fallback for client sessions
    if (!authUser) {
      const fallbackToken = (req.headers['x-session-token'] as string) || (typeof bodyToken === 'string' ? bodyToken : null);
      if (fallbackToken && db.sessions[fallbackToken]) {
        const session = db.sessions[fallbackToken];
        authUser = db.users.find(u => u.id === session.userId) || null;
      }
    }

    // 1. MUST BE AUTHENTICATED
    if (!authUser) {
      return res.status(401).json({
        success: false,
        error: 'AUTHENTICATION_REQUIRED',
        message: 'Authentication required. Please sign in to your student account to update your profile settings.'
      });
    }

    // 2. STRICT SECURITY RULE: NOBODY CAN CHANGE ANOTHER STUDENT'S PROFILE PHOTO, PHONE NUMBER, OR AGE
    // For example, only Bilisummaa can change Bilisummaa's profile, and only Feeneet can change Feeneet's profile.
    const isTargetingDifferentUserId = Boolean(userId && String(userId) !== authUser.id);
    const isTargetingDifferentEmail = Boolean(email && String(email).trim().toLowerCase() !== authUser.email.toLowerCase());

    if (isTargetingDifferentUserId || isTargetingDifferentEmail) {
      console.warn(`[SECURITY BLOCK] User ${authUser.name} (${authUser.email}) attempted to modify details of user id=${userId} email=${email}. Cross-student profile modification is forbidden.`);
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN_CROSS_USER_EDIT',
        message: "Access Denied: You can only edit your own personal profile. Nobody can change another student's profile photo, phone number, or age; it can only be changed by the student themselves."
      });
    }

    // Apply updates strictly to the authenticated user's own profile record
    if (name && typeof name === 'string' && name.trim()) {
      authUser.name = name.trim();
    }
    if (className && typeof className === 'string' && className.trim()) {
      authUser.className = className.trim();
    }
    if (age !== undefined) {
      authUser.age = (age === '' || age === null || isNaN(Number(age))) ? undefined : Math.max(10, Math.min(80, Number(age)));
    }
    if (phone !== undefined) {
      authUser.phone = (phone === '' || phone === null) ? undefined : String(phone).trim();
    }
    if (photoUrl !== undefined) {
      authUser.photoUrl = (photoUrl === '' || photoUrl === null) ? undefined : String(photoUrl).trim();
    }

    saveDb();

    console.log(`[USER SETTINGS] Self-updated profile for ${authUser.name} (${authUser.email}): age=${authUser.age}, phone=${authUser.phone}, photo=${authUser.photoUrl ? 'YES' : 'NONE'}`);

    return res.json({
      success: true,
      message: 'Profile settings updated successfully.',
      user: {
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        role: authUser.role,
        className: authUser.className,
        status: authUser.status,
        points: authUser.points,
        quizPoints: authUser.quizPoints,
        quizzesCompleted: authUser.quizzesCompleted,
        accuracy: authUser.accuracy,
        bestStreak: authUser.bestStreak,
        photoUrl: authUser.photoUrl,
        age: authUser.age,
        phone: authUser.phone,
        registrationDate: authUser.registrationDate
      }
    });
  };

  app.patch('/api/user/settings', handleUpdateSettings);
  app.post('/api/user/settings', handleUpdateSettings);
  app.put('/api/user/settings', handleUpdateSettings);

  // Sign out
  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      delete db.sessions[token];
      saveDb();
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // Check student status by email (for pending student polling/refresh)
  app.get('/api/student/status', (req, res) => {
    const email = req.query.email ? String(req.query.email).trim().toLowerCase() : '';
    if (!email) return res.status(400).json({ error: 'Email parameter required.' });

    const student = db.users.find(u => u.email.toLowerCase() === email);
    if (!student) {
      return res.status(404).json({ error: 'Student account not found.' });
    }

    res.json({
      id: student.id,
      name: student.name,
      email: student.email,
      status: student.status,
      className: student.className,
      registrationDate: student.registrationDate,
      decisionDate: student.decisionDate,
      decisionReason: student.decisionReason
    });
  });

  // -------------------------------------------------------------
  // ADMINISTRATOR APPROVAL & REJECTION (Requirements 4, 8)
  // -------------------------------------------------------------

  // 1-Click Quick Action from Email (Approve or Reject)
  // Requirement 4: Only administrator can approve or reject new accounts
  // Requirement 8: Send approval notification to student after decision
  // 1-Click Quick Action from Email (Approve or Reject)
  // Requirement 4: Only administrator can approve or reject new accounts
  // Requirement 8: Send approval notification to student after decision
  app.get('/api/admin/quick-action', async (req, res) => {
    const { token, action } = req.query;
    if (!token || !action) {
      return res.status(400).send('Invalid quick action request: token and action are required.');
    }

    const act = String(action).toLowerCase();
    if (act !== 'approve' && act !== 'reject') {
      return res.status(400).send('Action must be "approve" or "reject".');
    }

    const student = db.users.find(u =>
      act === 'approve' ? u.approvalToken === token : u.rejectionToken === token
    );

    if (!student) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Kellem School - Link Expired</title><meta name="viewport" content="width=device-width, initial-scale=1"></head>
        <body style="font-family: system-ui; max-width: 500px; margin: 40px auto; padding: 20px; text-align: center;">
          <h2 style="color: #dc2626;">Invalid or Expired Link</h2>
          <p>This approval link has already been used or is no longer valid.</p>
          <a href="/#student-login" style="display: inline-block; padding: 10px 20px; background: #08a989; color: white; text-decoration: none; border-radius: 8px;">Go to Kellem Portal</a>
        </body>
        </html>
      `);
    }

    const newStatus: UserStatus = act === 'approve' ? 'approved' : 'rejected';
    student.status = newStatus;
    student.decisionDate = new Date().toISOString();
    student.decisionBy = ADMIN_EMAIL;
    student.decisionReason = act === 'approve' ? 'Approved via 1-click administrator email link' : 'Rejected via administrator email link';

    // Invalidate tokens so link cannot be re-used maliciously
    student.approvalToken = crypto.randomBytes(24).toString('hex');
    student.rejectionToken = crypto.randomBytes(24).toString('hex');

    // Mark corresponding admin request email as actioned
    const adminEmailRecord = db.emails.find(e => e.studentId === student.id && e.type === 'admin_approval_request');
    if (adminEmailRecord) {
      adminEmailRecord.actionTaken = true;
    }

    // Requirement 8: Send approval/rejection notification email to student via Resend
    const appUrl = getAppUrl(req);
    await sendDecisionNotificationToStudent(student, newStatus, student.decisionReason, appUrl);
    saveDb();

    console.log(`[ADMIN ACTION] Student ${student.name} (${student.email}) status set to ${newStatus}. Notification sent via Resend.`);

    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Kellem School - Registration Decision Applied</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #071e30; color: #f1f5f9; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
          .card { background: #0b2a43; border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; max-width: 520px; width: 100%; padding: 36px 30px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
          .badge { display: inline-block; padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 800; text-transform: uppercase; margin-bottom: 16px; background: ${act === 'approve' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}; color: ${act === 'approve' ? '#34d399' : '#f87171'}; border: 1px solid ${act === 'approve' ? '#10b981' : '#ef4444'}; }
          h2 { margin: 0 0 10px; font-size: 24px; color: #fff; }
          p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 20px; }
          .info { background: rgba(0,0,0,0.3); border-radius: 12px; padding: 16px; text-align: left; font-size: 13px; margin-bottom: 24px; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .info-row:last-child { margin-bottom: 0; }
          .btn { display: inline-block; padding: 12px 24px; border-radius: 10px; background: #08a989; color: #fff; font-weight: 700; text-decoration: none; transition: 0.2s; }
          .btn:hover { background: #0bbd99; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">${act === 'approve' ? '✓ APPROVED BY ADMINISTRATOR' : '✕ REGISTRATION REJECTED'}</div>
          <h2>Decision Successfully Applied</h2>
          <p>
            ${act === 'approve'
              ? `Student account for <strong>${student.name}</strong> is now <strong>APPROVED</strong>. The student has been dispatched an official notification email via Resend and can now log into the portal immediately.`
              : `Student registration for <strong>${student.name}</strong> has been <strong>REJECTED</strong>. A notice has been sent to the applicant's email.`}
          </p>

          <div class="info">
            <div class="info-row"><span style="color:#64748b;">Student:</span> <strong>${student.name}</strong></div>
            <div class="info-row"><span style="color:#64748b;">Email:</span> <strong>${student.email}</strong></div>
            <div class="info-row"><span style="color:#64748b;">Class:</span> <strong>${student.className}</strong></div>
            <div class="info-row"><span style="color:#64748b;">Decision Time:</span> <strong>${new Date().toLocaleTimeString()}</strong></div>
            <div class="info-row"><span style="color:#64748b;">Admin:</span> <strong>${ADMIN_EMAIL}</strong></div>
          </div>

          <a href="/#student-login" class="btn">Open Kellem Portal Console</a>
        </div>
      </body>
      </html>
    `);
  });

  // Admin In-App Decision API
  // Requirement 4: Only the administrator can approve or reject new accounts
  // Requirement 8: Send an approval notification to student after decision
  app.post('/api/admin/decision', requireAdmin, async (req, res) => {
    const { studentId, action, reason } = req.body;
    if (!studentId || !action) {
      return res.status(400).json({ error: 'studentId and action ("approve" | "reject") are required.' });
    }

    const student = db.users.find(u => u.id === studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const decision: UserStatus = action === 'approve' ? 'approved' : 'rejected';
    student.status = decision;
    student.decisionDate = new Date().toISOString();
    student.decisionBy = ADMIN_EMAIL;
    student.decisionReason = reason || (decision === 'approved' ? 'Approved by Administrator Bilisatech' : 'Application declined');

    // Requirement 8: Send notification to student via Resend
    const appUrl = getAppUrl(req);
    const emailRecord = await sendDecisionNotificationToStudent(student, decision, student.decisionReason, appUrl);
    saveDb();

    res.json({
      success: true,
      decision,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        status: student.status,
        className: student.className,
        decisionDate: student.decisionDate
      },
      notificationEmail: {
        id: emailRecord.id,
        to: emailRecord.to,
        subject: emailRecord.subject,
        timestamp: emailRecord.timestamp,
        deliveryStatus: emailRecord.deliveryStatus,
        resendMessageId: emailRecord.resendMessageId,
        deliveryError: emailRecord.deliveryError
      }
    });
  });

  // Admin: List all pending registrations
  app.get('/api/admin/pending', requireAdmin, (req, res) => {
    const pendingStudents = db.users
      .filter(u => u.status === 'pending')
      .map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        className: u.className,
        registrationDate: u.registrationDate,
        status: u.status,
        photoUrl: u.photoUrl,
        age: u.age,
        phone: u.phone,
        approvalToken: u.approvalToken,
        rejectionToken: u.rejectionToken
      }));
    res.json({ pendingStudents });
  });

  // Admin: List all students & users
  app.get('/api/admin/users', requireAdmin, (req, res) => {
    const allUsers = db.users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      className: u.className,
      status: u.status,
      registrationDate: u.registrationDate,
      decisionDate: u.decisionDate,
      decisionBy: u.decisionBy,
      decisionReason: u.decisionReason,
      points: u.points,
      quizPoints: u.quizPoints,
      quizzesCompleted: u.quizzesCompleted,
      accuracy: u.accuracy,
      bestStreak: u.bestStreak,
      photoUrl: u.photoUrl,
      age: u.age,
      phone: u.phone
    }));

    const counts = {
      total: allUsers.length,
      pending: allUsers.filter(u => u.status === 'pending').length,
      approved: allUsers.filter(u => u.status === 'approved').length,
      rejected: allUsers.filter(u => u.status === 'rejected').length
    };

    res.json({ users: allUsers, counts });
  });

  // Admin: Email dispatch log
  app.get('/api/admin/emails', requireAdmin, (req, res) => {
    res.json({
      emails: db.emails
    });
  });

  // Admin: Get Resend & Secret Manager Configuration Diagnostics
  // Requirement 11: Read RESEND_API_KEY from Google Cloud Secret Manager
  // Requirement 13 & Instructions: Explain exactly what needs to be configured if missing
  app.get('/api/admin/email-config', requireAdmin, async (req, res) => {
    try {
      const status = await getEmailConfigStatus();
      res.json({
        config: status,
        instructions: {
          secretManagerStep: `In Google Cloud Secret Manager (project: ${status.projectId}), create a secret named "RESEND_API_KEY" with your Resend API key (starts with re_...).`,
          enableApiCommand: `gcloud services enable secretmanager.googleapis.com --project ${status.projectId}`,
          grantPermissionCommand: `gcloud secrets add-iam-policy-binding RESEND_API_KEY --member="serviceAccount:YOUR_CLOUD_RUN_SA" --role="roles/secretmanager.secretAccessor"`,
          resendDomainStep: `In Resend dashboard (https://resend.com/domains), verify your custom sending domain, or test with "Kellem Secondary School <onboarding@resend.dev>" to your registered Resend email (${ADMIN_EMAIL}).`,
          cloudRunEnvStep: `Alternatively in Google Cloud Run service environment variables, set RESEND_API_KEY directly from Secret Manager.`
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin: Test Real Email Delivery via Resend (Strictly No Simulation)
  // Requirement 13: Test actual email delivery before declaring the feature complete.
  app.post('/api/admin/test-email', requireAdmin, async (req, res) => {
    const appUrl = getAppUrl(req);
    const subject = `[TEST] Kellem Secondary School Resend API Connection Test`;
    const html = `
      <div style="font-family: sans-serif; padding: 24px; border: 1px solid #10b981; border-radius: 12px; background: #ffffff;">
        <h2 style="color: #072439;">Kellem Secondary School - Email Test</h2>
        <p>This is a live test email sent via <strong>Resend API</strong> from your Google Cloud Run backend.</p>
        <div style="background: #f0fdf4; padding: 12px; border-radius: 8px; border-left: 4px solid #10b981;">
          <strong>Configuration Verified:</strong>
          <ul>
            <li>Destination: ${ADMIN_EMAIL}</li>
            <li>Timestamp: ${new Date().toISOString()}</li>
            <li>Environment: Cloud Run Backend (${appUrl})</li>
          </ul>
        </div>
      </div>
    `;

    console.log(`[TEST_EMAIL] Admin initiated live Resend test delivery to ${ADMIN_EMAIL}`);
    const result = await sendActualResendEmail({
      to: ADMIN_EMAIL,
      subject,
      html,
      text: `Live test email from Kellem Secondary School Cloud Run backend to ${ADMIN_EMAIL}.`
    });

    const config = await getEmailConfigStatus();

    // Log this test email in outbox
    const testRecord: EmailRecord = {
      id: `email_test_${Date.now()}`,
      type: 'system',
      to: ADMIN_EMAIL,
      from: config.fromEmail,
      subject,
      html,
      text: 'Test email from Cloud Run backend via Resend.',
      timestamp: new Date().toISOString(),
      studentId: 'admin_test',
      studentName: 'System Diagnostic Test',
      actionTaken: true,
      deliveryStatus: result.status,
      deliveryError: result.error || null,
      resendMessageId: result.messageId || null,
      provider: 'resend'
    };
    db.emails.unshift(testRecord);
    saveDb();

    res.json({
      success: result.success,
      status: result.status,
      resendMessageId: result.messageId,
      error: result.error,
      config,
      instructions: result.success ? null : {
        summary: 'Resend API key is missing or not configured in Google Cloud Secret Manager.',
        steps: [
          `1. In Google Cloud Secret Manager (project ${config.projectId}), create secret "RESEND_API_KEY".`,
          `2. Enable the Secret Manager API: gcloud services enable secretmanager.googleapis.com --project ${config.projectId}`,
          `3. Or add RESEND_API_KEY to your Cloud Run service environment variables / secrets.`,
          `4. Ensure your sending address is verified in Resend (https://resend.com/domains) or use "onboarding@resend.dev".`
        ]
      }
    });
  });

  // -------------------------------------------------------------
  // PROTECTED SCHOOL FEATURES (Requirement 5 & 9)
  // Backend permissions securely enforced
  // -------------------------------------------------------------

  // Public: Live Student Count Summary (live update on any new registration)
  app.get('/api/students/summary', (req, res) => {
    const studentUsers = db.users.filter(u => u.role === 'student');
    res.json({
      totalStudents: studentUsers.length,
      approvedCount: studentUsers.filter(u => u.status === 'approved').length,
      pendingCount: studentUsers.filter(u => u.status === 'pending').length
    });
  });

  // Directory: All registered students (for the "All Students" interactive directory buttons)
  app.get('/api/students/all', (req, res) => {
    const allStudents = db.users
      .filter(u => u.role === 'student')
      .map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        className: u.className,
        status: u.status,
        points: u.points,
        quizPoints: u.quizPoints,
        quizzesCompleted: u.quizzesCompleted,
        accuracy: u.accuracy,
        bestStreak: u.bestStreak,
        photoUrl: u.photoUrl,
        age: u.age,
        phone: u.phone,
        registrationDate: u.registrationDate
      }));

    res.json({
      totalCount: allStudents.length,
      approvedCount: allStudents.filter(u => u.status === 'approved').length,
      pendingCount: allStudents.filter(u => u.status === 'pending').length,
      students: allStudents
    });
  });

  // Protected: Live Approved Roster & Leaderboard Data
  app.get('/api/students/roster', requireApproved, (req, res) => {
    const approvedStudents = db.users
      .filter(u => u.role === 'student' && u.status === 'approved')
      .map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        className: u.className,
        points: u.points,
        quizPoints: u.quizPoints,
        quizzesCompleted: u.quizzesCompleted,
        accuracy: u.accuracy,
        bestStreak: u.bestStreak,
        photoUrl: u.photoUrl,
        age: u.age,
        phone: u.phone,
        status: u.status,
        registrationDate: u.registrationDate
      }));

    res.json({
      totalCount: db.users.filter(u => u.role === 'student').length,
      students: approvedStudents
    });
  });

  // Public/All Users: Get all Institutional Announcements
  app.get('/api/announcements', (req, res) => {
    res.json({
      success: true,
      announcements: db.announcements || INITIAL_ANNOUNCEMENTS
    });
  });

  // Admin: Broadcast New Institutional Announcement
  app.post('/api/announcements', requireAdmin, (req, res) => {
    const { title, summary, fullContent, category, priority, actionUrl, actionLabel } = req.body;
    if (!title || !summary) {
      return res.status(400).json({ error: 'Title and summary are required.' });
    }
    const newAnnouncement: InstitutionalAnnouncement = {
      id: `ann_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: String(title).trim(),
      summary: String(summary).trim(),
      fullContent: fullContent ? String(fullContent).trim() : String(summary).trim(),
      category: category || 'academic',
      priority: priority || 'normal',
      publishDate: new Date().toISOString(),
      author: 'Office of School Directorate & Administration',
      referenceNo: `KSS/DIR/${new Date().getFullYear()}-${Math.floor(Math.random() * 800 + 100)}`,
      actionUrl: actionUrl || undefined,
      actionLabel: actionLabel || undefined
    };
    if (!Array.isArray(db.announcements)) {
      db.announcements = [...INITIAL_ANNOUNCEMENTS];
    }
    db.announcements.unshift(newAnnouncement);
    saveDb();
    res.status(201).json({
      success: true,
      announcement: newAnnouncement
    });
  });

  // Protected: Record Quiz Points and Streaks
  app.post('/api/quiz/record-score', requireApproved, (req, res) => {
    const user = (req as any).user as User;
    const { pointsEarned, finalCorrect, totalQuestions, currentStreak } = req.body;

    const dbUser = db.users.find(u => u.id === user.id);
    if (!dbUser) return res.status(404).json({ error: 'User not found.' });

    const addedPoints = Number(pointsEarned) || 0;
    const questionsCorrect = Number(finalCorrect) || 0;
    const totalQ = Number(totalQuestions) || 1;

    dbUser.points += addedPoints;
    dbUser.quizPoints += addedPoints;
    dbUser.quizzesCompleted += 1;

    const newAcc = Math.round(
      ((dbUser.accuracy || 75) * (dbUser.quizzesCompleted - 1) + (questionsCorrect / totalQ) * 100) / dbUser.quizzesCompleted
    );
    dbUser.accuracy = newAcc;
    dbUser.bestStreak = Math.max(dbUser.bestStreak || 0, Number(currentStreak) || 0);

    saveDb();

    res.json({
      success: true,
      user: {
        id: dbUser.id,
        name: dbUser.name,
        points: dbUser.points,
        quizPoints: dbUser.quizPoints,
        quizzesCompleted: dbUser.quizzesCompleted,
        accuracy: dbUser.accuracy,
        bestStreak: dbUser.bestStreak
      }
    });
  });

  // -------------------------------------------------------------
  // EXAM & TEST GENERATOR API (For Students & Teachers)
  // Generates 20, 30, 50, 100 questions for Math, Physics, Chemistry,
  // Biology, ICT, English, Construction, Geography, Economics
  // -------------------------------------------------------------
  app.post('/api/exam/generate', async (req, res) => {
    try {
      const {
        subject = 'math',
        count = 20,
        targetRole = 'student',
        grade = 'Grade 12 National Entrance Standard',
        difficulty = 'all'
      } = req.body;

      const validCounts = [20, 30, 50, 100];
      const qCount = validCounts.includes(Number(count))
        ? Number(count)
        : Number(count) >= 10 && Number(count) <= 100
        ? Number(count)
        : 20;

      const subjectMeta = EXAM_SUBJECTS.find(s => s.id === subject) || {
        id: subject as ExamSubject,
        label: subject === 'composite' ? 'All-Round Entrance (Composite 9 Subjects)' : String(subject).toUpperCase()
      };

      let questions = buildCurriculumExam(
        subject as ExamSubject,
        qCount,
        targetRole as ExamTargetRole,
        grade
      );

      // If difficulty is specified and not 'all', adjust difficulty badges
      if (difficulty !== 'all') {
        questions = questions.map(q => ({
          ...q,
          difficulty: difficulty as any
        }));
      }

      let source: 'ai' | 'curriculum_bank' = 'curriculum_bank';

      // If a valid Gemini API key is available, enrich questions with Gemini 3.8 Flash
      const hasValidGeminiKey =
        process.env.GEMINI_API_KEY &&
        process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' &&
        process.env.GEMINI_API_KEY.length > 20;

      if (hasValidGeminiKey && geminiClient && qCount <= 30 && subject !== 'composite') {
        try {
          const prompt = `You are the lead academic curriculum director at Kellem Secondary School in Ethiopia.
Generate ${Math.min(qCount, 15)} high-standard multiple-choice examination questions for ${subjectMeta.label} (${grade}).
Questions must match the Ethiopian national curriculum and university entrance standards.
Output JSON format:
[
  {
    "category": "Curriculum topic",
    "difficulty": "intermediate",
    "question": "Clear problem statement...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Step-by-step mathematical or scientific solution and reasoning...",
    "syllabusRef": "Unit reference",
    "teachingNote": "Grading criteria or common error point"
  }
]`;

          // Race with 2500ms timeout to ensure instant UI response
          const aiPromise = geminiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json'
            }
          });
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('AI timeout')), 2500)
          );

          const aiResponse = (await Promise.race([aiPromise, timeoutPromise])) as any;

          if (aiResponse.text) {
            const parsed = JSON.parse(aiResponse.text);
            if (Array.isArray(parsed) && parsed.length >= 5) {
              const aiQuestions = parsed.map((q: any, idx: number) => ({
                id: `q_ai_${subject}_${idx + 1}`,
                questionNumber: idx + 1,
                subject: subject as ExamSubject,
                subjectLabel: subjectMeta.label,
                category: q.category || 'Curriculum Assessment',
                difficulty: q.difficulty || 'intermediate',
                question: q.question,
                options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ['A', 'B', 'C', 'D'],
                correctIndex: typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < 4 ? q.correctIndex : 0,
                explanation: q.explanation || 'Refer to Ethiopian Ministry of Education curriculum guidelines.',
                syllabusRef: q.syllabusRef || `Ethiopian ${subjectMeta.label} Curriculum`,
                teachingNote: q.teachingNote || 'Assessment item designed for Kellem Secondary School'
              }));

              // Merge AI questions with curriculum bank to hit exact count
              if (aiQuestions.length >= qCount) {
                questions = aiQuestions.slice(0, qCount);
              } else {
                questions = [
                  ...aiQuestions,
                  ...questions.slice(aiQuestions.length)
                ].map((q, i) => ({ ...q, questionNumber: i + 1 }));
              }
              source = 'ai';
            }
          }
        } catch (aiErr) {
          console.warn('Gemini AI exam generation fallback to curriculum bank:', aiErr);
        }
      }

      const durationMinutes = qCount === 20 ? 25 : qCount === 30 ? 40 : qCount === 50 ? 60 : 120;
      const exam: GeneratedExam = {
        id: `exam_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: `${subjectMeta.label} ${qCount}-Question ${targetRole === 'teacher' ? 'Examination Paper & Marking Scheme' : 'Official Test'}`,
        createdAt: new Date().toISOString(),
        subject: subject as ExamSubject,
        subjectLabel: subjectMeta.label,
        questionCount: questions.length,
        targetRole: targetRole as ExamTargetRole,
        durationMinutes,
        gradeLevel: grade,
        questions,
        schoolHeader: {
          name: 'Kellem Secondary School (Mana Barumsaa Qellem Sad. 2ffaa)',
          location: 'Dambi Dollo, Oromia, Ethiopia',
          term: 'Academic Year 2026 Examination',
          academicYear: '2026 / 2018 E.C.'
        }
      };

      res.json({
        success: true,
        exam,
        source
      });
    } catch (err: any) {
      console.error('Error generating exam:', err);
      res.status(500).json({ error: 'Failed to generate exam: ' + err.message });
    }
  });

  // Submit and grade student exam
  app.post('/api/exam/submit', (req, res) => {
    try {
      const { examId, exam, selectedAnswers, timeSpentSeconds, studentId } = req.body;
      if (!exam || !Array.isArray(exam.questions)) {
        return res.status(400).json({ error: 'Invalid exam submission payload.' });
      }

      let correctCount = 0;
      const subjectBreakdown: Record<string, { total: number; correct: number }> = {};

      exam.questions.forEach((q: any, idx: number) => {
        const sub = q.subjectLabel || q.subject || 'General';
        if (!subjectBreakdown[sub]) {
          subjectBreakdown[sub] = { total: 0, correct: 0 };
        }
        subjectBreakdown[sub].total++;

        const studentAnswer = selectedAnswers ? selectedAnswers[idx] : undefined;
        if (studentAnswer !== undefined && studentAnswer === q.correctIndex) {
          correctCount++;
          subjectBreakdown[sub].correct++;
        }
      });

      const total = exam.questions.length || 1;
      const percentage = Math.round((correctCount / total) * 100);
      const isPassed = percentage >= 50;

      let gradeTier = 'Needs Improvement';
      if (percentage >= 85) gradeTier = 'Distinction (A+) 🏆';
      else if (percentage >= 75) gradeTier = 'Very Great (A) 🌟';
      else if (percentage >= 60) gradeTier = 'Good (B) 👍';
      else if (percentage >= 50) gradeTier = 'Satisfactory Pass (C) ✓';

      // If student is logged in, reward quiz points
      let updatedUser = null;
      if (studentId) {
        const dbUser = db.users.find(u => u.id === studentId);
        if (dbUser) {
          const addedPoints = Math.round(correctCount * 5 + (percentage >= 80 ? 30 : 15));
          dbUser.points += addedPoints;
          dbUser.quizPoints += addedPoints;
          dbUser.quizzesCompleted += 1;
          dbUser.accuracy = Math.round(
            ((dbUser.accuracy || 75) * (dbUser.quizzesCompleted - 1) + percentage) / dbUser.quizzesCompleted
          );
          saveDb();
          updatedUser = {
            id: dbUser.id,
            points: dbUser.points,
            quizPoints: dbUser.quizPoints,
            accuracy: dbUser.accuracy,
            quizzesCompleted: dbUser.quizzesCompleted
          };
        }
      }

      res.json({
        success: true,
        result: {
          examId,
          score: correctCount,
          totalQuestions: total,
          percentage,
          timeSpentSeconds: Number(timeSpentSeconds) || 0,
          selectedAnswers: selectedAnswers || {},
          isPassed,
          gradeTier,
          subjectBreakdown
        },
        user: updatedUser
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to process exam grading: ' + err.message });
    }
  });

  // -------------------------------------------------------------
  // API ROUTE FALLBACK & ERROR HANDLERS (Ensure /api/* always returns JSON)
  // -------------------------------------------------------------
  app.all('/api/*', (req, res) => {
    res.status(404).json({ success: false, error: `API route not found: ${req.method} ${req.path}` });
  });

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.path.startsWith('/api')) {
      console.error(`[API_ERROR] ${req.method} ${req.path}:`, err);
      const status = err.status || err.statusCode || 500;
      return res.status(status).json({
        success: false,
        error: err.type === 'entity.too.large'
          ? 'Image file is too large. Please select a photo under 5MB.'
          : (err.message || 'Server error processing request')
      });
    }
    next(err);
  });

  // -------------------------------------------------------------
  // VITE DEV SERVER / STATIC ASSETS
  // -------------------------------------------------------------
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res, next) => {
      if (req.url.startsWith('/api')) return next();
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(` Kellem Secondary School Backend Server Running on :${PORT}`);
    console.log(` Administrator Email: ${ADMIN_EMAIL}`);
    console.log(` Environment: ${isDev ? 'Development (Vite HMR)' : 'Production'}`);
    console.log(` Database: ${DB_FILE}`);
    console.log(`=======================================================`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
