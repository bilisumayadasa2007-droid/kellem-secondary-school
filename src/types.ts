export type UserStatus = 'pending' | 'approved' | 'rejected';
export type UserRole = 'admin' | 'student' | 'teacher';

export interface Student {
  id?: string;
  name: string;
  email?: string;
  className: string;
  points: number;
  quizPoints: number;
  quizzesCompleted: number;
  accuracy: number;
  bestStreak: number;
  status?: UserStatus;
  registrationDate?: string;
  photoUrl?: string;
  age?: number;
  phone?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  className: string;
  status: UserStatus;
  registrationDate?: string;
  photoUrl?: string;
  age?: number;
  phone?: string;
  points?: number;
  quizPoints?: number;
  quizzesCompleted?: number;
  accuracy?: number;
  bestStreak?: number;
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

export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface QuizQuestion {
  id: number;
  subject: 'entrance' | 'natural' | 'social' | 'english';
  category: string;
  difficulty: QuizDifficulty;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizRecord {
  question: QuizQuestion;
  selectedIndex: number;
  isCorrect: boolean;
}

export interface DailyStreakData {
  currentStreak: number;
  bestStreak: number;
  lastQuizDate: string | null;
  streakBonusTotal: number;
  completedToday: boolean;
}

export type ExamSubject =
  | 'math'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'ict'
  | 'english'
  | 'construction'
  | 'geography'
  | 'economics'
  | 'composite';

export type ExamTargetRole = 'student' | 'teacher';

export interface ExamQuestion {
  id: string;
  questionNumber: number;
  subject: ExamSubject;
  subjectLabel: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  syllabusRef?: string;
  teachingNote?: string;
}

export interface GeneratedExam {
  id: string;
  title: string;
  createdAt: string;
  subject: ExamSubject;
  subjectLabel: string;
  questionCount: number; // 20, 30, 50, 100
  targetRole: ExamTargetRole;
  durationMinutes: number;
  gradeLevel: string;
  questions: ExamQuestion[];
  schoolHeader: {
    name: string;
    location: string;
    term: string;
    academicYear: string;
  };
}

export interface ExamSubmissionResult {
  examId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpentSeconds: number;
  selectedAnswers: Record<number, number>;
  isPassed: boolean;
  gradeTier: string;
  subjectBreakdown: Record<string, { total: number; correct: number }>;
}

export type AnnouncementPriority = 'urgent' | 'high' | 'normal';
export type AnnouncementCategory = 'examinations' | 'admissions' | 'academic' | 'campus_life';

export interface InstitutionalAnnouncement {
  id: string;
  title: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  publishDate: string;
  author: string;
  summary: string;
  fullContent: string;
  actionUrl?: string;
  actionLabel?: string;
  referenceNo: string;
  isRead?: boolean;
}

