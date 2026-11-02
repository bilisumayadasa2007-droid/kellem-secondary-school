import React from 'react';
import { XCircle, ShieldAlert, Mail, LogOut, School, ChevronRight } from 'lucide-react';

interface RejectedViewProps {
  studentName?: string;
  studentEmail?: string;
  reason?: string;
  adminEmail: string;
  onSignOut: () => void;
  onSwitchToAdmin?: () => void;
}

export const RejectedView: React.FC<RejectedViewProps> = ({
  studentName,
  studentEmail,
  reason,
  adminEmail,
  onSignOut,
  onSwitchToAdmin
}) => {
  return (
    <div className="min-h-screen bg-[#180a0a] text-slate-100 font-sans antialiased flex flex-col justify-between relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Mini Bar */}
      <div className="bg-[#120505] text-slate-400 text-xs border-b border-red-500/20 py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-red-400">●</span>
            <span>Dambi Dollo, Oromia, Ethiopia</span>
            <span className="text-slate-700">•</span>
            <span>Mana Barumsaa Qellem Sad 2ffaa</span>
          </div>
          <div className="flex items-center gap-1.5 text-red-400 font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>Registration Rejected</span>
          </div>
        </div>
      </div>

      {/* Center Container */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        <div className="bg-[#240e0e]/95 backdrop-blur-xl border-2 border-red-500/30 rounded-3xl shadow-2xl p-6 sm:p-10 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-red-500/20 border-2 border-red-500/40 text-red-400 flex items-center justify-center font-black text-3xl shadow-xl shadow-red-950/50">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-black uppercase tracking-wider">
              Access Denied • Registration Rejected
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Application Not Approved
            </h1>

            <p className="text-slate-300 text-sm max-w-lg mx-auto leading-relaxed">
              {studentName ? (
                <span>
                  The student account registration for <strong>{studentName}</strong> ({studentEmail}) was reviewed and declined by the school administrator.
                </span>
              ) : (
                <span>
                  This account registration was reviewed and declined by the school administrator.
                </span>
              )}
            </p>
          </div>

          <div className="bg-black/40 rounded-2xl p-4 border border-red-500/20 text-xs space-y-2">
            <div className="font-bold text-red-300 uppercase tracking-wider text-[11px]">
              Administrator Review Note:
            </div>
            <p className="text-slate-200 italic leading-relaxed">
              "{reason || 'Registration details could not be verified against the official school roster.'}"
            </p>
            <div className="pt-2 border-t border-white/5 flex justify-between text-slate-400">
              <span>Reviewed By:</span>
              <span className="text-white font-bold">{adminEmail}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed text-center">
            Per school security and academic integrity policy, rejected accounts are strictly barred from entering protected website pages or taking school entrance quizzes. If you believe this is an error, please contact the administration office directly.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={`mailto:${adminEmail}?subject=Appeal%20Registration%20Decision%20-%20${encodeURIComponent(studentName || '')}`}
              className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/10 transition-all"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Contact Administrator</span>
            </a>

            <button
              onClick={onSignOut}
              className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-900/40 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out & Try Another Account</span>
            </button>
          </div>

          {onSwitchToAdmin && (
            <div className="pt-4 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={onSwitchToAdmin}
                className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 font-bold underline cursor-pointer"
              >
                <span>Switch to Administrator ({adminEmail}) to re-review</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-xs text-slate-500 border-t border-white/5 bg-[#120505]">
        © {new Date().getFullYear()} Kellem Secondary School • Dambi Dollo, Oromia, Ethiopia.
      </div>
    </div>
  );
};
