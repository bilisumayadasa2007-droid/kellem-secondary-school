/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Flame,
  Target,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Check,
  Plus,
  Trash2,
  Settings,
  CreditCard,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  User,
  GraduationCap,
  Microscope,
  Globe2,
  AlertCircle
} from 'lucide-react';
import { Student, UserProfile, DailyStreakData } from '../types';

interface ExamGoalItem {
  id: string;
  subject: string;
  targetScore: number;
  currentMockScore: number;
  maxScore: number;
  category: string;
}

interface StudyMilestone {
  id: string;
  title: string;
  subject: string;
  targetDate: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface UpcomingMilestoneDate {
  id: string;
  title: string;
  dateStr: string;
  daysRemaining: number;
  description: string;
  type: 'mock' | 'regional' | 'national';
}

interface StudentDashboardProps {
  currentUser: UserProfile | null;
  students: Student[];
  allStudentsList: Student[];
  dailyStreak: DailyStreakData;
  onOpenSettings: () => void;
  onOpenIdCard: (student: Student) => void;
  onNavigateHome: () => void;
  onStartQuiz: (subject?: 'entrance' | 'natural' | 'social' | 'english') => void;
  onOpenExamGenerator: () => void;
  onQuickLoginStudent?: (email: string, pass: string) => void;
}

export function StudentDashboard({
  currentUser,
  students,
  allStudentsList,
  dailyStreak,
  onOpenSettings,
  onOpenIdCard,
  onNavigateHome,
  onStartQuiz,
  onOpenExamGenerator,
  onQuickLoginStudent
}: StudentDashboardProps) {
  // If no user is logged in, allow selecting one of the approved students to view dashboard
  const [selectedStudentEmail, setSelectedStudentEmail] = useState<string>(
    currentUser?.email || (students[0]?.email || 'bilisummaa@kellem.edu.et')
  );

  // Sync with currentUser changes
  useEffect(() => {
    if (currentUser?.email) {
      setSelectedStudentEmail(currentUser.email);
    }
  }, [currentUser]);

  // Find target student details
  const activeStudent =
    (currentUser && (!selectedStudentEmail || currentUser.email === selectedStudentEmail))
      ? currentUser
      : students.find(s => s.email?.toLowerCase() === selectedStudentEmail.toLowerCase() || s.name.toLowerCase() === selectedStudentEmail.toLowerCase()) ||
        students[0];

  const studentName = activeStudent?.name || 'Bilisummaa Yaadasaa';
  const className = activeStudent?.className || 'Grade 12 Natural Science';
  const isNaturalScience = !className.toLowerCase().includes('social');

  // Find student in leaderboard & compute ranking
  const sortedByQuiz = [...students].sort((a, b) => (b.quizPoints || 0) - (a.quizPoints || 0));
  const rankIndex = sortedByQuiz.findIndex(s => s.name.toLowerCase() === studentName.toLowerCase());
  const quizRank = rankIndex >= 0 ? rankIndex + 1 : sortedByQuiz.length;
  const totalStudents = sortedByQuiz.length;

  const currentQuizPoints = activeStudent?.quizPoints ?? (activeStudent?.points ? activeStudent.points * 3 : 360);
  const academicPoints = activeStudent?.points ?? 98;
  const totalPoints = academicPoints + currentQuizPoints;
  const quizzesCompleted = activeStudent?.quizzesCompleted ?? 8;
  const accuracy = activeStudent?.accuracy ?? 96;
  const streakDays = dailyStreak?.currentStreak ?? (activeStudent?.bestStreak || 12);

  // Stream rank
  const streamStudents = sortedByQuiz.filter(s =>
    isNaturalScience
      ? s.className.toLowerCase().includes('natural')
      : s.className.toLowerCase().includes('social')
  );
  const streamRankIndex = streamStudents.findIndex(s => s.name.toLowerCase() === studentName.toLowerCase());
  const streamRank = streamRankIndex >= 0 ? streamRankIndex + 1 : streamStudents.length;

  // Next competitor ahead & behind
  const studentAhead = rankIndex > 0 ? sortedByQuiz[rankIndex - 1] : null;
  const pointsToOvertake = studentAhead
    ? Math.max((studentAhead.quizPoints || 0) - currentQuizPoints + 15, 15)
    : 0;

  // Exam Goals State
  const defaultGoals: ExamGoalItem[] = isNaturalScience
    ? [
        { id: 'phy', subject: 'Physics', targetScore: 88, currentMockScore: 82, maxScore: 100, category: 'Core Science' },
        { id: 'chem', subject: 'Chemistry', targetScore: 92, currentMockScore: 85, maxScore: 100, category: 'Core Science' },
        { id: 'bio', subject: 'Biology', targetScore: 94, currentMockScore: 90, maxScore: 100, category: 'Life Science' },
        { id: 'math', subject: 'Mathematics (Nat)', targetScore: 95, currentMockScore: 88, maxScore: 100, category: 'Analytical' },
        { id: 'eng', subject: 'English & Grammar', targetScore: 90, currentMockScore: 86, maxScore: 100, category: 'Language' },
        { id: 'apt', subject: 'General Aptitude', targetScore: 86, currentMockScore: 80, maxScore: 100, category: 'Reasoning' }
      ]
    : [
        { id: 'econ', subject: 'Economics', targetScore: 92, currentMockScore: 86, maxScore: 100, category: 'Social Sciences' },
        { id: 'geo', subject: 'Geography of Ethiopia', targetScore: 90, currentMockScore: 84, maxScore: 100, category: 'Earth & Human' },
        { id: 'hist', subject: 'History & Civics', targetScore: 88, currentMockScore: 82, maxScore: 100, category: 'Governance' },
        { id: 'math-soc', subject: 'Mathematics (Soc)', targetScore: 85, currentMockScore: 79, maxScore: 100, category: 'Analytical' },
        { id: 'eng-soc', subject: 'English & Grammar', targetScore: 92, currentMockScore: 88, maxScore: 100, category: 'Language' },
        { id: 'apt-soc', subject: 'General Aptitude', targetScore: 86, currentMockScore: 81, maxScore: 100, category: 'Reasoning' }
      ];

  const [examGoals, setExamGoals] = useState<ExamGoalItem[]>(() => {
    try {
      const saved = localStorage.getItem(`kellem_exam_goals_${studentName.replace(/\s+/g, '_')}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return defaultGoals;
  });

  const [overallNationalTarget, setOverallNationalTarget] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`kellem_national_target_${studentName.replace(/\s+/g, '_')}`);
      if (saved) return Number(saved);
    } catch {
      // ignore
    }
    return 575;
  });

  // Study Milestones Checklist
  const defaultMilestones: StudyMilestone[] = [
    {
      id: 'm1',
      title: 'Solve 20 Advanced Physics Kinematics & Bernoulli Questions',
      subject: 'Physics',
      targetDate: 'Friday',
      completed: true,
      priority: 'high'
    },
    {
      id: 'm2',
      title: "Master Le Chatelier's Equilibrium & Haber Ammonia Synthesis",
      subject: 'Chemistry',
      targetDate: 'Sunday',
      completed: true,
      priority: 'high'
    },
    {
      id: 'm3',
      title: 'Review Meiotic Prophase I Crossing-Over & Synaptonemal Complex',
      subject: 'Biology',
      targetDate: 'Tuesday',
      completed: false,
      priority: 'medium'
    },
    {
      id: 'm4',
      title: 'Practice 10 Inversion & Subjunctive English Structures',
      subject: 'English',
      targetDate: 'Wednesday',
      completed: false,
      priority: 'medium'
    },
    {
      id: 'm5',
      title: 'Complete 50-Question Full Length Timed Entrance Mock Exam',
      subject: 'Composite',
      targetDate: 'Next Weekend',
      completed: false,
      priority: 'high'
    }
  ];

  const [milestones, setMilestones] = useState<StudyMilestone[]>(() => {
    try {
      const saved = localStorage.getItem(`kellem_milestones_${studentName.replace(/\s+/g, '_')}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return defaultMilestones;
  });

  const [newMilestoneText, setNewMilestoneText] = useState('');
  const [newMilestoneSubject, setNewMilestoneSubject] = useState(isNaturalScience ? 'Physics' : 'Economics');
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState(overallNationalTarget);

  // Upcoming Milestones Dates (Calculated from a reference date)
  const upcomingExams: UpcomingMilestoneDate[] = [
    {
      id: 'e1',
      title: 'Kellem Second-Semester Mock Examination',
      dateStr: 'May 14, 2026',
      daysRemaining: 18,
      description: 'Comprehensive school-wide test covering Grades 11-12 curriculum.',
      type: 'mock'
    },
    {
      id: 'e2',
      title: 'Oromia Regional Model Test & Practical Assessment',
      dateStr: 'June 05, 2026',
      daysRemaining: 40,
      description: 'Standardized regional trial examination for university readiness.',
      type: 'regional'
    },
    {
      id: 'e3',
      title: 'Ethiopian University Entrance Examination (EUEE)',
      dateStr: 'July 08, 2026',
      daysRemaining: 73,
      description: 'Official National Exit and Higher Education Placement Exam (600/700 scale).',
      type: 'national'
    }
  ];

  // Save changes to localStorage
  const handleToggleMilestone = (id: string) => {
    setMilestones(prev => {
      const next = prev.map(m => (m.id === id ? { ...m, completed: !m.completed } : m));
      localStorage.setItem(`kellem_milestones_${studentName.replace(/\s+/g, '_')}`, JSON.stringify(next));
      return next;
    });
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneText.trim()) return;
    const item: StudyMilestone = {
      id: `custom_${Date.now()}`,
      title: newMilestoneText.trim(),
      subject: newMilestoneSubject,
      targetDate: 'Upcoming',
      completed: false,
      priority: 'medium'
    };
    setMilestones(prev => {
      const next = [item, ...prev];
      localStorage.setItem(`kellem_milestones_${studentName.replace(/\s+/g, '_')}`, JSON.stringify(next));
      return next;
    });
    setNewMilestoneText('');
  };

  const handleDeleteMilestone = (id: string) => {
    setMilestones(prev => {
      const next = prev.filter(m => m.id !== id);
      localStorage.setItem(`kellem_milestones_${studentName.replace(/\s+/g, '_')}`, JSON.stringify(next));
      return next;
    });
  };

  const handleUpdateSubjectTarget = (id: string, newTarget: number) => {
    const clamped = Math.min(100, Math.max(50, newTarget));
    setExamGoals(prev => {
      const next = prev.map(g => (g.id === id ? { ...g, targetScore: clamped } : g));
      localStorage.setItem(`kellem_exam_goals_${studentName.replace(/\s+/g, '_')}`, JSON.stringify(next));
      return next;
    });
  };

  const handleSaveNationalTarget = () => {
    const valid = Math.min(700, Math.max(300, tempTarget));
    setOverallNationalTarget(valid);
    localStorage.setItem(`kellem_national_target_${studentName.replace(/\s+/g, '_')}`, String(valid));
    setIsEditingTarget(false);
  };

  // Aggregated score calculations
  const totalTargetPoints = examGoals.reduce((sum, g) => sum + g.targetScore, 0);
  const totalCurrentMockPoints = examGoals.reduce((sum, g) => sum + g.currentMockScore, 0);
  const mockMaxTotal = examGoals.reduce((sum, g) => sum + g.maxScore, 0);
  const currentMockPercent = Math.round((totalCurrentMockPoints / mockMaxTotal) * 100);
  const targetMockPercent = Math.round((totalTargetPoints / mockMaxTotal) * 100);

  const completedMilestonesCount = milestones.filter(m => m.completed).length;
  const milestoneProgress = milestones.length > 0 ? Math.round((completedMilestonesCount / milestones.length) * 100) : 0;

  // Is this the currently authenticated user?
  const isOwnProfile = currentUser && (
    currentUser.email.toLowerCase() === (activeStudent.email || '').toLowerCase() ||
    currentUser.name.toLowerCase() === (activeStudent.name || '').toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f2438] pb-16 font-sans">
      {/* Top Banner Navigation Bar */}
      <div className="bg-[#082942] text-white border-b border-emerald-500/20 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="Return to School Portal"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span className="hidden sm:inline">Back to Campus</span>
            </button>
            <div className="h-5 w-px bg-white/20 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-sm sm:text-base font-black tracking-tight flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                Student Academic Dashboard
              </span>
            </div>
          </div>

          {/* Quick view switcher & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct Switch to Portal */}
            <a
              href="#/"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Campus Portal</span>
            </a>

            {/* Take Practice Quiz CTA */}
            <button
              onClick={() => onStartQuiz('entrance')}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Take Quiz</span>
            </button>

            {/* Settings (Strictly self-managed) */}
            {isOwnProfile && (
              <button
                onClick={onOpenSettings}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                title="Edit photo, age, and phone number"
              >
                <Settings className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Settings</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">

        {/* 1. HERO PROFILE & SUMMARY HEADER */}
        <div className="rounded-3xl bg-gradient-to-br from-[#082942] via-[#093554] to-[#07243a] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden border border-emerald-500/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Student Identity */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-emerald-400 p-1 shadow-xl">
                  {activeStudent.photoUrl ? (
                    <img
                      src={activeStudent.photoUrl}
                      alt={studentName}
                      className="w-full h-full rounded-[22px] object-cover bg-slate-900"
                    />
                  ) : (
                    <div className="w-full h-full rounded-[22px] bg-slate-900 flex items-center justify-center text-3xl font-black text-amber-300">
                      {studentName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1.5 rounded-xl shadow-md border-2 border-[#082942]" title={`Rank #${quizRank}`}>
                  <Trophy className="w-4 h-4 fill-slate-950" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Verified Scholar
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-black">
                    Rank #{quizRank} of {totalStudents}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-medium">
                    {className}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {studentName}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300 font-medium">
                  <span>Kellem Secondary School • Dambi Dollo</span>
                  {activeStudent.age && (
                    <>
                      <span>•</span>
                      <span>Age: {activeStudent.age} yrs</span>
                    </>
                  )}
                  {activeStudent.phone && (
                    <>
                      <span>•</span>
                      <span>Tel: {activeStudent.phone}</span>
                    </>
                  )}
                  {activeStudent.email && (
                    <>
                      <span>•</span>
                      <span className="text-slate-400">{activeStudent.email}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions & Switcher */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 lg:self-center">
              <button
                onClick={() => onOpenIdCard(activeStudent as Student)}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border border-white/10 cursor-pointer shadow-sm hover:scale-102"
              >
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Official ID Card</span>
              </button>

              {isOwnProfile && (
                <button
                  onClick={onOpenSettings}
                  className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md hover:scale-102 cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-emerald-200" />
                  <span>Update Profile</span>
                </button>
              )}

              {/* Student Switcher for testing/viewing */}
              <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-2xl border border-white/10">
                <span className="text-[11px] text-slate-400 pl-2 font-medium">View As:</span>
                <select
                  value={selectedStudentEmail}
                  onChange={(e) => setSelectedStudentEmail(e.target.value)}
                  className="bg-transparent text-xs font-bold text-amber-300 py-1.5 px-2 rounded-xl focus:outline-none cursor-pointer"
                >
                  {students.map(s => (
                    <option key={s.email || s.name} value={s.email || s.name} className="bg-[#082942] text-white">
                      {s.name} ({s.quizPoints || 0} pts)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 2. CORE METRICS: TOTAL POINTS, QUIZ RANK, ACCURACY & STREAK */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Points */}
          <div className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Points</span>
                <div className="text-3xl font-black text-[#082942] mt-1 flex items-baseline gap-1.5">
                  {totalPoints}
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    +{academicPoints} Acad.
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Quiz Points: <strong>{currentQuizPoints} pts</strong></span>
              <span className="text-emerald-700 font-bold">Top 5% Tier</span>
            </div>
          </div>

          {/* Card 2: Quiz Rank */}
          <div className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Quiz Leaderboard Rank</span>
                <div className="text-3xl font-black text-[#082942] mt-1 flex items-baseline gap-1.5">
                  #{quizRank}
                  <span className="text-xs font-bold text-slate-500">
                    of {totalStudents}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Stream Rank: <strong className="text-emerald-800">#{streamRank} {isNaturalScience ? 'Nat' : 'Soc'}</strong>
              </span>
              {studentAhead ? (
                <span className="text-amber-700 font-bold">
                  {pointsToOvertake} pts to #{quizRank - 1}
                </span>
              ) : (
                <span className="text-amber-600 font-black flex items-center gap-1">
                  👑 1st Champion
                </span>
              )}
            </div>
          </div>

          {/* Card 3: Quizzes Completed & Accuracy */}
          <div className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Quiz Accuracy</span>
                <div className="text-3xl font-black text-[#082942] mt-1 flex items-baseline gap-1.5">
                  {accuracy}%
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {quizzesCompleted} Completed
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">High Distinction Tier</span>
              <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> Excellent
              </span>
            </div>
          </div>

          {/* Card 4: Daily Practice Streak */}
          <div className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Daily Study Streak</span>
                <div className="text-3xl font-black text-orange-600 mt-1 flex items-baseline gap-1.5">
                  {streakDays} Days
                  <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-orange-500" /> Hot
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6 fill-orange-500" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                {dailyStreak?.completedToday ? '✓ Done for today' : 'Quiz needed today'}
              </span>
              <span className="text-orange-700 font-bold">+25 pts bonus active</span>
            </div>
          </div>
        </div>

        {/* 3. UPCOMING EXAM GOALS & COUNTDOWN SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: National Entrance Exam Target & Subject Targets (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Target Hero Card */}
            <div className="rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/90 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black mb-1.5">
                    <Target className="w-3.5 h-3.5 text-emerald-600" />
                    Ethiopian National Examination Target
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#082942]">
                    University Entrance Exam Target Score
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Track your performance benchmarks across national entrance exam subjects
                  </p>
                </div>

                {/* Overall Target Score Display & Quick Edit */}
                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/80 flex items-center gap-3 shrink-0">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Goal Target</span>
                    {isEditingTarget ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="number"
                          min="300"
                          max="700"
                          value={tempTarget}
                          onChange={(e) => setTempTarget(Number(e.target.value))}
                          className="w-20 px-2 py-1 text-sm font-black border border-emerald-500 rounded-lg bg-white"
                        />
                        <button
                          onClick={handleSaveNationalTarget}
                          className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-xs font-bold"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-emerald-700">{overallNationalTarget}</span>
                        <span className="text-xs font-bold text-slate-400">/ 700</span>
                        <button
                          onClick={() => {
                            setTempTarget(overallNationalTarget);
                            setIsEditingTarget(true);
                          }}
                          className="text-[11px] text-emerald-700 hover:underline font-bold ml-1"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Aggregated Target Progress Bar */}
              <div className="mt-5 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-600">Current Mock Readiness vs Target:</span>
                  <span className="text-[#082942]">
                    {currentMockPercent}% achieved ({totalCurrentMockPoints} / {totalTargetPoints} Target Pts)
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400 transition-all duration-700"
                    style={{ width: `${Math.min(100, Math.round((totalCurrentMockPoints / totalTargetPoints) * 100))}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Current Projected Entrance Score: ~{Math.round((overallNationalTarget * currentMockPercent) / 100)} / {overallNationalTarget}</span>
                  <span className="font-bold text-emerald-700">Admission Readiness: High</span>
                </div>
              </div>

              {/* Subject Breakdown Cards with Interactive Target Adjustment */}
              <div className="mt-6 space-y-3.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider pb-1">
                  <span>Subject Performance</span>
                  <span>Target vs Current Mock</span>
                </div>

                {examGoals.map(goal => {
                  const percentOfTarget = Math.round((goal.currentMockScore / goal.targetScore) * 100);
                  const isExceeding = goal.currentMockScore >= goal.targetScore;

                  return (
                    <div
                      key={goal.id}
                      className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-slate-50 border border-slate-200/70 transition-all space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-[#082942] shadow-xs">
                            {isNaturalScience ? <Microscope className="w-4 h-4 text-emerald-600" /> : <BookOpen className="w-4 h-4 text-blue-600" />}
                          </div>
                          <div>
                            <span className="font-black text-sm text-[#082942]">{goal.subject}</span>
                            <span className="text-[11px] text-slate-400 block">{goal.category}</span>
                          </div>
                        </div>

                        {/* Editable Target & Score Values */}
                        <div className="flex items-center gap-3 text-xs font-bold self-end sm:self-center">
                          <span className="text-slate-500">
                            Mock: <strong className="text-slate-800">{goal.currentMockScore}%</strong>
                          </span>
                          <span className="text-slate-300">•</span>
                          <div className="flex items-center gap-1">
                            <span className="text-slate-500">Target:</span>
                            <input
                              type="number"
                              min="50"
                              max="100"
                              value={goal.targetScore}
                              onChange={(e) => handleUpdateSubjectTarget(goal.id, Number(e.target.value))}
                              className="w-14 px-1.5 py-0.5 rounded-lg border border-slate-300 text-xs font-bold text-emerald-800 bg-white text-center focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                              title="Click to change target score"
                            />
                            <span className="text-slate-400">%</span>
                          </div>
                          {isExceeding ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black">
                              Target Met ✓
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-black">
                              {goal.targetScore - goal.currentMockScore}% to goal
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Subject Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isExceeding
                              ? 'bg-emerald-500'
                              : percentOfTarget >= 85
                              ? 'bg-amber-500'
                              : 'bg-orange-500'
                          }`}
                          style={{ width: `${Math.min(100, percentOfTarget)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Exam Practice Action Bar */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Need to boost your subject scores? Generate a dedicated 30 to 50 question mock test!
                </span>
                <button
                  onClick={onOpenExamGenerator}
                  className="px-4 py-2 rounded-xl bg-[#082942] hover:bg-[#0c395c] text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-sm shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Open Exam Generator</span>
                </button>
              </div>
            </div>

            {/* Daily Milestone Study Checklist */}
            <div className="rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg sm:text-xl font-black text-[#082942]">
                      Personal Study Milestones & Goals
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Daily tasks to stay ahead in your national exam preparation
                  </p>
                </div>
                <div className="text-xs font-bold text-slate-600">
                  <span className="text-emerald-700 font-black">{completedMilestonesCount}</span> of {milestones.length} tasks completed ({milestoneProgress}%)
                </div>
              </div>

              {/* Progress mini bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${milestoneProgress}%` }}
                ></div>
              </div>

              {/* Milestone items list */}
              <div className="space-y-2 pt-2">
                {milestones.map(m => (
                  <div
                    key={m.id}
                    onClick={() => handleToggleMilestone(m.id)}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer select-none ${
                      m.completed
                        ? 'bg-emerald-50/50 border-emerald-200 text-slate-500'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          m.completed
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {m.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className={`text-xs sm:text-sm font-semibold ${m.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {m.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {m.subject}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMilestone(m.id);
                        }}
                        className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom Milestone Form */}
              <form onSubmit={handleAddMilestone} className="pt-2 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Add custom exam study goal (e.g., Practice 20 Organic Chemistry reactions)..."
                  value={newMilestoneText}
                  onChange={(e) => setNewMilestoneText(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <select
                  value={newMilestoneSubject}
                  onChange={(e) => setNewMilestoneSubject(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-bold text-slate-700"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                  <option value="Economics">Economics</option>
                  <option value="Geography">Geography</option>
                  <option value="Composite">Composite</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Goal</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Upcoming Examination Milestones & Academic Recognition (1 Col) */}
          <div className="space-y-6">

            {/* Countdown to National Milestones */}
            <div className="rounded-3xl bg-white p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Calendar className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-black text-[#082942]">Upcoming Exam Milestones</h3>
              </div>

              <div className="space-y-3.5">
                {upcomingExams.map(exam => (
                  <div
                    key={exam.id}
                    className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/80 shadow-xs space-y-2 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block mb-1 ${
                          exam.type === 'national'
                            ? 'bg-rose-100 text-rose-800'
                            : exam.type === 'regional'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {exam.type === 'national' ? 'Official National' : exam.type === 'regional' ? 'Regional Model' : 'Internal Mock'}
                        </span>
                        <h4 className="font-black text-sm text-[#082942] leading-tight">{exam.title}</h4>
                      </div>

                      {/* Countdown badge */}
                      <div className="text-right shrink-0">
                        <div className="px-2.5 py-1 rounded-xl bg-[#082942] text-amber-300 font-black text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{exam.daysRemaining}d left</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {exam.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Date: <strong className="text-slate-700">{exam.dateStr}</strong></span>
                      <button
                        onClick={() => onStartQuiz('entrance')}
                        className="text-emerald-700 font-black hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        Prep Now <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Standing & Honor Tier */}
            <div className="rounded-3xl bg-gradient-to-br from-[#082942] to-[#0c395c] text-white p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black">Academic Honors Tier</h3>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-center space-y-2">
                <div className="text-3xl">👑</div>
                <h4 className="font-black text-base text-amber-300">
                  National Distinction Candidate
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  With {accuracy}% overall accuracy and {totalPoints} combined points, you are currently in the top tier at Kellem Secondary School.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Leadership Citation</span>
                  <span className="font-bold text-emerald-400">Approved</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>School Registry Record</span>
                  <span className="font-bold text-amber-300">ID #{activeStudent.id || 'KSS-2026-001'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Exam Hall Eligibility</span>
                  <span className="font-bold text-emerald-400">Verified Cleared</span>
                </div>
              </div>

              <button
                onClick={() => onOpenIdCard(activeStudent as Student)}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <CreditCard className="w-4 h-4 fill-slate-950" />
                <span>Show Official ID Badge</span>
              </button>
            </div>

            {/* Quick Demo Sign-in for fast evaluation */}
            {onQuickLoginStudent && (!currentUser || currentUser.role === 'admin') && (
              <div className="rounded-3xl bg-amber-50 border border-amber-200 p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-amber-900 uppercase">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Quick Student Evaluator
                </div>
                <p className="text-xs text-amber-800">
                  Sign in instantly as an approved student to test personal progress features:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onQuickLoginStudent('bilisummaa@kellem.edu.et', 'Student@1234')}
                    className="p-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-all cursor-pointer"
                  >
                    Bilisummaa (#1)
                  </button>
                  <button
                    onClick={() => onQuickLoginStudent('feeneet@kellem.edu.et', 'Student@1234')}
                    className="p-2 rounded-xl bg-blue-700 text-white font-bold text-xs hover:bg-blue-800 transition-all cursor-pointer"
                  >
                    Feeneet (#3)
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
