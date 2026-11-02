/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Bot,
  GraduationCap,
  Trophy,
  BookOpen,
  Calendar,
  Users,
  Award,
  Volume2,
  Send,
  Search,
  CheckCircle,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Compass,
  ArrowUp,
  FileText,
  School,
  Microscope,
  Globe2,
  Sparkle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Flame,
  ArrowRight,
  BarChart3,
  HelpCircle,
  Check,
  Medal,
  TrendingUp,
  Zap,
  Target,
  Clock,
  Lock,
  LogOut,
  LogIn,
  UserPlus,
  ShieldCheck,
  Mail,
  User,
  ShieldAlert,
  Inbox,
  AlertCircle,
  Phone,
  Camera,
  Image as ImageIcon,
  Settings,
  Bell,
  BellRing,
  Megaphone,
  Radio
} from 'lucide-react';

import { useNavigate, useLocation } from 'react-router-dom';
import {
  Student,
  UserProfile,
  EmailRecord,
  QuizDifficulty,
  QuizQuestion,
  QuizRecord,
  DailyStreakData,
  InstitutionalAnnouncement
} from './types';
import { AdminConsole } from './components/AdminConsole';
import { PendingApprovalView } from './components/PendingApprovalView';
import { RejectedView } from './components/RejectedView';
import { ExamGenerator } from './components/ExamGenerator';
import { UserSettingsModal } from './components/UserSettingsModal';
import { StudentDashboard } from './components/StudentDashboard';
import { InstitutionalNotificationModal } from './components/InstitutionalNotificationModal';
import { INITIAL_ANNOUNCEMENTS } from './data/institutionalAnnouncements';
import { playNotificationSound, dispatchBrowserNotification } from './utils/notificationSound';

const ADMIN_EMAIL = 'Bilisatech4@gmail.com'.toLowerCase();

