import React, { useState } from 'react';
import {
  Bell,
  BellRing,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  ExternalLink,
  Volume2,
  VolumeX,
  FileText,
  Send,
  Calendar,
  ShieldCheck,
  Check,
  Sparkles,
  Info,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { InstitutionalAnnouncement, AnnouncementCategory } from '../types';
import { playNotificationSound, dispatchBrowserNotification } from '../utils/notificationSound';

interface InstitutionalNotificationModalProps {
  announcements: InstitutionalAnnouncement[];
  readIds: Set<string>;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  notificationPermission: NotificationPermission | 'unsupported';
  onRequestPermission: () => Promise<void>;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const InstitutionalNotificationModal: React.FC<InstitutionalNotificationModalProps> = ({
  announcements,
  readIds,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  notificationPermission,
  onRequestPermission,
  soundEnabled,
  onToggleSound,
  onNavigateSection
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | AnnouncementCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDetailAnnouncement, setActiveDetailAnnouncement] = useState<InstitutionalAnnouncement | null>(null);
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  // Filter announcements
  const filtered = announcements.filter(ann => {
    const matchesCategory = selectedCategory === 'all' || ann.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      ann.title.toLowerCase().includes(q) ||
      ann.summary.toLowerCase().includes(q) ||
      ann.referenceNo.toLowerCase().includes(q) ||
      ann.author.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const unreadCount = announcements.filter(a => !readIds.has(a.id)).length;

  const handleTestNotification = () => {
    if (soundEnabled) {
      playNotificationSound();
    }
    const success = dispatchBrowserNotification(
      'Kellem Secondary School Institutional Notice',
      'Timely notifications are active! You will receive live updates on exam schedules and admissions.'
    );
    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 4000);
  };

  const handleSelectAnnouncement = (ann: InstitutionalAnnouncement) => {
    onMarkAsRead(ann.id);
    setActiveDetailAnnouncement(ann);
  };

  const handleActionClick = (url: string) => {
    if (url.startsWith('#')) {
      onClose();
      if (onNavigateSection) {
        onNavigateSection(url.replace('#', ''));
      } else {
        const target = document.getElementById(url.replace('#', ''));
        target?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notification-center-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        {/* Header with High-Contrast Navy Institutional Bar */}
        <div className="bg-[#0B192C] text-white p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center shrink-0">
              <BellRing className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  Institutional Announcement Center
                </span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                    {unreadCount} Unread
                  </span>
                )}
              </div>
              <h2 id="notification-center-title" className="text-xl sm:text-2xl font-black text-white mt-0.5">
                Official Institutional Bulletins & Alerts
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSound}
              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-white/10 border-white/10 text-slate-400 hover:text-white'
              }`}
              title={soundEnabled ? 'Chime sound is ON' : 'Chime sound is MUTED'}
              aria-label={soundEnabled ? 'Notification sound enabled' : 'Notification sound disabled'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              aria-label="Close Announcement Center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Browser Notifications Permission Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  notificationPermission === 'granted'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : notificationPermission === 'denied'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                <Bell className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                  <span>Timely Institutional Updates</span>
                  <span
                    className={`text-[10px] px-2 py-0.2 rounded-full font-bold uppercase ${
                      notificationPermission === 'granted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : notificationPermission === 'denied'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {notificationPermission === 'granted'
                      ? 'Notifications Active'
                      : notificationPermission === 'denied'
                      ? 'Blocked in Browser'
                      : 'Notifications Available'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-snug">
                  {notificationPermission === 'granted'
                    ? 'You are subscribed to receive timely updates on entrance exam timetables, candidate clearance, and official school circulars.'
                    : notificationPermission === 'denied'
                    ? 'Browser alerts are blocked. You can still view all timely updates inside this portal anytime.'
                    : 'Turn on notifications to receive timely updates on important institutional announcements and examination schedules.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              {notificationPermission !== 'granted' && notificationPermission !== 'denied' && (
                <button
                  type="button"
                  onClick={onRequestPermission}
                  className="px-4 py-2 rounded-xl bg-[#0B192C] hover:bg-[#1E293B] text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <BellRing className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Turn On Notifications</span>
                </button>
              )}

              {notificationPermission === 'granted' && (
                <button
                  type="button"
                  onClick={handleTestNotification}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Send Test Alert</span>
                </button>
              )}

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={onMarkAllAsRead}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Mark All Read
                </button>
              )}
            </div>
          </div>

          {testNotificationSent && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Test notification dispatched! Audio chime and system alert sent.</span>
            </div>
          )}
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 sm:px-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Segmented Category Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            {[
              { id: 'all', label: 'All Announcements' },
              { id: 'examinations', label: 'Examinations' },
              { id: 'admissions', label: 'Admissions' },
              { id: 'academic', label: 'Academic' },
              { id: 'campus_life', label: 'Campus Life' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0B192C] text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search announcements..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Announcements List Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3.5">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Info className="w-10 h-10 mx-auto opacity-40 text-slate-400" />
              <p className="text-sm font-bold text-slate-700">No announcements match your filter.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="text-xs text-emerald-700 font-bold hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filtered.map(ann => {
              const isRead = readIds.has(ann.id);
              const isUrgent = ann.priority === 'urgent';
              const isHigh = ann.priority === 'high';

              return (
                <div
                  key={ann.id}
                  onClick={() => handleSelectAnnouncement(ann)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer group text-left relative ${
                    !isRead
                      ? 'bg-emerald-50/40 border-emerald-400/80 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Priority Tag */}
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          isUrgent
                            ? 'bg-rose-600 text-white'
                            : isHigh
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {ann.priority === 'urgent'
                          ? 'Urgent Notice'
                          : ann.priority === 'high'
                          ? 'High Priority'
                          : 'General Notice'}
                      </span>

                      <span className="text-[11px] font-mono font-bold text-slate-500">
                        {ann.referenceNo}
                      </span>

                      <span className="text-slate-300">·</span>

                      <span className="text-[11px] text-slate-500 capitalize font-medium">
                        {ann.category.replace('_', ' ')}
                      </span>

                      {!isRead && (
                        <span className="px-2 py-0.2 rounded-full bg-emerald-600 text-white text-[9px] font-black">
                          NEW
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-500 font-medium">
                      {new Date(ann.publishDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-black text-[#0B192C] group-hover:text-emerald-700 transition-colors leading-snug">
                    {ann.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {ann.summary}
                  </p>

                  {/* Footer Meta & Actions */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-slate-500 text-[11px]">
                      Issued by: <strong className="text-slate-700">{ann.author}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-emerald-700 font-bold group-hover:underline flex items-center gap-1">
                        <span>Read Full Bulletin</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Institutional Broadcast • Kellem Secondary School</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
          >
            Close Notification Center
          </button>
        </div>
      </div>

      {/* DETAILED BULLETIN MODAL */}
      {activeDetailAnnouncement && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border-4 border-emerald-500/30 overflow-hidden text-slate-900">
            {/* Modal Header */}
            <div className="bg-[#0B192C] text-white p-5 sm:p-6 border-b border-slate-800 relative">
              <button
                onClick={() => setActiveDetailAnnouncement(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <img
                  src="/assets/aistudio/kss_best_logo_9d217f0f.png"
                  alt="KSS Crest"
                  className="w-12 h-12 rounded-xl bg-white p-0.5 object-contain border border-emerald-400 shrink-0"
                />
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                    MANA BARUMSAA QELLEM SAD 2FFAA • DAMBI DOLLO
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    Official Directorate Circular
                  </h3>
                  <div className="text-xs text-slate-300 font-mono mt-0.5">
                    Ref: {activeDetailAnnouncement.referenceNo}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                <span
                  className={`font-black uppercase px-2.5 py-0.5 rounded-md ${
                    activeDetailAnnouncement.priority === 'urgent'
                      ? 'bg-rose-100 text-rose-900 border border-rose-300'
                      : activeDetailAnnouncement.priority === 'high'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {activeDetailAnnouncement.priority.toUpperCase()} PRIORITY
                </span>

                <span className="text-slate-500 font-medium">
                  Published: {new Date(activeDetailAnnouncement.publishDate).toLocaleString()}
                </span>
              </div>

              <div>
                <h4 className="text-xl font-black text-[#0B192C] leading-snug">
                  {activeDetailAnnouncement.title}
                </h4>
                <div className="text-xs text-slate-500 font-semibold mt-1">
                  Issued By: <span className="text-slate-800 font-bold">{activeDetailAnnouncement.author}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                <strong>Executive Summary:</strong> {activeDetailAnnouncement.summary}
              </div>

              <div className="space-y-3 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {activeDetailAnnouncement.fullContent}
              </div>

              {activeDetailAnnouncement.actionUrl && (
                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      const url = activeDetailAnnouncement.actionUrl!;
                      setActiveDetailAnnouncement(null);
                      handleActionClick(url);
                    }}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                  >
                    <span>{activeDetailAnnouncement.actionLabel || 'Proceed to Portal Resource'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveDetailAnnouncement(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Close Bulletin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
