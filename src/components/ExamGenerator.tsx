import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Sparkles,
  GraduationCap,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Printer,
  Copy,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  Award,
  HelpCircle,
  AlertTriangle,
  Send,
  Zap,
  BookOpen,
  Filter,
  Check,
  Flame,
  ArrowRight,
  TrendingUp,
  Brain,
  Layers,
  Download
} from 'lucide-react';
import {
  ExamSubject,
  ExamTargetRole,
  ExamQuestion,
  GeneratedExam,
  ExamSubmissionResult,
  UserProfile
} from '../types';
import { EXAM_SUBJECTS, SubjectMeta } from '../data/examQuestionBank';

interface ExamGeneratorProps {
  currentUser?: UserProfile | null;
  onScoreUpdated?: (updatedUser: any) => void;
  onOpenChatWithQuestion?: (questionText: string) => void;
}

export const ExamGenerator: React.FC<ExamGeneratorProps> = ({
  currentUser,
  onScoreUpdated,
  onOpenChatWithQuestion
}) => {
  // Generator Configuration State
  const [selectedSubject, setSelectedSubject] = useState<ExamSubject>('math');
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [customCountInput, setCustomCountInput] = useState<string>('20');
  const [targetRole, setTargetRole] = useState<ExamTargetRole>(
    currentUser?.role === 'teacher' ? 'teacher' : 'student'
  );
  const [gradeLevel, setGradeLevel] = useState<string>('Grade 12 National Entrance Standard');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  // Generation Processing State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationSteps, setGenerationSteps] = useState<string[]>([]);
  const [currentStepText, setCurrentStepText] = useState<string>('');

  // Active Exam State
  const [activeExam, setActiveExam] = useState<GeneratedExam | null>(null);
  const [examSource, setExamSource] = useState<'ai' | 'curriculum_bank'>('curriculum_bank');

  // Interactive Student Test Mode State
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<ExamSubmissionResult | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Teacher View State
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(true);
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  // Filter in Result Review
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'flagged'>('all');

  // Timer countdown hook
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeRemainingSeconds > 0 && !examSubmitted) {
      interval = setInterval(() => {
        setTimeRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(interval!);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeRemainingSeconds, examSubmitted]);

  // Format seconds to MM:SS or HH:MM:SS
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Step-by-step Generation Handler
  const handleGenerateExam = async () => {
    setIsGenerating(true);
    setGenerationSteps([]);
    setActiveExam(null);
    setExamSubmitted(false);
    setSubmissionResult(null);
    setUserAnswers({});
    setFlaggedQuestions({});

    const countToGenerate = questionCount;
    const isComposite = selectedSubject === 'composite';

    try {
      if (isComposite) {
        // Multi-subject composite step-by-step progress simulation
        const subjectsSequence = ['math', 'physics', 'chemistry', 'biology', 'ict', 'english', 'construction', 'geography', 'economics'];
        for (let i = 0; i < subjectsSequence.length; i++) {
          const subMeta = EXAM_SUBJECTS.find(s => s.id === subjectsSequence[i]);
          setCurrentStepText(`Generating section ${i + 1}/${subjectsSequence.length}: ${subMeta?.label || subjectsSequence[i]} questions...`);
          setGenerationSteps(prev => [...prev, `✓ Generated ${subMeta?.label || subjectsSequence[i]} section`]);
          await new Promise(r => setTimeout(r, 120));
        }
      } else {
        const subMeta = EXAM_SUBJECTS.find(s => s.id === selectedSubject);
        setCurrentStepText(`Synthesizing ${countToGenerate} questions for ${subMeta?.label}...`);
        setGenerationSteps([
          `1. Retrieving Ethiopian Curriculum Standards (${gradeLevel})`,
          `2. Assembling ${countToGenerate} structured multiple-choice problems with step-by-step solutions`,
          `3. Formulating ${targetRole === 'teacher' ? 'Teacher Answer Key & Pedagogical Notes' : 'Interactive Assessment Engine'}`
        ]);
        await new Promise(r => setTimeout(r, 200));
      }

      const res = await fetch('/api/exam/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          count: countToGenerate,
          targetRole,
          grade: gradeLevel,
          difficulty: difficultyFilter
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.exam) {
        setActiveExam(data.exam);
        setExamSource(data.source || 'curriculum_bank');
        setCurrentQIndex(0);
        setTimeRemainingSeconds(data.exam.durationMinutes * 60);
        setIsTimerRunning(targetRole === 'student');
      } else {
        alert(data.error || 'Failed to generate exam. Please try again.');
      }
    } catch (err: any) {
      console.error('Error generating exam:', err);
      alert('Network error while generating exam. Please check your connection.');
    } finally {
      setIsGenerating(false);
      setCurrentStepText('');
    }
  };

  // Submit and grade student test
  const handleAutoSubmit = () => {
    handleSubmitExam();
  };

  const handleSubmitExam = async () => {
    if (!activeExam) return;
    setShowSubmitModal(false);
    setIsTimerRunning(false);

    const timeSpent = activeExam.durationMinutes * 60 - timeRemainingSeconds;

    try {
      const res = await fetch('/api/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: activeExam.id,
          exam: activeExam,
          selectedAnswers: userAnswers,
          timeSpentSeconds: Math.max(timeSpent, 10),
          studentId: currentUser?.id
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmissionResult(data.result);
        setExamSubmitted(true);
        if (data.user && onScoreUpdated) {
          onScoreUpdated(data.user);
        }
      }
    } catch (err) {
      console.error('Error submitting exam:', err);
      // Fallback local scoring
      let correct = 0;
      activeExam.questions.forEach((q, idx) => {
        if (userAnswers[idx] === q.correctIndex) correct++;
      });
      const pct = Math.round((correct / activeExam.questions.length) * 100);
      setSubmissionResult({
        examId: activeExam.id,
        score: correct,
        totalQuestions: activeExam.questions.length,
        percentage: pct,
        timeSpentSeconds: timeSpent,
        selectedAnswers: userAnswers,
        isPassed: pct >= 50,
        gradeTier: pct >= 85 ? 'Distinction (A+) 🏆' : pct >= 75 ? 'Very Great (A) 🌟' : pct >= 50 ? 'Pass (C) ✓' : 'Needs Improvement',
        subjectBreakdown: {}
      });
      setExamSubmitted(true);
    }
  };

  // Answer selection
  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (examSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [qIdx]: optIdx
    }));
  };

  // Flag toggle
  const handleToggleFlag = (qIdx: number) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [qIdx]: !prev[qIdx]
    }));
  };

  // Copy entire exam to clipboard (for teachers)
  const handleCopyExamText = () => {
    if (!activeExam) return;
    let text = `=== ${activeExam.schoolHeader.name.toUpperCase()} ===\n`;
    text += `${activeExam.schoolHeader.location} • ${activeExam.schoolHeader.academicYear}\n`;
    text += `EXAMINATION: ${activeExam.title}\n`;
    text += `GRADE: ${activeExam.gradeLevel} • TIME ALLOWED: ${activeExam.durationMinutes} MINUTES\n`;
    text += `STUDENT NAME: ____________________________ ROLL NO: ______ SECTION: ______\n\n`;
    text += `INSTRUCTIONS: Read each question carefully and select the best answer (A, B, C, or D).\n`;
    text += `--------------------------------------------------------------------------------\n\n`;

    activeExam.questions.forEach(q => {
      text += `Question ${q.questionNumber} [${q.subjectLabel} - ${q.category}]:\n`;
      text += `${q.question}\n`;
      const letters = ['A', 'B', 'C', 'D'];
      q.options.forEach((opt, idx) => {
        text += `  ${letters[idx]}. ${opt}\n`;
      });
      if (showAnswerKey) {
        text += `  [TEACHER ANSWER: ${letters[q.correctIndex]}] Explanation: ${q.explanation}\n`;
      }
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedNotice('Copied full exam paper to clipboard!');
    setTimeout(() => setCopiedNotice(null), 3000);
  };

  // Trigger browser print
  const handlePrint = () => {
    window.print();
  };

  const answeredCount = Object.keys(userAnswers).length;
  const currentQ = activeExam ? activeExam.questions[currentQIndex] : null;

  return (
    <div id="exam-generator" className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Main Section Header */}
      <div className="bg-gradient-to-r from-[#061e31] via-[#093d2c] to-[#072439] rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-emerald-500/30 mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/kss_best_logo_9d217f0f.png"
                alt="KSS Logo"
                className="w-12 h-12 rounded-xl bg-white p-0.5 border border-emerald-400 object-contain shadow-md shrink-0"
              />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Kellem Examination & Test Generator
              </div>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Generate Custom Exams & Tests for Students & Teachers
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Generate customized assessments with <strong>20</strong>, <strong>30</strong>, <strong>50</strong>, or <strong>100</strong> questions. 
              Generate subjects one by one or create a comprehensive composite national exam covering: 
              <span className="text-amber-300 font-bold"> Mathematics, Physics, Chemistry, Biology, ICT, English, Construction, Geography, and Economics</span>.
            </p>
          </div>

          {/* Role selector pill */}
          <div className="bg-black/40 p-1.5 rounded-2xl border border-white/10 flex items-center shrink-0 self-start lg:self-center shadow-lg">
            <button
              onClick={() => setTargetRole('student')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                targetRole === 'student'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>For Students (Test Mode)</span>
            </button>
            <button
              onClick={() => setTargetRole('teacher')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                targetRole === 'teacher'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>For Teachers (Paper Maker)</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <div className="font-bold text-white">9 Key Subjects</div>
              <div className="text-[11px] text-slate-400">Generated one by one</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              ⚡
            </div>
            <div>
              <div className="font-bold text-white">20, 30, 50, 100 Qs</div>
              <div className="text-[11px] text-slate-400">Instant generation</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              🖨️
            </div>
            <div>
              <div className="font-bold text-white">Printable Paper & Key</div>
              <div className="text-[11px] text-slate-400">Classroom ready for faculty</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              🤖
            </div>
            <div>
              <div className="font-bold text-white">Step-by-Step Solutions</div>
              <div className="text-[11px] text-slate-400">Full explanations & rubrics</div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: EXAM GENERATION CONTROLS (BUTTONS)             */}
      {/* ======================================================== */}
      {!activeExam && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-8">
          {/* STEP 1: Question Count Selector Buttons (20, 30, 50, 100) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-black text-[#082942] uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <span>Select Number of Questions:</span>
              </label>
              <span className="text-xs text-slate-500 font-medium">
                Choose length based on test duration & interest
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {[
                { count: 20, label: '20 Questions', duration: '25 Mins', badge: 'Quick Period Quiz', color: 'border-blue-300' },
                { count: 30, label: '30 Questions', duration: '40 Mins', badge: 'Standard Midterm', color: 'border-emerald-300' },
                { count: 50, label: '50 Questions', duration: '60 Mins', badge: 'Semester Model Exam', color: 'border-amber-300' },
                { count: 100, label: '100 Questions', duration: '120 Mins', badge: 'Full National Entrance', color: 'border-purple-300' }
              ].map(item => (
                <button
                  key={item.count}
                  type="button"
                  onClick={() => {
                    setQuestionCount(item.count);
                    setCustomCountInput(String(item.count));
                  }}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative overflow-hidden ${
                    questionCount === item.count
                      ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-500 shadow-lg scale-[1.02] ring-2 ring-emerald-400/30'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                      {item.badge}
                    </span>
                    {questionCount === item.count && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <div className="text-2xl font-black text-[#082942]">{item.count} Qs</div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-semibold">
                    <Clock className="w-3 h-3 text-slate-400" /> Time: {item.duration}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: Subject Selector Buttons (Generated One by One) */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-sm font-black text-[#082942] uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <span>Select Subject (Generate One by One):</span>
              </label>
              <span className="text-xs text-slate-500 font-medium">
                Math, Physics, Chemistry, Biology, ICT, English, Construction, Geography, Economics
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {EXAM_SUBJECTS.map(subj => {
                const isSelected = selectedSubject === subj.id;
                return (
                  <button
                    key={subj.id}
                    type="button"
                    onClick={() => setSelectedSubject(subj.id)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#082942] to-[#0a385c] text-white border-emerald-400 shadow-lg scale-[1.02]'
                        : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
                    }`}
                  >
                    <div className="text-2xl mb-1.5">{subj.icon}</div>
                    <div className={`font-black text-sm ${isSelected ? 'text-white' : 'text-[#082942]'}`}>
                      {subj.label}
                    </div>
                    <div className={`text-[11px] mt-0.5 line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {subj.description}
                    </div>
                  </button>
                );
              })}

              {/* Composite Multi-Subject Button */}
              <button
                type="button"
                onClick={() => setSelectedSubject('composite')}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  selectedSubject === 'composite'
                    ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white border-amber-300 shadow-lg scale-[1.02]'
                    : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 hover:border-amber-400'
                }`}
              >
                <div className="text-2xl mb-1.5">🌟</div>
                <div className={`font-black text-sm ${selectedSubject === 'composite' ? 'text-white' : 'text-amber-950'}`}>
                  Composite All 9
                </div>
                <div className={`text-[11px] mt-0.5 line-clamp-1 ${selectedSubject === 'composite' ? 'text-amber-100' : 'text-amber-800'}`}>
                  Subject by subject mock exam
                </div>
              </button>
            </div>
          </div>

          {/* STEP 3: Academic Standard & Difficulty Tuning */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Academic Level / Standard</label>
              <select
                value={gradeLevel}
                onChange={e => setGradeLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                <option value="Grade 12 National Entrance Standard">Grade 12 National Entrance Standard (ESUEE)</option>
                <option value="Grade 11 Curriculum Standard">Grade 11 Secondary Curriculum</option>
                <option value="Grade 10 General Secondary Standard">Grade 10 National Standard</option>
                <option value="Grade 9 Foundation Standard">Grade 9 Secondary Foundation</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Difficulty Focus</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'all', label: 'Balanced' },
                  { id: 'beginner', label: 'Core' },
                  { id: 'intermediate', label: 'Entrance' },
                  { id: 'advanced', label: 'Honors' }
                ].map(df => (
                  <button
                    key={df.id}
                    type="button"
                    onClick={() => setDifficultyFilter(df.id as any)}
                    className={`py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      difficultyFilter === df.id
                        ? 'bg-[#082942] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {df.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Exam Target Purpose</label>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                {targetRole === 'student' ? (
                  <span>🎓 <strong>Student Mode:</strong> Interactive timed exam with scoring, instant answers & ranking bonuses.</span>
                ) : (
                  <span>👨‍🏫 <strong>Teacher Mode:</strong> Clean printable test paper with student blanks, full answer key & grading rubric.</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>
                Ready to generate <strong>{questionCount} questions</strong> for{' '}
                <strong className="text-emerald-700">
                  {selectedSubject === 'composite' ? 'All 9 Subjects (Composite)' : EXAM_SUBJECTS.find(s => s.id === selectedSubject)?.label}
                </strong>
              </span>
            </div>

            <button
              onClick={handleGenerateExam}
              disabled={isGenerating}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base shadow-xl shadow-emerald-700/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating {questionCount} Questions One by One...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 text-amber-300" />
                  <span>Generate {questionCount}-Question {selectedSubject === 'composite' ? 'Composite Exam' : `${EXAM_SUBJECTS.find(s => s.id === selectedSubject)?.label} Test`}</span>
                </>
              )}
            </button>
          </div>

          {/* Live Generation Visualizer Progress */}
          {isGenerating && (
            <div className="p-5 rounded-2xl bg-[#071f33] text-slate-200 text-xs space-y-2 border border-emerald-500/30 animate-in fade-in">
              <div className="flex items-center justify-between font-bold text-emerald-400">
                <span>{currentStepText || 'Processing curriculum questions...'}</span>
                <span className="animate-pulse">Loading...</span>
              </div>
              <div className="space-y-1 text-slate-300">
                {generationSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-emerald-300">
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: ACTIVE EXAM VIEW (STUDENT OR TEACHER)          */}
      {/* ======================================================== */}
      {activeExam && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top Exam Action Bar */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-md flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                  {activeExam.subjectLabel}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                  {activeExam.questionCount} Questions
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                  {activeExam.gradeLevel}
                </span>
                {examSource === 'ai' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-600" /> AI Synthesized
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#082942] truncate max-w-xl">
                {activeExam.title}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Timer badge for student mode */}
              {targetRole === 'student' && !examSubmitted && (
                <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-mono font-black text-sm shadow-sm ${
                  timeRemainingSeconds < 300
                    ? 'bg-red-50 text-red-600 border-red-300 animate-pulse'
                    : 'bg-slate-900 text-amber-300 border-slate-800'
                }`}>
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{formatTime(timeRemainingSeconds)}</span>
                </div>
              )}

              {/* Teacher toggles & tools */}
              {targetRole === 'teacher' && (
                <>
                  <button
                    onClick={() => setShowAnswerKey(!showAnswerKey)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>{showAnswerKey ? 'Hide Answer Key' : 'Show Answer Key & Rubric'}</span>
                  </button>
                  <button
                    onClick={handleCopyExamText}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 rounded-xl bg-[#082942] hover:bg-[#0c395c] text-white text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Exam Paper</span>
                  </button>
                </>
              )}

              {/* Close / Return to Generator */}
              <button
                onClick={() => {
                  if (targetRole === 'student' && !examSubmitted && answeredCount > 0) {
                    if (!confirm('Leave this exam? Your current responses will be discarded.')) return;
                  }
                  setActiveExam(null);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 text-xs font-bold transition-all cursor-pointer"
              >
                New Exam
              </button>
            </div>
          </div>

          {copiedNotice && (
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 text-center animate-in fade-in">
              {copiedNotice}
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW A: STUDENT INTERACTIVE EXAM MODE                     */}
          {/* ======================================================== */}
          {targetRole === 'student' && !examSubmitted && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Question Navigation Sidebar (Palette 1-100) */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md lg:col-span-1 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-black text-[#082942] uppercase tracking-wider">
                    Question Navigator
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    {answeredCount} / {activeExam.questions.length} Answered
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 transition-all duration-300"
                    style={{ width: `${(answeredCount / activeExam.questions.length) * 100}%` }}
                  ></div>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-500"></span>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-amber-400"></span>
                    <span>Flagged</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-blue-600"></span>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-slate-100 border border-slate-300"></span>
                    <span>Unanswered</span>
                  </div>
                </div>

                {/* Question buttons grid */}
                <div className="grid grid-cols-5 gap-1.5 max-h-[360px] overflow-y-auto pr-1">
                  {activeExam.questions.map((q, idx) => {
                    const isAnswered = userAnswers[idx] !== undefined;
                    const isFlagged = flaggedQuestions[idx];
                    const isCurrent = currentQIndex === idx;

                    let btnClass = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
                    if (isCurrent) {
                      btnClass = 'bg-blue-600 text-white font-black shadow-md ring-2 ring-blue-300';
                    } else if (isFlagged) {
                      btnClass = 'bg-amber-400 text-slate-950 font-black';
                    } else if (isAnswered) {
                      btnClass = 'bg-emerald-500 text-white font-bold';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentQIndex(idx)}
                        className={`h-9 rounded-lg text-xs flex items-center justify-center transition-all cursor-pointer ${btnClass}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Finish & Submit Button */}
                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Exam for Grading</span>
                  </button>
                </div>
              </div>

              {/* Main Active Question Card */}
              {currentQ && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl lg:col-span-3 space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Question Header & Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#082942] text-white text-xs font-black">
                          Question {currentQIndex + 1} of {activeExam.questions.length}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                          {currentQ.subjectLabel}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold truncate max-w-xs">
                          {currentQ.category}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleFlag(currentQIndex)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          flaggedQuestions[currentQIndex]
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>{flaggedQuestions[currentQIndex] ? 'Flagged for Review' : 'Flag Question'}</span>
                      </button>
                    </div>

                    {/* Question Statement */}
                    <div className="text-base sm:text-lg font-bold text-[#082942] leading-relaxed">
                      {currentQ.question}
                    </div>

                    {/* Multiple-Choice Options */}
                    <div className="space-y-2.5 pt-2">
                      {currentQ.options.map((opt, optIdx) => {
                        const letters = ['A', 'B', 'C', 'D'];
                        const isSelected = userAnswers[currentQIndex] === optIdx;

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectOption(currentQIndex, optIdx)}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                              isSelected
                                ? 'bg-emerald-50/80 border-emerald-500 shadow-md ring-2 ring-emerald-400/20'
                                : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/50'
                            }`}
                          >
                            <span
                              className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-all ${
                                isSelected
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white text-slate-700 border border-slate-300'
                              }`}
                            >
                              {letters[optIdx]}
                            </span>
                            <div className="text-sm font-semibold text-slate-800 pt-0.5 leading-relaxed">
                              {opt}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Previous / Next Controls */}
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentQIndex === 0}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    <div className="text-xs text-slate-400 font-semibold">
                      Press option to select answer
                    </div>

                    {currentQIndex < activeExam.questions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentQIndex(prev => Math.min(activeExam.questions.length - 1, prev + 1))}
                        className="px-6 py-2.5 rounded-xl bg-[#082942] hover:bg-[#0c395c] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>Next Question</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowSubmitModal(true)}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Finish & Submit</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW B: STUDENT SUBMISSION RESULT & DETAILED REVIEW      */}
          {/* ======================================================== */}
          {targetRole === 'student' && examSubmitted && submissionResult && (
            <div className="space-y-6">
              {/* Score Banner Hero */}
              <div className="bg-gradient-to-br from-[#061e31] via-[#093d2c] to-[#072439] rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-emerald-500/30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                      Official Assessment Score Report
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-black text-white">
                      {submissionResult.gradeTier}
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                      You completed the <strong>{activeExam.title}</strong> in{' '}
                      <strong>{formatTime(submissionResult.timeSpentSeconds)}</strong>. 
                      Review each question solution and step-by-step reasoning below.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 bg-black/40 p-5 rounded-2xl border border-white/10 shrink-0">
                    <div className="text-center px-4 border-r border-white/10">
                      <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                        {submissionResult.score} / {submissionResult.totalQuestions}
                      </div>
                      <div className="text-[11px] text-slate-400 font-bold uppercase mt-1">Score</div>
                    </div>
                    <div className="text-center px-4">
                      <div className="text-3xl sm:text-4xl font-black text-amber-300">
                        {submissionResult.percentage}%
                      </div>
                      <div className="text-[11px] text-slate-400 font-bold uppercase mt-1">Accuracy</div>
                    </div>
                  </div>
                </div>

                {/* Quick actions in result */}
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300 font-bold">Filter Solutions:</span>
                    <button
                      onClick={() => setReviewFilter('all')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        reviewFilter === 'all' ? 'bg-white text-slate-950' : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      All ({activeExam.questions.length})
                    </button>
                    <button
                      onClick={() => setReviewFilter('incorrect')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        reviewFilter === 'incorrect' ? 'bg-red-500 text-white' : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      Incorrect ({submissionResult.totalQuestions - submissionResult.score})
                    </button>
                    <button
                      onClick={() => setReviewFilter('flagged')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        reviewFilter === 'flagged' ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      Flagged ({Object.keys(flaggedQuestions).filter(k => flaggedQuestions[Number(k)]).length})
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setExamSubmitted(false);
                        setUserAnswers({});
                        setFlaggedQuestions({});
                        setTimeRemainingSeconds(activeExam.durationMinutes * 60);
                        setIsTimerRunning(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Same Exam</span>
                    </button>
                    <button
                      onClick={() => setActiveExam(null)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate New Exam</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Detailed Question Review List */}
              <div className="space-y-4">
                {activeExam.questions.map((q, idx) => {
                  const studentAns = userAnswers[idx];
                  const isCorrect = studentAns === q.correctIndex;
                  const isFlagged = flaggedQuestions[idx];

                  if (reviewFilter === 'incorrect' && isCorrect) return null;
                  if (reviewFilter === 'flagged' && !isFlagged) return null;

                  const letters = ['A', 'B', 'C', 'D'];

                  return (
                    <div
                      key={idx}
                      className={`p-6 rounded-3xl border-2 transition-all bg-white shadow-md space-y-4 ${
                        isCorrect
                          ? 'border-emerald-200'
                          : 'border-red-200'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-black text-slate-800">
                            {q.subjectLabel} • {q.category}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {q.syllabusRef}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isCorrect ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Correct
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-bold flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5 text-red-600" /> Incorrect
                            </span>
                          )}
                          {isFlagged && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                              Flagged
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="font-bold text-base text-[#082942]">
                        {q.question}
                      </div>

                      {/* Options with correctness highlight */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => {
                          const isStudentPick = studentAns === optIdx;
                          const isRightAnswer = q.correctIndex === optIdx;

                          let borderStyle = 'border-slate-200 bg-slate-50 text-slate-700';
                          if (isRightAnswer) {
                            borderStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-bold';
                          } else if (isStudentPick && !isCorrect) {
                            borderStyle = 'border-red-400 bg-red-50 text-red-900 line-through';
                          }

                          return (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${borderStyle}`}
                            >
                              <span className="font-bold">{letters[optIdx]}.</span>
                              <span>{opt}</span>
                              {isRightAnswer && (
                                <span className="ml-auto text-emerald-700 font-bold text-[10px]">
                                  ✓ Correct
                                </span>
                              )}
                              {isStudentPick && !isCorrect && (
                                <span className="ml-auto text-red-600 font-bold text-[10px]">
                                  Your Pick
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Step-by-Step Explanation */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1 text-slate-700">
                        <div className="font-black text-[#082942] flex items-center gap-1.5 text-xs">
                          <Brain className="w-3.5 h-3.5 text-emerald-600" /> Step-by-Step Solution & Reasoning:
                        </div>
                        <p className="leading-relaxed">{q.explanation}</p>
                      </div>

                      {/* Discuss in Chat Button */}
                      {onOpenChatWithQuestion && (
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => onOpenChatWithQuestion(q.question)}
                            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Discuss this problem with Kellem AI</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW C: TEACHER EXAM PAPER & MARKING SCHEME VIEW         */}
          {/* ======================================================== */}
          {targetRole === 'teacher' && (
            <div className="space-y-6">
              {/* Official Printable Exam Paper Container */}
              <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200 shadow-xl space-y-8 print:shadow-none print:border-none print:p-0 print:m-0">
                {/* Official School Header for Test Photocopying */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left pb-6 border-b-2 border-slate-900">
                  <img
                    src="/assets/aistudio/kss_best_logo_9d217f0f.png"
                    alt="KSS School Logo"
                    className="w-20 h-20 object-contain shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="text-xs font-black tracking-widest text-slate-800 uppercase">
                      MANA BARUMSAA SADARKAA 2FFAA QELLEM • DAMBI DOLLO
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                      {activeExam.schoolHeader.name}
                    </h2>
                    <div className="text-xs font-bold text-slate-600">
                      {activeExam.schoolHeader.location} • {activeExam.schoolHeader.academicYear}
                    </div>
                    <div className="text-sm font-black text-slate-900 pt-1 uppercase">
                      {activeExam.title}
                    </div>
                  </div>
                </div>

                {/* Student Blanks Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-300 text-xs font-mono font-bold text-slate-900">
                  <div>STUDENT NAME: ____________________________</div>
                  <div>ROLL / ID NO: _____________</div>
                  <div>SECTION / STREAM: _________</div>
                </div>

                {/* Instructions */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-1">
                  <div className="font-black uppercase">General Instructions:</div>
                  <ul className="list-disc pl-5 space-y-0.5 text-slate-700">
                    <li>This examination contains <strong>{activeExam.questions.length} multiple-choice questions</strong>.</li>
                    <li>Time allowed: <strong>{activeExam.durationMinutes} minutes</strong>.</li>
                    <li>Each question has four alternative answers (A, B, C, D). Choose the best answer and circle or blacken corresponding space.</li>
                    <li>Any form of academic dishonesty will result in disqualification.</li>
                  </ul>
                </div>

                {/* Questions List */}
                <div className="space-y-6 pt-2">
                  {activeExam.questions.map((q, idx) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    return (
                      <div key={idx} className="space-y-2 pb-4 border-b border-slate-100 break-inside-avoid">
                        <div className="flex items-start gap-2">
                          <span className="font-black text-slate-900 min-w-[28px]">{idx + 1}.</span>
                          <div className="font-bold text-slate-900 text-sm leading-relaxed flex-1">
                            {q.question}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7 pt-1 text-xs text-slate-800">
                          {q.options.map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-start gap-1.5">
                              <span className="font-bold text-slate-900">({letters[optIdx]})</span>
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>

                        {/* Teacher Rubric & Answer Key Callout */}
                        {showAnswerKey && (
                          <div className="ml-7 mt-2 p-3 rounded-xl bg-amber-50/80 border border-amber-300 text-xs text-amber-950 space-y-1 print:border-slate-300">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-amber-900 uppercase">
                                ✓ Official Answer: Option ({letters[q.correctIndex]})
                              </span>
                              <span className="text-[10px] text-amber-800">({q.category})</span>
                            </div>
                            <div className="text-slate-800 text-[11px] leading-relaxed">
                              <strong>Marking Rationale:</strong> {q.explanation}
                            </div>
                            {q.teachingNote && (
                              <div className="text-amber-900 text-[11px] font-semibold italic">
                                <strong>Teacher Guidance:</strong> {q.teachingNote}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Printable Teacher Answer Key Matrix */}
                {showAnswerKey && (
                  <div className="pt-6 border-t-2 border-slate-900 break-inside-avoid">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3">
                      Master Answer Key Matrix (Quick Scoring Sheet)
                    </h4>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 text-xs font-mono font-bold text-center">
                      {activeExam.questions.map((q, idx) => {
                        const letters = ['A', 'B', 'C', 'D'];
                        return (
                          <div key={idx} className="p-2 rounded-lg bg-slate-100 border border-slate-300">
                            <div className="text-[10px] text-slate-500">Q{idx + 1}</div>
                            <div className="text-emerald-700 text-sm font-black">{letters[q.correctIndex]}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal to Submit Exam */}
      {showSubmitModal && activeExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0b2942] border border-white/20 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-black text-white">Submit Examination?</h4>
                <p className="text-xs text-slate-400">Confirm test completion</p>
              </div>
            </div>

            <div className="bg-black/30 p-4 rounded-xl text-xs space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span>Total Questions:</span>
                <strong className="text-white">{activeExam.questions.length}</strong>
              </div>
              <div className="flex justify-between">
                <span>Answered Questions:</span>
                <strong className="text-emerald-400">{answeredCount}</strong>
              </div>
              <div className="flex justify-between">
                <span>Unanswered:</span>
                <strong className={activeExam.questions.length - answeredCount > 0 ? 'text-amber-400' : 'text-slate-400'}>
                  {activeExam.questions.length - answeredCount}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Time Remaining:</span>
                <strong className="text-amber-300 font-mono">{formatTime(timeRemainingSeconds)}</strong>
              </div>
            </div>

            {activeExam.questions.length - answeredCount > 0 && (
              <p className="text-xs text-amber-300 font-medium">
                ⚠️ You have {activeExam.questions.length - answeredCount} unanswered questions. Unanswered questions will be counted as incorrect.
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Back to Test
              </button>
              <button
                type="button"
                onClick={handleSubmitExam}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer"
              >
                Yes, Submit for Grading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
