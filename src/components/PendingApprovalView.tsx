import React, { useState } from 'react';
import {
  Clock,
  ShieldAlert,
  Mail,
  RefreshCw,
  LogOut,
  CheckCircle2,
  Lock,
  School,
  ExternalLink,
  ChevronRight,
  Settings
} from 'lucide-react';
import { UserProfile } from '../types';

interface PendingApprovalViewProps {
  user: UserProfile;
  onRefreshStatus: () => Promise<void>;
  onSignOut: () => void;
  onSwitchToAdmin?: () => void;
  onOpenSettings?: () => void;
}

export const PendingApprovalView: React.FC<PendingApprovalViewProps> = ({
  user,
  onRefreshStatus,
  onSignOut,
  onSwitchToAdmin,
  onOpenSettings
}) => {
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<string | null>(null);

  const handleCheckNow = async () => {
    setChecking(true);
    setCheckResult(null);
    try {
      await onRefreshStatus();
      setCheckResult('Status refreshed from server. Awaiting administrator decision.');
    } catch (err) {
      setCheckResult('Unable to refresh status. Please try again in a few seconds.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071d2e] text-slate-100 font-sans antialiased flex flex-col justify-between relative overflow-hidden selection:bg-amber-500 selection:text-slate-950">
      {/* Background ambience */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Banner */}
      <div className="bg-[#051624] text-slate-300 text-xs border-b border-amber-500/20 py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-amber-400">●</span>
            <span>Dambi Dollo, Oromia, Ethiopia</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Mana Barumsaa Qellem Sad 2ffaa</span>
          </div>
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Registration-Only Approval Policy Active</span>
          </div>
        </div>
      </div>

      {/* Main Central Card */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        <div className="bg-[#0b2942]/95 backdrop-blur-xl border-2 border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-10 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <img
                src="/assets/aistudio/kss_best_logo_9d217f0f.png"
                alt="Kellem Secondary School Logo"
                className="w-16 h-16 rounded-2xl bg-white p-1 border-2 border-emerald-400 object-contain shadow-xl"
              />
              {user.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.name}
                  className="w-16 h-16 rounded-2xl border-2 border-amber-400 object-cover shadow-xl"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400/40 text-amber-300 flex items-center justify-center font-black text-2xl shadow-xl">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Status: PENDING ADMINISTRATOR APPROVAL
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Application Under Review
            </h1>

            <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
              Welcome, <strong>{user.name}</strong>! Your student registration has been created with <strong>PENDING</strong> status. An official approval request email has been dispatched to Administrator (<strong>Bilisatech4@gmail.com</strong>).
            </p>
          </div>

          {/* Access Policy Notice Box */}
          <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-500/30 text-amber-200 text-xs sm:text-sm space-y-2">
            <div className="flex items-center gap-2 font-black text-amber-300">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Protected Website Pages Are Locked</span>
            </div>
            <p className="leading-relaxed text-amber-100/90 text-xs">
              As mandated by Kellem Secondary School policy, <strong>pending students cannot access protected website features</strong> (including Kellem AI interactive tutor, practice quizzes, and internal school resources) until the administrator confirms your enrollment.
            </p>
          </div>

          {/* Registration Details Grid */}
          <div className="bg-black/30 rounded-2xl p-5 border border-white/5 space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-1 border-b border-white/5 mb-2">
              <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Your Application Record
              </h3>
              {onOpenSettings && (
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Settings className="w-3 h-3 text-emerald-400" />
                  <span>Update in Settings</span>
                </button>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Full Name:</span>
              <span className="text-white font-bold">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Registered Email:</span>
              <span className="text-emerald-300 font-bold">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Age:</span>
              <span className="text-amber-300 font-bold">{user.age ? `${user.age} years old` : 'Not specified yet (can add in Settings)'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Phone Number:</span>
              <span className="text-emerald-300 font-bold">{user.phone || 'Not provided yet (can add in Settings)'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Profile Photo:</span>
              <span className="text-slate-300 font-medium">{user.photoUrl ? 'Photo Uploaded' : 'None (can upload in Settings)'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Grade & Stream:</span>
              <span className="text-white font-bold">{user.className}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Submitted At:</span>
              <span className="text-slate-300">{user.registrationDate ? new Date(user.registrationDate).toLocaleString() : 'Just now'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Administrator Contacted:</span>
              <span className="text-amber-300 font-bold">Bilisatech4@gmail.com</span>
            </div>
            <div className="flex justify-between border-t border-white/5 pt-2">
              <span className="text-slate-400">Notification After Decision:</span>
              <span className="text-emerald-300 font-bold">Will be sent to {user.email}</span>
            </div>
          </div>

          {/* Real-time check button & Settings shortcut */}
          <div className="space-y-3">
            <button
              onClick={handleCheckNow}
              disabled={checking}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
              <span>{checking ? 'Checking with Server...' : 'Check Approval Status Now'}</span>
            </button>

            {checkResult && (
              <div className="text-center text-xs text-slate-300 bg-white/5 p-2.5 rounded-xl border border-white/10">
                {checkResult}
              </div>
            )}
          </div>

          {/* Quick Demo Switcher for Evaluation */}
          {onSwitchToAdmin && (
            <div className="pt-4 border-t border-white/10 text-center space-y-2">
              <span className="text-xs text-slate-400 block font-semibold">
                Testing this approval flow?
              </span>
              <button
                type="button"
                onClick={onSwitchToAdmin}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer"
              >
                <span>Switch to Administrator (Bilisatech4@gmail.com) to Approve</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Sign Out Button */}
          <div className="pt-2 text-center">
            <button
              onClick={onSignOut}
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto font-bold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out & Return to Login Screen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-xs text-slate-400 border-t border-white/10 bg-[#051624]">
        © {new Date().getFullYear()} Kellem Secondary School • Dambi Dollo, Oromia, Ethiopia.
      </div>
    </div>
  );
};