function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const PRESET_STUDENT_AVATARS = [
  { id: 'av1', label: 'Scholar 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
  { id: 'av2', label: 'Scholar 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
  { id: 'av3', label: 'Scholar 3', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80' },
  { id: 'av4', label: 'Scholar 4', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80' },
  { id: 'av5', label: 'Scholar 5', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80' },
  { id: 'av6', label: 'Scholar 6', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' }
];

const INITIAL_STUDENTS: Student[] = [
  { name: 'Bilisummaa Yaadasaa', className: 'Natural Science', points: 98, quizPoints: 360, quizzesCompleted: 8, accuracy: 96, bestStreak: 12, status: 'approved' },
  { name: "Raajii Amanu'e", className: 'Natural Science', points: 96, quizPoints: 320, quizzesCompleted: 7, accuracy: 93, bestStreak: 10, status: 'approved' },
  { name: 'Feeneet Yooseef', className: 'Natural Science', points: 94, quizPoints: 290, quizzesCompleted: 6, accuracy: 90, bestStreak: 8, status: 'approved' },
  { name: 'Israel Kassahuun', className: 'Natural Science', points: 91, quizPoints: 270, quizzesCompleted: 6, accuracy: 88, bestStreak: 7, status: 'approved' },
  { name: 'Eebbisa Beekaa', className: 'Social Science', points: 90, quizPoints: 250, quizzesCompleted: 5, accuracy: 86, bestStreak: 7, status: 'approved' },
  { name: 'Guutuu Aboomaa', className: 'Natural Science', points: 89, quizPoints: 230, quizzesCompleted: 5, accuracy: 85, bestStreak: 6, status: 'approved' },
  { name: 'Caaltuu Kennaa', className: 'Social Science', points: 88, quizPoints: 210, quizzesCompleted: 4, accuracy: 84, bestStreak: 5, status: 'approved' },
  { name: 'Taliilaa Jaallataa', className: 'Natural Science', points: 87, quizPoints: 190, quizzesCompleted: 4, accuracy: 82, bestStreak: 5, status: 'approved' },
  { name: 'Atinaboon Rattaa', className: 'Natural Science', points: 85, quizPoints: 170, quizzesCompleted: 3, accuracy: 80, bestStreak: 4, status: 'approved' },
  { name: 'Feeneet Gaaromaa', className: 'Natural Science', points: 84, quizPoints: 160, quizzesCompleted: 3, accuracy: 78, bestStreak: 4, status: 'approved' },
  { name: 'Nabiyyuu Sulxaan', className: 'Natural Science', points: 82, quizPoints: 140, quizzesCompleted: 3, accuracy: 76, bestStreak: 3, status: 'approved' },
  { name: 'Toleeraa Tatikuu', className: 'Natural Science', points: 80, quizPoints: 120, quizzesCompleted: 2, accuracy: 74, bestStreak: 3, status: 'approved' },
  { name: 'Lammii Xilahuun', className: 'Natural Science', points: 78, quizPoints: 110, quizzesCompleted: 2, accuracy: 72, bestStreak: 3, status: 'approved' },
  { name: 'Gammachuu Takkaa', className: 'Natural Science', points: 76, quizPoints: 90, quizzesCompleted: 2, accuracy: 70, bestStreak: 2, status: 'approved' },
  { name: 'Fatiyaa Yaasiin', className: 'Natural Science', points: 74, quizPoints: 80, quizzesCompleted: 1, accuracy: 68, bestStreak: 2, status: 'approved' },
  { name: 'Siifan Efreem', className: 'Natural Science', points: 72, quizPoints: 60, quizzesCompleted: 1, accuracy: 65, bestStreak: 1, status: 'approved' }
];

const DAILY_ENGLISH_PHRASES = [
  { phrase: "How's your day going?", reply: "It's going well, thank you!", tip: "Use it to ask politely about someone's day." },
  { phrase: "How's your week been?", reply: "Pretty good, thanks. I've been studying a lot.", tip: "Use it when you meet someone during the week." },
  { phrase: "What are you working on?", reply: "I'm preparing for my entrance exam.", tip: "Use it to ask about someone's current work or study." },
  { phrase: "Could you explain that again?", reply: "Sure. Let me explain it in a simpler way.", tip: "Use it when you need someone to repeat an explanation." },
  { phrase: "What do you think?", reply: "I think it is a good idea because it can help students learn.", tip: "Use it to ask for an opinion." },
  { phrase: "Could you help me, please?", reply: "Of course. What do you need help with?", tip: "A polite way to ask for help." },
  { phrase: "I don't understand yet.", reply: "No problem. Let's go step by step.", tip: "Use it when a lesson is still difficult." },
  { phrase: "That makes sense.", reply: "Great! I'm glad it is clear now.", tip: "Use it when you understand an explanation." },
  { phrase: "What did you learn today?", reply: "I learned a new English phrase.", tip: "Use it to talk about daily learning." },
  { phrase: "Can we practice together?", reply: "Yes! Let's practice for five minutes.", tip: "Use it to start a speaking practice." }
];

const QUIZ_BANKS: Record<'entrance' | 'natural' | 'social' | 'english', QuizQuestion[]> = {
  entrance: [
    {
      id: 101,
      subject: 'entrance',
      category: 'Physics • Units & Measurements',
      difficulty: 'beginner',
      question: 'Which of the following is the standard International System (SI) base unit for measuring electric current?',
      options: ['Volt (V)', 'Ampere (A)', 'Ohm (Ω)', 'Watt (W)'],
      correctIndex: 1,
      explanation: 'The Ampere (A) is one of the seven base SI units defining electric current. Volt measures potential difference and Ohm measures resistance.'
    },
    {
      id: 102,
      subject: 'entrance',
      category: 'Biology • Cell Biology',
      difficulty: 'beginner',
      question: 'Which cellular organelle is universally referred to as the "powerhouse of the cell" for producing ATP through cellular respiration?',
      options: ['Golgi apparatus', 'Mitochondria', 'Endoplasmic reticulum', 'Lysosome'],
      correctIndex: 1,
      explanation: 'Mitochondria synthesize the vast majority of cellular chemical energy in the form of adenosine triphosphate (ATP).'
    },
    {
      id: 103,
      subject: 'entrance',
      category: 'Civics • Democratic Governance',
      difficulty: 'beginner',
      question: 'Under constitutional democratic governance, what are the three fundamental branches of government that ensure checks and balances?',
      options: ['Police, Military, and Civil Service', 'Legislative, Executive, and Judicial', 'Presidential, Monarchical, and Regional', 'Cabinet, Electoral Board, and Media'],
      correctIndex: 1,
      explanation: 'The separation of powers divides authority into Legislative (law-making), Executive (law-enforcing), and Judicial (law-interpreting) branches.'
    },
    {
      id: 1,
      subject: 'entrance',
      category: 'Physics • Kinematics',
      difficulty: 'intermediate',
      question: 'A ball is projected vertically upward with an initial velocity of 20 m/s. Neglecting air resistance (g = 10 m/s²), what is the maximum height reached?',
      options: ['10 meters', '20 meters', '40 meters', '15 meters'],
      correctIndex: 1,
      explanation: 'At maximum height, vertical velocity v = 0. Using v² = u² - 2gh => 0 = (20)² - 2(10)h => 20h = 400 => h = 20 meters.'
    },
    {
      id: 2,
      subject: 'entrance',
      category: 'Economics • Macroeconomics',
      difficulty: 'intermediate',
      question: 'What economic phenomenon describes a persistent, generalized increase in the aggregate price level of goods and services in an economy?',
      options: ['Deflation', 'Inflation', 'Stagflation', 'Depreciation'],
      correctIndex: 1,
      explanation: 'Inflation is the sustained increase in the general price level of goods and services over time, eroding consumer purchasing power.'
    },
    {
      id: 4,
      subject: 'entrance',
      category: 'Geography • Ethiopian Geology',
      difficulty: 'intermediate',
      question: 'The Great East African Rift Valley, which bisects Ethiopia, was formed primarily through which tectonic mechanism?',
      options: ['Divergent plate boundary movement', 'Subduction zone convergence', 'Continental glaciation', 'Transform oceanic faulting'],
      correctIndex: 0,
      explanation: 'The East African Rift is an active continental rift zone caused by divergent tectonic plates pulling apart the Nubian and Somalian subplates.'
    },
    {
      id: 104,
      subject: 'entrance',
      category: 'Physics • Rotational Dynamics',
      difficulty: 'advanced',
      question: 'A uniform solid cylinder and a thin cylindrical hoop of identical mass and radius roll down the same inclined plane without slipping. Which reaches the bottom first and why?',
      options: [
        'The hoop, because its rotational inertia concentrates on the rim',
        'The solid cylinder, because its smaller moment of inertia converts more energy into translational speed',
        'Both reach simultaneously because gravity is independent of mass distribution',
        'The hoop, because it experiences less rolling friction'
      ],
      correctIndex: 1,
      explanation: 'For a solid cylinder, I = 1/2 MR², while for a hoop, I = MR². The lower moment of inertia means less energy is spent on rotation and more on translational velocity.'
    },
    {
      id: 105,
      subject: 'entrance',
      category: 'Economics • Macroeconomic Shocks',
      difficulty: 'advanced',
      question: 'An economy experiencing a simultaneous crisis of stagnant GDP growth, high unemployment, and rapidly escalating price inflation is characterized as:',
      options: ['A liquidity trap', 'Stagflation', 'Hyper-deflationary spiral', 'Demand-pull expansion'],
      correctIndex: 1,
      explanation: 'Stagflation occurs when adverse supply shocks cause output to contract while production costs and prices escalate simultaneously.'
    },
    {
      id: 3,
      subject: 'entrance',
      category: 'Biology • Cellular Respiration',
      difficulty: 'advanced',
      question: 'In eukaryotic cells during aerobic cellular respiration, what directly drives the rotary catalytic mechanism of ATP synthase in the inner mitochondrial membrane?',
      options: [
        'Direct substrate phosphorylation in the outer membrane',
        'The electrochemical proton-motive force across the inner membrane',
        'Direct electron transfer from pyruvate dehydrogenase',
        'Continuous hydrolysis of glucose in ribosomes'
      ],
      correctIndex: 1,
      explanation: 'Protons pumped into the intermembrane space flow down their electrochemical gradient through ATP synthase back into the matrix (chemiosmosis), driving ATP synthesis.'
    }
  ],
  natural: [
    {
      id: 201,
      subject: 'natural',
      category: 'Chemistry • Acids & Bases',
      difficulty: 'beginner',
      question: 'On the standard pH scale at 25°C, which numerical value represents a completely neutral aqueous solution?',
      options: ['pH = 0', 'pH = 7', 'pH = 14', 'pH = 1'],
      correctIndex: 1,
      explanation: 'A pH of 7 corresponds to equal concentrations of hydronium [H⁺] and hydroxide [OH⁻] ions (1.0 × 10⁻⁷ M), designating neutrality.'
    },
    {
      id: 202,
      subject: 'natural',
      category: 'Physics • Mechanics & Inertia',
      difficulty: 'beginner',
      question: 'Which fundamental law of physics establishes that an object remains at rest or in uniform motion unless acted upon by a net external force?',
      options: ["Newton's First Law (Law of Inertia)", "Newton's Second Law (F = ma)", "Newton's Third Law (Action-Reaction)", "Law of Universal Gravitation"],
      correctIndex: 0,
      explanation: "Newton's First Law defines inertia — the property of matter to resist any change in its existing state of rest or uniform motion."
    },
    {
      id: 203,
      subject: 'natural',
      category: 'Biology • Biochemistry',
      difficulty: 'beginner',
      question: 'What are the fundamental monomer units that join together via peptide bonds to construct polypeptide chains and proteins?',
      options: ['Monosaccharides', 'Fatty acids', 'Amino acids', 'Nucleotides'],
      correctIndex: 2,
      explanation: 'Proteins are polymers synthesized from 20 standard amino acid monomers joined by covalent peptide bonds.'
    },
    {
      id: 6,
      subject: 'natural',
      category: 'Chemistry • Oxidation States',
      difficulty: 'intermediate',
      question: 'What is the oxidation number of sulfur (S) in sulfuric acid (H₂SO₄)?',
      options: ['+4', '+6', '-2', '+2'],
      correctIndex: 1,
      explanation: 'Hydrogen is +1 (x2 = +2), Oxygen is -2 (x4 = -8). For neutral H₂SO₄: (+2) + S + (-8) = 0 => S = +6.'
    },
    {
      id: 7,
      subject: 'natural',
      category: 'Physics • Electromagnetism',
      difficulty: 'intermediate',
      question: 'Which fundamental law states that the induced electromotive force (EMF) is proportional to the time rate of change of magnetic flux?',
      options: ["Ampère's Law", "Ohm's Law", "Faraday's Law of Induction", "Coulomb's Law"],
      correctIndex: 2,
      explanation: "Faraday's Law of Induction states that ε = -dΦ/dt, formulating how changing magnetic fields induce an electric potential."
    },
    {
      id: 8,
      subject: 'natural',
      category: 'Biology • Molecular Genetics',
      difficulty: 'intermediate',
      question: 'What is the specific role of transfer RNA (tRNA) molecules during ribosomal translation in protein synthesis?',
      options: ['Transcribing DNA sequences into mRNA', 'Transporting specific amino acids matching mRNA codons', 'Synthesizing the phospholipid bilayer', 'Forming ATP in the mitochondria'],
      correctIndex: 1,
      explanation: 'Each tRNA carries a specific amino acid and contains an anticodon triplet that pairs complementarily with mRNA codons on the ribosome.'
    },
    {
      id: 204,
      subject: 'natural',
      category: 'Chemistry • Chemical Equilibrium',
      difficulty: 'advanced',
      question: 'For the exothermic synthesis of ammonia: N₂(g) + 3H₂(g) ⇌ 2NH₃(g) + 92 kJ, which operating conditions maximize the equilibrium percentage yield of NH₃?',
      options: [
        'High temperature and low pressure',
        'Low temperature and high pressure',
        'High temperature and high pressure without catalyst',
        'Low temperature and low pressure'
      ],
      correctIndex: 1,
      explanation: "According to Le Chatelier's principle, lowering temperature favors the exothermic forward reaction, and increasing pressure shifts toward fewer gas moles (4 moles -> 2 moles)."
    },
    {
      id: 205,
      subject: 'natural',
      category: 'Physics • Fluid Mechanics',
      difficulty: 'advanced',
      question: 'According to Bernoulli’s Principle for streamline flow of an ideal incompressible fluid, an increase in fluid velocity at a constriction causes:',
      options: [
        'A simultaneous increase in internal fluid pressure',
        'A decrease in internal fluid pressure',
        'A drop in temperature with static pressure remaining unchanged',
        'An exponential increase in fluid density'
      ],
      correctIndex: 1,
      explanation: 'Bernoulli’s equation shows that when kinetic energy density (1/2 ρv²) increases in a streamline constriction, static pressure (P) must decrease to maintain total energy conservation.'
    },
    {
      id: 206,
      subject: 'natural',
      category: 'Biology • Cytogenetics',
      difficulty: 'advanced',
      question: 'During meiotic Prophase I, at which specific sub-stage do homologous non-sister chromatids undergo reciprocal crossing-over at recombination nodules?',
      options: ['Leptotene', 'Zygotene', 'Pachytene', 'Diakinesis'],
      correctIndex: 2,
      explanation: 'Crossing over occurs during the Pachytene stage of Prophase I when the synaptonemal complex is completely formed between homologous pairs.'
    }
  ],
  social: [
    {
      id: 301,
      subject: 'social',
      category: 'Economics • Sectors of the Economy',
      difficulty: 'beginner',
      question: 'Which economic sector, focusing on agriculture, forestry, and raw resource extraction, employs the largest proportion of Ethiopia’s workforce?',
      options: ['Primary sector', 'Secondary sector', 'Tertiary sector', 'Quaternary sector'],
      correctIndex: 0,
      explanation: 'The primary sector extracts raw natural resources, primarily through smallholder agriculture which sustains the traditional Ethiopian livelihood.'
    },
    {
      id: 302,
      subject: 'social',
      category: 'Geography • Ethiopian Hydro-Basins',
      difficulty: 'beginner',
      question: 'Which major Ethiopian river originates from the highland watershed of Lake Tana and contributes over 80% of the Nile basin’s seasonal flood discharge?',
      options: ['Awash River', 'Abay (Blue Nile) River', 'Omo River', 'Genale-Dawa River'],
      correctIndex: 1,
      explanation: 'The Abay (Blue Nile) flows out of Lake Tana in northern Ethiopia, descending through deep gorges to merge with the White Nile at Khartoum.'
    },
    {
      id: 303,
      subject: 'social',
      category: 'Civics • Citizen Participation',
      difficulty: 'beginner',
      question: 'What category of democratic human rights guarantees citizens the liberty to vote, run for public office, and peacefully assemble?',
      options: ['Sovereign patents', 'Civil and Political Rights', 'Economic monopolies', 'Corporate franchises'],
      correctIndex: 1,
      explanation: 'Civil and political rights safeguard individual liberties and guarantee equal opportunities to participate in political governance.'
    },
    {
      id: 11,
      subject: 'social',
      category: 'Economics • Elasticity',
      difficulty: 'intermediate',
      question: 'When the price elasticity of demand coefficient (|Ed|) is greater than 1, demand for that product is classified as:',
      options: ['Price inelastic', 'Unitary elastic', 'Price elastic', 'Perfectively inelastic'],
      correctIndex: 2,
      explanation: 'An elasticity coefficient greater than 1 means consumers respond sensitively, leading to a proportionally larger percentage change in quantity demanded than the percentage change in price.'
    },
    {
      id: 12,
      subject: 'social',
      category: 'Geography • Ethiopian Agro-Ecology',
      difficulty: 'intermediate',
      question: 'In traditional Ethiopian agro-ecological classification, the temperate sub-humid plateau zone between 1,500m and 2,300m elevation is termed:',
      options: ['Bereha', 'Kolla', 'Woina Dega', 'Dega'],
      correctIndex: 2,
      explanation: 'Woina Dega (1,500m to 2,300m) represents the temperate plateau zone where Dambi Dollo and surrounding coffee-growing highlands are located.'
    },
    {
      id: 13,
      subject: 'social',
      category: 'Economics • Fiscal Policy',
      difficulty: 'intermediate',
      question: 'Which fiscal policy combination is an example of contractionary policy designed to cool down high macroeconomic inflation?',
      options: ['Increasing government spending and cutting taxes', 'Lowering interest rates and purchasing treasury bonds', 'Decreasing government spending and raising tax rates', 'Subsidizing fuel and agricultural inputs'],
      correctIndex: 2,
      explanation: 'Contractionary fiscal policy contracts aggregate demand by reducing government budgetary outlays and taking purchasing power out of circulation through higher taxes.'
    },
    {
      id: 304,
      subject: 'social',
      category: 'Economics • Keynesian Macroeconomics',
      difficulty: 'advanced',
      question: 'In a closed economy with no taxes, if the Marginal Propensity to Consume (MPC) is 0.80, what is the value of the Keynesian government expenditure multiplier?',
      options: ['1.25', '2.50', '5.00', '10.00'],
      correctIndex: 2,
      explanation: 'The expenditure multiplier formula is 1 / (1 - MPC). Here: 1 / (1 - 0.80) = 1 / 0.20 = 5. Every Birr spent generates 5 Birr in equilibrium national output.'
    },
    {
      id: 305,
      subject: 'social',
      category: 'Geography • Soil Conservation Engineering',
      difficulty: 'advanced',
      question: 'On steep agricultural gradients in the Ethiopian highlands, which biological-structural conservation combination provides optimal protection against sheet and rill erosion?',
      options: [
        'Continuous monoculture maize without contour bunds',
        'Vetiver grass vegetative buffer strips integrated with graded fanya-juu terraces',
        'Complete deforestation of hillside slopes for sun exposure',
        'Deep moldboard plowing down the slope direction'
      ],
      correctIndex: 1,
      explanation: 'Vetiver vegetative hedges coupled with fanya-juu terraces intercept surface runoff velocity, trap topsoil sediment, and enhance moisture infiltration.'
    },
    {
      id: 306,
      subject: 'social',
      category: 'Civics • Constitutional Review',
      difficulty: 'advanced',
      question: 'Under Articles 62 and 83 of the FDRE Constitution of Ethiopia, which specific constitutional organ is vested with the final authority to interpret the Constitution?',
      options: [
        'The Federal Supreme Court',
        'The House of Federation (HoF), assisted by the Council of Constitutional Inquiry',
        'The Federal High Court',
        'The Office of the Prime Minister'
      ],
      correctIndex: 1,
      explanation: 'Unlike American jurisprudence where supreme courts hold judicial review, the Ethiopian Constitution vests final constitutional interpretation in the House of Federation (HoF).'
    }
  ],
  english: [
    {
      id: 401,
      subject: 'english',
      category: 'Grammar • Parts of Speech',
      difficulty: 'beginner',
      question: 'In the sentence: "Diligent students at Kellem Secondary School study consistently," what part of speech is the word "Diligent"?',
      options: ['Adverb', 'Adjective', 'Noun', 'Preposition'],
      correctIndex: 1,
      explanation: '"Diligent" is an adjective that modifies and describes the noun "students".'
    },
    {
      id: 402,
      subject: 'english',
      category: 'Grammar • Irregular Plurals',
      difficulty: 'beginner',
      question: 'What is the correct academic plural form of the singular scientific noun "criterion"?',
      options: ['Criterions', 'Criteria', 'Criterias', 'Criterium'],
      correctIndex: 1,
      explanation: '"Criteria" is the correct plural form of Greek origin (similar to phenomenon -> phenomena).'
    },
    {
      id: 403,
      subject: 'english',
      category: 'Vocabulary • Antonyms',
      difficulty: 'beginner',
      question: 'Which of the following words is the direct antonym (opposite in meaning) of the adjective "ABUNDANT"?',
      options: ['Plentiful', 'Scarce', 'Copious', 'Sufficient'],
      correctIndex: 1,
      explanation: '"Abundant" means existing in large amounts, whereas "scarce" means rare or in short supply.'
    },
    {
      id: 16,
      subject: 'english',
      category: 'Grammar • Subject-Verb Agreement',
      difficulty: 'intermediate',
      question: 'Choose the correct verb form: "Neither the head teacher nor the department heads _______ present at yesterday\'s morning briefing."',
      options: ['was', 'were', 'is', 'are'],
      correctIndex: 1,
      explanation: 'In correlative "neither... nor" structures, the verb agrees with the closer subject ("department heads", plural) in the past tense ("were").'
    },
    {
      id: 17,
      subject: 'english',
      category: 'Vocabulary • Academic Register',
      difficulty: 'intermediate',
      question: 'What is the precise academic definition of the adjective "METICULOUS"?',
      options: ['Careless and hasty', 'Exceedingly precise, thorough, and attentive to detail', 'Hesitant and timid', 'Ambiguous and undefined'],
      correctIndex: 1,
      explanation: '"Meticulous" means showing great attention to detail, precision, and thoroughness.'
    },
    {
      id: 18,
      subject: 'english',
      category: 'Collocations & Prepositions',
      difficulty: 'intermediate',
      question: 'Select the proper grammatical preposition: "The school director congratulated the top students _______ their stellar entrance exam results."',
      options: ['on', 'for', 'about', 'with'],
      correctIndex: 0,
      explanation: 'The standard English prepositional collocation is "congratulate [someone] ON [something]".'
    },
    {
      id: 404,
      subject: 'english',
      category: 'Grammar • Negative Inversion',
      difficulty: 'advanced',
      question: 'Identify the grammatically correct inverted construction used for formal rhetorical emphasis:',
      options: [
        'Seldom we have witnessed such extraordinary dedication in the laboratory.',
        'Seldom have we witnessed such extraordinary dedication in the laboratory.',
        'Seldom we did witness such extraordinary dedication in the laboratory.',
        'Have we witnessed seldom such extraordinary dedication in the laboratory.'
      ],
      correctIndex: 1,
      explanation: 'When negative or restrictive adverbs ("Seldom", "Rarely", "Hardly") open a clause, subject-auxiliary inversion is mandatory: Adverb + Auxiliary (have) + Subject (we) + Main Verb (witnessed).'
    },
    {
      id: 405,
      subject: 'english',
      category: 'Grammar • Mandative Subjunctive',
      difficulty: 'advanced',
      question: 'Choose the correct subjunctive form: "Director Zarihuun requested that every candidate _______ thoroughly prepared before the entrance test begins."',
      options: ['is', 'was', 'be', 'will be'],
      correctIndex: 2,
      explanation: 'The mandative subjunctive following verbs of command, request, or recommendation ("requested that...") requires the base infinitive form of the verb without inflections ("be").'
    },
    {
      id: 406,
      subject: 'english',
      category: 'Vocabulary • Critical Reasoning',
      difficulty: 'advanced',
      question: 'In academic critique, if an argument is described as "fallacious", it is characterized as:',
      options: ['Empirically infallible and proven', 'Based on faulty reasoning or invalid logic', 'Universally affirmed by scientific consensus', 'Novel and innovative'],
      correctIndex: 1,
      explanation: '"Fallacious" comes from fallacy, describing arguments that contain flawed logic, invalid premises, or deceptive reasoning.'
    }
  ]
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Session & Authentication State
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('kellem_auth_token'));
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('kellem_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  // Rejection State (when a rejected student tries to sign in)
  const [rejectedInfo, setRejectedInfo] = useState<{ name?: string; email?: string; reason?: string } | null>(null);

  // Admin Console View State (for administrator Bilisatech4@gmail.com)
  const [showAdminConsole, setShowAdminConsole] = useState(false);
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);

  // Student Database
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);

  // UI Navigation
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentIdCardModal, setStudentIdCardModal] = useState<Student | null>(null);
  const [searchStudent, setSearchStudent] = useState('');
  const [allStudentsList, setAllStudentsList] = useState<Student[]>(INITIAL_STUDENTS);
  const [totalStudentsCount, setTotalStudentsCount] = useState<number>(INITIAL_STUDENTS.length);

  // Authentication Form State
  const [authRole, setAuthRole] = useState<'student' | 'teacher'>('student');
  const [authTab, setAuthTab] = useState<'signup' | 'signin'>('signup');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authClass, setAuthClass] = useState('Grade 12 Natural Science');
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authAlert, setAuthAlert] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Kellem AI Mode Switch: Chat vs Practice Quiz
  const [kellemAiTab, setKellemAiTab] = useState<'chat' | 'quiz'>('chat');
  // Inside Quiz View: Active Quiz vs Top Performers Ranking
  const [quizViewMode, setQuizViewMode] = useState<'quiz' | 'leaderboard'>('quiz');
  const [performerFilter, setPerformerFilter] = useState<'all' | 'natural' | 'social'>('all');

  // Institutional Announcements & Notification Center State
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<InstitutionalAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [readAnnouncementIds, setReadAnnouncementIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('kellem_read_announcements');
      if (saved) return new Set(JSON.parse(saved));
    } catch {
      // ignore
    }
    return new Set(['ann_campus_library_extended_hours']);
  });
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('kellem_notification_sound') !== 'false';
  });
  const [notificationBannerDismissed, setNotificationBannerDismissed] = useState<boolean>(false);

  // Kellem AI Chat State
  const [chatMode, setChatMode] = useState<'study' | 'english' | 'entrance' | 'skills' | 'announcements'>('study');
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: "Hello! I'm Kellem AI, your learning assistant for Kellem Secondary School in Dambi Dollo. Ask me any school question, explore study tips, check the latest institutional notices, or switch to Practice Quiz to test your knowledge!"
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Quiz State
  const [activeSubject, setActiveSubject] = useState<'entrance' | 'natural' | 'social' | 'english'>('entrance');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | QuizDifficulty>('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizHistory, setQuizHistory] = useState<QuizRecord[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [streak, setStreak] = useState(0);
  const [scoreNotification, setScoreNotification] = useState<string | null>(null);

  // Daily Streak State
  const [dailyStreak, setDailyStreak] = useState<DailyStreakData>(() => {
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();
    try {
      const saved = localStorage.getItem('kellemDailyStreak');
      if (saved) {
        const parsed = JSON.parse(saved);
        const lastDate = parsed.lastQuizDate;
        if (lastDate === today) {
          return {
            currentStreak: parsed.currentStreak || 1,
            bestStreak: parsed.bestStreak || parsed.currentStreak || 1,
            lastQuizDate: lastDate,
            streakBonusTotal: parsed.streakBonusTotal || 50,
            completedToday: true
          };
        } else if (lastDate === yesterday) {
          return {
            currentStreak: parsed.currentStreak || 1,
            bestStreak: parsed.bestStreak || parsed.currentStreak || 1,
            lastQuizDate: lastDate,
            streakBonusTotal: parsed.streakBonusTotal || 50,
            completedToday: false
          };
        } else {
          return {
            currentStreak: 0,
            bestStreak: parsed.bestStreak || 0,
            lastQuizDate: lastDate,
            streakBonusTotal: parsed.streakBonusTotal || 0,
            completedToday: false
          };
        }
      }
    } catch {
      // fallback
    }
    return {
      currentStreak: 3,
      bestStreak: 5,
      lastQuizDate: yesterday,
      streakBonusTotal: 85,
      completedToday: false
    };
  });

  // Daily Phrase & Voice
  const todayPhrase = DAILY_ENGLISH_PHRASES[new Date().getDate() % DAILY_ENGLISH_PHRASES.length];
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Scroll chat bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  // Fetch all students (both approved and pending) and live counts
  const fetchAllStudentsAndCounts = async () => {
    try {
      const res = await fetch('/api/students/all');
      if (res.ok) {
        const data = await res.json();
        if (typeof data.totalCount === 'number') {
          setTotalStudentsCount(data.totalCount);
        }
        if (Array.isArray(data.students) && data.students.length > 0) {
          setAllStudentsList(data.students);
          // Also sync with approved students
          const approved = data.students.filter((s: Student) => s.status === 'approved');
          if (approved.length > 0) {
            setStudents(approved);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching all students directory:', err);
    }
  };

  // Initial session verification & roster fetch
  const verifySessionAndFetchRoster = async () => {
    fetchAllStudentsAndCounts();

    if (token) {
      try {
        const meRes = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (meRes.ok) {
          const data = await meRes.json();
          setCurrentUser(data.user);
          localStorage.setItem('kellem_user_profile', JSON.stringify(data.user));

          // If admin, fetch pending count
          if (data.user.role === 'admin' || data.user.email.toLowerCase() === ADMIN_EMAIL) {
            fetchPendingApprovalsCount(token);
          }
        } else {
          // Token expired or invalid
          setToken(null);
          setCurrentUser(null);
          localStorage.removeItem('kellem_auth_token');
          localStorage.removeItem('kellem_user_profile');
        }
      } catch (err) {
        console.error('Session verify error:', err);
      }
    }

    // Fetch approved roster from backend
    if (token) {
      try {
        const rosterRes = await fetch('/api/students/roster', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (rosterRes.ok) {
          const rData = await rosterRes.json();
          if (Array.isArray(rData.students) && rData.students.length > 0) {
            setStudents(rData.students);
          }
          if (typeof rData.totalCount === 'number') {
            setTotalStudentsCount(rData.totalCount);
          }
        }
      } catch (err) {
        console.error('Roster fetch error:', err);
      }
    }
  };

  const fetchPendingApprovalsCount = async (authToken: string) => {
    try {
      const res = await fetch('/api/admin/pending', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPendingApprovalsCount((data.pendingStudents || []).length);
      }
    } catch (err) {
      console.error('Pending count error:', err);
    }
  };

  useEffect(() => {
    verifySessionAndFetchRoster();
  }, [token]);

  const fetchAnnouncementsFromServer = async () => {
    try {
      const res = await fetch('/api/announcements');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.announcements) && data.announcements.length > 0) {
          setAnnouncements(data.announcements);
        }
      }
    } catch {
      // fallback to initial announcements
    }
  };

  useEffect(() => {
    fetchAllStudentsAndCounts();
    fetchAnnouncementsFromServer();
    const interval = setInterval(() => {
      fetchAllStudentsAndCounts();
      fetchAnnouncementsFromServer();
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const unreadAnnouncementsCount = announcements.filter(a => !readAnnouncementIds.has(a.id)).length;

  const handleRequestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
        if (perm === 'granted') {
          if (soundEnabled) playNotificationSound();
          dispatchBrowserNotification(
            'Notifications Activated • Kellem Secondary School',
            'You will receive timely updates on EUEE entrance exams, admissions, and institutional notices.'
          );
        }
      } catch (err) {
        console.warn('Error requesting notification permission:', err);
      }
    }
  };

  const handleMarkAnnouncementAsRead = (id: string) => {
    setReadAnnouncementIds(prev => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem('kellem_read_announcements', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const handleMarkAllAnnouncementsAsRead = () => {
    const allIds = announcements.map(a => a.id);
    setReadAnnouncementIds(new Set(allIds));
    localStorage.setItem('kellem_read_announcements', JSON.stringify(allIds));
  };

  const handleToggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem('kellem_notification_sound', String(next));
      return next;
    });
  };

  // Refresh status helper for pending view
  const refreshUserStatus = async () => {
    if (!currentUser?.email) return;
    try {
      const res = await fetch(`/api/student/status?email=${encodeURIComponent(currentUser.email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'approved') {
          // Account was approved!
          setCurrentUser(prev => prev ? { ...prev, status: 'approved' } : null);
          localStorage.setItem('kellem_user_profile', JSON.stringify({ ...currentUser, status: 'approved' }));
          setAuthAlert({
            text: 'Your registration has been approved by administrator Bilisatech4@gmail.com! Welcome to Kellem Portal.',
            type: 'success'
          });
        } else if (data.status === 'rejected') {
          setRejectedInfo({
            name: data.name,
            email: data.email,
            reason: data.decisionReason || 'Registration declined by administrator.'
          });
          setCurrentUser(prev => prev ? { ...prev, status: 'rejected' } : null);
        }
      }
    } catch (err) {
      console.error('Status refresh error:', err);
    }
  };

  // Sign Out Handler
  const handleSignOut = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch {
        // ignore
      }
    }
    setToken(null);
    setCurrentUser(null);
    setRejectedInfo(null);
    setShowAdminConsole(false);
    localStorage.removeItem('kellem_auth_token');
    localStorage.removeItem('kellem_user_profile');
    setAuthAlert({
      text: 'You have signed out. Please sign in or create an account to access website features.',
      type: 'info'
    });
  };

  // Authentication Submission (Register or Sign In)
  // Requirement 1: Send approval request email to administrator ONLY when a new student registers
  // Requirement 2: Do NOT send approval requests when existing students sign in
  // Requirement 3: New student accounts must have PENDING status
  // Requirement 6: Approved students can sign in normally without additional approval
  // Requirement 7: Rejected students cannot access the website
  const handleAuthSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthAlert(null);
    setRejectedInfo(null);

    const cleanEmail = authEmail.trim().toLowerCase();
    const cleanPassword = authPassword.trim();

    if (!cleanEmail || !cleanPassword) {
      setAuthAlert({ text: 'Please enter both email and password.', type: 'error' });
      return;
    }

    setAuthLoading(true);

    try {
      if (authTab === 'signup') {
        // REGISTRATION
        if (!authName.trim()) {
          setAuthAlert({ text: 'Please enter your full name.', type: 'error' });
          setAuthLoading(false);
          return;
        }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: authName.trim(),
            email: cleanEmail,
            password: cleanPassword,
            role: authRole,
            className: authClass
          })
        });

        const data = await res.json();
        if (res.ok) {
          // Immediately update student directory and total count
          if (data.user) {
            const newStudentEntry: Student = {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              className: data.user.className,
              points: 50,
              quizPoints: 0,
              quizzesCompleted: 0,
              accuracy: 0,
              bestStreak: 0,
              status: data.user.status || 'pending',
              photoUrl: data.user.photoUrl || undefined,
              age: data.user.age || undefined,
              phone: data.user.phone || undefined,
              registrationDate: data.user.registrationDate || new Date().toISOString()
            };
            setAllStudentsList(prev => [newStudentEntry, ...prev.filter(s => s.email !== data.user.email)]);
            setTotalStudentsCount(typeof data.totalStudentsCount === 'number' ? data.totalStudentsCount : (prev => prev + 1));
          }

          // Requirement 3: New student accounts must have PENDING status
          if (data.status === 'pending') {
            if (data.token) {
              setToken(data.token);
              localStorage.setItem('kellem_auth_token', data.token);
            }
            setCurrentUser({
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              className: data.user.className,
              status: 'pending',
              photoUrl: data.user.photoUrl || undefined,
              age: data.user.age || undefined,
              phone: data.user.phone || undefined,
              registrationDate: data.user.registrationDate || new Date().toISOString()
            });
            // Requirement 1 was executed on backend: approval request email sent to Bilisatech4@gmail.com
            setAuthAlert({
              text: `Registration received! Account has PENDING status. An official approval request email has been dispatched to Administrator (${ADMIN_EMAIL}). You can manually upload your profile photo and add your age & phone number in Settings.`,
              type: 'info'
            });
          } else {
            // Non-student registration or immediate
            setAuthAlert({ text: 'Account created successfully! Please sign in.', type: 'success' });
            setAuthTab('signin');
          }
        } else {
          setAuthAlert({ text: data.error || 'Registration failed.', type: 'error' });
        }
      } else {
        // SIGN IN
        // Requirement 2: Do NOT send approval requests when existing students sign in!
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            password: cleanPassword
          })
        });

        const data = await res.json();

        if (res.ok) {
          // Requirement 6: Approved students can sign in normally without additional approval
          setToken(data.token);
          setCurrentUser(data.user);
          localStorage.setItem('kellem_auth_token', data.token);
          localStorage.setItem('kellem_user_profile', JSON.stringify(data.user));
          setAuthAlert(null);

          if (data.user.role === 'admin' || data.user.email.toLowerCase() === ADMIN_EMAIL) {
            fetchPendingApprovalsCount(data.token);
          }
        } else {
          // Handle PENDING or REJECTED status
          if (data.status === 'pending') {
            // Requirement 5: Pending students cannot access protected website pages
            setCurrentUser(data.user || {
              id: 'pending',
              name: cleanEmail.split('@')[0],
              email: cleanEmail,
              role: 'student',
              className: 'Grade 12 Natural Science',
              status: 'pending'
            });
            setAuthAlert({
              text: `Your registration is currently PENDING approval by Administrator (${ADMIN_EMAIL}). Protected pages are locked.`,
              type: 'info'
            });
          } else if (data.status === 'rejected') {
            // Requirement 7: Rejected students cannot access the website
            setRejectedInfo({
              email: cleanEmail,
              reason: data.reason || 'Application declined by school administrator.'
            });
          } else {
            setAuthAlert({ text: data.error || 'Incorrect email or password.', type: 'error' });
          }
        }
      }
    } catch (err) {
      setAuthAlert({ text: 'Unable to connect to server. Please try again.', type: 'error' });
    } finally {
      setAuthLoading(false);
    }
  };

  // Quick Demo Logins for Evaluation & Testing
  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setAuthEmail(demoEmail);
    setAuthPassword(demoPass);
    setAuthTab('signin');
    setAuthAlert(null);
  };

  const handleExecuteDirectLogin = async (demoEmail: string, demoPass: string) => {
    try {
      setAuthLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail.trim().toLowerCase(), password: demoPass })
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setCurrentUser(data.user);
        localStorage.setItem('kellem_auth_token', data.token);
        localStorage.setItem('kellem_user_profile', JSON.stringify(data.user));
        setAuthAlert(null);
        if (data.user.role === 'admin' || data.user.email.toLowerCase() === ADMIN_EMAIL) {
          fetchPendingApprovalsCount(data.token);
        }
      } else {
        setAuthAlert({ text: data.error || 'Failed to sign in', type: 'error' });
      }
    } catch {
      setAuthAlert({ text: 'Sign in network error', type: 'error' });
    } finally {
      setAuthLoading(false);
    }
  };

  // Switch to Administrator
  const handleSwitchToAdmin = () => {
    setCurrentUser(null);
    setRejectedInfo(null);
    setAuthEmail('Bilisatech4@gmail.com');
    setAuthPassword('Admin@Kellem2026');
    setAuthTab('signin');
    setAuthAlert({
      text: 'Administrator credentials filled (Bilisatech4@gmail.com). Click Sign In to access the Administrator Approval Console.',
      type: 'info'
    });
  };

  // Quiz Handling
  const sortedStudents = [...students].sort((a, b) => b.points - a.points);
  const bestStudent = sortedStudents[0];
  const topQuizPerformers = [...students].sort((a, b) => (b.quizPoints || 0) - (a.quizPoints || 0));
  const topQuizLeader = topQuizPerformers[0];

  const activeStudentName = currentUser?.name || bestStudent?.name || 'Bilisummaa Yaadasaa';
  const currentUserRankIndex = topQuizPerformers.findIndex(s => s.name.toLowerCase() === activeStudentName.toLowerCase());
  const currentUserRank = currentUserRankIndex >= 0 ? currentUserRankIndex + 1 : topQuizPerformers.length;
  const currentStudentData = topQuizPerformers[currentUserRankIndex] || topQuizPerformers[0];
  const studentAhead = currentUserRankIndex > 0 ? topQuizPerformers[currentUserRankIndex - 1] : null;
  const pointsToOvertake = studentAhead ? Math.max((studentAhead.quizPoints - currentStudentData.quizPoints) + 10, 10) : 0;

  const filteredPerformers = topQuizPerformers.filter(s => {
    if (performerFilter === 'natural') return s.className.toLowerCase().includes('natural');
    if (performerFilter === 'social') return s.className.toLowerCase().includes('social');
    return true;
  });

  const rawSubjectQuestions = QUIZ_BANKS[activeSubject] || QUIZ_BANKS.entrance;
  const filteredQuestions = selectedDifficulty === 'all'
    ? rawSubjectQuestions
    : rawSubjectQuestions.filter(q => q.difficulty === selectedDifficulty);
  const currentQuizQuestions = filteredQuestions.length > 0 ? filteredQuestions : rawSubjectQuestions;
  const currentQuestion = currentQuizQuestions[currentQuestionIndex] || currentQuizQuestions[0];
  const correctCount = quizHistory.filter(h => h.isCorrect).length;
  const attemptedCount = quizHistory.length;

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
    setIsAnswerSubmitted(true);
    const isCorrect = index === currentQuestion.correctIndex;
    const newStreak = isCorrect ? streak + 1 : 0;
    setStreak(newStreak);
    setQuizHistory(prev => [
      ...prev,
      {
        question: currentQuestion,
        selectedIndex: index,
        isCorrect
      }
    ]);
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex + 1 < currentQuizQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      const totalQ = currentQuizQuestions.length;
      const finalCorrect = quizHistory.filter(h => h.isCorrect).length;

      const basePointsEarned = quizHistory.reduce((sum, item) => {
        if (!item.isCorrect) return sum;
        if (item.question.difficulty === 'advanced') return sum + 20;
        if (item.question.difficulty === 'intermediate') return sum + 15;
        return sum + 10;
      }, 0);

      const isPerfect = finalCorrect === totalQ && totalQ > 0;
      const perfectBonus = isPerfect
        ? (selectedDifficulty === 'advanced' ? 30 : selectedDifficulty === 'intermediate' ? 25 : 20)
        : 0;
      const pointsEarned = basePointsEarned + perfectBonus;

      const today = getTodayDateString();
      const yesterday = getYesterdayDateString();
      let earnedStreakBonus = 0;
      let nextStreakDays = dailyStreak.currentStreak;

      if (!dailyStreak.completedToday) {
        if (dailyStreak.lastQuizDate === yesterday) {
          nextStreakDays = dailyStreak.currentStreak + 1;
        } else {
          nextStreakDays = 1;
        }
        earnedStreakBonus = 25 + (nextStreakDays * 10);
        const updatedStreakData: DailyStreakData = {
          currentStreak: nextStreakDays,
          bestStreak: Math.max(dailyStreak.bestStreak, nextStreakDays),
          lastQuizDate: today,
          streakBonusTotal: (dailyStreak.streakBonusTotal || 0) + earnedStreakBonus,
          completedToday: true
        };
        setDailyStreak(updatedStreakData);
        localStorage.setItem('kellemDailyStreak', JSON.stringify(updatedStreakData));
      }

      const totalRoundEarned = pointsEarned + earnedStreakBonus;

      // Backend sync if user is approved
      if (token && currentUser?.status === 'approved') {
        try {
          await fetch('/api/quiz/record-score', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              pointsEarned: totalRoundEarned,
              finalCorrect,
              totalQuestions: totalQ,
              currentStreak: nextStreakDays
            })
          });
        } catch (err) {
          console.error('Quiz record error:', err);
        }
      }

      // Update local state
      setStudents(prev => {
        const targetStudentName = currentUser?.name || bestStudent?.name || 'Bilisummaa Yaadasaa';
        return prev.map(s => {
          if (s.name.toLowerCase() === targetStudentName.toLowerCase()) {
            const nextQuizPoints = (s.quizPoints || 0) + totalRoundEarned;
            const nextQuizzes = (s.quizzesCompleted || 0) + 1;
            const nextAcc = Math.round(
              ((s.accuracy || 75) * (s.quizzesCompleted || 1) + (finalCorrect / totalQ) * 100) / nextQuizzes
            );
            return {
              ...s,
              points: s.points + totalRoundEarned,
              quizPoints: nextQuizPoints,
              quizzesCompleted: nextQuizzes,
              accuracy: nextAcc,
              bestStreak: Math.max(s.bestStreak || 0, streak)
            };
          }
          return s;
        });
      });

      if (earnedStreakBonus > 0) {
        setScoreNotification(
          `🔥 Day ${nextStreakDays} Daily Streak Achieved! +${pointsEarned} Quiz Points + ${earnedStreakBonus} Daily Streak Bonus (+${totalRoundEarned} Total) awarded to ${activeStudentName}!`
        );
      } else {
        setScoreNotification(
          `✓ +${pointsEarned} Quiz Points earned! Daily streak protected at ${dailyStreak.currentStreak} consecutive days.`
        );
      }
    }
  };

  const restartQuiz = (
    newSubject?: 'entrance' | 'natural' | 'social' | 'english',
    newDifficulty?: 'all' | QuizDifficulty
  ) => {
    if (newSubject) setActiveSubject(newSubject);
    if (newDifficulty !== undefined) setSelectedDifficulty(newDifficulty);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizHistory([]);
    setQuizFinished(false);
    setStreak(0);
    setScoreNotification(null);
    setQuizViewMode('quiz');
  };

  const handleDiscussMistakesInChat = () => {
    const wrongAnswers = quizHistory.filter(h => !h.isCorrect);
    let promptText = '';
    if (wrongAnswers.length === 0) {
      promptText = `I scored 100% on the ${activeSubject.toUpperCase()} practice quiz! Can you give me more advanced concepts to prepare for the Ethiopian national entrance exam?`;
    } else {
      promptText = `I just completed the ${activeSubject.toUpperCase()} quiz and missed ${wrongAnswers.length} question(s). Specifically: "${wrongAnswers[0].question.question}". Could you explain the concept in deeper detail and give me a helpful memory tip?`;
    }
    setKellemAiTab('chat');
    setInputQuestion(promptText);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: 'user', text: promptText },
        {
          sender: 'ai',
          text: `Great initiative! Reviewing mistakes is how top students at Kellem Secondary School achieve distinction. Let's break down that topic step-by-step:\n\n${wrongAnswers[0]?.question.explanation || 'You mastered all the questions! Consistent revision maintains your top ranking.'}\n\nWhat other questions or related concepts would you like to explore?`
        }
      ]);
    }, 150);
  };

  const handleDiscussQuestionInChat = (questionText: string) => {
    const promptText = `Can you explain this question from the Kellem Exam Generator step-by-step and show the complete solution?\n\n"${questionText}"`;
    setKellemAiTab('chat');
    setInputQuestion(promptText);
    const el = document.getElementById('kellem-ai');
    el?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: 'user', text: promptText },
        {
          sender: 'ai',
          text: `Certainly! Let's solve this examination problem together step-by-step for Kellem Secondary School:\n\n**Problem Statement:**\n${questionText}\n\n**Key Academic Principles:**\n1. Analyze the given parameters and identify the relevant formula or grammatical rule.\n2. Work through the steps methodically avoiding common distractor options.\n3. Verify your final answer against Ethiopian curriculum standards.\n\nWhat specific part of this question would you like to explore further?`
        }
      ]);
    }, 200);
  };

  const handleExamScoreUpdated = (updatedUser: any) => {
    if (updatedUser && currentUser) {
      const merged = { ...currentUser, ...updatedUser };
      setCurrentUser(merged);
      localStorage.setItem('kellem_user_profile', JSON.stringify(merged));
      setStudents(prev =>
        prev.map(s => (s.id === updatedUser.id || s.name.toLowerCase() === currentUser.name.toLowerCase()) ? { ...s, ...updatedUser } : s)
      );
    }
  };

  const handleSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${todayPhrase.phrase}. Reply: ${todayPhrase.reply}`);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert(`${todayPhrase.phrase} - ${todayPhrase.reply}`);
    }
  };

  const generateKellemAiResponse = (query: string, mode: string): string => {
    const q = query.toLowerCase().trim();
    if (/streak|daily streak|consecutive|bonus/.test(q)) {
      return `Your daily streak is currently at ${dailyStreak.currentStreak} day(s)! Complete at least one quiz every day to earn up to +${25 + (dailyStreak.currentStreak + 1) * 10} bonus points each day. Consistency is the secret to topping the entrance exam!`;
    }
    if (/approval|registration|pending|bilisatech/.test(q)) {
      return `Kellem Secondary School operates on a registration-only approval policy overseen by Administrator ${ADMIN_EMAIL}. New student accounts receive PENDING status until approved. Once approved, you can sign in normally without any repetitive approvals.`;
    }
    if (/quiz|practice question|test me|exam question|practice|leaderboard|top performer|rank/.test(q)) {
      return "I have an interactive practice quiz and Top Performers leaderboard ready! You can switch to the '🔥 Practice Quiz & Tracker' tab above to test your skills, earn cumulative quiz points, maintain your daily streak, and climb to the #1 spot on the school rankings.";
    }
    if (/hello|hi|hey|akkam|nagaa/.test(q)) {
      return "Hello! I'm Kellem AI, dedicated to helping Kellem Secondary School students excel. What subject or lesson are you focusing on today?";
    }
    if (mode === 'english' || /english|speak|phrase|grammar|vocabulary/.test(q)) {
      if (/practice|conversation/.test(q)) {
        return `Let's practice! Repeat this: "Consistent daily effort leads to academic excellence." Now reply with your favorite subject and why you enjoy it!`;
      }
      return `Daily English Tip from Kellem AI:\nPhrase: "${todayPhrase.phrase}"\nNatural Response: "${todayPhrase.reply}"\nUsage note: ${todayPhrase.tip}`;
    }
    if (mode === 'entrance' || /entrance|exam|study|revision|test/.test(q)) {
      return `Kellem AI Entrance Strategy:\n1. Master core concepts in Physics, Chemistry, Biology / Economics & Geography.\n2. Maintain your Daily Quiz Streak for consistent memory retention.\n3. Solve practice questions daily to climb the Top Performers leaderboard.\n4. Practice daily revision habits.`;
    }
    if (mode === 'skills' || /skill|coding|tech|computer/.test(q)) {
      return `Developing 21st-century skills: Start with fundamentals of algorithmic thinking, computer literacy, or science projects. Small, consistent daily practice creates lifelong mastery!`;
    }
    if (mode === 'announcements' || /announcement|notification|notice|schedule|deadline|bulletin|euee/.test(q)) {
      return `📢 Kellem Institutional Announcements:\n• EUEE 2026 National University Entrance Exam candidate admission passes are now ready at the Admissions Directorate.\n• Grade 12 Natural & Social Science weekend revision practicals are scheduled in the science laboratory and library.\n• Turn on notifications via the 🔔 bell icon at the top of the portal to receive timely institutional alerts!`;
    }
    return `That's an insightful question about "${query}". At Kellem Secondary School, breaking complex topics into clear fundamentals is the best way to master them. Review your textbook examples, test your understanding with practice questions, and check the Institutional Announcements for current academic schedules!`;
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuestion.trim()) return;
    const userText = inputQuestion.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputQuestion('');
    setIsAiTyping(true);
    setTimeout(() => {
      const response = generateKellemAiResponse(userText, chatMode);
      setMessages(prev => [...prev, { sender: 'ai', text: response }]);
      setIsAiTyping(false);
    }, 450);
  };

  const filteredStudents = sortedStudents.filter(
    s => s.name.toLowerCase().includes(searchStudent.toLowerCase()) || s.className.toLowerCase().includes(searchStudent.toLowerCase())
  );

  const scorePercent = currentQuizQuestions.length > 0
    ? Math.round((correctCount / currentQuizQuestions.length) * 100)
    : 0;

  const getTierInfo = (percent: number) => {
    if (percent === 100) {
      return {
        badge: '🏆 National Entrance Distinction Master',
        color: 'bg-amber-100 text-amber-900 border-amber-300',
        message: 'Flawless performance! You mastered every concept in this exam round.'
      };
    }
    if (percent >= 80) {
      return {
        badge: '🎖️ University Placement Honors Track',
        color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        message: 'Outstanding score! You are well prepared for high national rankings.'
      };
    }
    if (percent >= 60) {
      return {
        badge: '📘 Solid Academic Competence',
        color: 'bg-blue-100 text-blue-900 border-blue-300',
        message: 'Good foundation. Review your incorrect answers to turn B grades into A+.'
      };
    }
    return {
      badge: '💡 Focused Revision Recommended',
      color: 'bg-orange-100 text-orange-900 border-orange-300',
      message: 'Keep going! Regular practice with Kellem AI will rapidly elevate your scores.'
    };
  };

  const tier = getTierInfo(scorePercent);

  // -------------------------------------------------------------
  // CONDITIONAL GATES:
  // -------------------------------------------------------------

  // 1. REJECTED STATE: Requirement 7 ("Rejected students cannot access the website")
  if (rejectedInfo) {
    return (
      <RejectedView
        studentName={rejectedInfo.name}
        studentEmail={rejectedInfo.email}
        reason={rejectedInfo.reason}
        adminEmail={ADMIN_EMAIL}
        onSignOut={handleSignOut}
        onSwitchToAdmin={handleSwitchToAdmin}
      />
    );
  }

  // 2. PENDING STATE: Requirement 3 & 5 ("New student accounts must have PENDING status. Pending students cannot access protected website pages.")
  if (currentUser && currentUser.status === 'pending') {
    return (
      <>
        <PendingApprovalView
          user={currentUser}
          onRefreshStatus={refreshUserStatus}
          onSignOut={handleSignOut}
          onSwitchToAdmin={handleSwitchToAdmin}
          onOpenSettings={() => setShowSettingsModal(true)}
        />
        {showSettingsModal && (
          <UserSettingsModal
            user={currentUser}
            currentUser={currentUser}
            token={token}
            onClose={() => setShowSettingsModal(false)}
            onProfileUpdated={(updated) => {
              setCurrentUser(updated);
              localStorage.setItem('kellem_user_profile', JSON.stringify(updated));
              setAllStudentsList(prev =>
                prev.map(s => (s.id === updated.id || s.email === updated.email ? { ...s, ...updated } : s))
              );
            }}
          />
        )}
      </>
    );
  }

  // 3. STUDENT DASHBOARD ROUTE (When navigating to #/dashboard via HashRouter)
  if (location.pathname === '/dashboard') {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        {!currentUser && (
          <div className="bg-[#082942] text-amber-300 text-xs py-2.5 px-4 font-bold border-b border-amber-400/30 flex flex-wrap items-center justify-between gap-2 shadow-sm">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Student Dashboard Preview Mode • Showing academic standing & exam goals for Bilisummaa Yaadasaa</span>
            </span>
            <button
              onClick={() => navigate('/')}
              className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer transition-all shadow-sm"
            >
              Back to Sign In / Register →
            </button>
          </div>
        )}
        <StudentDashboard
          currentUser={currentUser}
          students={students}
          allStudentsList={allStudentsList}
          dailyStreak={dailyStreak}
          onOpenSettings={() => setShowSettingsModal(true)}
          onOpenIdCard={(st) => setStudentIdCardModal(st)}
          onNavigateHome={() => navigate('/')}
          onStartQuiz={(subject) => {
            navigate('/');
            setKellemAiTab('quiz');
            setQuizViewMode('quiz');
            if (subject) restartQuiz(subject);
            setTimeout(() => {
              document.getElementById('kellem-ai')?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          }}
          onOpenExamGenerator={() => {
            navigate('/');
            setTimeout(() => {
              document.getElementById('exam-generator')?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          }}
          onQuickLoginStudent={handleExecuteDirectLogin}
        />
        {/* User Settings Modal */}
        {showSettingsModal && currentUser && (
          <UserSettingsModal
            user={currentUser}
            currentUser={currentUser}
            token={token}
            onClose={() => setShowSettingsModal(false)}
            onProfileUpdated={(updated) => {
              setCurrentUser(updated);
              localStorage.setItem('kellem_user_profile', JSON.stringify(updated));
              setStudents(prev =>
                prev.map(s => (s.id === updated.id || s.name.toLowerCase() === updated.name.toLowerCase()) ? { ...s, ...updated } : s)
              );
              setAllStudentsList(prev =>
                prev.map(s => (s.id === updated.id || s.email === updated.email) ? { ...s, ...updated } : s)
              );
            }}
          />
        )}
      </div>
    );
  }

  // 4. UNAUTHENTICATED STATE: Create new account or sign in first
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#071d2e] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-white flex flex-col justify-between relative overflow-hidden">
        {/* Ambient atmospheric glows */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Mini Bar */}
        <div className="bg-[#051624] text-slate-300 text-xs border-b border-emerald-500/20 py-2.5 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">●</span>
              <span>Dambi Dollo, Oromia, Ethiopia</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-medium">Mana Barumsaa Qellem Sad 2ffaa</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-emerald-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin Approval: <strong>{ADMIN_EMAIL}</strong></span>
              </span>
            </div>
          </div>
        </div>

        {/* Main Central Container */}
        <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
          <div className="bg-[#0b2942]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-10">
            {/* Header / Emblem */}
            <div className="text-center space-y-3 mb-8">
              <div className="flex justify-center">
                <img
                  src="/assets/aistudio/kss_best_logo_9d217f0f.png"
                  alt="Kellem Secondary School Official Emblem"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-1.5 border-2 border-emerald-400 shadow-2xl object-contain hover:scale-105 transition-transform"
                />
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Registration-Only Approval Portal
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Kellem Secondary School
              </h1>
              <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
                New students registering receive <strong>PENDING</strong> status and trigger an approval email to the Administrator (<strong>{ADMIN_EMAIL}</strong>). Approved students sign in normally without repeated approval.
              </p>

              {/* Direct Explore Student Dashboard Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400/20 via-emerald-400/20 to-teal-400/20 hover:from-amber-400/30 hover:to-emerald-400/30 text-emerald-300 border border-emerald-400/30 text-xs font-black inline-flex items-center gap-2 cursor-pointer transition-all shadow-sm hover:scale-102"
                >
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  <span>Explore Student Dashboard (Points, Quiz Rank & Exam Goals) →</span>
                </button>
              </div>
            </div>

            {/* Tab Selector */}
            <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-black/40 border border-white/10 max-w-md mx-auto mb-8">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('signup');
                  setAuthAlert(null);
                }}
                className={`py-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  authTab === 'signup'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg scale-102 font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4" /> 1. Register New Student
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('signin');
                  setAuthAlert(null);
                }}
                className={`py-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  authTab === 'signin'
                    ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-lg scale-102 font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-4 h-4" /> 2. Sign In (Approved / Admin)
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="max-w-lg mx-auto space-y-4">
              {authTab === 'signup' && (
                <>
                  {/* Notice of Registration-only email */}
                  <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Approval Notice:</strong> Submitting will send an approval request email to <strong>{ADMIN_EMAIL}</strong> with your photo, age, and phone number. Your account will be <strong>PENDING</strong> until approved.
                    </div>
                  </div>

                  {/* Manual Settings Notice */}
                  <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2.5">
                    <Settings className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Manual Profile Details:</strong> Profile photo, age, and phone number are never added automatically. Once registered, you can manually upload your photo and set your age and phone number anytime in your <strong>Account Settings</strong>.
                    </div>
                  </div>

                  {/* Role picker */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">Account Role</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setAuthRole('student')}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
                          authRole === 'student'
                            ? 'border-emerald-400 bg-emerald-950/80 text-emerald-200 ring-2 ring-emerald-500/30'
                            : 'border-slate-700 bg-black/20 text-slate-400 hover:border-slate-500'
                        }`}
                      >
                        <span className="text-xl">🎓</span>
                        <div>
                          <div className="font-extrabold text-white">Student</div>
                          <div className="text-[10px] text-slate-400">Requires Admin Approval</div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthRole('teacher')}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
                          authRole === 'teacher'
                            ? 'border-amber-400 bg-amber-950/80 text-amber-200 ring-2 ring-amber-500/30'
                            : 'border-slate-700 bg-black/20 text-slate-400 hover:border-slate-500'
                        }`}
                      >
                        <span className="text-xl">👨‍🏫</span>
                        <div>
                          <div className="font-extrabold text-white">Faculty / Staff</div>
                          <div className="text-[10px] text-slate-400">School Educators</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={authName}
                        onChange={e => setAuthName(e.target.value)}
                        placeholder="e.g. Toleraa Gudeta"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  {/* Grade / Stream */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      {authRole === 'student' ? 'Grade & Academic Stream' : 'Department'}
                    </label>
                    <select
                      value={authClass}
                      onChange={e => setAuthClass(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#071a2b] border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-400"
                    >
                      {authRole === 'student' ? (
                        <>
                          <option value="Grade 12 Natural Science">Grade 12 Natural Science</option>
                          <option value="Grade 12 Social Science">Grade 12 Social Science</option>
                          <option value="Grade 11 Natural Science">Grade 11 Natural Science</option>
                          <option value="Grade 11 Social Science">Grade 11 Social Science</option>
                          <option value="Grade 10">Grade 10</option>
                          <option value="Grade 9">Grade 9</option>
                        </>
                      ) : (
                        <>
                          <option value="Science Department">Science Department</option>
                          <option value="Social Studies Department">Social Studies Department</option>
                          <option value="English & Languages Department">English & Languages Department</option>
                          <option value="School Administration">School Administration</option>
                        </>
                      )}
                    </select>
                  </div>
                </>
              )}

              {/* Email Address */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={e => setAuthEmail(e.target.value)}
                    placeholder="student@kellem.edu.et or name@gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={authPassword}
                    onChange={e => setAuthPassword(e.target.value)}
                    placeholder="Enter password (minimum 6 characters)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 placeholder:text-slate-500"
                  />
                </div>
              </div>

              {authAlert && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-bold leading-relaxed ${
                    authAlert.type === 'success'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      : authAlert.type === 'info'
                      ? 'bg-amber-950/80 text-amber-200 border border-amber-500/40'
                      : 'bg-red-950/80 text-red-300 border border-red-500/40'
                  }`}
                >
                  {authAlert.text}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {authLoading ? (
                  <span>Processing...</span>
                ) : authTab === 'signup' ? (
                  <>
                    <UserPlus className="w-5 h-5 text-slate-950" />
                    <span>Register Account (Dispatches Admin Approval Email)</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 text-slate-950" />
                    <span>Sign In (No approval requests sent on sign in)</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Bar */}
            <div className="mt-8 pt-6 border-t border-white/10 max-w-lg mx-auto">
              <span className="text-xs font-bold text-slate-400 block text-center mb-3">
                Quick 1-Click Evaluation Credentials:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('bilisummaa@kellem.edu.et', 'Kellem@2026')}
                  className="px-2.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  🎓 Bilisummaa Yaadasaa
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('feeneet@kellem.edu.et', 'Kellem@2026')}
                  className="px-2.5 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border border-teal-500/40 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  🎓 Feeneet Yooseef
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('Bilisatech4@gmail.com', 'Admin@Kellem2026')}
                  className="px-2.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  👑 Admin (Bilisatech4)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('signup');
                    setAuthName(`Student_${Math.floor(Math.random() * 900 + 100)}`);
                    setAuthEmail(`student${Math.floor(Math.random() * 900 + 100)}@kellem.edu.et`);
                    setAuthPassword('Student@1234');
                    setAuthAlert({
                      text: 'Filled new student registration! Click "Register Account" to see the approval request email sent to Bilisatech4@gmail.com.',
                      type: 'info'
                    });
                  }}
                  className="px-2.5 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-500/40 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  📝 New Test Applicant
                </button>
              </div>
            </div>

            {/* Policy Verification Points */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Approval email sent <strong>ONLY</strong> when a new student registers.</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>NO</strong> approval emails sent when existing students sign in.</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>New students start with <strong>PENDING</strong> status.</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Only administrator (<strong>{ADMIN_EMAIL}</strong>) can approve.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="py-4 text-center text-xs text-slate-400 border-t border-white/10 bg-[#051624]">
          © {new Date().getFullYear()} Kellem Secondary School • Dambi Dollo, Oromia, Ethiopia.
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 4. APPROVED / AUTHENTICATED USER PORTAL VIEW
  // All original Kellem Secondary School features preserved!
  // -------------------------------------------------------------
  const isAdmin = currentUser.role === 'admin' || currentUser.email.toLowerCase() === ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f2438] font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Bar with Admin Governance Info */}
      <div className="bg-[#082942] text-slate-200 text-xs sm:text-sm border-b border-emerald-500/20 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">●</span>
            <span>Dambi Dollo, Oromia, Ethiopia</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Mana Barumsaa Qellem Sad 2ffaa</span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Notification Bell Shortcut in Top Bar */}
            <button
              onClick={() => setNotificationModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-400"
              title="Institutional Bulletins & Timely Notifications"
              aria-label="View Institutional Announcements"
            >
              <Bell className="w-3.5 h-3.5 text-emerald-400" />
              <span>Notices</span>
              {unreadAnnouncementsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center">
                  {unreadAnnouncementsCount}
                </span>
              )}
            </button>

            {isAdmin && (
              <button
                onClick={() => setShowAdminConsole(!showAdminConsole)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 transition-all cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Console</span>
                {pendingApprovalsCount > 0 && (
                  <span className="bg-red-600 text-white px-1.5 py-0.2 rounded-full text-[10px] animate-pulse">
                    {pendingApprovalsCount} Pending
                  </span>
                )}
              </button>
            )}

            <div className="flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30 text-xs font-semibold">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {isAdmin ? 'Administrator' : 'Approved Student'}: <strong>{currentUser.name}</strong> ({currentUser.className || currentUser.role})
              </span>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                location.pathname === '/dashboard'
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 scale-105'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
              title="View student dashboard: points, quiz rank, and upcoming exam goals"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Dashboard</span>
            </button>

            <button
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-emerald-500/40 text-xs font-bold transition-all cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500"
              title="Manual photo, age, and phone number settings"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-400" />
              <span>Settings</span>
            </button>

            <button
              onClick={handleSignOut}
              className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <LogOut className="w-3 h-3" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <button
            onClick={() => {
              navigate('/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 group text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-2xl"
          >
            <img
              src="/assets/aistudio/kss_best_logo_9d217f0f.png"
              alt="Kellem Secondary School Logo"
              className="w-14 h-14 rounded-2xl bg-white p-0.5 border-2 border-emerald-500/40 object-contain shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform shrink-0"
            />
            <div>
              <div className="text-xl font-black text-[#0B192C] tracking-tight leading-none flex items-center gap-1.5">
                Kellem <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Secondary</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">Secondary School • Dambi Dollo</p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-semibold text-slate-700">
            <button
              onClick={() => {
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`transition-colors cursor-pointer font-bold ${
                location.pathname === '/' ? 'text-emerald-700 underline underline-offset-4 decoration-2 decoration-emerald-600' : 'hover:text-emerald-700'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className={`px-3 py-1.5 rounded-full font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                location.pathname === '/dashboard'
                  ? 'bg-emerald-700 text-white shadow-emerald-900/20 ring-2 ring-emerald-500'
                  : 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100 hover:scale-102'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-700" />
              <span>Student Dashboard</span>
              <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full font-black">Goals</span>
            </button>
            <a href="#about" onClick={() => navigate('/')} className="hover:text-emerald-700 transition-colors">About</a>
            <a href="#announcements" onClick={() => navigate('/')} className="hover:text-emerald-700 transition-colors font-bold text-emerald-900 flex items-center gap-1">
              <span>Announcements</span>
              {unreadAnnouncementsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              )}
            </a>
            <a href="#students" onClick={() => navigate('/')} className="hover:text-emerald-700 transition-colors">Students</a>
            <a
              href="#kellem-ai"
              onClick={() => {
                navigate('/');
                setKellemAiTab('chat');
              }}
              className="hover:text-emerald-700 text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200"
            >
              <Bot className="w-4 h-4 text-emerald-700" /> Kellem AI
            </a>
            <a
              href="#kellem-ai"
              onClick={() => {
                navigate('/');
                setKellemAiTab('quiz');
                setQuizViewMode('leaderboard');
              }}
              className="hover:text-amber-900 text-amber-900 font-bold flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-300"
            >
              <Flame className="w-4 h-4 fill-orange-500 text-orange-600" />
              <span>Streak: {dailyStreak.currentStreak}d</span>
            </a>
            <a
              href="#exam-generator"
              onClick={() => navigate('/')}
              className="text-[#0B192C] hover:text-emerald-800 font-black flex items-center gap-1.5 bg-gradient-to-r from-emerald-100 via-teal-100 to-emerald-200 px-3.5 py-1.5 rounded-full border border-emerald-400 shadow-sm transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Exam Generator</span>
              <span className="text-[10px] bg-emerald-800 text-white px-2 py-0.5 rounded-full font-bold">20-100Q</span>
            </a>
            <a href="#departments" onClick={() => navigate('/')} className="hover:text-emerald-700 transition-colors">Departments</a>
            <a href="#win-entrance" onClick={() => navigate('/')} className="hover:text-emerald-700 transition-colors">Win Entrance</a>
            <a href="#english-club" onClick={() => navigate('/')} className="hover:text-emerald-700 transition-colors">English Club</a>
            <a href="#student-data" onClick={() => navigate('/')} className="text-white bg-[#0B192C] hover:bg-[#1E293B] px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm font-bold">
              <Users className="w-4 h-4" /> Student Data
            </a>

            {/* Notification Bell in Navbar */}
            <button
              onClick={() => setNotificationModalOpen(true)}
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 border border-slate-200 transition-all cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-500"
              title="Institutional Announcements & Notifications"
              aria-label="Institutional Notifications"
            >
              <Bell className="w-4 h-4 text-slate-800" />
              <span className="hidden xl:inline text-xs font-bold">Alerts</span>
              {unreadAnnouncementsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[9px] font-black">
                  {unreadAnnouncementsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowSettingsModal(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold flex items-center gap-1.5 border border-emerald-200 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <Settings className="w-4 h-4 text-emerald-700" />
              <span>Settings</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => setShowAdminConsole(!showAdminConsole)}
                className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-extrabold flex items-center gap-1.5 border border-amber-300 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Admin</span>
                {pendingApprovalsCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                )}
              </button>
            )}
          </nav>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 shadow-xl animate-in fade-in duration-200">
            <button
              onClick={() => {
                setShowSettingsModal(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-950 font-bold text-xs flex items-center gap-2 border border-emerald-200"
            >
              <Settings className="w-4 h-4 text-emerald-600" />
              <span>Account Settings (Manual Photo, Age & Phone)</span>
            </button>
            {isAdmin && (
              <button
                onClick={() => {
                  setShowAdminConsole(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2.5 px-3 rounded-lg bg-amber-100 text-amber-950 font-black text-xs flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Admin Approval Console</span>
                </span>
                <span className="bg-amber-300 text-amber-950 px-2 py-0.5 rounded-full font-black text-[10px]">
                  {pendingApprovalsCount} Pending
                </span>
              </button>
            )}
            <button
              onClick={() => {
                navigate('/dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-950 font-black text-xs flex items-center justify-between border border-emerald-300 cursor-pointer shadow-xs"
            >
              <span className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>Student Dashboard (Points, Rank & Goals)</span>
              </span>
              <span className="bg-emerald-700 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">New</span>
            </button>
            <button
              onClick={() => {
                navigate('/');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full text-left py-2 text-slate-700 font-semibold hover:text-emerald-700 cursor-pointer"
            >
              Home Portal
            </button>
            <a
              href="#exam-generator"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-950 font-black text-xs flex items-center justify-between border border-emerald-300"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Exam & Test Generator (Students & Teachers)</span>
              </span>
              <span className="bg-emerald-700 text-white text-[10px] px-2 py-0.5 rounded-full">20-100Q</span>
            </a>
            <button
              onClick={() => {
                setNotificationModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl bg-amber-50 text-amber-950 font-bold text-xs flex items-center justify-between border border-amber-200"
            >
              <span className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-700" />
                <span>Institutional Notices & Alerts</span>
              </span>
              {unreadAnnouncementsCount > 0 && (
                <span className="bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                  {unreadAnnouncementsCount} New
                </span>
              )}
            </button>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-semibold hover:text-emerald-700">About Our School</a>
            <a href="#announcements" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-semibold hover:text-emerald-700">Official Announcements</a>
            <a href="#students" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-semibold hover:text-emerald-700">Students List</a>
            <a
              href="#kellem-ai"
              onClick={() => {
                setKellemAiTab('chat');
                setMobileMenuOpen(false);
              }}
              className="block py-2 text-emerald-800 font-bold bg-emerald-50 px-3 rounded-lg"
            >
              🤖 Kellem AI Learning Assistant
            </a>
            <a
              href="#kellem-ai"
              onClick={() => {
                setKellemAiTab('quiz');
                setMobileMenuOpen(false);
              }}
              className="block py-2 text-amber-900 font-bold bg-amber-50 px-3 rounded-lg flex items-center justify-between"
            >
              <span>🔥 Daily Streak: {dailyStreak.currentStreak} Days</span>
              <span className="text-xs bg-amber-200 px-2 py-0.5 rounded-full font-black">
                {dailyStreak.completedToday ? 'Done Today' : 'Quiz Needed'}
              </span>
            </a>
            <a href="#departments" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-semibold hover:text-emerald-700">Academic Departments</a>
            <a href="#win-entrance" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-semibold hover:text-emerald-700">Win Entrance Exam Prep</a>
            <a href="#english-club" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-semibold hover:text-emerald-700">English Club</a>
            <a href="#student-data" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-semibold hover:text-emerald-700">All Student Database</a>
            <div className="pt-3 mt-2 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-500">{currentUser.className || currentUser.role}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold flex items-center gap-1 border border-red-200 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Container / Router View Switching with HashRouter */}
      {location.pathname === '/dashboard' ? (
        <StudentDashboard
          currentUser={currentUser}
          students={students}
          allStudentsList={allStudentsList}
          dailyStreak={dailyStreak}
          onOpenSettings={() => setShowSettingsModal(true)}
          onOpenIdCard={(st) => setStudentIdCardModal(st)}
          onNavigateHome={() => {
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onStartQuiz={(subject) => {
            navigate('/');
            setKellemAiTab('quiz');
            setQuizViewMode('quiz');
            if (subject) restartQuiz(subject);
            setTimeout(() => {
              document.getElementById('kellem-ai')?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          }}
          onOpenExamGenerator={() => {
            navigate('/');
            setTimeout(() => {
              document.getElementById('exam-generator')?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          }}
          onQuickLoginStudent={handleExecuteDirectLogin}
        />
      ) : (
        <main id="home">
          {/* Administrator Approval Console Section (When toggled or when admin visits) */}
          {isAdmin && showAdminConsole && token && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
              <AdminConsole
                token={token}
                adminEmail={ADMIN_EMAIL}
                onClose={() => setShowAdminConsole(false)}
                onRefreshData={() => verifySessionAndFetchRoster()}
              />
            </section>
          )}

          {/* Top Interactive Dashboard Bar */}
          <section className="bg-gradient-to-r from-[#072439] via-[#0b3829] to-[#0a4834] text-white py-4 shadow-inner">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Student Dashboard Showcase Card */}
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold shadow-lg shadow-emerald-950/40 group transition-all cursor-pointer text-left border border-emerald-400/30"
                >
                  <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform">
                    🎓
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-emerald-200 font-black block">
                      Personal Analytics & Goals
                    </span>
                    <span className="text-base sm:text-lg font-black tracking-tight flex items-center gap-1.5 truncate">
                      Student Dashboard <ChevronRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                  <span className="text-xs bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black">
                    #{currentUserRank}
                  </span>
                </button>

                {/* Daily Streak Showcase Card */}
                <a
                  href="#kellem-ai"
                  onClick={() => {
                    setKellemAiTab('quiz');
                    setQuizViewMode('quiz');
                  }}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-extrabold shadow-lg shadow-orange-500/20 group transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-white/80 flex items-center justify-center text-2xl shadow-sm animate-pulse">
                    🔥
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-amber-950/90 font-black block">
                      Daily Quiz Streak • {dailyStreak.completedToday ? 'Locked in for today!' : 'Quiz Needed Today'}
                    </span>
                    <span className="text-base sm:text-lg font-black tracking-tight flex items-center gap-1.5 truncate">
                      {dailyStreak.currentStreak} Days Consecutive <Sparkles className="w-4 h-4 fill-amber-900 text-amber-950" />
                    </span>
                  </div>
                  <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                </a>

                {/* Total Students */}
                <a
                  href="#student-data"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-sm transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/20 flex items-center justify-center text-xl">
                    👥
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold block">Total Students</span>
                    <span className="text-lg font-black tracking-tight">{totalStudentsCount} Enrolled</span>
                  </div>
                </a>

                {/* Top Quiz Leader */}
                <a
                  href="#kellem-ai"
                  onClick={() => {
                    setKellemAiTab('quiz');
                    setQuizViewMode('leaderboard');
                  }}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-amber-400/40 backdrop-blur-sm transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-amber-400/20 flex items-center justify-center text-xl">
                    🏆
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase tracking-wider text-amber-300 font-semibold block">#1 Quiz Champion</span>
                    <span className="text-base font-black truncate block">{topQuizLeader?.name || '—'}</span>
                    <span className="text-xs text-amber-400 font-bold">⚡ {topQuizLeader?.quizPoints || 0} Quiz Pts</span>
                  </div>
                </a>
              </div>
            </div>
          </section>

          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-b from-[#082942] to-[#0c395c] text-white py-20 lg:py-28 border-b-8 border-emerald-500">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-bold tracking-wider uppercase mb-6 backdrop-blur-sm">
                    <School className="w-4 h-4" /> MANA BARUMSAA QELLEM SAD 2FFAA
                  </div>
                  <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-white mb-6">
                    Mana Barumsaa Qellem Sad 2ffaa
                  </h1>
                  <p className="text-lg sm:text-2xl text-slate-200 font-normal leading-relaxed mb-8">
                    Learning today. Growing every day. Building a better tomorrow in Dambi Dollo, Ethiopia.
                  </p>
                  <div className="flex flex-wrap gap-3.5">
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black shadow-lg shadow-amber-500/30 transition-all text-sm sm:text-base flex items-center gap-2 hover:scale-105 cursor-pointer"
                    >
                      <GraduationCap className="w-5 h-5 text-slate-950" />
                      <span>My Student Dashboard</span>
                    </button>
                    <a
                      href="#exam-generator"
                      className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black shadow-lg shadow-emerald-500/30 transition-all text-sm sm:text-base flex items-center gap-2 hover:scale-105"
                    >
                      <Sparkles className="w-5 h-5 text-slate-950" />
                      <span>Generate Exam (20-100 Qs)</span>
                    </a>
                    <a
                      href="#student-data"
                      className="px-6 py-3.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white font-black border border-emerald-400/30 transition-all text-sm sm:text-base flex items-center gap-2"
                    >
                      <Users className="w-5 h-5" /> All Students ({totalStudentsCount})
                    </a>
                    <button
                      onClick={() => {
                        setKellemAiTab('quiz');
                        setQuizViewMode('quiz');
                        const el = document.getElementById('kellem-ai');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-black shadow-lg shadow-orange-500/20 transition-all text-sm sm:text-base flex items-center gap-2"
                  >
                    <Flame className="w-5 h-5 fill-white" /> Continue {dailyStreak.currentStreak}-Day Streak
                  </button>
                  <button
                    onClick={() => {
                      setKellemAiTab('quiz');
                      setQuizViewMode('leaderboard');
                      const el = document.getElementById('kellem-ai');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md text-white font-bold transition-all text-sm sm:text-base flex items-center gap-2"
                  >
                    <Trophy className="w-4 h-4 text-amber-400" /> View Top Performers
                  </button>
                </div>
              </div>

              {/* Official School Crest Emblem in Hero */}
              <div className="shrink-0 hidden lg:flex flex-col items-center">
                <div className="relative group">
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-teal-400 blur-xl opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                  <img
                    src="/assets/aistudio/kss_best_logo_9d217f0f.png"
                    alt="Kellem Secondary School Crest"
                    className="relative w-64 h-64 rounded-full bg-white p-3 border-4 border-emerald-400 shadow-2xl object-contain hover:scale-105 transition-transform"
                  />
                </div>
                <span className="mt-4 px-4 py-1.5 rounded-full bg-black/40 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider backdrop-blur-md">
                  Barnoota • Hojii • Milkaa'ina
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Highlights Grid */}
        <section className="relative -mt-8 max-w-7xl mx-auto px-4 sm:px-6 z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 flex items-center gap-3.5">
              <span className="text-2xl sm:text-3xl p-2 rounded-xl bg-emerald-50 text-emerald-700">🏛️</span>
              <div>
                <b className="block text-sm sm:text-base text-slate-900 font-bold">High School</b>
                <small className="text-slate-500 font-medium text-xs">Secondary education</small>
              </div>
            </div>
            <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 flex items-center gap-3.5">
              <span className="text-2xl sm:text-3xl p-2 rounded-xl bg-blue-50 text-blue-700">🔬</span>
              <div>
                <b className="block text-sm sm:text-base text-slate-900 font-bold">Natural Science</b>
                <small className="text-slate-500 font-medium text-xs">Science-focused stream</small>
              </div>
            </div>
            <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 flex items-center gap-3.5">
              <span className="text-2xl sm:text-3xl p-2 rounded-xl bg-amber-50 text-amber-700">📚</span>
              <div>
                <b className="block text-sm sm:text-base text-slate-900 font-bold">Social Science</b>
                <small className="text-slate-500 font-medium text-xs">Humanities & society</small>
              </div>
            </div>
            <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 flex items-center gap-3.5">
              <span className="text-2xl sm:text-3xl p-2 rounded-xl bg-emerald-50 text-emerald-700">🌱</span>
              <div>
                <b className="block text-sm sm:text-base text-slate-900 font-bold">Daily Growth</b>
                <small className="text-slate-500 font-medium text-xs">Small steps, big changes</small>
              </div>
            </div>
          </div>
        </section>

        {/* About Our School */}
        <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-black tracking-widest text-emerald-600 uppercase mb-2">ABOUT OUR SCHOOL</div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#082942] tracking-tight leading-tight mb-6">
                A place to learn, grow, and serve the community.
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
                Kellem Secondary School is a renowned high school located in <strong>Dambi Dollo, Ethiopia</strong>. The school supports students through Natural Science and Social Science departments and encourages a culture of learning, discipline, creativity, and continuous self-improvement.
              </p>
              <div className="p-5 rounded-2xl bg-emerald-50 border-l-4 border-emerald-500 text-emerald-950 font-semibold text-base sm:text-lg shadow-sm">
                “Read every day for at least 10 minutes. Take small steps and make big changes.”
              </div>
            </div>
            <div className="bg-gradient-to-tr from-[#082942] to-[#0c4e7a] p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 rounded-full bg-emerald-500/20 blur-2xl"></div>
              <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl">
                  🏫
                </div>
                <h3 className="text-2xl font-black">Kellem Secondary School Campus</h3>
                <p className="text-slate-200 leading-relaxed text-sm sm:text-base">
                  Located in the heart of Dambi Dollo, our campus houses classrooms, science laboratories, a reading center, and active student clubs including the Kellem English Club and entrance examination revision circles.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/15">
                  <div>
                    <span className="text-2xl font-black text-amber-400">100%</span>
                    <p className="text-xs text-slate-300">Dedication to student achievement</p>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-emerald-400">Grades 9-12</span>
                    <p className="text-xs text-slate-300">Natural & Social Sciences</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Teachers & Leaders Section - 1st Director is Zarihuun */}
        <section id="teachers" className="py-20 bg-slate-100/70 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="text-xs font-black tracking-widest text-emerald-600 uppercase mb-2">OUR TEACHERS & LEADERS</div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#082942] tracking-tight">Teachers who guide our students</h2>
              <p className="text-slate-600 mt-3 text-base">
                Dedicated educators committed to teaching with clarity, discipline, and inspiring mentorship.
              </p>
            </div>

            {/* Teacher Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
              {[
                { name: 'Faqqadee', role: 'Teacher', initial: 'F' },
                { name: 'Shafee', role: 'Teacher', initial: 'S' },
                { name: 'Fedhasaa', role: 'Teacher', initial: 'F' },
                { name: 'Ayyaana', role: 'Teacher', initial: 'A' },
                { name: 'Daaffisaa', role: 'Teacher', initial: 'D' }
              ].map(teacher => (
                <div key={teacher.name} className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-2xl mb-4">
                    {teacher.initial}
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">{teacher.name}</h3>
                  <p className="text-emerald-700 text-xs font-semibold uppercase tracking-wider mt-1">{teacher.role}</p>
                </div>
              ))}
            </div>

            {/* School Directors Timeline (1st Director is Zarihuun) */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md">
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl sm:text-2xl font-black text-[#082942]">School Directors</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1st Director: Zarihuun */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border-l-4 border-emerald-600 relative overflow-hidden">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded-full inline-block mb-2">
                    1st Director
                  </span>
                  <div className="text-2xl font-black text-[#082942]">Zarihuun</div>
                  <p className="text-xs text-slate-600 mt-2">Principal Director • Kellem Secondary School leadership & academic oversight</p>
                </div>

                {/* 2nd Director: Argata */}
                <div className="p-6 rounded-2xl bg-slate-50 border-l-4 border-blue-500">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full inline-block mb-2">
                    2nd Director
                  </span>
                  <div className="text-2xl font-black text-[#082942]">Argata</div>
                  <p className="text-xs text-slate-600 mt-2">Vice Director • Student affairs, curriculum support & school administration</p>
                </div>

                {/* 3rd Director: Soonessoo */}
                <div className="p-6 rounded-2xl bg-slate-50 border-l-4 border-amber-500">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full inline-block mb-2">
                    3rd Director
                  </span>
                  <div className="text-2xl font-black text-[#082942]">Soonessoo</div>
                  <p className="text-xs text-slate-600 mt-2">Associate Director • Discipline, community coordination & school activities</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kellem AI Section with Progress Tracking, Score Summary & Top Performers */}
        <section id="kellem-ai" className="py-20 bg-gradient-to-b from-[#eefbf6] via-[#f5fbff] to-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#082942] text-white text-xs font-black tracking-widest uppercase mb-4 shadow-md">
                <Bot className="w-4 h-4 text-emerald-400" /> KELLEM AI
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-[#082942] tracking-tight">Your school AI learning partner</h2>
              <p className="text-slate-600 text-base sm:text-lg mt-3">
                Practice national entrance exam questions, keep your <strong>Daily Streak</strong> burning for bonus points, and compete on the <strong>Top Performers</strong> leaderboard!
              </p>

              {/* Main Feature Navigation: Chat vs Quiz */}
              <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300 shadow-sm max-w-md w-full">
                <button
                  onClick={() => setKellemAiTab('chat')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    kellemAiTab === 'chat'
                      ? 'bg-white text-emerald-800 shadow-md scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Bot className="w-4 h-4" /> Kellem AI Chat
                </button>
                <button
                  onClick={() => setKellemAiTab('quiz')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all relative cursor-pointer ${
                    kellemAiTab === 'quiz'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md scale-[1.02]'
                      : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  <Flame className="w-4 h-4 fill-orange-500 text-orange-600" />
                  <span>Quiz & Daily Streak</span>
                  <span className="bg-slate-950 text-amber-300 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                    {dailyStreak.currentStreak}d
                  </span>
                </button>
              </div>
            </div>

            {/* VIEW 1: Quiz & Progress View (Active Quiz & Top Performers Ranking) */}
            {kellemAiTab === 'quiz' ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden transition-all animate-in fade-in">
                {/* Header with Sub-tabs: Quiz vs Top Performers */}
                <div className="bg-[#08243a] text-white p-6 border-b border-slate-800">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> High-Yield Entrance Examination
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                        Kellem AI Practice & Ranking Arena
                      </h3>
                    </div>

                    {/* Sub-tab view switcher */}
                    <div className="flex items-center gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/10">
                      <button
                        onClick={() => setQuizViewMode('quiz')}
                        className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                          quizViewMode === 'quiz'
                            ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 shadow-md scale-105'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        <Zap className="w-4 h-4" /> Practice Quiz
                      </button>
                      <button
                        onClick={() => setQuizViewMode('leaderboard')}
                        className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                          quizViewMode === 'leaderboard'
                            ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 shadow-md scale-105'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        <Trophy className="w-4 h-4 text-slate-900" /> Top Performers
                        <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                          Live
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* PROMINENT DAILY STREAK BANNER IN HEADER */}
                  <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-950/80 via-[#132c22] to-[#082942] border border-orange-500/30 shadow-lg relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Flame & Streak Status */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md border ${
                            dailyStreak.completedToday
                              ? 'bg-gradient-to-tr from-orange-500 to-amber-400 border-amber-300 text-white shadow-orange-500/30'
                              : 'bg-orange-950/90 border-orange-500/50 text-orange-400 animate-pulse'
                          }`}
                        >
                          🔥
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                              {dailyStreak.currentStreak}-Day Daily Streak
                            </span>
                            {dailyStreak.completedToday ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-400" /> Completed Today
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-black uppercase tracking-wider flex items-center gap-1 animate-pulse">
                                <Clock className="w-3 h-3 text-amber-300" /> Quiz Needed Today
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-300 mt-1">
                            {dailyStreak.completedToday ? (
                              <span>
                                🎉 <strong>Streak locked!</strong> You completed today’s quiz and earned your daily bonus. Return tomorrow to reach <strong>Day {dailyStreak.currentStreak + 1}</strong>!
                              </span>
                            ) : (
                              <span>
                                ⏳ Complete at least 1 quiz today to advance to <strong>Day {dailyStreak.currentStreak + 1}</strong> and unlock <strong>+{25 + (dailyStreak.currentStreak + 1) * 10} Bonus Streak Points</strong>!
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Right: Daily Streak Calendar Tracker */}
                      <div className="flex items-center gap-3 bg-black/40 px-3.5 py-2.5 rounded-xl border border-white/10 self-start md:self-auto shrink-0">
                        <div className="text-right mr-1">
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Daily Bonus</span>
                          <span className="text-xs font-black text-amber-400">+{25 + (dailyStreak.currentStreak + (dailyStreak.completedToday ? 0 : 1)) * 10} pts / day</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map(dayNum => {
                            const isDone = dailyStreak.completedToday
                              ? dayNum <= dailyStreak.currentStreak
                              : dayNum < dailyStreak.currentStreak;
                            const isTodayWaiting = !dailyStreak.completedToday && dayNum === dailyStreak.currentStreak;
                            return (
                              <div
                                key={dayNum}
                                className={`w-7 h-8 rounded-lg flex flex-col items-center justify-center text-[10px] font-black border transition-all ${
                                  isDone
                                    ? 'bg-gradient-to-b from-orange-500 to-amber-500 text-white border-orange-400 shadow-sm'
                                    : isTodayWaiting
                                    ? 'bg-amber-400/20 text-amber-300 border-amber-400 animate-pulse'
                                    : 'bg-white/5 text-slate-500 border-white/10'
                                }`}
                              >
                                <span>{isDone ? '✓' : `D${dayNum}`}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sub-headers for Quiz mode (Subject selectors & Difficulty filter) */}
                  {quizViewMode === 'quiz' && (
                    <div className="mt-5 pt-4 border-t border-white/10 space-y-3.5">
                      {/* Row 1: Stream Selection */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-slate-300 font-bold">
                          <span>Select Stream:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: 'entrance', label: '⭐ All-Round Entrance', icon: '🏛️' },
                            { id: 'natural', label: '🔬 Natural Science', icon: '🧪' },
                            { id: 'social', label: '📚 Social Science', icon: '🌍' },
                            { id: 'english', label: '🗣️ English & Grammar', icon: '💬' }
                          ].map(sub => (
                            <button
                              key={sub.id}
                              onClick={() => restartQuiz(sub.id as any, selectedDifficulty)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                activeSubject === sub.id
                                  ? 'bg-amber-400 text-slate-950 shadow-md font-black scale-105'
                                  : 'bg-white/10 hover:bg-white/20 text-slate-200'
                              }`}
                            >
                              <span>{sub.icon}</span>
                              <span>{sub.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Row 2: Difficulty Filter UI */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                        <div className="flex items-center gap-2 text-xs text-slate-300 font-bold">
                          <span className="flex items-center gap-1 text-amber-400">
                            <Target className="w-3.5 h-3.5" /> Difficulty Challenge:
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: 'all', label: 'All Levels', icon: '🎯', badge: 'Mix', reward: 'Mixed Pts' },
                            { id: 'beginner', label: 'Beginner', icon: '🟢', badge: 'Core', reward: '+10 pts/Q' },
                            { id: 'intermediate', label: 'Intermediate', icon: '🟡', badge: 'Entrance', reward: '+15 pts/Q' },
                            { id: 'advanced', label: 'Advanced', icon: '🔴', badge: 'Honors', reward: '+20 pts/Q' }
                          ].map(lvl => {
                            const countInSubject = (QUIZ_BANKS[activeSubject] || []).filter(
                              q => lvl.id === 'all' || q.difficulty === lvl.id
                            ).length;
                            const isSelected = selectedDifficulty === lvl.id;
                            let activeBtnClass = '';
                            if (isSelected) {
                              if (lvl.id === 'beginner') {
                                activeBtnClass = 'bg-emerald-400 text-slate-950 shadow-md font-black scale-105 ring-2 ring-emerald-300';
                              } else if (lvl.id === 'intermediate') {
                                activeBtnClass = 'bg-amber-400 text-slate-950 shadow-md font-black scale-105 ring-2 ring-amber-300';
                              } else if (lvl.id === 'advanced') {
                                activeBtnClass = 'bg-rose-500 text-white shadow-md font-black scale-105 ring-2 ring-rose-300';
                              } else {
                                activeBtnClass = 'bg-white text-slate-950 shadow-md font-black scale-105 ring-2 ring-slate-200';
                              }
                            } else {
                              activeBtnClass = 'bg-white/10 hover:bg-white/20 text-slate-200';
                            }
                            return (
                              <button
                                key={lvl.id}
                                onClick={() => restartQuiz(activeSubject, lvl.id as any)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeBtnClass}`}
                              >
                                <span>{lvl.icon}</span>
                                <span>{lvl.label}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                                  isSelected ? 'bg-black/20 text-inherit' : 'bg-white/15 text-slate-300'
                                }`}>
                                  {countInSubject}Q
                                </span>
                                <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase ${
                                  isSelected ? 'bg-black/25 text-inherit' : 'bg-white/10 text-amber-300'
                                }`}>
                                  {lvl.reward}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* TAB CONTENT A: TOP PERFORMERS RANKING COMPONENT */}
                {quizViewMode === 'leaderboard' ? (
                  <div className="p-6 sm:p-10 space-y-8 animate-in fade-in">
                    {/* Standing Hero */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#07253b] via-[#0b3829] to-[#094732] text-white shadow-xl relative overflow-hidden">
                      <div className="absolute right-0 top-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-2">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase tracking-wider">
                            <Flame className="w-3.5 h-3.5 text-amber-400" /> Competitive Quiz Leaderboard
                          </div>
                          <h4 className="text-2xl sm:text-3xl font-black text-white">
                            Your Standing: Rank #{currentUserRank} of {topQuizPerformers.length}
                          </h4>
                          <p className="text-slate-200 text-sm max-w-xl leading-relaxed">
                            {currentUserRankIndex === 0 ? (
                              <span>
                                🏆 <strong>Magnificent!</strong> You are holding <strong>1st Place</strong> at Kellem Secondary School with {currentStudentData.quizPoints} cumulative quiz points. Maintain your <strong>{dailyStreak.currentStreak}-day streak</strong> to keep your lead safe!
                              </span>
                            ) : (
                              <span>
                                ⚡ You have <strong>{currentStudentData.quizPoints} Quiz Points</strong>. You need only <strong>{pointsToOvertake} more points</strong> to overtake #{currentUserRank - 1} <strong>{studentAhead?.name}</strong>! Complete today's daily quiz to earn both quiz points and streak bonuses!
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                          <button
                            onClick={() => {
                              setQuizViewMode('quiz');
                              restartQuiz('entrance');
                            }}
                            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all hover:scale-105 cursor-pointer"
                          >
                            <Zap className="w-4 h-4 fill-slate-950" /> Take Quiz to Climb Ranks
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                      <div>
                        <h4 className="text-xl font-black text-[#082942] flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-amber-500" /> Top Quiz Champions
                        </h4>
                        <p className="text-xs text-slate-500">Live ranking calculated from verified practice quiz points & daily streaks</p>
                      </div>
                      <div className="flex gap-2">
                        {[
                          { id: 'all', label: `All Streams (${topQuizPerformers.length})` },
                          { id: 'natural', label: `🔬 Natural Science` },
                          { id: 'social', label: `📚 Social Science` }
                        ].map(f => (
                          <button
                            key={f.id}
                            onClick={() => setPerformerFilter(f.id as any)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              performerFilter === f.id
                                ? 'bg-[#082942] text-white shadow-sm'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* OLYMPIC PODIUM COMPONENT (TOP 3) */}
                    <div className="pt-4 pb-2">
                      <div className="grid grid-cols-3 gap-2 sm:gap-6 items-end max-w-3xl mx-auto">
                        {/* 2nd Place (Silver) */}
                        {filteredPerformers[1] && (
                          <div className="flex flex-col items-center text-center">
                            <div className="relative mb-2">
                              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-slate-200 via-slate-100 to-white border-2 border-slate-300 shadow-md flex items-center justify-center text-2xl font-black text-slate-700">
                                {filteredPerformers[1].name.charAt(0)}
                              </div>
                              <div className="absolute -top-3 -right-2 w-7 h-7 rounded-full bg-slate-300 text-slate-800 flex items-center justify-center text-xs font-black shadow-sm">
                                🥈
                              </div>
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[110px] sm:max-w-[160px] block">
                              {filteredPerformers[1].name}
                            </span>
                            <span className="text-[10px] sm:text-xs text-slate-500 font-medium truncate block">
                              {filteredPerformers[1].className}
                            </span>
                            <div className="mt-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-black">
                              ⚡ {filteredPerformers[1].quizPoints} pts
                            </div>
                            {/* Pedestal */}
                            <div className="w-full h-28 sm:h-36 bg-gradient-to-b from-slate-200 to-slate-300 rounded-t-2xl mt-3 flex flex-col justify-center items-center text-slate-700 border-t-4 border-slate-400 shadow-inner">
                              <span className="text-2xl sm:text-4xl font-black">2</span>
                              <span className="text-[10px] font-bold uppercase tracking-wider">Silver</span>
                              <span className="text-[10px] text-slate-600">{filteredPerformers[1].accuracy}% Acc</span>
                            </div>
                          </div>
                        )}

                        {/* 1st Place (Gold Champion) */}
                        {filteredPerformers[0] && (
                          <div className="flex flex-col items-center text-center -mt-6">
                            <div className="relative mb-2">
                              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-300 via-amber-200 to-yellow-100 border-4 border-amber-400 shadow-xl flex items-center justify-center text-3xl font-black text-amber-950 ring-4 ring-amber-400/20">
                                {filteredPerformers[0].name.charAt(0)}
                              </div>
                              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl animate-bounce">
                                👑
                              </div>
                              <div className="absolute -bottom-2 right-0 w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-sm font-black shadow-md border-2 border-white">
                                🥇
                              </div>
                            </div>
                            <span className="text-sm sm:text-base font-black text-[#082942] truncate max-w-[120px] sm:max-w-[180px] block">
                              {filteredPerformers[0].name}
                            </span>
                            <span className="text-[10px] sm:text-xs text-emerald-700 font-bold truncate block">
                              {filteredPerformers[0].className}
                            </span>
                            <div className="mt-1 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-sm">
                              ⚡ {filteredPerformers[0].quizPoints} pts
                            </div>
                            {/* Pedestal */}
                            <div className="w-full h-36 sm:h-48 bg-gradient-to-b from-amber-300 to-amber-400 rounded-t-3xl mt-3 flex flex-col justify-center items-center text-amber-950 border-t-4 border-amber-500 shadow-lg">
                              <span className="text-3xl sm:text-5xl font-black">1</span>
                              <span className="text-[11px] font-black uppercase tracking-wider">Champion</span>
                              <span className="text-[10px] font-bold text-amber-900">{filteredPerformers[0].accuracy}% Acc • {filteredPerformers[0].bestStreak} Streak</span>
                            </div>
                          </div>
                        )}

                        {/* 3rd Place (Bronze) */}
                        {filteredPerformers[2] && (
                          <div className="flex flex-col items-center text-center">
                            <div className="relative mb-2">
                              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-100 via-orange-100 to-white border-2 border-amber-600/40 shadow-md flex items-center justify-center text-2xl font-black text-amber-900">
                                {filteredPerformers[2].name.charAt(0)}
                              </div>
                              <div className="absolute -top-3 -right-2 w-7 h-7 rounded-full bg-amber-700 text-white flex items-center justify-center text-xs font-black shadow-sm">
                                🥉
                              </div>
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[110px] sm:max-w-[160px] block">
                              {filteredPerformers[2].name}
                            </span>
                            <span className="text-[10px] sm:text-xs text-slate-500 font-medium truncate block">
                              {filteredPerformers[2].className}
                            </span>
                            <div className="mt-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-black">
                              ⚡ {filteredPerformers[2].quizPoints} pts
                            </div>
                            {/* Pedestal */}
                            <div className="w-full h-24 sm:h-28 bg-gradient-to-b from-amber-600/30 to-amber-700/40 rounded-t-2xl mt-3 flex flex-col justify-center items-center text-amber-950 border-t-4 border-amber-600 shadow-inner">
                              <span className="text-2xl sm:text-4xl font-black">3</span>
                              <span className="text-[10px] font-bold uppercase tracking-wider">Bronze</span>
                              <span className="text-[10px] text-amber-900">{filteredPerformers[2].accuracy}% Acc</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* FULL LEADERBOARD TABLE (Ranks 4+) */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
                          Contender Standings (Ranks 4 – {filteredPerformers.length})
                        </span>
                        <span className="text-xs text-slate-500 font-medium">Sorted by Cumulative Quiz Points</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-[#082942] text-white text-xs uppercase tracking-wider">
                            <tr>
                              <th className="py-3 px-6">Rank</th>
                              <th className="py-3 px-6">Student</th>
                              <th className="py-3 px-6">Stream</th>
                              <th className="py-3 px-6">Quizzes Taken</th>
                              <th className="py-3 px-6">Accuracy</th>
                              <th className="py-3 px-6">Best Streak</th>
                              <th className="py-3 px-6">Quiz Points</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {filteredPerformers.slice(3).map((st, i) => {
                              const rank = i + 4;
                              const isCurrentUser = st.name.toLowerCase() === activeStudentName.toLowerCase();
                              return (
                                <tr
                                  key={st.name}
                                  className={`transition-colors ${
                                    isCurrentUser ? 'bg-emerald-50/80 font-bold border-l-4 border-emerald-500' : 'hover:bg-slate-50'
                                  }`}
                                >
                                  <td className="py-3.5 px-6 font-bold text-slate-500">
                                    #{rank}
                                  </td>
                                  <td className="py-3.5 px-6">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-700">
                                        {st.name.charAt(0)}
                                      </div>
                                      <div>
                                        <span className="text-slate-900 font-bold block">{st.name}</span>
                                        {isCurrentUser && (
                                          <span className="text-[10px] text-emerald-700 font-extrabold uppercase">
                                            (YOU)
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3.5 px-6 text-slate-600 text-xs">
                                    {st.className}
                                  </td>
                                  <td className="py-3.5 px-6 text-slate-700 text-xs">
                                    {st.quizzesCompleted} completed
                                  </td>
                                  <td className="py-3.5 px-6">
                                    <div className="flex items-center gap-2">
                                      <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div
                                          className="bg-emerald-500 h-full rounded-full"
                                          style={{ width: `${st.accuracy}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-xs font-bold text-slate-700">{st.accuracy}%</span>
                                    </div>
                                  </td>
                                  <td className="py-3.5 px-6 text-xs font-bold text-orange-600">
                                    🔥 {st.bestStreak}
                                  </td>
                                  <td className="py-3.5 px-6">
                                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-black">
                                      ⚡ {st.quizPoints} pts
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* TAB CONTENT B: ACTIVE PRACTICE QUIZ */
                  <div>
                    {/* Live Top Performer & Streak Bar */}
                    <div className="px-6 py-2.5 bg-amber-50/70 border-b border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-600" />
                        <span className="text-amber-950 font-bold">
                          #1 Champion: <strong>{topQuizLeader?.name}</strong> ({topQuizLeader?.quizPoints} pts)
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-orange-900 font-extrabold flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-600" />
                          Daily Streak: {dailyStreak.currentStreak} Days {dailyStreak.completedToday ? '✓' : '⏳'}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1 ${
                          selectedDifficulty === 'beginner'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : selectedDifficulty === 'intermediate'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : selectedDifficulty === 'advanced'
                            ? 'bg-rose-100 text-rose-900 border border-rose-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}>
                          {selectedDifficulty === 'all' ? '🎯 All Levels' :
                           selectedDifficulty === 'beginner' ? '🟢 Beginner' :
                           selectedDifficulty === 'intermediate' ? '🟡 Intermediate' : '🔴 Advanced'}
                        </span>
                      </div>
                      <button
                        onClick={() => setQuizViewMode('leaderboard')}
                        className="text-amber-900 hover:text-amber-950 font-black flex items-center gap-1 cursor-pointer"
                      >
                        View Top Performers Leaderboard <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {!quizFinished ? (
                      <div className="p-6 sm:p-10 space-y-8">
                        {/* Progress Header */}
                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-600 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-black">
                                {currentQuestion.category}
                              </span>
                              <span className={`px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider flex items-center gap-1 ${
                                currentQuestion.difficulty === 'beginner'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : currentQuestion.difficulty === 'intermediate'
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                  : 'bg-rose-50 text-rose-800 border border-rose-200'
                              }`}>
                                {currentQuestion.difficulty === 'beginner' && '🟢 Beginner (+10 pts)'}
                                {currentQuestion.difficulty === 'intermediate' && '🟡 Intermediate (+15 pts)'}
                                {currentQuestion.difficulty === 'advanced' && '🔴 Advanced (+20 pts)'}
                              </span>
                              <span>
                                Question {currentQuestionIndex + 1} of {currentQuizQuestions.length}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-black">
                                Current Score: {correctCount} / {attemptedCount}
                              </span>
                              {streak > 1 && (
                                <span className="bg-orange-100 text-orange-800 px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1">
                                  <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-600" /> {streak} Question Streak!
                                </span>
                              )}
                            </div>
                          </div>
                          {/* Visual Progress Bar */}
                          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300 ease-out"
                              style={{
                                width: `${((currentQuestionIndex + (isAnswerSubmitted ? 1 : 0)) / currentQuizQuestions.length) * 100}%`
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Question Prompt */}
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">
                            Question #{currentQuestionIndex + 1}
                          </span>
                          <h4 className="text-xl sm:text-2xl font-black text-[#082942] leading-snug">
                            {currentQuestion.question}
                          </h4>
                        </div>

                        {/* Multiple Choice Options */}
                        <div className="space-y-3">
                          {currentQuestion.options.map((opt, idx) => {
                            const isSelected = selectedOption === idx;
                            const isCorrect = idx === currentQuestion.correctIndex;
                            let btnStyle = 'border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/30 text-slate-800';
                            if (isAnswerSubmitted) {
                              if (isCorrect) {
                                btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                              } else if (isSelected) {
                                btnStyle = 'border-red-500 bg-red-50 text-red-950 font-bold';
                              } else {
                                btnStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                              }
                            }
                            return (
                              <button
                                key={idx}
                                disabled={isAnswerSubmitted}
                                onClick={() => handleSelectOption(idx)}
                                className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left flex items-center justify-between text-base font-semibold transition-all cursor-pointer ${btnStyle}`}
                              >
                                <div className="flex items-center gap-3.5">
                                  <span
                                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                                      isAnswerSubmitted && isCorrect
                                        ? 'bg-emerald-600 text-white'
                                        : isAnswerSubmitted && isSelected
                                        ? 'bg-red-600 text-white'
                                        : 'bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    {String.fromCharCode(65 + idx)}
                                  </span>
                                  <span>{opt}</span>
                                </div>
                                {isAnswerSubmitted && (
                                  <div>
                                    {isCorrect ? (
                                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                    ) : isSelected ? (
                                      <XCircle className="w-6 h-6 text-red-500" />
                                    ) : null}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Kellem AI Explanation Box upon selection */}
                        {isAnswerSubmitted && (
                          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border-l-4 border-emerald-600 space-y-3 animate-in fade-in">
                            <div className="flex items-center gap-2">
                              <Bot className="w-5 h-5 text-emerald-700" />
                              <h5 className="font-black text-emerald-950 text-base">
                                {selectedOption === currentQuestion.correctIndex
                                  ? '🎉 Correct! Outstanding thinking!'
                                  : '💡 Not quite, but here is the key concept:'}
                              </h5>
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed">
                              <strong>Explanation:</strong> {currentQuestion.explanation}
                            </p>
                            <div className="pt-2 flex justify-end">
                              <button
                                onClick={handleNextQuestion}
                                className="px-6 py-3 rounded-xl bg-[#082942] hover:bg-[#0c395c] text-white font-extrabold text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
                              >
                                {currentQuestionIndex + 1 < currentQuizQuestions.length ? (
                                  <>
                                    Next Question <ArrowRight className="w-4 h-4" />
                                  </>
                                ) : (
                                  <>
                                    Complete Quiz & Lock in Daily Streak <Flame className="w-4 h-4 fill-orange-400 text-orange-400" />
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* SCORE SUMMARY SCREEN WITH DAILY STREAK */
                      <div className="p-6 sm:p-10 space-y-8 animate-in fade-in">
                        <div className="text-center max-w-2xl mx-auto space-y-4">
                          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-orange-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center text-4xl shadow-xl shadow-orange-500/20 animate-pulse">
                            🎉
                          </div>
                          <div>
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-600 block mb-1">
                              QUIZ COMPLETE • SCORE & DAILY STREAK SUMMARY
                            </span>
                            <h3 className="text-3xl sm:text-4xl font-black text-[#082942]">
                              {scorePercent >= 80 ? 'Exceptional Work!' : 'Quiz Completed!'}
                            </h3>
                            <p className="text-slate-600 text-sm mt-1">{tier.message}</p>
                          </div>
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs sm:text-sm font-black shadow-sm ${tier.color}`}>
                            <span>{tier.badge}</span>
                          </div>
                        </div>

                        {/* Daily Streak Celebration Box */}
                        <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-slate-950 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <span className="text-xs font-black uppercase tracking-wider text-orange-950 flex items-center gap-1.5">
                              <Flame className="w-4 h-4 fill-slate-950 text-slate-950" /> Daily Streak Bonus Credited!
                            </span>
                            <h4 className="text-2xl font-black text-slate-950">
                              {dailyStreak.currentStreak} Consecutive Days Burning!
                            </h4>
                            <p className="text-xs text-amber-950 font-bold max-w-xl">
                              {scoreNotification || `✓ Bonus points have been added to your cumulative Quiz Points ranking!`}
                            </p>
                          </div>
                          <button
                            onClick={() => setQuizViewMode('leaderboard')}
                            className="px-5 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 font-black text-xs shrink-0 shadow-md transition-all flex items-center gap-2 cursor-pointer"
                          >
                            <Trophy className="w-4 h-4" /> Check Leaderboard Standing
                          </button>
                        </div>

                        {/* Score Breakdown Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                            <span className="text-xs text-slate-500 font-bold uppercase block">Final Score</span>
                            <b className="text-2xl font-black text-[#082942] block mt-1">
                              {correctCount} / {currentQuizQuestions.length}
                            </b>
                            <small className="text-xs text-slate-500 font-medium">Questions Correct</small>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                            <span className="text-xs text-slate-500 font-bold uppercase block">Accuracy</span>
                            <b className={`text-2xl font-black block mt-1 ${scorePercent >= 80 ? 'text-emerald-600' : 'text-blue-600'}`}>
                              {scorePercent}%
                            </b>
                            <small className="text-xs text-slate-500 font-medium">Performance Rate</small>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                            <span className="text-xs text-slate-500 font-bold uppercase block">Challenge Level</span>
                            <b className="text-sm font-black block mt-2 capitalize">
                              {selectedDifficulty === 'all' && <span className="text-slate-800">🎯 All Levels</span>}
                              {selectedDifficulty === 'beginner' && <span className="text-emerald-700">🟢 Beginner</span>}
                              {selectedDifficulty === 'intermediate' && <span className="text-amber-700">🟡 Intermediate</span>}
                              {selectedDifficulty === 'advanced' && <span className="text-rose-700">🔴 Advanced</span>}
                            </b>
                            <small className="text-[11px] text-slate-500 font-bold block mt-0.5">
                              {selectedDifficulty === 'advanced' ? '+20 pts / Q' : selectedDifficulty === 'intermediate' ? '+15 pts / Q' : selectedDifficulty === 'beginner' ? '+10 pts / Q' : 'Mixed Pts'}
                            </small>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                            <span className="text-xs text-slate-500 font-bold uppercase block">Daily Streak</span>
                            <b className="text-2xl font-black text-orange-500 block mt-1">
                              🔥 {dailyStreak.currentStreak}d
                            </b>
                            <small className="text-xs text-slate-500 font-medium">Consecutive Days</small>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center col-span-2 sm:col-span-1">
                            <span className="text-xs text-slate-500 font-bold uppercase block">Subject Stream</span>
                            <b className="text-base font-black text-[#082942] block mt-1 capitalize truncate">
                              {activeSubject}
                            </b>
                            <small className="text-xs text-slate-500 font-medium">Kellem Syllabus</small>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 flex flex-wrap gap-3 justify-center sm:justify-end">
                          <button
                            onClick={() => restartQuiz()}
                            className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-4 h-4" /> Retake {selectedDifficulty === 'all' ? 'Quiz' : selectedDifficulty}
                          </button>
                          <button
                            onClick={handleDiscussMistakesInChat}
                            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center gap-2 shadow-md transition-colors cursor-pointer"
                          >
                            <Bot className="w-4 h-4" /> Discuss with Kellem AI
                          </button>
                          <button
                            onClick={() => setQuizViewMode('leaderboard')}
                            className="px-5 py-3 rounded-xl bg-[#082942] hover:bg-[#0c395c] text-white font-extrabold text-sm flex items-center gap-2 shadow-md transition-colors cursor-pointer"
                          >
                            <Trophy className="w-4 h-4 text-amber-400" /> View Top Performers Podium
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* VIEW 2: Interactive Chat App */
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-4 min-h-[580px] transition-all animate-in fade-in">
                {/* Sidebar */}
                <div className="bg-[#08243a] text-white p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl">
                        🤖
                      </div>
                      <div>
                        <h3 className="font-black text-lg text-white leading-none">Kellem AI</h3>
                        <small className="text-slate-400 text-xs">Learn • Practice • Improve</small>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { id: 'study', label: '📖 Study Help' },
                        { id: 'english', label: '🗣️ English Practice' },
                        { id: 'entrance', label: '🏛️ Win Entrance' },
                        { id: 'skills', label: '💡 Learn Skills' },
                        { id: 'teacher', label: '👨‍🏫 Teacher Insights' }
                      ].map(topic => (
                        <button
                          key={topic.id}
                          onClick={() => {
                            setChatMode(topic.id as any);
                            setMessages(prev => [
                              ...prev,
                              {
                                sender: 'ai',
                                text: `Switched mode to ${topic.label}. What question can Kellem AI help you with?`
                              }
                            ]);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                            chatMode === topic.id
                              ? 'bg-emerald-600 text-white shadow-md'
                              : 'text-slate-300 hover:bg-white/5'
                          }`}
                        >
                          {topic.label}
                        </button>
                      ))}
                    </div>

                    {/* Daily Streak Sidebar Card */}
                    <div className="p-3.5 rounded-2xl bg-orange-950/40 border border-orange-500/30 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-orange-400 font-bold">
                        <span className="flex items-center gap-1">
                          <Flame className="w-4 h-4 fill-orange-500" /> Daily Streak
                        </span>
                        <span className="font-black">{dailyStreak.currentStreak} Days</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        {dailyStreak.completedToday
                          ? 'Streak protected for today! Great dedication.'
                          : 'Complete 1 quiz today to maintain streak bonus!'}
                      </p>
                      <button
                        onClick={() => {
                          setKellemAiTab('quiz');
                          setQuizViewMode('quiz');
                        }}
                        className="w-full mt-1 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-black text-[11px] transition-colors cursor-pointer"
                      >
                        {dailyStreak.completedToday ? 'Practice More' : "Play Today's Quiz"}
                      </button>
                    </div>

                    <div className="pt-1 space-y-2">
                      <button
                        onClick={() => {
                          setKellemAiTab('quiz');
                          setQuizViewMode('leaderboard');
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/10 transition-all cursor-pointer"
                      >
                        <Trophy className="w-4 h-4 text-amber-400" /> View Top Performers
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-slate-400 leading-relaxed">
                    <strong>Kellem AI</strong> is an educational assistant designed for students and teachers of Kellem Secondary School.
                  </div>
                </div>

                {/* Chat Area */}
                <div className="lg:col-span-3 flex flex-col h-[580px] bg-slate-50/50">
                  <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base capitalize flex items-center gap-2">
                        {chatMode.replace('-', ' ')} Assistant
                      </h4>
                      <span className="text-xs text-slate-500">Ask Kellem AI anything about your learning</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Kellem AI Online
                    </div>
                  </div>

                  <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    {messages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${
                            m.sender === 'user' ? 'bg-emerald-600 text-white' : 'bg-[#082942] text-amber-300'
                          }`}
                        >
                          {m.sender === 'user' ? '👤' : '🤖'}
                        </div>
                        <div
                          className={`p-4 rounded-2xl text-sm leading-relaxed ${
                            m.sender === 'user'
                              ? 'bg-emerald-600 text-white rounded-tr-none shadow-sm'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm whitespace-pre-line'
                          }`}
                        >
                          <b className={`text-xs block mb-1 ${m.sender === 'user' ? 'text-emerald-100' : 'text-emerald-700'}`}>
                            {m.sender === 'user' ? 'You' : 'Kellem AI'}
                          </b>
                          {m.text}
                        </div>
                      </div>
                    ))}
                    {isAiTyping && (
                      <div className="flex gap-3 max-w-[85%]">
                        <div className="w-8 h-8 rounded-full bg-[#082942] text-amber-300 flex items-center justify-center text-sm">
                          🤖
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-slate-200 rounded-tl-none shadow-sm flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                          <span>Kellem AI is thinking</span>
                          <span className="animate-bounce">.</span>
                          <span className="animate-bounce delay-100">.</span>
                          <span className="animate-bounce delay-200">.</span>
                        </div>
                      </div>
                    )}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* Quick Prompts */}
                  <div className="px-6 py-2 bg-white border-t border-slate-100 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setKellemAiTab('quiz');
                        setQuizViewMode('quiz');
                      }}
                      className="text-xs bg-orange-50 hover:bg-orange-100 border border-orange-300 text-orange-900 px-3 py-1 rounded-full transition-colors font-bold flex items-center gap-1 cursor-pointer"
                    >
                      🔥 Check Daily Streak ({dailyStreak.currentStreak}d)
                    </button>
                    <button
                      onClick={() => {
                        setKellemAiTab('quiz');
                        setQuizViewMode('leaderboard');
                      }}
                      className="text-xs bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1 rounded-full transition-colors font-bold flex items-center gap-1 cursor-pointer"
                    >
                      🏆 Top Performers Leaderboard
                    </button>
                    {[
                      'Explain this lesson simply',
                      'Teach me one useful English phrase',
                      'Who is the 1st director of Kellem?'
                    ].map(prompt => (
                      <button
                        key={prompt}
                        onClick={() => {
                          setInputQuestion(prompt);
                        }}
                        className="text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 text-slate-600 px-3 py-1 rounded-full transition-colors font-medium cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-2">
                    <input
                      type="text"
                      value={inputQuestion}
                      onChange={e => setInputQuestion(e.target.value)}
                      placeholder="Ask Kellem AI a question..."
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm"
                    />
                    <button
                      type="submit"
                      disabled={!inputQuestion.trim()}
                      className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4" /> Send
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Daily English Phrase Feature */}
            <div className="mt-8 bg-white p-6 sm:p-8 rounded-3xl border border-emerald-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 flex-1">
                <span className="text-xs font-black tracking-widest text-emerald-600 uppercase">
                  EVERY DAY WE USE ENGLISH PHRASES
                </span>
                <h3 className="text-2xl font-black text-[#082942]">💬 Kellem AI Daily English Phrase</h3>
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                  <div className="text-xl font-black text-emerald-900">“{todayPhrase.phrase}”</div>
                  <div className="text-sm text-slate-700"><strong>Natural Reply:</strong> “{todayPhrase.reply}”</div>
                  <div className="text-xs text-emerald-700 italic">{todayPhrase.tip}</div>
                </div>
                <p className="text-xs text-slate-500">
                  Students can learn one useful phrase every day, listen to the pronunciation, and use it in classroom conversations.
                </p>
              </div>
              <button
                onClick={handleSpeech}
                disabled={isSpeaking}
                className="px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center gap-2 shrink-0 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Volume2 className="w-5 h-5" /> {isSpeaking ? 'Playing Voice...' : "Hear today's phrase"}
              </button>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* EXAM & TEST GENERATOR SECTION (STUDENTS & TEACHERS)      */}
        {/* Supports 20, 30, 50, 100 questions and all 9 subjects:   */}
        {/* Math, Physics, Chemistry, Biology, ICT, English,         */}
        {/* Construction, Geography, Economics, & Composite Entrance */}
        {/* ======================================================== */}
        <ExamGenerator
          currentUser={currentUser}
          onScoreUpdated={handleExamScoreUpdated}
          onOpenChatWithQuestion={handleDiscussQuestionInChat}
        />

        {/* Students Section */}
        <section id="students" className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-black tracking-widest text-emerald-600 uppercase mb-2">STUDENTS</div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#082942] tracking-tight">Our Natural & Social Science students</h2>
            <p className="text-slate-600 mt-2 text-base">
              Hard-working students advancing academic excellence and continuous learning at Kellem Secondary School.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Natural Science */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <h3 className="text-xl font-black text-[#082942] flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-blue-600" /> Natural Science Stream
                </h3>
                <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">
                  14 Students
                </span>
              </div>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 list-decimal list-inside text-sm font-semibold text-slate-700">
                <li>Bilisummaa Yaadasaa</li>
                <li>Raajii Amanu'e</li>
                <li>Feeneet Yooseef</li>
                <li>Israel Kassahuun</li>
                <li>Guutuu Aboomaa</li>
                <li>Taliilaa Jaallataa</li>
                <li>Atinaboon Rattaa</li>
                <li>Feeneet Gaaromaa</li>
                <li>Nabiyyuu Sulxaan</li>
                <li>Toleeraa Tatikuu</li>
                <li>Lammii Xilahuun</li>
                <li>Gammachuu Takkaa</li>
                <li>Fatiyaa Yaasiin</li>
                <li>Siifan Efreem</li>
              </ol>
            </div>
            {/* Social Science */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <h3 className="text-xl font-black text-[#082942] flex items-center gap-2">
                    <Globe2 className="w-5 h-5 text-amber-600" /> Social Science Stream
                  </h3>
                  <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                    2 Students
                  </span>
                </div>
                <ol className="space-y-3 list-decimal list-inside text-sm font-semibold text-slate-700">
                  <li>Eebbisa Beekaa</li>
                  <li>Caaltuu Kennaa</li>
                </ol>
              </div>
              <div className="mt-8 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 leading-relaxed">
                Both streams receive rigorous entrance preparation, access to study guides, and <strong>Kellem AI</strong> practice modules.
              </div>
            </div>
          </div>
        </section>

        {/* Student Database & Overall School Leaderboard */}
        <section id="student-data" className="py-20 bg-slate-100/70 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-2">
                  <img src="/assets/aistudio/kss_best_logo_9d217f0f.png" alt="KSS" className="w-4 h-4 object-contain rounded-full" />
                  STUDENT DATABASE & IDENTIFICATION
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#082942] tracking-tight">
                  All Students Directory & Live Count
                </h2>
                <p className="text-slate-600 mt-2 text-base max-w-2xl">
                  Live verification directory for enrolled students. Profile photos, age, and phone numbers are manually uploaded and managed by students in their Account Settings.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 self-start md:self-auto">
                <button
                  onClick={() => setStudentModalOpen(true)}
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Users className="w-4 h-4" /> All Students Modal ({totalStudentsCount})
                </button>
              </div>
            </div>

            {/* Live Count Bar - Automatically increments when new students register */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500 shadow-md text-center relative overflow-hidden">
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider animate-pulse">
                  Live Counter
                </div>
                <span className="text-3xl block mb-1">🎓</span>
                <strong className="text-3xl font-black text-[#082942] block">{totalStudentsCount}</strong>
                <small className="text-emerald-700 font-extrabold uppercase text-xs">Total Students Enrolled</small>
                <div className="text-[11px] text-slate-500 mt-1">Counts new student registrations instantly</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                <span className="text-3xl block mb-1">✅</span>
                <strong className="text-3xl font-black text-emerald-600 block">
                  {allStudentsList.filter(s => s.status !== 'pending' && s.status !== 'rejected').length}
                </strong>
                <small className="text-slate-500 font-bold uppercase text-xs">Approved Students</small>
                <div className="text-[11px] text-slate-400 mt-1">Full portal access enabled</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                <span className="text-3xl block mb-1">⏳</span>
                <strong className="text-3xl font-black text-amber-600 block">
                  {allStudentsList.filter(s => s.status === 'pending').length}
                </strong>
                <small className="text-slate-500 font-bold uppercase text-xs">Pending Approval</small>
                <div className="text-[11px] text-slate-400 mt-1">Awaiting {ADMIN_EMAIL}</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                <span className="text-3xl block mb-1">⚡</span>
                <strong className="text-3xl font-black text-amber-500 block">{topQuizLeader?.quizPoints || 0} pts</strong>
                <small className="text-slate-500 font-bold uppercase text-xs">Highest Quiz Points</small>
                <div className="text-[11px] text-slate-400 mt-1">Held by {topQuizLeader?.name || 'Top Scholar'}</div>
              </div>
            </div>

            {/* INTERACTIVE ALL STUDENTS BUTTON DIRECTORY ("ALL STUDENTS IN BUTTONS") */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md mb-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="text-xl font-black text-[#082942] flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-600" /> All Students Interactive Buttons
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click on any student button below to open their official KSS Digital Student ID Card with photo, age, phone, and stream.
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 text-xs w-full md:w-72">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchStudent}
                    onChange={e => setSearchStudent(e.target.value)}
                    placeholder="Search by student name, phone, age..."
                    className="bg-transparent border-none outline-none w-full text-slate-800 font-medium"
                  />
                  {searchStudent && (
                    <button onClick={() => setSearchStudent('')} className="text-slate-400 hover:text-slate-600 font-bold">
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Grid of Student Interactive Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {allStudentsList
                  .filter(st => {
                    const q = searchStudent.toLowerCase();
                    return (
                      st.name.toLowerCase().includes(q) ||
                      st.className.toLowerCase().includes(q) ||
                      (st.phone && st.phone.includes(q)) ||
                      (st.age && st.age.toString().includes(q))
                    );
                  })
                  .map((st, idx) => {
                    const isPending = st.status === 'pending';
                    return (
                      <button
                        key={`${st.id || st.name}-${idx}`}
                        onClick={() => setStudentIdCardModal(st)}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] hover:shadow-lg flex items-center gap-3 cursor-pointer group ${
                          isPending
                            ? 'bg-amber-50/50 border-amber-200 hover:border-amber-400'
                            : 'bg-slate-50 hover:bg-emerald-50/40 border-slate-200 hover:border-emerald-400'
                        }`}
                      >
                        {/* Profile Photo */}
                        <div className="relative shrink-0">
                          {st.photoUrl ? (
                            <img
                              src={st.photoUrl}
                              alt={st.name}
                              className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shadow-sm"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#082942] to-emerald-700 text-white flex items-center justify-center font-black text-base shadow-sm">
                              {st.name.charAt(0)}
                            </div>
                          )}
                          <span
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[9px] ${
                              isPending ? 'bg-amber-500 text-slate-950 font-black' : 'bg-emerald-500 text-white'
                            }`}
                            title={isPending ? 'Pending Approval' : 'Approved Student'}
                          >
                            {isPending ? '⏳' : '✓'}
                          </span>
                        </div>

                        {/* Student Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-black text-sm text-[#082942] truncate group-hover:text-emerald-700">
                              {st.name}
                            </span>
                            {st.age ? (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-white border border-slate-200 text-slate-600 shrink-0">
                                Age {st.age}
                              </span>
                            ) : (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-md font-medium bg-slate-100 text-slate-400 shrink-0">
                                Age not set
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            {st.className}
                          </div>

                          <div className="flex items-center justify-between gap-1 mt-1.5">
                            {st.phone ? (
                              <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                                <Phone className="w-2.5 h-2.5 text-emerald-600" />
                                {st.phone}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic font-normal">
                                No phone
                              </span>
                            )}
                            <span className="text-[10px] font-black text-amber-700 bg-amber-100/70 px-1.5 py-0.2 rounded-full">
                              ⚡ {st.quizPoints || 0} pts
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>

              {allStudentsList.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="font-bold text-sm">No students found matching your search.</p>
                </div>
              )}
            </div>

            {/* Student Table with Live Search */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search students table by name or stream..."
                    value={searchStudent}
                    onChange={e => setSearchStudent(e.target.value)}
                    className="bg-transparent border-0 outline-none text-sm w-full font-medium text-slate-800"
                  />
                </div>
                <div className="text-xs font-bold text-slate-500">
                  Showing {filteredStudents.length} Students
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#082942] text-white text-xs uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-6">Rank</th>
                      <th className="py-3.5 px-6">Student Identity</th>
                      <th className="py-3.5 px-6">Age & Contact</th>
                      <th className="py-3.5 px-6">Class / Stream</th>
                      <th className="py-3.5 px-6">Quiz Points</th>
                      <th className="py-3.5 px-6">Academic Points</th>
                      <th className="py-3.5 px-6">ID Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((s, idx) => (
                      <tr
                        key={s.name}
                        onClick={() => setStudentIdCardModal(s)}
                        className="hover:bg-emerald-50/50 cursor-pointer transition-colors"
                      >
                        <td className="py-4 px-6 font-bold text-slate-500">#{idx + 1}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {s.photoUrl ? (
                              <img
                                src={s.photoUrl}
                                alt={s.name}
                                className="w-9 h-9 rounded-full object-cover border border-emerald-500"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-700">
                                {s.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <span className="font-bold text-slate-900 block">{s.name}</span>
                              <span className="text-[11px] text-slate-400 font-medium">{s.email || 'student@kellem.edu.et'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-xs text-slate-700 font-semibold">
                            <span>{s.age ? `Age ${s.age}` : 'Age not set'}</span>
                            <span className="text-slate-300 mx-1.5">•</span>
                            <span className={s.phone ? 'text-emerald-700' : 'text-slate-400 italic font-normal'}>
                              {s.phone || 'No phone'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-600 font-medium">{s.className}</td>
                        <td className="py-4 px-6 font-black text-amber-600">⚡ {s.quizPoints || 0} pts</td>
                        <td className="py-4 px-6 font-black text-emerald-700">{s.points} pts</td>
                        <td className="py-4 px-6">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setStudentIdCardModal(s);
                            }}
                            className="px-3 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-extrabold transition-all cursor-pointer"
                          >
                            View ID Card
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Student Directory Modal */}
        {studentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl">
              <button
                onClick={() => setStudentModalOpen(false)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xl cursor-pointer"
              >
                ✕
              </button>
              <div className="flex items-center gap-3 mb-4">
                <img src="/assets/aistudio/kss_best_logo_9d217f0f.png" alt="KSS Seal" className="w-12 h-12 object-contain rounded-full shadow-sm" />
                <div>
                  <div className="text-xs font-black tracking-widest text-emerald-600 uppercase">
                    KELLEM SECONDARY SCHOOL • ALL STUDENTS
                  </div>
                  <h3 className="text-2xl font-black text-[#082942]">Student Directory & Identity</h3>
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-6">
                All registered students ({allStudentsList.length} total) listed in interactive buttons. Click any button to inspect their verified student profile, age, phone number, and performance.
              </p>

              {/* Interactive buttons in modal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-h-[50vh] overflow-y-auto pr-1">
                {allStudentsList.map((s, i) => (
                  <button
                    key={`${s.id || s.name}-${i}`}
                    onClick={() => {
                      setSelectedStudent(s);
                      setStudentIdCardModal(s);
                    }}
                    className="p-3.5 rounded-2xl border-2 text-left flex items-center gap-3 transition-all hover:scale-[1.01] hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40 cursor-pointer"
                  >
                    {s.photoUrl ? (
                      <img src={s.photoUrl} alt={s.name} className="w-11 h-11 rounded-xl object-cover border border-emerald-500 shrink-0" />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-[#082942] text-white flex items-center justify-center font-black text-sm shrink-0">
                        {s.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-black text-sm text-[#082942] truncate">{s.name}</span>
                        {s.age ? (
                          <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600 font-bold shrink-0">
                            Age {s.age}
                          </span>
                        ) : (
                          <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 shrink-0">
                            Age not set
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 truncate">{s.className}</div>
                      <div className="text-[10px] text-emerald-700 font-bold mt-0.5 flex items-center justify-between">
                        {s.phone ? (
                          <span>📞 {s.phone}</span>
                        ) : (
                          <span className="text-slate-400 italic font-normal">No phone</span>
                        )}
                        <span className="text-amber-700 font-black">⚡ {s.quizPoints || 0} pts</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Total count: <strong>{totalStudentsCount} Enrolled Students</strong></span>
                <span className="text-emerald-700 font-bold">Registration-Only Approval Enforced</span>
              </div>
            </div>
          </div>
        )}

        {/* OFFICIAL KSS STUDENT IDENTITY CARD MODAL (Opened by clicking any student button) */}
        {studentIdCardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl border-4 border-emerald-500/30 overflow-hidden">
              <button
                onClick={() => setStudentIdCardModal(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-lg cursor-pointer z-10"
              >
                ✕
              </button>

              {/* ID Card Header with Official School Crest */}
              <div className="text-center pb-5 border-b border-slate-200 relative">
                <div className="w-20 h-20 mx-auto mb-2 p-1 rounded-full bg-white shadow-md border-2 border-emerald-500">
                  <img
                    src="/assets/aistudio/kss_best_logo_9d217f0f.png"
                    alt="Kellem Secondary School Seal"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <h4 className="text-xs font-black text-emerald-800 tracking-widest uppercase">
                  MANA BARUMSAA QELLEM SAD 2FFAA
                </h4>
                <h3 className="text-lg font-black text-[#082942]">
                  KELLEM SECONDARY SCHOOL
                </h3>
                <p className="text-[10px] text-slate-500 font-semibold tracking-wider mt-0.5">
                  Barnoota • Hojii • Milkaa'ina • Dambi Dollo, Oromia
                </p>
                <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                  Official Student Identity Card
                </div>
              </div>

              {/* Student Photo & Identification */}
              <div className="pt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    {studentIdCardModal.photoUrl ? (
                      <img
                        src={studentIdCardModal.photoUrl}
                        alt={studentIdCardModal.name}
                        className="w-20 h-20 rounded-2xl object-cover border-4 border-emerald-500 shadow-md"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#082942] to-emerald-700 text-white flex items-center justify-center text-3xl font-black shadow-md">
                        {studentIdCardModal.name.charAt(0)}
                      </div>
                    )}
                    <span
                      className={`absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[9px] font-black text-white shadow-sm ${
                        studentIdCardModal.status === 'pending' ? 'bg-amber-500' : 'bg-emerald-600'
                      }`}
                    >
                      {studentIdCardModal.status === 'pending' ? 'PENDING' : 'VERIFIED'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                      STUDENT FULL NAME
                    </span>
                    <h4 className="text-xl font-black text-[#082942] truncate leading-tight">
                      {studentIdCardModal.name}
                    </h4>
                    <span className="text-xs text-emerald-700 font-bold block mt-0.5">
                      {studentIdCardModal.className}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      ID: KSS-{studentIdCardModal.id ? String(studentIdCardModal.id).slice(-6) : '2026-STU'}
                    </span>
                  </div>
                </div>

                {/* Identity Details Table */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-bold">Age:</span>
                    <span className="font-black text-[#082942]">
                      {studentIdCardModal.age ? `${studentIdCardModal.age} Years Old` : <span className="text-slate-400 font-normal italic">Not specified (set in Settings)</span>}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-bold">Phone Number:</span>
                    {studentIdCardModal.phone ? (
                      <a
                        href={`tel:${studentIdCardModal.phone}`}
                        className="font-black text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" /> {studentIdCardModal.phone}
                      </a>
                    ) : (
                      <span className="text-slate-400 font-normal italic">Not provided (add in Settings)</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-bold">Email:</span>
                    <span className="font-semibold text-slate-700 truncate max-w-[200px]">
                      {studentIdCardModal.email || 'student@kellem.edu.et'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-bold">Profile Photo:</span>
                    <span className="text-slate-600 font-medium">
                      {studentIdCardModal.photoUrl ? 'Uploaded by Student' : 'Not uploaded yet (add in Settings)'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-bold">Portal Status:</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-black text-[10px] ${
                        studentIdCardModal.status === 'pending'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {studentIdCardModal.status === 'pending' ? 'Pending Approval' : 'Approved Account'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500 font-bold">Verified Quiz Points:</span>
                    <span className="font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                      ⚡ {studentIdCardModal.quizPoints || 0} pts
                    </span>
                  </div>
                </div>

                {/* Verification Stamp & Edit in Settings */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verified by Admin: {ADMIN_EMAIL}</span>
                  </div>
                  {currentUser && (
                    (studentIdCardModal.id && currentUser.id && studentIdCardModal.id === currentUser.id) ||
                    (studentIdCardModal.email && currentUser.email && studentIdCardModal.email.toLowerCase() === currentUser.email.toLowerCase()) ||
                    (studentIdCardModal.name && currentUser.name && studentIdCardModal.name.toLowerCase() === currentUser.name.toLowerCase())
                  ) ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setStudentIdCardModal(null);
                          setShowSettingsModal(true);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Settings className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Edit My Settings</span>
                      </button>
                      <button
                        onClick={() => setStudentIdCardModal(null)}
                        className="px-4 py-1.5 rounded-xl bg-[#082942] hover:bg-[#0c395c] text-white text-xs font-black cursor-pointer shadow-sm transition-all"
                      >
                        Close Card
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-bold flex items-center gap-1.5 border border-slate-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Self-managed by {studentIdCardModal.name.split(' ')[0]} (Only they can edit their photo, phone & age)</span>
                      </div>
                      <button
                        onClick={() => setStudentIdCardModal(null)}
                        className="px-4 py-1.5 rounded-xl bg-[#082942] hover:bg-[#0c395c] text-white text-xs font-black cursor-pointer shadow-sm transition-all"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Academic Departments */}
        <section id="departments" className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-black tracking-widest text-emerald-600 uppercase mb-2">ACADEMIC DEPARTMENTS</div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#082942] tracking-tight">Choose a path. Build your future.</h2>
            <p className="text-slate-600 mt-2 text-base">
              Comprehensive curriculum aligned with national educational standards and university entrance pathways.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0877b7] to-[#0a9ca2] text-white shadow-xl">
              <span className="text-4xl block mb-3">🔬</span>
              <h3 className="text-2xl font-black mb-3">Natural Science Stream</h3>
              <p className="text-slate-100 text-sm sm:text-base leading-relaxed">
                Encouraging scientific thinking, laboratory discovery, problem solving, physics, chemistry, biology, and preparing students for engineering, medicine, and technology studies.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0c6b59] to-[#16a76f] text-white shadow-xl">
              <span className="text-4xl block mb-3">📚</span>
              <h3 className="text-2xl font-black mb-3">Social Science Stream</h3>
              <p className="text-slate-100 text-sm sm:text-base leading-relaxed">
                Developing in-depth understanding of people, economics, geography, history, social ideas, and the world around us to build future leaders, lawyers, and economists.
              </p>
            </div>
          </div>
        </section>

        {/* Win Entrance Section */}
        <section id="win-entrance" className="py-20 bg-slate-100/70 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-12">
              <div className="text-xs font-black tracking-widest text-emerald-600 uppercase mb-2">ENTRANCE PREPARATION</div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#082942] tracking-tight">Win Entrance</h2>
              <p className="text-slate-600 mt-2 text-base">
                Prepare with focused revision, past national exam practice questions, and smart study habits with Kellem AI.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-3xl mb-3 block">🗓️</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Structured Study Plan</h3>
                <p className="text-slate-600 text-sm">Organize your revision schedule and focus deeply on core high-yield subjects.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-3xl mb-3 block">📝</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Exam Practice</h3>
                <p className="text-slate-600 text-sm">Solve timed practice tests, evaluate mistakes, and reinforce weak areas.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-3xl mb-3 block">💪</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Build High Confidence</h3>
                <p className="text-slate-600 text-sm">Track your progress and mental preparedness to perform at your absolute best.</p>
              </div>
            </div>

            {/* Grade 12 Study Guides */}
            <h3 className="text-xl font-black text-[#082942] mb-6">Grade 12 Study Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-3xl block mb-2">📊</span>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Economics Study Guide</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Review macroeconomics, market failure, monetary policy, taxation, poverty and inequality metrics.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => {
                      setKellemAiTab('quiz');
                      restartQuiz('social');
                      const el = document.getElementById('kellem-ai');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                  >
                    Take Economics Quiz
                  </button>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-3xl block mb-2">🗺️</span>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Geography Study Guide</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Review plate tectonics, climate change, sustainable development, resource distribution, and population.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => {
                      setKellemAiTab('quiz');
                      restartQuiz('social');
                      const el = document.getElementById('kellem-ai');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                  >
                    Take Geography Quiz
                  </button>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-3xl block mb-2">⚡</span>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Physics Study Guide</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Review Newtonian motion, gravitation, thermodynamics, electromagnetism, and introductory electronics.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => {
                      setKellemAiTab('quiz');
                      restartQuiz('natural');
                      const el = document.getElementById('kellem-ai');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                  >
                    Take Physics Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* English Club Section */}
        <section id="english-club" className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <div className="text-xs font-black tracking-widest text-emerald-600 uppercase mb-2">LANGUAGE & COMMUNICATION</div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#082942] tracking-tight">English Club</h2>
            <p className="text-slate-600 mt-2 text-base">
              A friendly environment for students to practice English speaking, listening, vocabulary, and communication skills together.
            </p>
            <div className="mt-5">
              <a
                href="https://t.me/kellemenglishclub"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#229ED9] hover:bg-[#1e8ec3] text-white font-bold text-sm shadow-md transition-colors"
              >
                ✈️ Join English Club on Telegram <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-3xl mb-3 block">🗣️</span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Speaking Practice</h3>
              <p className="text-slate-600 text-sm">Practice everyday conversations and build self-assurance in oral communication.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-3xl mb-3 block">🎭</span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Activities & Debates</h3>
              <p className="text-slate-600 text-sm">Join discussions, presentations, role-play dialogues, and vocabulary challenges.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-3xl mb-3 block">🌍</span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Global Readiness</h3>
              <p className="text-slate-600 text-sm">Equip yourself with language skills crucial for higher education and modern careers.</p>
            </div>
          </div>
        </section>

        {/* Calendar & Weekly Learning Culture */}
        <section id="events" className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-black tracking-widest text-emerald-600 uppercase mb-2">SCHOOL EVENTS & CALENDAR</div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#082942] tracking-tight">Our weekly learning culture</h2>
            <p className="text-slate-600 mt-2 text-base">
              Establishing good habits, collaboration, and high spirit across classrooms throughout the school week.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-black text-emerald-700 tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md mb-3 inline-block">
                MONDAY
              </span>
              <h3 className="text-xl font-bold text-slate-900 mb-2">English Speaking Day</h3>
              <p className="text-slate-600 text-sm">Practice speaking English throughout the campus, in corridors and classrooms.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-black text-blue-700 tracking-wider bg-blue-50 px-2.5 py-1 rounded-md mb-3 inline-block">
                WEDNESDAY
              </span>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Singing & Creative Day</h3>
              <p className="text-slate-600 text-sm">A day for community songs, cultural expression, and positive school spirit.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-black text-emerald-700 tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md mb-3 inline-block">
                FRIDAY
              </span>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Clean Campus Day</h3>
              <p className="text-slate-600 text-sm">Collaborative care to keep classrooms, library, and grounds pristine and green.</p>
            </div>
          </div>
        </section>

        {/* School Community Spotlight */}
        <section className="py-20 bg-slate-100/70 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center gap-8">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white text-4xl font-black flex items-center justify-center shadow-lg shrink-0">
                BY
              </div>
              <div className="space-y-2">
                <span className="text-xs font-black tracking-widest text-emerald-600 uppercase">SCHOOL COMMUNITY INNOVATOR</span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#082942]">Bilisuma Yadasa Beka</h3>
                <p className="text-slate-600 text-base leading-relaxed">
                  A passionate student and young innovator who believes in learning, technology, and building useful tools like <strong>Kellem AI</strong> to help classmates succeed in secondary education and entrance examinations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      )}

      {/* Footer */}
      <footer className="bg-[#08243a] text-slate-300 pt-16 pb-28 sm:pb-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/kss_best_logo_9d217f0f.png"
                alt="Kellem Secondary School Seal"
                className="w-12 h-12 object-contain rounded-full bg-white p-0.5 shadow-sm ring-2 ring-emerald-500/50"
              />
              <div>
                <h4 className="text-xl font-black text-white">Kellem Secondary School</h4>
                <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Mana Barumsaa Qellem Sad 2ffaa</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              Mana Barumsaa Qellem Sad 2ffaa • Dambi Dollo, Oromia, Ethiopia. Empowered by <strong>Kellem AI</strong> and secured with Registration-Only Administrator Approval (<strong>{ADMIN_EMAIL}</strong>).
            </p>
          </div>
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="hover:text-emerald-400 transition-colors">About Our School</a></li>
              <li><a href="#teachers" className="hover:text-emerald-400 transition-colors">Teachers & 1st Director Zarihuun</a></li>
              <li><a href="#students" className="hover:text-emerald-400 transition-colors">Student Roster</a></li>
              <li>
                <button
                  onClick={() => {
                    navigate('/');
                    setKellemAiTab('quiz');
                    setQuizViewMode('leaderboard');
                    const el = document.getElementById('kellem-ai');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors font-bold text-left flex items-center gap-1 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" /> Top Performers Leaderboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="hover:text-emerald-400 transition-colors font-bold text-left flex items-center gap-1 cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> Student Dashboard & Goals
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Governance</h5>
            <ul className="space-y-2 text-sm">
              <li><span className="text-slate-400">Admin:</span> <span className="text-amber-300 font-bold">{ADMIN_EMAIL}</span></li>
              <li><a href="#win-entrance" className="hover:text-emerald-400 transition-colors">Win Entrance Exam</a></li>
              <li><a href="#english-club" className="hover:text-emerald-400 transition-colors">English Club Telegram</a></li>
              {isAdmin && (
                <li>
                  <button
                    onClick={() => setShowAdminConsole(true)}
                    className="text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
                  >
                    Open Administrator Console →
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Kellem Secondary School. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-semibold">Leadership:</span> 1st Director Zarihuun • 2nd Director Argata • 3rd Director Soonessoo
          </div>
        </div>
      </footer>

      {/* Floating Bottom Nav for Mobile / Quick Access */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2.5 px-4 lg:hidden shadow-lg">
        <div className="flex justify-around items-center text-xs font-bold text-slate-600">
          <button
            onClick={() => navigate('/dashboard')}
            className={`flex flex-col items-center gap-1 cursor-pointer ${
              location.pathname === '/dashboard' ? 'text-emerald-700 font-black' : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => {
              navigate('/');
              setKellemAiTab('quiz');
              setQuizViewMode('quiz');
              const el = document.getElementById('kellem-ai');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-1 text-orange-600 cursor-pointer"
          >
            <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
            <span>{dailyStreak.currentStreak}d Streak</span>
          </button>
          <button
            onClick={() => {
              navigate('/');
              setKellemAiTab('quiz');
              setQuizViewMode('leaderboard');
              const el = document.getElementById('kellem-ai');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-1 text-amber-700 cursor-pointer"
          >
            <Trophy className="w-5 h-5 text-amber-600" />
            <span>Ranks</span>
          </button>
          <button
            onClick={() => {
              navigate('/');
              setKellemAiTab('chat');
              const el = document.getElementById('kellem-ai');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-1 text-emerald-700 cursor-pointer"
          >
            <Bot className="w-5 h-5 text-emerald-600" />
            <span>AI Chat</span>
          </button>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="flex flex-col items-center gap-1 text-slate-700 hover:text-emerald-700 cursor-pointer"
          >
            <Settings className="w-5 h-5 text-slate-600" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => {
              navigate('/');
              const el = document.getElementById('student-data');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-1 hover:text-emerald-700 cursor-pointer"
          >
            <Users className="w-5 h-5" />
            <span>Students</span>
          </button>
          {isAdmin ? (
            <button
              onClick={() => setShowAdminConsole(!showAdminConsole)}
              className="flex flex-col items-center gap-1 text-amber-700 cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <span>Admin</span>
            </button>
          ) : (
            <button
              onClick={handleSignOut}
              className="flex flex-col items-center gap-1 hover:text-red-600 cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* User Settings Modal (Strictly Self-Managed: Only the user themselves can change photo, age, and phone) */}
      {showSettingsModal && currentUser && (
        <UserSettingsModal
          user={currentUser}
          currentUser={currentUser}
          token={token}
          onClose={() => setShowSettingsModal(false)}
          onProfileUpdated={(updated) => {
            setCurrentUser(updated);
            localStorage.setItem('kellem_user_profile', JSON.stringify(updated));
            setStudents(prev =>
              prev.map(s => (s.id === updated.id || s.name.toLowerCase() === updated.name.toLowerCase()) ? { ...s, ...updated } : s)
            );
            setAllStudentsList(prev =>
              prev.map(s => (s.id === updated.id || s.email === updated.email) ? { ...s, ...updated } : s)
            );
            if (studentIdCardModal && (studentIdCardModal.id === updated.id || studentIdCardModal.name.toLowerCase() === updated.name.toLowerCase())) {
              setStudentIdCardModal(prev => prev ? { ...prev, ...updated } : null);
            }
          }}
        />
      )}
    </div>
  );
}
