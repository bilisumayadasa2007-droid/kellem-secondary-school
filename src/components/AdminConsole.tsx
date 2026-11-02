import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Eye,
  RefreshCw,
  ExternalLink,
  Send,
  AlertTriangle,
  UserCheck,
  UserX,
  FileText,
  Search,
  Filter,
  TrendingUp,
  Key,
  Server,
  Check
} from 'lucide-react';
import { UserProfile, EmailRecord, ResendConfigStatus } from '../types';
import { RegistrationGrowthChart } from './RegistrationGrowthChart';

interface AdminConsoleProps {
  token: string;
  adminEmail: string;
  onClose?: () => void;
  onRefreshData?: () => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  token,
  adminEmail,
  onClose,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'growth' | 'pending' | 'users' | 'emails'>('growth');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [emailConfig, setEmailConfig] = useState<ResendConfigStatus | null>(null);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [previewEmail, setPreviewEmail] = useState<EmailRecord | null>(null);
  const [decisionModalStudent, setDecisionModalStudent] = useState<{ id: string; name: string; email: string; action: 'approve' | 'reject' } | null>(null);
  const [decisionReason, setDecisionReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, emailsRes, configRes] = await Promise.all([
        fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/admin/emails', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/admin/email-config', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (usersRes.ok) {
        const uData = await usersRes.json();
        setUsers(uData.users || []);
      }
      if (emailsRes.ok) {
        const eData = await emailsRes.json();
        setEmails(eData.emails || []);
      }
      if (configRes.ok) {
        const cData = await configRes.json();
        setEmailConfig(cData.config || null);
      }
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setTestingEmail(true);
    setTestEmailResult(null);
    try {
      const res = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ to: adminEmail })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestEmailResult({
          success: true,
          message: `Real test email dispatched successfully via Resend! Message ID: ${data.result?.id || 'acknowledged'}`,
          details: data.result
        });
      } else {
        setTestEmailResult({
          success: false,
          message: data.error || 'Failed to dispatch test email via Resend.',
          details: data.details
        });
      }
      await fetchAdminData();
    } catch (err: any) {
      setTestEmailResult({
        success: false,
        message: `Network error attempting email dispatch: ${err.message}`
      });
    } finally {
      setTestingEmail(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 6000);
    return () => clearInterval(interval);
  }, [token]);

  const handleDecision = async (studentId: string, action: 'approve' | 'reject', reason?: string) => {
    setActionLoadingId(studentId);
    try {
      const res = await fetch('/api/admin/decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId,
          action,
          reason: reason || (action === 'approve' ? 'Approved by Administrator Bilisatech' : 'Application declined by school administration')
        })
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage({
          text: `Success: Student account has been ${action === 'approve' ? 'APPROVED' : 'REJECTED'}. An official notification email was dispatched to the student!`,
          type: 'success'
        });
        setDecisionModalStudent(null);
        setDecisionReason('');
        await fetchAdminData();
        if (onRefreshData) onRefreshData();
      } else {
        setStatusMessage({
          text: data.error || 'Failed to process decision.',
          type: 'error'
        });
      }
    } catch (err) {
      setStatusMessage({ text: 'Network error processing decision.', type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingStudents = users.filter(u => u.status === 'pending');
  const approvedStudents = users.filter(u => u.status === 'approved');
  const rejectedStudents = users.filter(u => u.status === 'rejected');

  const filteredUsers = users.filter(u => {
    const matchesFilter = userFilter === 'all' || u.status === userFilter;
    const matchesQuery =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.className.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="bg-[#0b2942] text-slate-100 rounded-3xl border border-emerald-500/30 shadow-2xl overflow-hidden mb-12">
      {/* Admin Top Header Banner */}
      <div className="bg-gradient-to-r from-[#051726] via-[#093d2c] to-[#072439] p-6 border-b border-emerald-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src="/assets/aistudio/kss_best_logo_9d217f0f.png"
              alt="Kellem Secondary School Logo"
              className="w-14 h-14 rounded-2xl bg-white p-1 border-2 border-emerald-400 object-contain shadow-xl shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  School Administrator Console
                </span>
                <span className="text-xs text-slate-400">Governance & Admissions</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Kellem Secondary School Admin Center
              </h2>
              <p className="text-xs text-slate-300">
                Logged in as Administrator: <strong className="text-amber-300">{adminEmail}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                Close Console
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
          <div
            onClick={() => setActiveTab('growth')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'growth'
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/30'
                : 'bg-black/20 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 uppercase">Growth (30d)</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">30 Days</div>
            <span className="text-[10px] text-slate-400">Recharts growth line</span>
          </div>

          <div
            onClick={() => setActiveTab('pending')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/30'
                : 'bg-black/20 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 uppercase">Pending Review</span>
              {pendingStudents.length > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
              )}
            </div>
            <div className="text-2xl font-black text-white mt-1">{pendingStudents.length}</div>
            <span className="text-[10px] text-slate-400">Needs admin approval</span>
          </div>

          <div
            onClick={() => {
              setActiveTab('users');
              setUserFilter('approved');
            }}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'users' && userFilter === 'approved'
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/30'
                : 'bg-black/20 border-white/10 hover:border-white/20'
            }`}
          >
            <span className="text-xs font-bold text-emerald-300 uppercase block">Approved</span>
            <div className="text-2xl font-black text-white mt-1">{approvedStudents.length}</div>
            <span className="text-[10px] text-slate-400">Full portal access</span>
          </div>

          <div
            onClick={() => {
              setActiveTab('users');
              setUserFilter('rejected');
            }}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'users' && userFilter === 'rejected'
                ? 'bg-red-500/20 border-red-400 text-red-200 ring-2 ring-red-400/30'
                : 'bg-black/20 border-white/10 hover:border-white/20'
            }`}
          >
            <span className="text-xs font-bold text-red-300 uppercase block">Rejected</span>
            <div className="text-2xl font-black text-white mt-1">{rejectedStudents.length}</div>
            <span className="text-[10px] text-slate-400">Access blocked</span>
          </div>

          <div
            onClick={() => setActiveTab('emails')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'emails'
                ? 'bg-blue-500/20 border-blue-400 text-blue-200 ring-2 ring-blue-400/30'
                : 'bg-black/20 border-white/10 hover:border-white/20'
            }`}
          >
            <span className="text-xs font-bold text-blue-300 uppercase block">Emails Dispatched</span>
            <div className="text-2xl font-black text-white mt-1">{emails.length}</div>
            <span className="text-[10px] text-slate-400">Transmission audit log</span>
          </div>
        </div>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div
          className={`px-6 py-3 text-xs font-bold flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border-b border-emerald-500/30'
              : 'bg-red-950/90 text-red-300 border-b border-red-500/30'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-white font-black ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="bg-[#071f33] px-6 py-3 border-b border-white/10 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('growth')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'growth'
              ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-md scale-102 font-black'
              : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Registration Growth (30d)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-900 text-emerald-300 text-[10px] font-black">
            Recharts
          </span>
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-md scale-102'
              : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Registrations</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-900 text-amber-300 text-[10px] font-black">
            {pendingStudents.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('users');
            setUserFilter('all');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-md scale-102'
              : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Student Directory & All Users</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-900 text-emerald-300 text-[10px] font-black">
            {users.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('emails')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'emails'
              ? 'bg-gradient-to-r from-blue-400 to-indigo-400 text-slate-950 shadow-md scale-102'
              : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Email Outbox & Audit Log</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-900 text-blue-300 text-[10px] font-black">
            {emails.length}
          </span>
        </button>
      </div>

      {/* TAB CONTENT 0: REGISTRATION GROWTH CHART */}
      {activeTab === 'growth' && (
        <div className="p-6 sm:p-8">
          <RegistrationGrowthChart users={users} />
        </div>
      )}

      {/* TAB CONTENT 1: PENDING REGISTRATIONS */}
      {activeTab === 'pending' && (
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" /> Pending Student Registration Requests
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Each applicant has been assigned <strong>PENDING</strong> status. Approval request emails were automatically sent to <strong>{adminEmail}</strong>.
              </p>
            </div>
            <div className="text-xs text-amber-300 font-bold bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-500/30">
              Only Administrator ({adminEmail}) can approve or reject
            </div>
          </div>

          {pendingStudents.length === 0 ? (
            <div className="py-12 text-center bg-black/20 rounded-2xl border border-white/5 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">All Caught Up!</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                There are currently no student accounts awaiting approval. When a new student registers, an approval request email will automatically arrive in your inbox and appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingStudents.map(student => (
                <div
                  key={student.id}
                  className="bg-[#071e30] border-2 border-amber-500/40 rounded-2xl p-5 shadow-lg relative flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {student.photoUrl ? (
                          <img
                            src={student.photoUrl}
                            alt={student.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-md shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-black text-lg border-2 border-amber-500/30 shrink-0">
                            {student.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase tracking-wider">
                            PENDING APPROVAL
                          </span>
                          <h4 className="text-lg font-black text-white mt-1">{student.name}</h4>
                          <div className="text-xs text-emerald-400 font-semibold">{student.className}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/30 p-3 rounded-xl space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Email:</span>
                        <span className="text-white font-bold">{student.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Age:</span>
                        <span className="text-amber-300 font-bold">{student.age ? `${student.age} years old` : 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Phone:</span>
                        <span className="text-emerald-300 font-bold">
                          {student.phone ? (
                            <a href={`tel:${student.phone}`} className="hover:underline">
                              📞 {student.phone}
                            </a>
                          ) : (
                            'Not provided'
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Registered:</span>
                        <span className="text-slate-300">{student.registrationDate ? new Date(student.registrationDate).toLocaleString() : 'Just now'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Protected Features:</span>
                        <span className="text-red-400 font-bold">Locked (No Access)</span>
                      </div>
                      <div className="flex justify-between border-t border-white/5 pt-1 mt-1">
                        <span className="text-slate-400">Admin Email:</span>
                        <span className="text-emerald-300 font-bold">Dispatched to {adminEmail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 pt-4 border-t border-white/10 flex gap-2">
                    <button
                      onClick={() => {
                        setDecisionModalStudent({
                          id: student.id,
                          name: student.name,
                          email: student.email,
                          action: 'approve'
                        });
                        setDecisionReason('Academic qualifications & enrollment verified');
                      }}
                      disabled={actionLoadingId === student.id}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Account</span>
                    </button>

                    <button
                      onClick={() => {
                        setDecisionModalStudent({
                          id: student.id,
                          name: student.name,
                          email: student.email,
                          action: 'reject'
                        });
                        setDecisionReason('Enrollment records could not be verified with school directorate');
                      }}
                      disabled={actionLoadingId === student.id}
                      className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Application</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: ALL USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" /> All Registered School Accounts
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                View all students, teachers, administrators and their current verification status.
              </p>
            </div>
            {/* Filter Buttons */}
            <div className="flex gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
              {(['all', 'approved', 'pending', 'rejected'] as const).map(flt => (
                <button
                  key={flt}
                  onClick={() => setUserFilter(flt)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-bold transition-all cursor-pointer ${
                    userFilter === flt
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {flt}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by student name, email, or class stream..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* Users Table */}
          <div className="bg-[#071e30] rounded-2xl border border-white/10 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#051726] text-slate-300 uppercase tracking-wider text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role & Stream</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Quiz Pts</th>
                    <th className="py-3 px-4">Academic Pts</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-white">{u.name}</div>
                            <div className="text-[11px] text-slate-400">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-300 font-semibold">{u.className}</div>
                        <div className="text-[10px] text-slate-500 capitalize">{u.role}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            u.status === 'approved'
                              ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                              : u.status === 'pending'
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                              : 'bg-red-400/20 text-red-300 border border-red-400/30'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-amber-300">
                        {u.quizPoints || 0} pts
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-300">
                        {u.points || 50} pts
                      </td>
                      <td className="py-3 px-4 text-right">
                        {u.role !== 'admin' && (
                          <div className="flex items-center justify-end gap-1.5">
                            {u.status !== 'approved' && (
                              <button
                                onClick={() => handleDecision(u.id, 'approve', 'Approved by administrator')}
                                className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                            {u.status !== 'rejected' && (
                              <button
                                onClick={() => handleDecision(u.id, 'reject', 'Revoked or rejected by administrator')}
                                className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[10px] font-bold border border-red-500/30 cursor-pointer"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: EMAIL TRANSMISSION, RESEND DIAGNOSTICS & AUDIT LOG */}
      {activeTab === 'emails' && (
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400" /> Resend Email Engine & Transmission Audit Log
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated student registration alerts to <strong>{adminEmail}</strong> and applicant status updates.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-300 bg-blue-950/60 px-3 py-1 rounded-xl border border-blue-500/30 font-bold">
                Total Dispatched: {emails.length} Emails
              </span>
            </div>
          </div>

          {/* Resend & Secret Manager Diagnostics Card */}
          <div className="bg-gradient-to-br from-[#071f33] to-[#041321] rounded-2xl border border-blue-500/30 p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                    Cloud Run Backend Email Provider
                  </span>
                  {emailConfig?.hasKey ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3 text-emerald-400" /> Resend Active ({emailConfig.source === 'secret_manager' ? 'GCP Secret Manager' : 'Environment Variable'})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded-full">
                      <AlertTriangle className="w-3 h-3 text-amber-400" /> Unconfigured (Missing RESEND_API_KEY)
                    </span>
                  )}
                </div>
                <h4 className="text-base font-black text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-400" /> Resend API & Google Cloud Secret Manager Diagnostics
                </h4>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowSetupGuide(!showSetupGuide)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-bold transition-all cursor-pointer"
                >
                  {showSetupGuide ? 'Hide Setup Guide' : 'Setup Guide'}
                </button>
                <button
                  onClick={handleTestEmail}
                  disabled={testingEmail}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 ${testingEmail ? 'animate-spin' : ''}`} />
                  <span>{testingEmail ? 'Dispatching via Resend...' : 'Send Live Test Email via Resend'}</span>
                </button>
              </div>
            </div>

            {/* Test Email Result Banner */}
            {testEmailResult && (
              <div
                className={`p-3.5 rounded-xl text-xs font-semibold border ${
                  testEmailResult.success
                    ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
                    : 'bg-red-950/80 border-red-500/40 text-red-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  {testEmailResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <div>{testEmailResult.message}</div>
                    {!testEmailResult.success && (
                      <p className="text-[11px] text-red-300 font-normal">
                        No simulated delivery was performed. Please configure your Resend API key in Google Cloud Secret Manager or Cloud Run environment variables as explained below.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Config Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Target Administrator</span>
                <span className="text-white font-black font-mono text-[11px] break-all">{adminEmail}</span>
              </div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Sending Domain / From</span>
                <span className="text-emerald-300 font-mono text-[11px]">{emailConfig?.fromEmail || 'onboarding@resend.dev'}</span>
              </div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">GCP Project ID</span>
                <span className="text-amber-300 font-mono text-[11px]">{emailConfig?.projectId || 'ais-europe-west1-18466e18a1c84'}</span>
              </div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Secret Manager Key</span>
                <span className="text-blue-300 font-mono text-[11px]">RESEND_API_KEY</span>
              </div>
            </div>

            {/* Secret Manager Status Note */}
            <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex items-start gap-2.5 text-xs text-slate-300">
              <Server className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200">Secret Manager Status: </strong>
                <span className={emailConfig?.secretManagerStatus === 'connected' ? 'text-emerald-300' : 'text-amber-300'}>
                  {emailConfig?.secretManagerMessage || 'Inspecting Google Cloud Secret Manager...'}
                </span>
              </div>
            </div>

            {/* Collapsible Setup Instructions */}
            {showSetupGuide && (
              <div className="mt-4 p-4 rounded-xl bg-black/50 border border-blue-500/20 text-xs space-y-3">
                <h5 className="font-black text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" /> Exact Steps to Enable Live Delivery in Cloud Run:
                </h5>
                <ol className="list-decimal pl-5 space-y-2 text-slate-300">
                  <li>
                    <strong>Get Resend API Key:</strong> Sign up for free at <a href="https://resend.com" target="_blank" rel="noreferrer" className="text-blue-400 underline font-mono">resend.com</a> and copy your API key (starts with <code className="text-amber-300">re_</code>).
                  </li>
                  <li>
                    <strong>Option 1 (Google Cloud Secret Manager):</strong> Enable Secret Manager in project <code className="text-amber-300">{emailConfig?.projectId || 'ais-europe-west1-18466e18a1c84'}</code>:
                    <div className="mt-1 bg-black/70 p-2.5 rounded-lg font-mono text-[11px] text-slate-200 overflow-x-auto space-y-1">
                      <div>gcloud services enable secretmanager.googleapis.com --project={emailConfig?.projectId || 'ais-europe-west1-18466e18a1c84'}</div>
                      <div>echo -n "re_YOUR_KEY" | gcloud secrets create RESEND_API_KEY --data-file=- --project={emailConfig?.projectId || 'ais-europe-west1-18466e18a1c84'}</div>
                    </div>
                  </li>
                  <li>
                    <strong>Option 2 (Cloud Run Environment Variable):</strong> In the Google Cloud Console, navigate to Cloud Run &rarr; Edit &amp; Deploy New Revision &rarr; Add Environment Variable <code className="text-amber-300">RESEND_API_KEY=re_YOUR_KEY</code>.
                  </li>
                  <li>
                    <strong>Domain Verification:</strong> For testing, emails to your admin email <code className="text-emerald-300">{adminEmail}</code> can be sent freely with <code className="text-blue-300">onboarding@resend.dev</code>. To send to arbitrary student emails, add and verify your custom school domain in Resend Domains.
                  </li>
                </ol>
              </div>
            )}
          </div>

          {/* Email Outbox & Audit Records */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-200 uppercase tracking-wider">
              Dispatched Email Records & Delivery Audit
            </h4>

            {emails.length === 0 ? (
              <div className="py-12 text-center bg-black/20 rounded-2xl border border-white/5 space-y-2">
                <Mail className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="text-sm font-bold text-white">No Emails Dispatched Yet</h4>
                <p className="text-xs text-slate-400">
                  Register a new student account to trigger the automated approval request email sent to {adminEmail}.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {emails.map(email => (
                  <div
                    key={email.id}
                    className="bg-[#071e30] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-400/40 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            email.type === 'admin_approval_request'
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                              : email.type === 'student_approval_notification'
                              ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                              : 'bg-red-400/20 text-red-300 border border-red-400/30'
                          }`}
                        >
                          {email.type === 'admin_approval_request'
                            ? 'Approval Request to Admin'
                            : email.type === 'student_approval_notification'
                            ? 'Approval Notice to Student'
                            : 'Rejection Notice to Student'}
                        </span>

                        {/* Delivery Status Badge */}
                        {email.deliveryStatus === 'delivered' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Resend Sent {email.resendMessageId ? `(${email.resendMessageId.substring(0, 12)}...)` : ''}
                          </span>
                        )}
                        {email.deliveryStatus === 'unconfigured' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Unconfigured (Missing RESEND_API_KEY)
                          </span>
                        )}
                        {email.deliveryStatus === 'failed' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Delivery Failed
                          </span>
                        )}
                        {email.deliveryStatus === 'skipped_duplicate' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/20 text-slate-300 border border-slate-500/30 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Duplicate Suppressed
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400">
                          {new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} • {new Date(email.timestamp).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="text-sm font-black text-white truncate">{email.subject}</div>

                      <div className="text-xs text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                        <span><strong>To:</strong> <span className="text-emerald-300 font-mono">{email.to}</span></span>
                        <span><strong>Student:</strong> {email.studentName}</span>
                      </div>

                      {email.deliveryError && (
                        <div className="text-[11px] text-red-300/90 bg-red-950/40 p-2 rounded-lg border border-red-500/20 font-mono">
                          {email.deliveryError}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setPreviewEmail(email)}
                        className="px-3.5 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview Email</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: CONFIRM APPROVAL / REJECTION WITH CUSTOM NOTE */}
      {decisionModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0b2942] border border-white/20 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {decisionModalStudent.action === 'approve' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
                <h3 className="text-xl font-black text-white">
                  {decisionModalStudent.action === 'approve' ? 'Approve Student Account' : 'Reject Registration'}
                </h3>
              </div>
              <button
                onClick={() => setDecisionModalStudent(null)}
                className="w-8 h-8 rounded-full bg-white/10 text-slate-300 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="bg-black/30 p-4 rounded-xl text-xs space-y-1 text-slate-300">
              <div><strong>Student Name:</strong> {decisionModalStudent.name}</div>
              <div><strong>Applicant Email:</strong> {decisionModalStudent.email}</div>
              <div className="pt-2 text-emerald-400 font-semibold border-t border-white/5">
                {decisionModalStudent.action === 'approve'
                  ? 'An approval confirmation email will be dispatched to this student immediately.'
                  : 'A formal rejection email will be dispatched to this student immediately.'}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Decision Note / Message to Student (Optional)
              </label>
              <textarea
                value={decisionReason}
                onChange={e => setDecisionReason(e.target.value)}
                rows={3}
                placeholder="Add school notes or reasons for this decision..."
                className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDecisionModalStudent(null)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDecision(decisionModalStudent.id, decisionModalStudent.action, decisionReason)}
                disabled={actionLoadingId === decisionModalStudent.id}
                className={`flex-1 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                  decisionModalStudent.action === 'approve'
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    : 'bg-red-600 hover:bg-red-500 text-white'
                }`}
              >
                {decisionModalStudent.action === 'approve' ? 'Confirm Approval & Send Email' : 'Confirm Rejection & Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EMAIL PREVIEW POPUP */}
      {previewEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Email client header */}
            <div className="bg-[#0b2942] text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-700">
              <div className="space-y-0.5">
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Dispatched Email Preview
                </div>
                <h4 className="text-base font-black truncate max-w-md">{previewEmail.subject}</h4>
              </div>
              <button
                onClick={() => setPreviewEmail(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 text-xs text-slate-700 space-y-1">
              <div><strong>To:</strong> <span className="text-emerald-700 font-bold">{previewEmail.to}</span></div>
              <div><strong>From:</strong> {previewEmail.from}</div>
              <div><strong>Sent:</strong> {new Date(previewEmail.timestamp).toLocaleString()}</div>
            </div>

            {/* Email HTML Body Render */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: previewEmail.html }}
              />
            </div>

            <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setPreviewEmail(null)}
                className="px-5 py-2 rounded-xl bg-[#082942] text-white font-bold text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
