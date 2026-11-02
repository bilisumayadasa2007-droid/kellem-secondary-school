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
  User
} from 'lucide-react';

interface Student {
  name: string;
  className: string;
  points: number;
  quizPoints: number;
  quizzesCompleted: number;
  accuracy: number;
  bestStreak: number;
}

export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced';

interface QuizQuestion {
  id: number;
  subject: 'entrance' | 'natural' | 'social' | 'english';
  category: string;
  difficulty: QuizDifficulty;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizRecord {
  question: QuizQuestion;
  selectedIndex: number;
  isCorrect: boolean;
}

interface DailyStreakData {
  currentStreak: number;
  bestStreak: number;
  lastQuizDate: string | null;
  streakBonusTotal: number;
  completedToday: boolean;
}

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

const INITIAL_STUDENTS: Student[] = [
  { name: 'Bilisummaa Yaadasaa', className: 'Natural Science', points: 98, quizPoints: 360, quizzesCompleted: 8, accuracy: 96, bestStreak: 12 },
  { name: "Raajii Amanu'e", className: 'Natural Science', points: 96, quizPoints: 320, quizzesCompleted: 7, accuracy: 93, bestStreak: 10 },
  { name: 'Feeneet Yooseef', className: 'Natural Science', points: 94, quizPoints: 290, quizzesCompleted: 6, accuracy: 90, bestStreak: 8 },
  { name: 'Israel Kassahuun', className: 'Natural Science', points: 91, quizPoints: 270, quizzesCompleted: 6, accuracy: 88, bestStreak: 7 },
  { name: 'Eebbisa Beekaa', className: 'Social Science', points: 90, quizPoints: 250, quizzesCompleted: 5, accuracy: 86, bestStreak: 7 },
  { name: 'Guutuu Aboomaa', className: 'Natural Science', points: 89, quizPoints: 230, quizzesCompleted: 5, accuracy: 85, bestStreak: 6 },
  { name: 'Caaltuu Kennaa', className: 'Social Science', points: 88, quizPoints: 210, quizzesCompleted: 4, accuracy: 84, bestStreak: 5 },
  { name: 'Taliilaa Jaallataa', className: 'Natural Science', points: 87, quizPoints: 190, quizzesCompleted: 4, accuracy: 82, bestStreak: 5 },
  { name: 'Atinaboon Rattaa', className: 'Natural Science', points: 85, quizPoints: 170, quizzesCompleted: 3, accuracy: 80, bestStreak: 4 },
  { name: 'Feeneet Gaaromaa', className: 'Natural Science', points: 84, quizPoints: 160, quizzesCompleted: 3, accuracy: 78, bestStreak: 4 },
  { name: 'Nabiyyuu Sulxaan', className: 'Natural Science', points: 82, quizPoints: 140, quizzesCompleted: 3, accuracy: 76, bestStreak: 3 },
  { name: 'Toleeraa Tatikuu', className: 'Natural Science', points: 80, quizPoints: 120, quizzesCompleted: 2, accuracy: 74, bestStreak: 3 },
  { name: 'Lammii Xilahuun', className: 'Natural Science', points: 78, quizPoints: 110, quizzesCompleted: 2, accuracy: 72, bestStreak: 3 },
  { name: 'Gammachuu Takkaa', className: 'Natural Science', points: 76, quizPoints: 90, quizzesCompleted: 2, accuracy: 70, bestStreak: 2 },
  { name: 'Fatiyaa Yaasiin', className: 'Natural Science', points: 74, quizPoints: 80, quizzesCompleted: 1, accuracy: 68, bestStreak: 2 },
  { name: 'Siifan Efreem', className: 'Natural Science', points: 72, quizPoints: 60, quizzesCompleted: 1, accuracy: 65, bestStreak: 1 }
];

const DAILY_ENGLISH_PHRASES = [
  { phrase: "How’s your day going?", reply: "It’s going well, thank you!", tip: "Use it to ask politely about someone’s day." },
  { phrase: "How’s your week been?", reply: "Pretty good, thanks. I’ve been studying a lot.", tip: "Use it when you meet someone during the week." },
  { phrase: "What are you working on?", reply: "I’m preparing for my entrance exam.", tip: "Use it to ask about someone’s current work or study." },
  { phrase: "Could you explain that again?", reply: "Sure. Let me explain it in a simpler way.", tip: "Use it when you need someone to repeat an explanation." },
  { phrase: "What do you think?", reply: "I think it is a good idea because it can help students learn.", tip: "Use it to ask for an opinion." },
  { phrase: "Could you help me, please?", reply: "Of course. What do you need help with?", tip: "A polite way to ask for help." },
  { phrase: "I don’t understand yet.", reply: "No problem. Let’s go step by step.", tip: "Use it when a lesson is still difficult." },
  { phrase: "That makes sense.", reply: "Great! I’m glad it is clear now.", tip: "Use it when you understand an explanation." },
  { phrase: "What did you learn today?", reply: "I learned a new English phrase.", tip: "Use it to talk about daily learning." },
  { phrase: "Can we practice together?", reply: "Yes! Let’s practice for five minutes.", tip: "Use it to start a speaking practice." }
];

const QUIZ_BANKS: Record<'entrance' | 'natural' | 'social' | 'english', QuizQuestion[]> = {
  entrance: [
    // Beginner Level
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

    // Intermediate Level
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

    // Advanced Level
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
    // Beginner Level
    {
      id: 201,
      subject: 'natural',
      category: 'Chemistry • Acids & Bases',
      difficulty: 'beginner',
      question: 'On the standard pH scale at 25°C, which numerical value represents a completely neutral aqueous solution?',
      options: ['pH = 0', 'pH = 7', 'pH = 14', 'pH = 1'],
      correctIndex: 1,
      explanation: 'A pH of 7 corresponds to equal concentrations of hydronium [H₃O⁺] and hydroxide [OH⁻] ions (1.0 × 10⁻⁷ M), designating neutrality.'
    },
    {
      id: 202,
      subject: 'natural',
      category: 'Physics • Mechanics & Inertia',
      difficulty: 'beginner',
      question: 'Which fundamental law of physics establishes that an object remains at rest or in uniform motion unless acted upon by a net external force?',
      options: ["Newton's First Law (Law of Inertia)", "Newton's Second Law (F = ma)", "Newton's Third Law (Action-Reaction)", "Law of Universal Gravitation"],
      correctIndex: 0,
      explanation: "Newton's First Law defines inertia—the property of matter to resist any change in its existing state of rest or uniform motion."
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

    // Intermediate Level
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

    // Advanced Level
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
    // Beginner Level
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

    // Intermediate Level
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

    // Advanced Level
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
    // Beginner Level
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

    // Intermediate Level
    {
      id: 16,
      subject: 'english',
      category: 'Grammar • Subject-Verb Agreement',
      difficulty: 'intermediate',
      question: 'Choose the correct verb form: "Neither the head teacher nor the department heads _______ present at yesterday’s morning briefing."',
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

    // Advanced Level
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
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('kellemStudents');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s: any, idx: number) => ({
            name: s.name,
            className: s.className || 'Natural Science',
            points: typeof s.points === 'number' ? s.points : 50,
            quizPoints: typeof s.quizPoints === 'number' ? s.quizPoints : Math.max(360 - idx * 20, 60),
            quizzesCompleted: typeof s.quizzesCompleted === 'number' ? s.quizzesCompleted : Math.max(8 - Math.floor(idx / 2), 1),
            accuracy: typeof s.accuracy === 'number' ? s.accuracy : Math.max(96 - idx * 2, 60),
            bestStreak: typeof s.bestStreak === 'number' ? s.bestStreak : Math.max(12 - idx, 1)
          }));
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_STUDENTS;
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchStudent, setSearchStudent] = useState('');

  // Authentication State
  const [authRole, setAuthRole] = useState<'student' | 'teacher'>('student');
  const [authTab, setAuthTab] = useState<'signup' | 'signin'>('signup');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authClass, setAuthClass] = useState('Grade 12 Natural Science');
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string; className: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem('kellemCurrentUser');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });
  const [authAlert, setAuthAlert] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Kellem AI Mode Switch: Chat vs Practice Quiz
  const [kellemAiTab, setKellemAiTab] = useState<'chat' | 'quiz'>('chat');

  // Inside Quiz View: Active Quiz vs Top Performers Ranking
  const [quizViewMode, setQuizViewMode] = useState<'quiz' | 'leaderboard'>('quiz');
  const [performerFilter, setPerformerFilter] = useState<'all' | 'natural' | 'social'>('all');

  // Kellem AI Chat State
  const [chatMode, setChatMode] = useState<'study' | 'english' | 'entrance' | 'skills' | 'teacher'>('study');
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'Hello! I’m Kellem AI, your learning assistant for Kellem Secondary School. Ask me any school question, explore study tips, or switch to Practice Quiz to test your knowledge!'
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

  // Cumulative Quiz Progress
  interface CumulativeStats {
    quizzesCompleted: number;
    totalCorrect: number;
    totalAnswered: number;
    pointsAwarded: number;
  }

  const [cumulativeStats, setCumulativeStats] = useState<CumulativeStats>(() => {
    try {
      const saved = localStorage.getItem('kellemQuizStats');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return { quizzesCompleted: 0, totalCorrect: 0, totalAnswered: 0, pointsAwarded: 0 };
  });

  // DAILY STREAK STATE (Tracking consecutive daily quiz completions & bonuses)
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
    // Default initial 3-day active streak from yesterday to immediately showcase streak incentives
    return {
      currentStreak: 3,
      bestStreak: 5,
      lastQuizDate: yesterday,
      streakBonusTotal: 85,
      completedToday: false
    };
  });

  // Daily Phrase
  const todayPhrase = DAILY_ENGLISH_PHRASES[new Date().getDate() % DAILY_ENGLISH_PHRASES.length];
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  const sortedStudents = [...students].sort((a, b) => b.points - a.points);
  const bestStudent = sortedStudents[0];

  // Top Performers based on cumulative Quiz Points
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

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < currentQuizQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Complete quiz!
      setQuizFinished(true);
      const totalQ = currentQuizQuestions.length;
      const finalCorrect = quizHistory.filter(h => h.isCorrect).length;

      // Challenge-weighted points: Beginner = +10, Intermediate = +15, Advanced = +20 per correct answer
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

      // Check and update Daily Streak
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
        try {
          localStorage.setItem('kellemDailyStreak', JSON.stringify(updatedStreakData));
        } catch {
          // ignore
        }
      }

      const totalRoundEarned = pointsEarned + earnedStreakBonus;

      // Update cumulative stats
      setCumulativeStats(prev => {
        const next = {
          quizzesCompleted: prev.quizzesCompleted + 1,
          totalCorrect: prev.totalCorrect + finalCorrect,
          totalAnswered: prev.totalAnswered + totalQ,
          pointsAwarded: prev.pointsAwarded + totalRoundEarned
        };
        try {
          localStorage.setItem('kellemQuizStats', JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });

      // Update student points and quizPoints in student list
      const targetStudentName = currentUser?.name || bestStudent?.name || 'Bilisummaa Yaadasaa';
      setStudents(prev => {
        const updated = prev.map(s => {
          if (s.name.toLowerCase() === targetStudentName.toLowerCase()) {
            const nextQuizPoints = (s.quizPoints || 0) + totalRoundEarned;
            const nextQuizzes = (s.quizzesCompleted || 0) + 1;
            const nextAcc = Math.round(
              ((s.accuracy || 75) * (s.quizzesCompleted || 1) + (finalCorrect / totalQ) * 100) / nextQuizzes
            );
            const nextStreak = Math.max(s.bestStreak || 0, streak);
            return {
              ...s,
              points: s.points + totalRoundEarned,
              quizPoints: nextQuizPoints,
              quizzesCompleted: nextQuizzes,
              accuracy: nextAcc,
              bestStreak: nextStreak
            };
          }
          return s;
        });
        try {
          localStorage.setItem('kellemStudents', JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });

      if (earnedStreakBonus > 0) {
        setScoreNotification(
          `🔥 Day ${nextStreakDays} Daily Streak Achieved! +${pointsEarned} Quiz Points + ${earnedStreakBonus} Daily Streak Bonus (+${totalRoundEarned} Total) awarded to ${targetStudentName}!`
        );
      } else {
        setScoreNotification(
          `⭐ +${pointsEarned} Quiz Points earned! Daily streak protected at ${dailyStreak.currentStreak} consecutive days.`
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
    if (/quiz|practice question|test me|exam question|practice|leaderboard|top performer|rank/.test(q)) {
      return "I have an interactive practice quiz and Top Performers leaderboard ready! You can switch to the '🎯 Practice Quiz & Tracker' tab above to test your skills, earn cumulative quiz points, maintain your daily streak, and climb to the #1 spot on the school rankings.";
    }
    if (/hello|hi|hey|akkam|nagaa/.test(q)) {
      return "Hello! 👋 I’m Kellem AI, dedicated to helping Kellem Secondary School students excel. What subject or lesson are you focusing on today?";
    }
    if (mode === 'english' || /english|speak|phrase|grammar|vocabulary/.test(q)) {
      if (/practice|conversation/.test(q)) {
        return `Let's practice! Repeat this: "Consistent daily effort leads to academic excellence." Now reply with your favorite subject and why you enjoy it!`;
      }
      return `Daily English Tip from Kellem AI:\nPhrase: "${todayPhrase.phrase}"\nNatural Response: "${todayPhrase.reply}"\nUsage note: ${todayPhrase.tip}`;
    }
    if (mode === 'entrance' || /entrance|exam|study|revision|test/.test(q)) {
      return `Kellem AI Entrance Strategy:\n1. Master core concepts in Physics, Chemistry, Biology / Economics & Geography.\n2. Maintain your Daily Quiz Streak for consistent memory retention.\n3. Solve 5 practice questions daily to climb the Top Performers leaderboard.\n4. Practice daily revision habits.`;
    }
    if (mode === 'skills' || /skill|coding|tech|computer/.test(q)) {
      return `Developing 21st-century skills: Start with fundamentals of algorithmic thinking, computer literacy, or science projects. Small, consistent daily practice creates lifelong mastery!`;
    }
    if (mode === 'teacher' || /teacher|pedagogy|insight|director/.test(q)) {
      return `Teacher & Leadership Insights: Kellem Secondary School leadership—guided by 1st Director Zarihuun, 2nd Director Argata, and 3rd Director Soonessoo—prioritizes student engagement, disciplined study routines, and moral integrity.`;
    }
    if (/zarihuun|director|leadership/.test(q)) {
      return `Our 1st Director is Zarihuun, working alongside 2nd Director Argata and 3rd Director Soonessoo to foster educational quality at Kellem Secondary School in Dambi Dollo.`;
    }
    return `That's an insightful question about "${query}". At Kellem Secondary School, breaking complex topics into clear fundamentals is the best way to master them. Review your textbook examples, test your understanding with practice questions, and don't hesitate to ask teachers for clarification!`;
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

  const handleAuthSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthAlert({ text: 'Please fill in both email and password.', type: 'error' });
      return;
    }

    if (authTab === 'signup') {
      if (!authName.trim()) {
        setAuthAlert({ text: 'Please enter your full name.', type: 'error' });
        return;
      }
      const user = {
        name: authName.trim(),
        role: authRole === 'teacher' ? 'Teacher' : 'Student',
        className: authClass || (authRole === 'teacher' ? 'Faculty Staff' : 'Grade 12 Natural Science'),
        email: authEmail.trim()
      };
      setCurrentUser(user);
      try {
        localStorage.setItem('kellemCurrentUser', JSON.stringify(user));
      } catch {
        // ignore
      }

      if (authRole === 'student') {
        const exists = students.some(s => s.name.toLowerCase() === user.name.toLowerCase());
        if (!exists) {
          const updated = [
            ...students,
            {
              name: user.name,
              className: user.className,
              points: 50,
              quizPoints: 0,
              quizzesCompleted: 0,
              accuracy: 0,
              bestStreak: 0
            }
          ];
          setStudents(updated);
          try {
            localStorage.setItem('kellemStudents', JSON.stringify(updated));
          } catch {
            // ignore
          }
        }
      }
      setAuthAlert(null);
    } else {
      const existing = students.find(s => s.name.toLowerCase().includes(authEmail.split('@')[0].toLowerCase()));
      const user = {
        name: existing ? existing.name : authName.trim() || authEmail.split('@')[0],
        role: authRole === 'teacher' ? 'Teacher' : 'Student',
        className: existing ? existing.className : (authRole === 'teacher' ? 'Faculty Staff' : 'Grade 12 Natural Science'),
        email: authEmail.trim()
      };
      setCurrentUser(user);
      try {
        localStorage.setItem('kellemCurrentUser', JSON.stringify(user));
      } catch {
        // ignore
      }
      setAuthAlert(null);
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('kellemCurrentUser');
    } catch {
      // ignore
    }
    setAuthAlert({ text: 'You have signed out. Please sign in or create an account to access website features.', type: 'success' });
  };

  const handleQuickLogin = (demoName: string, demoRole: 'Student' | 'Teacher', demoClass: string, demoEmail: string) => {
    const user = {
      name: demoName,
      role: demoRole,
      className: demoClass,
      email: demoEmail
    };
    setCurrentUser(user);
    try {
      localStorage.setItem('kellemCurrentUser', JSON.stringify(user));
    } catch {
      // ignore
    }
    setAuthAlert(null);
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
        badge: '🌟 University Placement Honors Track',
        color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        message: 'Outstanding score! You are well prepared for high national rankings.'
      };
    }
    if (percent >= 60) {
      return {
        badge: '👍 Solid Academic Competence',
        color: 'bg-blue-100 text-blue-900 border-blue-300',
        message: 'Good foundation. Review your incorrect answers to turn B grades into A+.'
      };
    }
    return {
      badge: '📚 Focused Revision Recommended',
      color: 'bg-orange-100 text-orange-900 border-orange-300',
      message: 'Keep going! Regular practice with Kellem AI will rapidly elevate your scores.'
    };
  };

  const tier = getTierInfo(scorePercent);

  // AUTHENTICATION GATE: First create new account or sign in before opening website features
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
              <span className="text-emerald-400">📍</span>
              <span>Dambi Dollo, Oromia, Ethiopia</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-medium">Mana Barumsaa Qellem Sad 2ffaa</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-emerald-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Official Portal Access
              </span>
            </div>
          </div>
        </div>

        {/* Main Central Container */}
        <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
          <div className="bg-[#0b2942]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-10">
            {/* Header / Emblem */}
            <div className="text-center space-y-3 mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[#0a4b36] via-[#097b61] to-[#08b48f] text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-xl shadow-emerald-900/40">
                KS
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Welcome to Kellem Secondary School
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                First Create New Account or Sign In
              </h1>
              <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
                Please create your account or sign in below. Once you enter, the website will unlock full access to <strong>Kellem AI</strong>, Practice Quizzes with difficulty levels, Daily Streak bonuses, school rankings, and complete curriculum resources.
              </p>
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
                <UserPlus className="w-4 h-4" /> 1. Create New Account
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
                <LogIn className="w-4 h-4" /> 2. Sign In
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="max-w-lg mx-auto space-y-4">
              {authTab === 'signup' && (
                <>
                  {/* Role picker */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">Select Account Role</label>
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
                          <div className="text-[10px] text-slate-400">Natural & Social Science</div>
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
                        <span className="text-xl">👩‍🏫</span>
                        <div>
                          <div className="font-extrabold text-white">Teacher / Staff</div>
                          <div className="text-[10px] text-slate-400">Faculty & Leadership</div>
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
                        placeholder="e.g. Bilisummaa Yaadasaa"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  {/* Grade / Stream */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      {authRole === 'student' ? 'Grade & Stream' : 'Department / Subject'}
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
                    placeholder={authTab === 'signup' ? 'yourname@kellem.edu.et' : 'name@kellem.edu.et'}
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
                  className={`p-3.5 rounded-xl text-xs font-bold ${
                    authAlert.type === 'success'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      : 'bg-red-950/80 text-red-300 border border-red-500/40'
                  }`}
                >
                  {authAlert.text}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
              >
                {authTab === 'signup' ? (
                  <>
                    <UserPlus className="w-5 h-5 text-slate-950" />
                    <span>Create Account & Open Website Features</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 text-slate-950" />
                    <span>Sign In & Open Website Features</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Bar */}
            <div className="mt-8 pt-6 border-t border-white/10 max-w-lg mx-auto">
              <span className="text-xs font-bold text-slate-400 block text-center mb-3">
                Or immediately open website with a quick demo profile:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('Bilisummaa Yaadasaa', 'Student', 'Grade 12 Natural Science', 'bilisummaa@kellem.edu.et')}
                  className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  🎓 Student Champion
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('Raajii Amanu\'e', 'Student', 'Grade 12 Natural Science', 'raajii@kellem.edu.et')}
                  className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  🔬 Science Student
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('Teacher Tolaa', 'Teacher', 'Faculty Staff', 'tolaa@kellem.edu.et')}
                  className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-white/10 hover:border-amber-500/40 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  👩‍🏫 Faculty Member
                </button>
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-xl">🤖</span>
                <h4 className="text-xs font-black text-white">Kellem AI Tutor</h4>
                <p className="text-[11px] text-slate-400">24/7 intelligent study guidance & national entrance revision.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-xl">🎯</span>
                <h4 className="text-xs font-black text-white">Difficulty Quizzes</h4>
                <p className="text-[11px] text-slate-400">Beginner, Intermediate, and Advanced challenge tiers.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-xl">🔥</span>
                <h4 className="text-xs font-black text-white">Daily Streaks</h4>
                <p className="text-[11px] text-slate-400">Daily practice bonus points & Olympic podium ranking.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-xl">🏫</span>
                <h4 className="text-xs font-black text-white">School Leadership</h4>
                <p className="text-[11px] text-slate-400">Led by 1st Director Zarihuun & esteemed academic staff.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="py-4 text-center text-xs text-slate-400 border-t border-white/10 bg-[#051624]">
          © {new Date().getFullYear()} Kellem Secondary School • Dambi Dollo, Oromia, Ethiopia. All rights reserved.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f2438] font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Bar */}
      <div className="bg-[#082942] text-slate-200 text-xs sm:text-sm border-b border-emerald-500/20 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">📍</span>
            <span>Dambi Dollo, Oromia, Ethiopia</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Mana Barumsaa Qellem Sad 2ffaa</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30 text-xs font-semibold">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Logged in: <strong>{currentUser.name}</strong> ({currentUser.className || currentUser.role})</span>
            </div>
            <button
              onClick={handleSignOut}
              className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3 h-3" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0a4b36] via-[#097b61] to-[#08b48f] text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
              KS
            </div>
            <div>
              <div className="text-xl font-black text-[#082942] tracking-tight leading-none flex items-center gap-1.5">
                Kellem <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Secondary</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Secondary School • Dambi Dollo</p>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#home" className="hover:text-emerald-700 transition-colors">Home</a>
            <a href="#about" className="hover:text-emerald-700 transition-colors">About</a>
            <a href="#teachers" className="hover:text-emerald-700 transition-colors">Teachers & Leaders</a>
            <a href="#students" className="hover:text-emerald-700 transition-colors">Students</a>
            <a
              href="#kellem-ai"
              onClick={() => {
                setKellemAiTab('chat');
              }}
              className="hover:text-emerald-700 text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200"
            >
              <Bot className="w-4 h-4 text-emerald-600" /> Kellem AI
            </a>
            <a
              href="#kellem-ai"
              onClick={() => {
                setKellemAiTab('quiz');
                setQuizViewMode('leaderboard');
              }}
              className="hover:text-amber-800 text-amber-800 font-bold flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-200"
            >
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
              <span>Streak: {dailyStreak.currentStreak}d</span>
            </a>
            <a href="#departments" className="hover:text-emerald-700 transition-colors">Departments</a>
            <a href="#win-entrance" className="hover:text-emerald-700 transition-colors">Win Entrance</a>
            <a href="#english-club" className="hover:text-emerald-700 transition-colors">English Club</a>
            <a href="#student-data" className="text-white bg-[#082942] hover:bg-[#0c395c] px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
              <Users className="w-4 h-4" /> Student Data
            </a>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold">
                <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-black">
                  {currentUser.name.charAt(0)}
                </span>
                <span className="truncate max-w-[110px]">{currentUser.name}</span>
                <span className="text-[10px] bg-emerald-200/80 text-emerald-950 px-1.5 py-0.2 rounded font-extrabold uppercase">
                  {currentUser.role}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                title="Sign out of Kellem Portal"
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Sign Out</span>
              </button>
            </div>
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
            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-semibold hover:text-emerald-700">Home</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-semibold hover:text-emerald-700">About Our School</a>
            <a href="#teachers" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-semibold hover:text-emerald-700">Teachers & Directors</a>
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
            <a
              href="#kellem-ai"
              onClick={() => {
                setKellemAiTab('quiz');
                setQuizViewMode('leaderboard');
                setMobileMenuOpen(false);
              }}
              className="block py-2 text-amber-900 font-bold bg-amber-50/60 px-3 rounded-lg"
            >
              🏆 Top Performers Quiz Ranking
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

      {/* Top Interactive Dashboard Bar */}
      <section className="bg-gradient-to-r from-[#072439] via-[#0b3829] to-[#0a4834] text-white py-4 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                👨‍🎓
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold block">Total Students</span>
                <span className="text-lg font-black tracking-tight">{students.length} Enrolled</span>
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
                <span className="text-xs text-amber-400 font-bold">⭐ {topQuizLeader?.quizPoints || 0} Quiz Pts</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-b from-[#082942] to-[#0c395c] text-white py-20 lg:py-28 border-b-8 border-emerald-500">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
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
              <a
                href="#about"
                className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black shadow-lg shadow-emerald-500/25 transition-all text-sm sm:text-base"
              >
                Explore Our School
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
        </div>
      </section>

      {/* Quick Highlights Grid */}
      <section className="relative -mt-8 max-w-7xl mx-auto px-4 sm:px-6 z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 flex items-center gap-3.5">
            <span className="text-2xl sm:text-3xl p-2 rounded-xl bg-emerald-50 text-emerald-700">🎓</span>
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
                🏛️
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
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
                  kellemAiTab === 'chat'
                    ? 'bg-white text-emerald-800 shadow-md scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bot className="w-4 h-4" /> Kellem AI Chat
              </button>
              <button
                onClick={() => setKellemAiTab('quiz')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all relative ${
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
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                        quizViewMode === 'quiz'
                          ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 shadow-md scale-105'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <Zap className="w-4 h-4" /> Practice Quiz
                    </button>
                    <button
                      onClick={() => setQuizViewMode('leaderboard')}
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
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
                              🌟 <strong>Streak locked!</strong> You completed today’s quiz and earned your daily bonus. Return tomorrow to reach <strong>Day {dailyStreak.currentStreak + 1}</strong>!
                            </span>
                          ) : (
                            <span>
                              ⚡ Complete at least 1 quiz today to advance to <strong>Day {dailyStreak.currentStreak + 1}</strong> and unlock <strong>+{25 + (dailyStreak.currentStreak + 1) * 10} Bonus Streak Points</strong>!
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Right: Daily Streak Calendar Tracker & Bonus Info */}
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
                          { id: 'entrance', label: '⚡ All-Round Entrance', icon: '🏆' },
                          { id: 'natural', label: '🔬 Natural Science', icon: '🧪' },
                          { id: 'social', label: '🌍 Social Science', icon: '📊' },
                          { id: 'english', label: '🗣️ English & Grammar', icon: '📖' }
                        ].map(sub => (
                          <button
                            key={sub.id}
                            onClick={() => restartQuiz(sub.id as any, selectedDifficulty)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
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
                          { id: 'all', label: 'All Levels', icon: '🌟', badge: 'Mix', reward: 'Mixed Pts' },
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
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeBtnClass}`}
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
                  {/* Competitive Incentive / Personal Standing Hero Banner */}
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
                              👑 <strong>Magnificent!</strong> You are holding <strong>1st Place</strong> at Kellem Secondary School with {currentStudentData.quizPoints} cumulative quiz points. Maintain your <strong>{dailyStreak.currentStreak}-day streak</strong> to keep your lead safe!
                            </span>
                          ) : (
                            <span>
                              🔥 You have <strong>{currentStudentData.quizPoints} Quiz Points</strong>. You need only <strong>{pointsToOvertake} more points</strong> to overtake #{currentUserRank - 1} <strong>{studentAhead?.name}</strong>! Complete today's daily quiz to earn both quiz points and streak bonuses!
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
                          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all hover:scale-105"
                        >
                          <Zap className="w-4 h-4 fill-slate-950" /> Take Quiz to Climb Ranks
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Filter Pills for Top Performers */}
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
                        { id: 'social', label: `🌍 Social Science` }
                      ].map(f => (
                        <button
                          key={f.id}
                          onClick={() => setPerformerFilter(f.id as any)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
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
                            ⭐ {filteredPerformers[1].quizPoints} pts
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
                            ⭐ {filteredPerformers[0].quizPoints} pts
                          </div>
                          {/* Pedestal */}
                          <div className="w-full h-36 sm:h-48 bg-gradient-to-b from-amber-300 to-amber-400 rounded-t-3xl mt-3 flex flex-col justify-center items-center text-amber-950 border-t-4 border-amber-500 shadow-lg">
                            <span className="text-3xl sm:text-5xl font-black">1</span>
                            <span className="text-[11px] font-black uppercase tracking-wider">Champion</span>
                            <span className="text-[10px] font-bold text-amber-900">{filteredPerformers[0].accuracy}% Acc • 🔥 {filteredPerformers[0].bestStreak} Streak</span>
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
                            ⭐ {filteredPerformers[2].quizPoints} pts
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
                                    ⭐ {st.quizPoints} pts
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Competitive Incentive / Scoring Rules */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <span className="font-black text-slate-900 block flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-orange-500" /> Daily Streak Bonuses
                      </span>
                      <p className="text-slate-600">Complete at least one quiz each consecutive day to earn progressive bonuses (+25 to +100+ pts).</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <span className="font-black text-slate-900 block flex items-center gap-1.5">
                        <Trophy className="w-4 h-4 text-amber-500" /> +20 Perfect Score Bonus
                      </span>
                      <p className="text-slate-600">Score 5 out of 5 to unlock the full round distinction bonus of +20 extra points.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <span className="font-black text-slate-900 block flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-500" /> +10 Pts Per Correct
                      </span>
                      <p className="text-slate-600">Every correct answer directly raises your cumulative Quiz Points ranking.</p>
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
                        Daily Streak: {dailyStreak.currentStreak} Days {dailyStreak.completedToday ? '✅' : '⚡'}
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
                        {selectedDifficulty === 'all' ? '🌟 All Levels' :
                         selectedDifficulty === 'beginner' ? '🟢 Beginner' :
                         selectedDifficulty === 'intermediate' ? '🟡 Intermediate' : '🔴 Advanced'}
                      </span>
                    </div>

                    <button
                      onClick={() => setQuizViewMode('leaderboard')}
                      className="text-amber-900 hover:text-amber-950 font-black flex items-center gap-1"
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
                              className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left flex items-center justify-between text-base font-semibold transition-all ${btnStyle}`}
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
                                ? '✅ Correct! Outstanding thinking!'
                                : '❌ Not quite, but here is the key concept:'}
                            </h5>
                          </div>
                          <p className="text-slate-700 text-sm leading-relaxed">
                            <strong>Explanation:</strong> {currentQuestion.explanation}
                          </p>

                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={handleNextQuestion}
                              className="px-6 py-3 rounded-xl bg-[#082942] hover:bg-[#0c395c] text-white font-extrabold text-sm flex items-center gap-2 shadow-md transition-all"
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
                    /* SCORE SUMMARY SCREEN WITH DAILY STREAK & TOP PERFORMER RECOGNITION */
                    <div className="p-6 sm:p-10 space-y-8 animate-in fade-in">
                      {/* Top Score Banner */}
                      <div className="text-center max-w-2xl mx-auto space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-orange-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center text-4xl shadow-xl shadow-orange-500/20 animate-pulse">
                          🔥
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

                        {/* Tier Badge */}
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
                            {scoreNotification || `⭐ Bonus points have been added to your cumulative Quiz Points ranking!`}
                          </p>
                        </div>

                        <button
                          onClick={() => setQuizViewMode('leaderboard')}
                          className="px-5 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 font-black text-xs shrink-0 shadow-md transition-all flex items-center gap-2"
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
                            {selectedDifficulty === 'all' && <span className="text-slate-800">🌟 All Levels</span>}
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

                      {/* Question Review Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <h4 className="text-lg font-black text-[#082942] flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-emerald-600" /> Question-by-Question Review
                          </h4>
                          <span className="text-xs text-slate-500">
                            {correctCount} correct • {currentQuizQuestions.length - correctCount} incorrect
                          </span>
                        </div>

                        <div className="space-y-3">
                          {quizHistory.map((item, idx) => (
                            <div
                              key={idx}
                              className={`p-5 rounded-2xl border-2 text-sm space-y-2 ${
                                item.isCorrect
                                  ? 'bg-emerald-50/40 border-emerald-200'
                                  : 'bg-red-50/40 border-red-200'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[11px] font-black uppercase text-slate-400">
                                      Question {idx + 1} • {item.question.category}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                      item.question.difficulty === 'beginner'
                                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                        : item.question.difficulty === 'intermediate'
                                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                        : 'bg-rose-100 text-rose-900 border border-rose-200'
                                    }`}>
                                      {item.question.difficulty}
                                    </span>
                                  </div>
                                  <div className="font-bold text-slate-900 text-base">{item.question.question}</div>
                                </div>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-black shrink-0 flex items-center gap-1 ${
                                    item.isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'
                                  }`}
                                >
                                  {item.isCorrect ? 'Correct ✅' : 'Incorrect ❌'}
                                </span>
                              </div>

                              <div className="pt-2 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                                <div>
                                  <span className="font-semibold text-slate-500 block">Your Answer:</span>
                                  <span className={item.isCorrect ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}>
                                    {String.fromCharCode(65 + item.selectedIndex)}) {item.question.options[item.selectedIndex]}
                                  </span>
                                </div>
                                {!item.isCorrect && (
                                  <div>
                                    <span className="font-semibold text-slate-500 block">Correct Answer:</span>
                                    <span className="text-emerald-700 font-bold">
                                      {String.fromCharCode(65 + item.question.correctIndex)}) {item.question.options[item.question.correctIndex]}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <p className="text-xs text-slate-600 pt-1 border-t border-slate-200/60 leading-relaxed">
                                <strong>Kellem AI Takeaway:</strong> {item.question.explanation}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-4 flex flex-wrap gap-3 justify-center sm:justify-end">
                        <button
                          onClick={() => restartQuiz()}
                          className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm flex items-center gap-2 transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" /> Retake {selectedDifficulty === 'all' ? 'Quiz' : selectedDifficulty}
                        </button>

                        {/* Progression button to higher challenge */}
                        {selectedDifficulty === 'beginner' && (
                          <button
                            onClick={() => restartQuiz(activeSubject, 'intermediate')}
                            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-md transition-all hover:scale-105"
                          >
                            <span>Try Intermediate Challenge</span> 🟡 <ArrowRight className="w-4 h-4" />
                          </button>
                        )}

                        {selectedDifficulty === 'intermediate' && (
                          <button
                            onClick={() => restartQuiz(activeSubject, 'advanced')}
                            className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400 text-white font-extrabold text-sm flex items-center gap-2 shadow-md transition-all hover:scale-105"
                          >
                            <span>Try Advanced Honors Challenge</span> 🔴 <ArrowRight className="w-4 h-4" />
                          </button>
                        )}

                        {selectedDifficulty === 'advanced' && (
                          <button
                            onClick={() => restartQuiz(activeSubject, 'all')}
                            className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center gap-2 shadow-md transition-all hover:scale-105"
                          >
                            <span>Try All 9 Questions Mix</span> 🌟 <ArrowRight className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={handleDiscussMistakesInChat}
                          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center gap-2 shadow-md transition-colors"
                        >
                          <Bot className="w-4 h-4" /> Discuss Mistakes with Kellem AI
                        </button>
                        <button
                          onClick={() => setQuizViewMode('leaderboard')}
                          className="px-5 py-3 rounded-xl bg-[#082942] hover:bg-[#0c395c] text-white font-extrabold text-sm flex items-center gap-2 shadow-md transition-colors"
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
                      { id: 'study', label: '📚 Study Help' },
                      { id: 'english', label: '🗣️ English Practice' },
                      { id: 'entrance', label: '🏆 Win Entrance' },
                      { id: 'skills', label: '🛠️ Learn Skills' },
                      { id: 'teacher', label: '👩‍🏫 Teacher Insights' }
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
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
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
                      className="w-full mt-1 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-black text-[11px] transition-colors"
                    >
                      {dailyStreak.completedToday ? 'Practice More' : 'Play Today’s Quiz'}
                    </button>
                  </div>

                  {/* Quick buttons */}
                  <div className="pt-1 space-y-2">
                    <button
                      onClick={() => {
                        setKellemAiTab('quiz');
                        setQuizViewMode('leaderboard');
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/10 transition-all"
                    >
                      <Trophy className="w-4 h-4 text-amber-400" /> View Top Performers
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-slate-400 leading-relaxed">
                  ℹ️ <strong>Kellem AI</strong> is an educational assistant designed for students and teachers of Kellem Secondary School.
                </div>
              </div>

              {/* Chat Conversation Area */}
              <div className="lg:col-span-3 flex flex-col h-[580px] bg-slate-50/50">
                {/* Chat Header */}
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

                {/* Messages Container */}
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

                {/* Suggested Prompts */}
                <div className="px-6 py-2 bg-white border-t border-slate-100 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setKellemAiTab('quiz');
                      setQuizViewMode('quiz');
                    }}
                    className="text-xs bg-orange-50 hover:bg-orange-100 border border-orange-300 text-orange-900 px-3 py-1 rounded-full transition-colors font-bold flex items-center gap-1"
                  >
                    🔥 Check Daily Streak ({dailyStreak.currentStreak}d)
                  </button>
                  <button
                    onClick={() => {
                      setKellemAiTab('quiz');
                      setQuizViewMode('leaderboard');
                    }}
                    className="text-xs bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1 rounded-full transition-colors font-bold flex items-center gap-1"
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
                      className="text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 text-slate-600 px-3 py-1 rounded-full transition-colors font-medium"
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
                    className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-colors"
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
              <h3 className="text-2xl font-black text-[#082942]">📅 Kellem AI Daily English Phrase</h3>
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
              className="px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center gap-2 shrink-0 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Volume2 className="w-5 h-5" /> {isSpeaking ? 'Playing Voice...' : "Hear today's phrase"}
            </button>
          </div>
        </div>
      </section>

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
              💡 Both streams receive rigorous entrance preparation, access to study guides, and <strong>Kellem AI</strong> practice modules.
            </div>
          </div>
        </div>
      </section>

      {/* Student Database & Overall School Leaderboard */}
      <section id="student-data" className="py-20 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="text-xs font-black tracking-widest text-emerald-600 uppercase mb-2">STUDENT DATABASE</div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#082942] tracking-tight">All Student Data & Rankings</h2>
              <p className="text-slate-600 mt-2 text-base">
                Track performance, cumulative academic points, quiz ratings, and celebrate top-performing students.
              </p>
            </div>
            <button
              onClick={() => setStudentModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all self-start md:self-auto"
            >
              <Users className="w-4 h-4" /> Open Student Directory Modal
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <span className="text-3xl block mb-1">👨‍🎓</span>
              <strong className="text-3xl font-black text-[#082942] block">{students.length}</strong>
              <small className="text-slate-500 font-bold uppercase text-xs">Total Registered Students</small>
            </div>
            <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500 shadow-md text-center">
              <span className="text-3xl block mb-1">🏆</span>
              <strong className="text-2xl font-black text-[#082942] block truncate">{topQuizLeader?.name}</strong>
              <small className="text-emerald-700 font-bold uppercase text-xs">#1 Top Quiz Champion</small>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <span className="text-3xl block mb-1">⭐</span>
              <strong className="text-3xl font-black text-amber-500 block">{topQuizLeader?.quizPoints || 0} pts</strong>
              <small className="text-slate-500 font-bold uppercase text-xs">Highest Quiz Points</small>
            </div>
          </div>

          {/* Student Table with Live Search */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search students by name or stream..."
                value={searchStudent}
                onChange={e => setSearchStudent(e.target.value)}
                className="bg-transparent border-0 outline-none text-sm w-full font-medium text-slate-800"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#082942] text-white text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6">Rank</th>
                    <th className="py-3.5 px-6">Student Name</th>
                    <th className="py-3.5 px-6">Class / Stream</th>
                    <th className="py-3.5 px-6">Quiz Points</th>
                    <th className="py-3.5 px-6">Academic Points</th>
                    <th className="py-3.5 px-6">Recognition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((s, idx) => (
                    <tr
                      key={s.name}
                      onClick={() => setSelectedStudent(s)}
                      className="hover:bg-emerald-50/50 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-6 font-bold text-slate-500">#{idx + 1}</td>
                      <td className="py-4 px-6 font-bold text-slate-900">{s.name}</td>
                      <td className="py-4 px-6 text-slate-600">{s.className}</td>
                      <td className="py-4 px-6 font-black text-amber-600">⭐ {s.quizPoints} pts</td>
                      <td className="py-4 px-6 font-black text-emerald-700">{s.points} pts</td>
                      <td className="py-4 px-6">
                        {idx === 0 ? (
                          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
                            🏆 Top Scholar
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                            Rank #{idx + 1}
                          </span>
                        )}
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
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setStudentModalOpen(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xl"
            >
              ✕
            </button>
            <div className="text-xs font-black tracking-widest text-emerald-600 uppercase mb-1">ALL STUDENTS</div>
            <h3 className="text-2xl font-black text-[#082942] mb-2">Student Directory & Performance</h3>
            <p className="text-sm text-slate-500 mb-6">Select a student name to see their stream, quiz points, and rank.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              {sortedStudents.map((s, i) => (
                <button
                  key={s.name}
                  onClick={() => setSelectedStudent(s)}
                  className={`p-3 rounded-xl border text-left flex justify-between items-center text-sm font-bold transition-all ${
                    selectedStudent?.name === s.name
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
                      : 'border-slate-200 hover:border-emerald-300 bg-slate-50'
                  }`}
                >
                  <span className="truncate">
                    {i === 0 ? '🏆 ' : ''}
                    {s.name}
                  </span>
                  <div className="text-right shrink-0 ml-2">
                    <span className="text-xs text-amber-700 font-extrabold block">⭐ {s.quizPoints} q-pts</span>
                  </div>
                </button>
              ))}
            </div>

            {selectedStudent && (
              <div className="p-5 rounded-2xl bg-emerald-50 border-l-4 border-emerald-600 space-y-1.5">
                <div className="text-lg font-black text-[#082942]">{selectedStudent.name}</div>
                <div className="text-sm text-slate-700">Stream: {selectedStudent.className}</div>
                <div className="text-sm text-amber-800 font-bold">Quiz Points: ⭐ {selectedStudent.quizPoints} pts • {selectedStudent.quizzesCompleted} Quizzes</div>
                <div className="text-sm text-emerald-800 font-bold">Accuracy: {selectedStudent.accuracy}% • Best Streak: 🔥 {selectedStudent.bestStreak}</div>
                <div className="text-xs text-slate-500 pt-1">
                  Status: {topQuizPerformers.findIndex(s => s.name === selectedStudent.name) === 0 ? '🏆 #1 Top Quiz Performer at Kellem Secondary School' : 'Enrolled Student'}
                </div>
              </div>
            )}
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
            <span className="text-4xl block mb-3">🌍</span>
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
              <span className="text-3xl mb-3 block">📚</span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Structured Study Plan</h3>
              <p className="text-slate-600 text-sm">Organize your revision schedule and focus deeply on core high-yield subjects.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-3xl mb-3 block">📝</span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Exam Practice</h3>
              <p className="text-slate-600 text-sm">Solve timed practice tests, evaluate mistakes, and reinforce weak areas.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-3xl mb-3 block">🏆</span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Build High Confidence</h3>
              <p className="text-slate-600 text-sm">Track your progress and mental preparedness to perform at your absolute best.</p>
            </div>
          </div>

          {/* Grade 12 Study Guides */}
          <h3 className="text-xl font-black text-[#082942] mb-6">Grade 12 Study Guides</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-3xl block mb-2">📘</span>
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
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Take Economics Quiz
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-3xl block mb-2">🌍</span>
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
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Take Geography Quiz
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-3xl block mb-2">⚛️</span>
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
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
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
              📲 Join English Club on Telegram <ExternalLink className="w-4 h-4" />
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
            <span className="text-3xl mb-3 block">🎤</span>
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

      {/* Student & Teacher Portal / Login */}
      <section id="student-login" className="py-20 bg-gradient-to-br from-[#072439] via-[#093d2e] to-[#082942] text-white">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 font-black text-2xl mx-auto flex items-center justify-center border border-emerald-400/30 mb-4">
              KS
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">Kellem Secondary School Portal</h2>
            <p className="text-slate-300 text-sm mt-1">Student & Teacher Authentication & Academic Points</p>
          </div>

          <div className="bg-[#14221d] p-6 sm:p-8 rounded-3xl border border-emerald-900/60 shadow-2xl">
            {currentUser ? (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-emerald-600 text-white text-3xl font-black flex items-center justify-center mx-auto shadow-lg">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-2xl font-black text-white">Welcome, {currentUser.name}!</h3>
                <p className="text-slate-300 text-sm">
                  {currentUser.role} • {currentUser.email} • {currentUser.className}
                </p>
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-bold text-sm">
                  ⭐ Academic Points Active • Ready for Kellem AI Quizzes
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-900/60 mb-6">
                  <button
                    onClick={() => {
                      setAuthTab('signin');
                      setAuthAlert(null);
                    }}
                    className={`py-2.5 rounded-lg text-sm font-bold transition-all ${
                      authTab === 'signin' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthTab('signup');
                      setAuthAlert(null);
                    }}
                    className={`py-2.5 rounded-lg text-sm font-bold transition-all ${
                      authTab === 'signup' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {authTab === 'signup' && (
                    <>
                      {/* Role selection */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setAuthRole('student')}
                          className={`p-3 rounded-xl border text-left flex items-center gap-2.5 text-xs font-bold transition-all ${
                            authRole === 'student'
                              ? 'border-emerald-500 bg-emerald-950/60 text-white'
                              : 'border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="text-lg">🎓</span> Student
                        </button>
                        <button
                          type="button"
                          onClick={() => setAuthRole('teacher')}
                          className={`p-3 rounded-xl border text-left flex items-center gap-2.5 text-xs font-bold transition-all ${
                            authRole === 'teacher'
                              ? 'border-emerald-500 bg-emerald-950/60 text-white'
                              : 'border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="text-lg">👩‍🏫</span> Teacher
                        </button>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={authName}
                          onChange={e => setAuthName(e.target.value)}
                          placeholder="e.g. Bilisuma Yadasa"
                          className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">Grade / Class</label>
                        <input
                          type="text"
                          value={authClass}
                          onChange={e => setAuthClass(e.target.value)}
                          placeholder="Grade 12 Natural Science"
                          className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={e => setAuthEmail(e.target.value)}
                      placeholder="name@kellemschool.edu"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={authPassword}
                      onChange={e => setAuthPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {authAlert && (
                    <div
                      className={`p-3 rounded-xl text-xs font-bold ${
                        authAlert.type === 'success'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-red-950 text-red-300 border border-red-500/30'
                      }`}
                    >
                      {authAlert.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all"
                  >
                    {authTab === 'signin' ? 'Sign in to Portal' : 'Create Student / Teacher Account'}
                  </button>
                </form>
              </>
            )}
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

      {/* Footer */}
      <footer className="bg-[#08243a] text-slate-300 pt-16 pb-28 sm:pb-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                KS
              </div>
              <h4 className="text-xl font-black text-white">Kellem Secondary School</h4>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              Mana Barumsaa Qellem Sad 2ffaa • Dambi Dollo, Oromia, Ethiopia. Empowered by <strong>Kellem AI</strong> with daily streaks, practice quizzes, and Top Performers progress tracking.
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
                    setKellemAiTab('quiz');
                    setQuizViewMode('leaderboard');
                    const el = document.getElementById('kellem-ai');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors font-bold text-left flex items-center gap-1"
                >
                  <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" /> Top Performers Leaderboard
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Programs</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#win-entrance" className="hover:text-emerald-400 transition-colors">Win Entrance Exam</a></li>
              <li><a href="#english-club" className="hover:text-emerald-400 transition-colors">English Club Telegram</a></li>
              <li><a href="#departments" className="hover:text-emerald-400 transition-colors">Natural & Social Science</a></li>
              <li><a href="#student-login" className="hover:text-emerald-400 transition-colors">Student & Teacher Portal</a></li>
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
            onClick={() => {
              setKellemAiTab('quiz');
              setQuizViewMode('quiz');
              const el = document.getElementById('kellem-ai');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-1 text-orange-600"
          >
            <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
            <span>{dailyStreak.currentStreak}d Streak</span>
          </button>
          <button
            onClick={() => {
              setKellemAiTab('quiz');
              setQuizViewMode('leaderboard');
              const el = document.getElementById('kellem-ai');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-1 text-amber-700"
          >
            <Trophy className="w-5 h-5 text-amber-600" />
            <span>Ranks</span>
          </button>
          <button
            onClick={() => {
              setKellemAiTab('chat');
              const el = document.getElementById('kellem-ai');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-1 text-emerald-700"
          >
            <Bot className="w-5 h-5 text-emerald-600" />
            <span>AI Chat</span>
          </button>
          <a href="#student-data" className="flex flex-col items-center gap-1 hover:text-emerald-700">
            <Users className="w-5 h-5" />
            <span>Students</span>
          </a>
          <a href="#student-login" className="flex flex-col items-center gap-1 hover:text-emerald-700">
            <UserCheck className="w-5 h-5" />
            <span>Portal</span>
          </a>
        </div>
      </div>
    </div>
  );
}
