import { ExamQuestion, ExamSubject } from '../types.ts';

export interface SubjectMeta {
  id: ExamSubject;
  label: string;
  icon: string;
  color: string;
  department: string;
  description: string;
}

export const EXAM_SUBJECTS: SubjectMeta[] = [
  {
    id: 'math',
    label: 'Mathematics',
    icon: '📐',
    color: 'from-blue-600 to-indigo-600',
    department: 'Mathematics & Computer Science',
    description: 'Calculus, Algebra, Analytical Geometry, Vectors, Matrices & Statistics'
  },
  {
    id: 'physics',
    label: 'Physics',
    icon: '⚡',
    color: 'from-amber-500 to-orange-600',
    department: 'Natural Science Department',
    description: 'Mechanics, Thermodynamics, Electromagnetism, Optics & Modern Physics'
  },
  {
    id: 'chemistry',
    label: 'Chemistry',
    icon: '🧪',
    color: 'from-emerald-500 to-teal-600',
    department: 'Natural Science Department',
    description: 'Chemical Bonding, Organic Synthesis, Stoichiometry, Equilibrium & Kinetics'
  },
  {
    id: 'biology',
    label: 'Biology',
    icon: '🧬',
    color: 'from-green-600 to-emerald-700',
    department: 'Natural Science Department',
    description: 'Cellular Genetics, Molecular Biology, Human Physiology & Ecology'
  },
  {
    id: 'ict',
    label: 'ICT',
    icon: '💻',
    color: 'from-cyan-500 to-blue-600',
    department: 'Information Technology',
    description: 'Computer Architecture, Networking, Database SQL, Cybersecurity & Coding'
  },
  {
    id: 'english',
    label: 'English',
    icon: '📖',
    color: 'from-purple-500 to-indigo-600',
    department: 'Languages & Literature',
    description: 'Reading Comprehension, Grammar Inversion, Vocabulary, Idioms & Discourse'
  },
  {
    id: 'construction',
    label: 'Construction',
    icon: '🏗️',
    color: 'from-yellow-600 to-amber-700',
    department: 'Technical & Vocational Department',
    description: 'Technical Drafting, Surveying, Structural Concrete, Building Materials & Safety'
  },
  {
    id: 'geography',
    label: 'Geography',
    icon: '🌍',
    color: 'from-emerald-600 to-green-700',
    department: 'Social Science Department',
    description: 'Physical & Economic Geography of Ethiopia, Horn of Africa, Climatology & GIS'
  },
  {
    id: 'economics',
    label: 'Economics',
    icon: '📈',
    color: 'from-rose-500 to-pink-600',
    department: 'Social Science Department',
    description: 'Microeconomics, Macroeconomics, Fiscal Policy, Inflation & Ethiopian Economy'
  }
];

// Curated authentic Ethiopian Secondary School question bank for each of the 9 subjects
const CURATED_QUESTIONS: Record<ExamSubject, Omit<ExamQuestion, 'id' | 'questionNumber'>[]> = {
  math: [
    {
      subject: 'math',
      subjectLabel: 'Mathematics',
      category: 'Calculus • Limits & Derivatives',
      difficulty: 'intermediate',
      question: 'Evaluate the limit: lim (x → 2) (x³ - 8) / (x² - 4).',
      options: ['2', '3', '0', 'Does not exist'],
      correctIndex: 1,
      explanation: 'Factor the numerator: x³ - 8 = (x - 2)(x² + 2x + 4). Factor the denominator: x² - 4 = (x - 2)(x + 2). Canceling (x - 2) gives (x² + 2x + 4) / (x + 2). Substituting x = 2 yields (4 + 4 + 4) / 4 = 12 / 4 = 3.',
      syllabusRef: 'Ethiopian Grade 12 Math Unit 2: Limits and Continuity',
      teachingNote: 'Check students who erroneously apply L’Hôpital’s rule without factoring or make sign errors in difference of cubes.'
    },
    {
      subject: 'math',
      subjectLabel: 'Mathematics',
      category: 'Vectors & Analytical Geometry',
      difficulty: 'intermediate',
      question: 'If vector u = 2i - 3j + 6k and vector v = 3i + 2j - k, find the dot product u · v.',
      options: ['-6', '0', '6', '12'],
      correctIndex: 0,
      explanation: 'u · v = (2)(3) + (-3)(2) + (6)(-1) = 6 - 6 - 6 = -6.',
      syllabusRef: 'Ethiopian Grade 11 Math Unit 6: Vectors',
      teachingNote: 'Emphasize scalar nature of dot product vs vector cross product.'
    },
    {
      subject: 'math',
      subjectLabel: 'Mathematics',
      category: 'Matrices & Determinants',
      difficulty: 'advanced',
      question: 'Find the determinant of the 2x2 matrix A = [[cos θ, -sin θ], [sin θ, cos θ]].',
      options: ['0', '1', 'cos² θ - sin² θ', '2'],
      correctIndex: 1,
      explanation: 'det(A) = (cos θ)(cos θ) - (-sin θ)(sin θ) = cos² θ + sin² θ = 1, characteristic of rotation matrices.',
      syllabusRef: 'Ethiopian Grade 11 Math Unit 4: Matrices',
      teachingNote: 'Point out this is the 2D orthogonal rotation determinant.'
    },
    {
      subject: 'math',
      subjectLabel: 'Mathematics',
      category: 'Integral Calculus',
      difficulty: 'advanced',
      question: 'Find the definite integral ∫ (from 0 to 1) (3x² + 2x + 1) dx.',
      options: ['2', '3', '1', '5'],
      correctIndex: 1,
      explanation: 'Antiderivative is F(x) = x³ + x² + x. Evaluating from 0 to 1: F(1) - F(0) = (1 + 1 + 1) - 0 = 3.',
      syllabusRef: 'Ethiopian Grade 12 Math Unit 4: Integration',
      teachingNote: 'A classic polynomial definite integral testing power rule of integration.'
    },
    {
      subject: 'math',
      subjectLabel: 'Mathematics',
      category: 'Probability & Statistics',
      difficulty: 'beginner',
      question: 'A fair die is tossed. What is the probability of rolling a prime number?',
      options: ['1/3', '1/2', '2/3', '5/6'],
      correctIndex: 1,
      explanation: 'Prime outcomes in {1, 2, 3, 4, 5, 6} are {2, 3, 5}. There are 3 prime numbers out of 6 possible outcomes, so P = 3/6 = 1/2.',
      syllabusRef: 'Ethiopian Grade 10 Math Unit 5: Statistics & Probability',
      teachingNote: 'Remind students that 1 is not a prime number.'
    },
    {
      subject: 'math',
      subjectLabel: 'Mathematics',
      category: 'Coordinate Geometry • Circles',
      difficulty: 'intermediate',
      question: 'What is the center and radius of the circle with equation x² + y² - 6x + 8y = 0?',
      options: ['Center (3, -4), Radius = 5', 'Center (-3, 4), Radius = 25', 'Center (6, -8), Radius = 10', 'Center (3, 4), Radius = 5'],
      correctIndex: 0,
      explanation: 'Complete the square: (x - 3)² - 9 + (y + 4)² - 16 = 0 ==> (x - 3)² + (y + 4)² = 25. Thus, center is (3, -4) and radius = √25 = 5.',
      syllabusRef: 'Ethiopian Grade 11 Math Unit 3: Coordinate Geometry',
      teachingNote: 'Common error is forgetting to take square root of 25 for radius.'
    },
    {
      subject: 'math',
      subjectLabel: 'Mathematics',
      category: 'Algebra • Sequences & Series',
      difficulty: 'intermediate',
      question: 'Find the 10th term of an arithmetic progression where the first term is 4 and common difference is 3.',
      options: ['31', '34', '30', '28'],
      correctIndex: 0,
      explanation: 'a_n = a_1 + (n - 1)d ==> a_10 = 4 + (9)(3) = 4 + 27 = 31.',
      syllabusRef: 'Ethiopian Grade 11 Math Unit 1: Sequences and Series',
      teachingNote: 'Remind students to multiply by (n - 1), not n.'
    },
    {
      subject: 'math',
      subjectLabel: 'Mathematics',
      category: 'Logarithms & Exponents',
      difficulty: 'beginner',
      question: 'Solve for x: log₂(x) + log₂(x - 2) = 3.',
      options: ['4', '-2', '4 and -2', '8'],
      correctIndex: 0,
      explanation: 'log₂[x(x - 2)] = 3 ==> x² - 2x = 2³ = 8 ==> x² - 2x - 8 = 0 ==> (x - 4)(x + 2) = 0. Since the argument of a logarithm must be positive, x = -2 is extraneous. Hence x = 4.',
      syllabusRef: 'Ethiopian Grade 10 Math Unit 2: Exponential and Logarithmic Functions',
      teachingNote: 'Critical question testing domain restrictions of logarithmic functions.'
    }
  ],

  physics: [
    {
      subject: 'physics',
      subjectLabel: 'Physics',
      category: 'Mechanics • Kinematics & Projectiles',
      difficulty: 'intermediate',
      question: 'A projectile is launched from ground level with speed 40 m/s at an angle of 30° above the horizontal. Taking g = 10 m/s², what is its maximum height?',
      options: ['20 m', '40 m', '80 m', '10 m'],
      correctIndex: 0,
      explanation: 'Vertical velocity v_y0 = 40 sin(30°) = 20 m/s. Maximum height H = v_y0² / (2g) = (20)² / (2 × 10) = 400 / 20 = 20 m.',
      syllabusRef: 'Ethiopian Grade 11 Physics Unit 2: Two-Dimensional Motion',
      teachingNote: 'Emphasize that horizontal velocity remains constant and vertical velocity is zero at peak.'
    },
    {
      subject: 'physics',
      subjectLabel: 'Physics',
      category: 'Thermodynamics • Heat Engines',
      difficulty: 'advanced',
      question: 'A Carnot engine operates between heat reservoirs at 600 K and 300 K. What is the maximum theoretical efficiency of this engine?',
      options: ['50%', '66.7%', '33.3%', '75%'],
      correctIndex: 0,
      explanation: 'Carnot efficiency η = 1 - (T_cold / T_hot) = 1 - (300 / 600) = 1 - 0.5 = 0.50 (50%).',
      syllabusRef: 'Ethiopian Grade 11 Physics Unit 8: Thermodynamics',
      teachingNote: 'Temperatures must be in Kelvin, not Celsius.'
    },
    {
      subject: 'physics',
      subjectLabel: 'Physics',
      category: 'Electromagnetism • Induction',
      difficulty: 'intermediate',
      question: 'According to Lenz’s Law, the direction of an induced current is such that:',
      options: [
        'It opposes the change in magnetic flux that produced it',
        'It reinforces the change in magnetic flux that produced it',
        'It is always perpendicular to the magnetic field lines',
        'It increases the magnetic dipole moment of the conductor'
      ],
      correctIndex: 0,
      explanation: 'Lenz’s law is a consequence of conservation of energy: an induced current always flows in such a direction that its magnetic effect opposes the change that created it.',
      syllabusRef: 'Ethiopian Grade 12 Physics Unit 3: Electromagnetic Induction',
      teachingNote: 'Connect directly to Faraday’s law with the negative sign: ε = -N(dΦ/dt).'
    },
    {
      subject: 'physics',
      subjectLabel: 'Physics',
      category: 'Waves & Optics • Snell’s Law',
      difficulty: 'beginner',
      question: 'Light passes from air (n = 1.0) into water (n = 1.33). What happens to its frequency, wavelength, and speed?',
      options: [
        'Frequency stays constant, wavelength decreases, speed decreases',
        'Frequency decreases, wavelength stays constant, speed decreases',
        'Frequency increases, wavelength increases, speed increases',
        'Frequency and speed stay constant, wavelength decreases'
      ],
      correctIndex: 0,
      explanation: 'Frequency depends only on the source and remains constant across media. Because speed v = c / n, speed decreases, and since v = f λ, wavelength λ = v / f also decreases.',
      syllabusRef: 'Ethiopian Grade 10 Physics Unit 4: Wave Motion and Light',
      teachingNote: 'Highlight that frequency is invariant when light refracts across interfaces.'
    },
    {
      subject: 'physics',
      subjectLabel: 'Physics',
      category: 'Modern Physics • Photoelectric Effect',
      difficulty: 'advanced',
      question: 'In the photoelectric effect experiment, increasing the frequency of the incident light above threshold increases which property of emitted electrons?',
      options: ['Maximum kinetic energy', 'Total number of electrons emitted per second', 'Electron rest mass', 'Work function of the metal'],
      correctIndex: 0,
      explanation: 'Einstein’s photoelectric equation states KE_max = hf - Φ. Increasing frequency f increases kinetic energy, whereas increasing light intensity increases the rate of emitted photoelectrons.',
      syllabusRef: 'Ethiopian Grade 12 Physics Unit 7: Atomic and Nuclear Physics',
      teachingNote: 'Essential distinction between frequency (energy per photon) vs intensity (number of photons).'
    },
    {
      subject: 'physics',
      subjectLabel: 'Physics',
      category: 'Mechanics • Circular Motion',
      difficulty: 'intermediate',
      question: 'A 2 kg mass moves in a horizontal circle of radius 0.5 m with a constant speed of 4 m/s. What centripetal force acts on the mass?',
      options: ['64 N', '32 N', '16 N', '8 N'],
      correctIndex: 0,
      explanation: 'F_c = m v² / r = (2 kg) × (4 m/s)² / (0.5 m) = 2 × 16 / 0.5 = 64 N.',
      syllabusRef: 'Ethiopian Grade 11 Physics Unit 3: Circular Motion',
      teachingNote: 'Check that students square the velocity.'
    }
  ],

  chemistry: [
    {
      subject: 'chemistry',
      subjectLabel: 'Chemistry',
      category: 'Chemical Bonding • Molecular Geometry',
      difficulty: 'intermediate',
      question: 'According to VSEPR theory, what is the molecular shape and bond angle of sulfur hexafluoride (SF₆)?',
      options: ['Octahedral, 90°', 'Trigonal bipyramidal, 120° and 90°', 'Tetrahedral, 109.5°', 'Square planar, 90°'],
      correctIndex: 0,
      explanation: 'SF₆ has 6 bonding pairs and 0 lone pairs on the central sulfur atom (sp³d² hybridization), creating an octahedral geometry with 90° F-S-F bond angles.',
      syllabusRef: 'Ethiopian Grade 11 Chemistry Unit 3: Chemical Bonding',
      teachingNote: 'Differentiate between electron pair geometry and molecular geometry.'
    },
    {
      subject: 'chemistry',
      subjectLabel: 'Chemistry',
      category: 'Organic Chemistry • Functional Groups',
      difficulty: 'beginner',
      question: 'Which functional group characterizes carboxylic acids?',
      options: ['-COOH', '-OH', '-CHO', '-COO-'],
      correctIndex: 0,
      explanation: 'Carboxylic acids contain the carboxyl group -COOH (-C(=O)OH). -OH is alcohol, -CHO is aldehyde, and -COO- is ester.',
      syllabusRef: 'Ethiopian Grade 10 Chemistry Unit 4: Organic Chemistry',
      teachingNote: 'Ensure students can recognize IUPAC naming conventions for carboxylic acids (-oic acid).'
    },
    {
      subject: 'chemistry',
      subjectLabel: 'Chemistry',
      category: 'Electrochemistry • Galvanic Cells',
      difficulty: 'advanced',
      question: 'Given the standard reduction potentials E°(Zn²⁺/Zn) = -0.76 V and E°(Cu²⁺/Cu) = +0.34 V, what is the standard cell potential (E°_cell) for the Daniell cell?',
      options: ['+1.10 V', '-1.10 V', '+0.42 V', '-0.42 V'],
      correctIndex: 0,
      explanation: 'E°_cell = E°_cathode - E°_anode = E°(Cu²⁺/Cu) - E°(Zn²⁺/Zn) = +0.34 V - (-0.76 V) = +1.10 V.',
      syllabusRef: 'Ethiopian Grade 12 Chemistry Unit 4: Electrochemistry',
      teachingNote: 'Cathode is copper (reduction) and anode is zinc (oxidation).'
    },
    {
      subject: 'chemistry',
      subjectLabel: 'Chemistry',
      category: 'Equilibrium & Le Chatelier’s Principle',
      difficulty: 'intermediate',
      question: 'For the exothermic reaction N₂(g) + 3H₂(g) ⇌ 2NH₃(g) (ΔH < 0), which condition shifts the equilibrium toward higher ammonia yield?',
      options: ['Increasing pressure and decreasing temperature', 'Decreasing pressure and increasing temperature', 'Adding a catalyst and increasing temperature', 'Removing hydrogen gas'],
      correctIndex: 0,
      explanation: '4 moles of gas on left vs 2 on right: increasing pressure shifts toward fewer gas molecules (forward). Since ΔH < 0 (exothermic), decreasing temperature shifts right to produce heat.',
      syllabusRef: 'Ethiopian Grade 11 Chemistry Unit 5: Chemical Equilibrium',
      teachingNote: 'Catalysts only increase reaction rates, not the equilibrium position.'
    },
    {
      subject: 'chemistry',
      subjectLabel: 'Chemistry',
      category: 'Stoichiometry & Gas Laws',
      difficulty: 'intermediate',
      question: 'What volume does 0.5 moles of an ideal gas occupy at standard temperature and pressure (STP)?',
      options: ['11.2 L', '22.4 L', '5.6 L', '44.8 L'],
      correctIndex: 0,
      explanation: 'At STP (0°C, 1 atm), 1 mole of any ideal gas occupies 22.4 liters. Therefore, 0.5 moles occupies 0.5 × 22.4 = 11.2 L.',
      syllabusRef: 'Ethiopian Grade 10 Chemistry Unit 2: Chemical Calculations',
      teachingNote: 'Reinforce Avogadro’s molar volume at STP.'
    }
  ],

  biology: [
    {
      subject: 'biology',
      subjectLabel: 'Biology',
      category: 'Genetics & Heredity • Mendelian Ratios',
      difficulty: 'intermediate',
      question: 'In a monohybrid cross between two heterozygous tall pea plants (Tt × Tt), what is the expected phenotypic ratio among offspring?',
      options: ['3 tall : 1 short', '1 tall : 2 intermediate : 1 short', '1 tall : 1 short', 'All tall'],
      correctIndex: 0,
      explanation: 'The genotypic ratio is 1 TT : 2 Tt : 1 tt. Because T is dominant over t, TT and Tt appear tall (3/4) and tt appears short (1/4), yielding 3 tall : 1 short.',
      syllabusRef: 'Ethiopian Grade 10 Biology Unit 3: Heredity',
      teachingNote: 'Distinguish between genotypic ratio (1:2:1) and phenotypic ratio (3:1).'
    },
    {
      subject: 'biology',
      subjectLabel: 'Biology',
      category: 'Cell Biology • Organelle Function',
      difficulty: 'beginner',
      question: 'Which organelle is responsible for cellular aerobic respiration and ATP generation in eukaryotic cells?',
      options: ['Mitochondrion', 'Ribosome', 'Golgi apparatus', 'Lysosome'],
      correctIndex: 0,
      explanation: 'Mitochondria are the powerhouses of eukaryotic cells where Krebs cycle and oxidative phosphorylation take place to produce ATP.',
      syllabusRef: 'Ethiopian Grade 9 Biology Unit 2: Cell Biology',
      teachingNote: 'Contrast with chloroplasts, which generate sugars via photosynthesis.'
    },
    {
      subject: 'biology',
      subjectLabel: 'Biology',
      category: 'Human Physiology • Circulatory System',
      difficulty: 'intermediate',
      question: 'Which chamber of the human heart pumps oxygenated blood into the systemic aorta under highest pressure?',
      options: ['Left ventricle', 'Right ventricle', 'Left atrium', 'Right atrium'],
      correctIndex: 0,
      explanation: 'The left ventricle has the thickest myocardium because it must generate enough hydraulic pressure to circulate oxygenated blood through the aorta to the entire body.',
      syllabusRef: 'Ethiopian Grade 11 Biology Unit 4: Transport and Exchange',
      teachingNote: 'Right ventricle pumps to pulmonary artery at lower pressure.'
    },
    {
      subject: 'biology',
      subjectLabel: 'Biology',
      category: 'Molecular Biology • DNA & RNA',
      difficulty: 'advanced',
      question: 'If a DNA coding strand has the sequence 5’-ATG CGT GAC-3’, what is the mRNA codon transcript?',
      options: ['5’-AUG CGU GAC-3’', '3’-UAC GCA CUG-5’', '5’-UAC GCA CUG-3’', '5’-AUG CGU CUG-3’'],
      correctIndex: 0,
      explanation: 'The mRNA transcript matches the DNA coding (sense) strand in sequence and 5’ to 3’ polarity, replacing thymine (T) with uracil (U).',
      syllabusRef: 'Ethiopian Grade 12 Biology Unit 2: Molecular Genetics',
      teachingNote: 'Ensure students do not confuse the coding strand with the template strand.'
    },
    {
      subject: 'biology',
      subjectLabel: 'Biology',
      category: 'Ecology • Trophic Levels',
      difficulty: 'beginner',
      question: 'In an ecological food chain, what proportion of chemical energy is typically transferred from one trophic level to the next?',
      options: ['Approximately 10%', 'Approximately 50%', 'Approximately 90%', '100%'],
      correctIndex: 0,
      explanation: 'Lindeman’s 10% law states that only around 10% of energy is converted into biomass at the next trophic level; the remaining 90% is dissipated as metabolic heat and respiration.',
      syllabusRef: 'Ethiopian Grade 9 Biology Unit 5: Ecology and Ecosystems',
      teachingNote: 'Explains why food chains rarely exceed 4 or 5 trophic levels.'
    }
  ],

  ict: [
    {
      subject: 'ict',
      subjectLabel: 'ICT',
      category: 'Computer Hardware • Logic & Memory',
      difficulty: 'beginner',
      question: 'Which component is considered the volatile primary memory of a computer system?',
      options: ['RAM (Random Access Memory)', 'ROM (Read Only Memory)', 'Hard Disk Drive', 'Solid State Drive'],
      correctIndex: 0,
      explanation: 'RAM loses all stored data when electrical power is switched off, making it volatile primary memory.',
      syllabusRef: 'Ethiopian Grade 9 ICT Unit 2: Computer Hardware Systems',
      teachingNote: 'Contrast volatile RAM with non-volatile ROM, SSD, and HDD.'
    },
    {
      subject: 'ict',
      subjectLabel: 'ICT',
      category: 'Networking & Internet Protocols',
      difficulty: 'intermediate',
      question: 'What is the primary role of DNS (Domain Name System) in computer networks?',
      options: [
        'Translating human-readable domain names into IP addresses',
        'Encrypting data packets transferred across the internet',
        'Assigning MAC addresses to network interface cards',
        'Filtering unauthorized ports via a stateful firewall'
      ],
      correctIndex: 0,
      explanation: 'DNS acts as the phonebook of the Internet, translating friendly domain names like www.kellem.edu.et into machine-routable IP addresses.',
      syllabusRef: 'Ethiopian Grade 11 ICT Unit 3: Computer Networks and the Internet',
      teachingNote: 'Help students visualize client-server query resolution.'
    },
    {
      subject: 'ict',
      subjectLabel: 'ICT',
      category: 'Database Management • SQL',
      difficulty: 'intermediate',
      question: 'Which SQL clause is used to filter records resulting from a GROUP BY aggregate function?',
      options: ['HAVING', 'WHERE', 'ORDER BY', 'LIMIT'],
      correctIndex: 0,
      explanation: 'WHERE filters rows before grouping occurs; HAVING filters grouped rows based on aggregate functions like COUNT(), SUM(), or AVG().',
      syllabusRef: 'Ethiopian Grade 12 ICT Unit 2: Database Systems',
      teachingNote: 'Classic examination trap: students often confuse WHERE with HAVING.'
    },
    {
      subject: 'ict',
      subjectLabel: 'ICT',
      category: 'Cybersecurity • Threat Mitigation',
      difficulty: 'beginner',
      question: 'A malicious email that deceives recipients into revealing their passwords by imitating a trusted institution is called:',
      options: ['Phishing', 'DDoS Attack', 'Trojan Horse', 'Spyware'],
      correctIndex: 0,
      explanation: 'Phishing is a social engineering attack where fraudulent communications trick users into revealing confidential credentials or financial information.',
      syllabusRef: 'Ethiopian Grade 10 ICT Unit 5: Information Safety and Ethics',
      teachingNote: 'Encourage student awareness of URL verification and 2FA.'
    },
    {
      subject: 'ict',
      subjectLabel: 'ICT',
      category: 'Programming & Web Development',
      difficulty: 'intermediate',
      question: 'In HTML5, which tag is correctly used to embed an external CSS stylesheet into a web document?',
      options: ['<link rel="stylesheet" href="style.css">', '<style src="style.css">', '<script href="style.css">', '<css link="style.css">'],
      correctIndex: 0,
      explanation: 'External CSS is linked within the <head> element using the <link> tag with attributes rel="stylesheet" and href="path".',
      syllabusRef: 'Ethiopian Grade 11 ICT Unit 4: Web Design and Development',
      teachingNote: 'Point out difference between internal <style> and external <link>.'
    }
  ],

  english: [
    {
      subject: 'english',
      subjectLabel: 'English',
      category: 'Grammar • Negative Inversion',
      difficulty: 'advanced',
      question: 'Complete the sentence: "Rarely _______ such enthusiasm among high school students."',
      options: ['have we witnessed', 'we have witnessed', 'we witnessed', 'did we witnessed'],
      correctIndex: 0,
      explanation: 'Negative and limiting adverbs at the start of a sentence require subject-auxiliary inversion: Adverb + Auxiliary (have) + Subject (we) + Past Participle (witnessed).',
      syllabusRef: 'Ethiopian Grade 12 English Unit 4: Advanced Sentence Structures',
      teachingNote: 'Students frequently forget inversion after seldom, rarely, hardly, scarcely.'
    },
    {
      subject: 'english',
      subjectLabel: 'English',
      category: 'Conditionals • Third Conditional',
      difficulty: 'intermediate',
      question: 'Choose the correct form: "If Tollera _______ harder for the university entrance exam, he would have secured a medical placement."',
      options: ['had studied', 'studied', 'would study', 'has studied'],
      correctIndex: 0,
      explanation: 'Third conditional (unreal past) structure: If + past perfect (had studied), ... would have + past participle.',
      syllabusRef: 'Ethiopian Grade 11 English Unit 6: Expressing Conditionals',
      teachingNote: 'Third conditional deals with hypothetical situations in the past.'
    },
    {
      subject: 'english',
      subjectLabel: 'English',
      category: 'Vocabulary • Academic Register',
      difficulty: 'intermediate',
      question: 'What is the closest antonym to the word "METICULOUS"?',
      options: ['Careless', 'Diligent', 'Scrupulous', 'Methodical'],
      correctIndex: 0,
      explanation: 'Meticulous means showing great attention to detail and being very careful. Its direct opposite is careless or negligent.',
      syllabusRef: 'Ethiopian Grade 11 English Unit 2: Academic Vocabulary',
      teachingNote: 'Ensure students read carefully whether question asks for synonym or antonym.'
    },
    {
      subject: 'english',
      subjectLabel: 'English',
      category: 'Phrasal Verbs & Idiomatic Expressions',
      difficulty: 'beginner',
      question: 'In academic discourse, what does the phrasal verb "carry out" mean?',
      options: ['Execute or perform', 'Remove or dispose', 'Postpone to later', 'Propose a theory'],
      correctIndex: 0,
      explanation: '"To carry out an experiment or investigation" means to conduct, execute, or perform it.',
      syllabusRef: 'Ethiopian Grade 10 English Unit 3: Phrasal Verbs',
      teachingNote: 'Common in scientific writing questions on the national examination.'
    },
    {
      subject: 'english',
      subjectLabel: 'English',
      category: 'Discourse Markers & Cohesion',
      difficulty: 'intermediate',
      question: 'Which transition word indicates a contrast between two ideas?',
      options: ['Nevertheless', 'Furthermore', 'Consequently', 'Similarly'],
      correctIndex: 0,
      explanation: '"Nevertheless" introduces a concession or contrast. "Furthermore" adds information, "Consequently" shows cause/effect, and "Similarly" shows comparison.',
      syllabusRef: 'Ethiopian Grade 11 English Unit 5: Paragraph Cohesion',
      teachingNote: 'Essential for reading comprehension and essay construction.'
    }
  ],

  construction: [
    {
      subject: 'construction',
      subjectLabel: 'Construction',
      category: 'Technical Drafting & Scales',
      difficulty: 'intermediate',
      question: 'In architectural technical drawing, what does a drawing scale of 1:50 represent?',
      options: [
        '1 cm on paper represents 50 cm (0.5 m) in actual building dimensions',
        '1 cm on paper represents 50 meters in actual building dimensions',
        '50 cm on paper represents 1 cm in actual building dimensions',
        'The drawing is enlarged 50 times the original object'
      ],
      correctIndex: 0,
      explanation: 'Scale 1:50 means 1 unit of measurement on the drawing sheet corresponds to 50 equal units on the actual building structure.',
      syllabusRef: 'Ethiopian Technical & Vocational Construction Unit 1: Technical Drawing & Orthographic Projection',
      teachingNote: 'Standard architectural scale used in Ethiopian building floor plans and elevations.'
    },
    {
      subject: 'construction',
      subjectLabel: 'Construction',
      category: 'Building Materials • Concrete Technology',
      difficulty: 'beginner',
      question: 'What are the four primary constituent ingredients of standard structural concrete?',
      options: [
        'Ordinary Portland cement, sand (fine aggregate), gravel (coarse aggregate), and water',
        'Cement, lime, clay, and bitumen',
        'Sand, plaster of Paris, gypsum, and water',
        'Crushed stone, asphalt, resin, and water'
      ],
      correctIndex: 0,
      explanation: 'Concrete is formed by hydrating cement with water, binding fine aggregate (sand) and coarse aggregate (crushed gravel) into a monolithic stone-like mass.',
      syllabusRef: 'Ethiopian Technical Stream Construction Unit 3: Concrete Technology',
      teachingNote: 'Remind students of the role of the water-cement ratio in determining compressive strength.'
    },
    {
      subject: 'construction',
      subjectLabel: 'Construction',
      category: 'Surveying • Leveling Instruments',
      difficulty: 'intermediate',
      question: 'Which surveying tool is primarily utilized by site engineers to determine elevation differences between benchmarks on a construction plot?',
      options: ['Optical Dump Level / Automatic Level', 'Prismatic Compass', 'Gunter’s Chain', 'Plumb Bob'],
      correctIndex: 0,
      explanation: 'An automatic optical level with a leveling staff is the standard site equipment for establishing accurate horizontal sightlines and measuring differential elevation.',
      syllabusRef: 'Ethiopian Construction Stream Unit 2: Plane Surveying and Leveling',
      teachingNote: 'A plumb bob verifies verticality; an optical level measures horizontal heights.'
    },
    {
      subject: 'construction',
      subjectLabel: 'Construction',
      category: 'Structural Elements • Foundations',
      difficulty: 'intermediate',
      question: 'Which type of foundation is most suitable for supporting individual columns carrying heavy structural loads on uniform stable soil?',
      options: ['Isolated pad footing', 'Raft (Mat) foundation', 'Deep friction pile', 'Stepped strip foundation'],
      correctIndex: 0,
      explanation: 'Isolated pad footings are reinforced concrete square/rectangular slabs placed beneath individual columns to spread point loads evenly across the subsoil.',
      syllabusRef: 'Ethiopian Construction Curriculum Unit 4: Substructure and Foundations',
      teachingNote: 'Raft foundations are chosen when soil bearing capacity is low and loads are widespread.'
    },
    {
      subject: 'construction',
      subjectLabel: 'Construction',
      category: 'Site Safety & Environmental Standards',
      difficulty: 'beginner',
      question: 'What is the mandatory Personal Protective Equipment (PPE) item required to prevent traumatic head injury on active construction sites?',
      options: ['Certified Hard Hat / Safety Helmet', 'High-visibility fluorescent vest', 'Steel-toe safety boots', 'Welding goggles'],
      correctIndex: 0,
      explanation: 'Safety helmets/hard hats protect workers from falling debris, suspended equipment, and impacts with overhead structural elements.',
      syllabusRef: 'Ethiopian Occupational Health & Safety in Construction',
      teachingNote: 'Highlight basic OSHA and Ethiopian Ministry of Urban Development standards.'
    }
  ],

  geography: [
    {
      subject: 'geography',
      subjectLabel: 'Geography',
      category: 'Physical Geography • Horn of Africa',
      difficulty: 'intermediate',
      question: 'Which physiographic region of Ethiopia divides the northwestern and southeastern highlands?',
      options: ['The Great East African Rift Valley', 'The Danakil Depression', 'The Western Lowlands', 'The Ogaden Basin'],
      correctIndex: 0,
      explanation: 'The Ethiopian Rift Valley runs diagonally from northeast to southwest, physically bisecting the country into the Northwestern and Southeastern highlands and plateaus.',
      syllabusRef: 'Ethiopian Grade 12 Geography Unit 2: The Physical Geography of Ethiopia',
      teachingNote: 'Key entrance exam topic examining tectonic rifting and geomorphology.'
    },
    {
      subject: 'geography',
      subjectLabel: 'Geography',
      category: 'Drainage Systems of Ethiopia',
      difficulty: 'beginner',
      question: 'Which Ethiopian river basin carries the largest annual volume of water and flows west toward the Nile basin?',
      options: ['Abay (Blue Nile)', 'Awash', 'Wabe Shebelle', 'Genale-Dawa'],
      correctIndex: 0,
      explanation: 'The Abay (Blue Nile) basin originating from Lake Tana discharges the largest volume of surface runoff in Ethiopia, contributing over 60% of the main Nile flow.',
      syllabusRef: 'Ethiopian Grade 12 Geography Unit 3: Drainage Systems of Ethiopia',
      teachingNote: 'Awash is an inland drainage river, whereas Abay is in the Western drainage basin.'
    },
    {
      subject: 'geography',
      subjectLabel: 'Geography',
      category: 'Climatology • Agro-ecological Zones',
      difficulty: 'intermediate',
      question: 'In traditional Ethiopian agro-climatic zone classification, what is the zone located between 1,500 and 2,300 meters above sea level called?',
      options: ['Woina Dega (Sub-tropical)', 'Kolla (Warm/Tropical)', 'Dega (Cool/Temperate)', 'Bereha (Hot Arid)'],
      correctIndex: 0,
      explanation: 'Woina Dega spans 1,500m to 2,300m elevation with moderate temperatures, supporting major settlement and cultivation of teff, maize, and coffee in Ethiopia.',
      syllabusRef: 'Ethiopian Grade 11 Geography Unit 4: Climate of Ethiopia',
      teachingNote: 'Kolla is below 1,500m; Dega is 2,300m to 3,200m; Kur/Wurch is above 3,200m.'
    },
    {
      subject: 'geography',
      subjectLabel: 'Geography',
      category: 'Cartography & Map Reading',
      difficulty: 'intermediate',
      question: 'On a topographic contour map, contour lines that are spaced closely together indicate:',
      options: ['A steep slope', 'A gentle or flat terrain', 'A river valley basin', 'A depression with water'],
      correctIndex: 0,
      explanation: 'Close contour lines represent a rapid change in elevation over a short horizontal distance, which signifies a steep terrain or cliff.',
      syllabusRef: 'Ethiopian Grade 10 Geography Unit 1: Map Reading and Interpretation',
      teachingNote: 'Wider contour lines indicate gentle or flat slopes.'
    },
    {
      subject: 'geography',
      subjectLabel: 'Geography',
      category: 'Population & Economic Geography',
      difficulty: 'beginner',
      question: 'What is the dominant economic activity employing the majority of the working population in Ethiopia?',
      options: ['Subsistence and commercial agriculture', 'Manufacturing and heavy industries', 'Financial banking services', 'Mining and petroleum extraction'],
      correctIndex: 0,
      explanation: 'Agriculture remains the backbone of the Ethiopian economy, employing over 65% of the labor force and providing primary export commodities like coffee and oilseeds.',
      syllabusRef: 'Ethiopian Grade 11 Geography Unit 6: Economic Activities in Ethiopia',
      teachingNote: 'Contrast with services sector contribution to GDP.'
    }
  ],

  economics: [
    {
      subject: 'economics',
      subjectLabel: 'Economics',
      category: 'Microeconomics • Elasticity of Demand',
      difficulty: 'intermediate',
      question: 'If a 10% decrease in the price of teff leads to a 25% increase in quantity demanded, what is the price elasticity of demand (|Ed|)?',
      options: ['2.5 (Elastic)', '0.4 (Inelastic)', '1.0 (Unitary Elastic)', '25.0 (Perfect Elastic)'],
      correctIndex: 0,
      explanation: '|Ed| = % change in quantity demanded / % change in price = 25% / 10% = 2.5. Because |Ed| > 1, demand is price elastic.',
      syllabusRef: 'Ethiopian Grade 11 Economics Unit 2: Theory of Demand and Supply',
      teachingNote: 'Always evaluate magnitude (absolute value) for classifying elasticity.'
    },
    {
      subject: 'economics',
      subjectLabel: 'Economics',
      category: 'Fundamental Economic Concepts',
      difficulty: 'beginner',
      question: 'The value of the next best alternative foregone when making a choice is formally defined as:',
      options: ['Opportunity Cost', 'Sunk Cost', 'Marginal Cost', 'Variable Cost'],
      correctIndex: 0,
      explanation: 'Opportunity cost reflects the fundamental economic problem of scarcity: choosing one opportunity implies forfeiting the benefits of the best alternative.',
      syllabusRef: 'Ethiopian Grade 10 Economics Unit 1: Introduction to Economics',
      teachingNote: 'Central concept in production possibilities frontier (PPF) analysis.'
    },
    {
      subject: 'economics',
      subjectLabel: 'Economics',
      category: 'Macroeconomics • Inflation & Monetary Policy',
      difficulty: 'intermediate',
      question: 'Which monetary policy action by the National Bank of Ethiopia would help reduce demand-pull inflation in the economy?',
      options: [
        'Increasing the reserve requirement and raising the policy interest rate',
        'Decreasing reserve requirement and printing currency',
        'Lowering commercial bank interest rates to stimulate borrowing',
        'Increasing government deficit spending'
      ],
      correctIndex: 0,
      explanation: 'Contractionary monetary policy raises interest rates and reserve requirements to tighten the money supply, curb excess borrowing, and reduce aggregate demand.',
      syllabusRef: 'Ethiopian Grade 12 Economics Unit 3: Monetary Policy and Banking',
      teachingNote: 'Contrast contractionary policy (to fight inflation) with expansionary policy (to stimulate growth).'
    },
    {
      subject: 'economics',
      subjectLabel: 'Economics',
      category: 'National Income Accounting • GDP',
      difficulty: 'intermediate',
      question: 'Gross Domestic Product (GDP) calculated by the expenditure approach is expressed by which formula?',
      options: ['GDP = C + I + G + (X - M)', 'GDP = C + S + T', 'GDP = Rent + Wages + Interest + Profit', 'GDP = Exports - Imports'],
      correctIndex: 0,
      explanation: 'Under the expenditure method, GDP is the sum of Consumption (C), Investment (I), Government purchases (G), and Net Exports (X - M).',
      syllabusRef: 'Ethiopian Grade 12 Economics Unit 2: National Income Accounting',
      teachingNote: 'Remind students that imports (M) are subtracted because they represent foreign output.'
    },
    {
      subject: 'economics',
      subjectLabel: 'Economics',
      category: 'Market Structures • Perfect Competition vs Monopoly',
      difficulty: 'advanced',
      question: 'Under perfect competition in the long run, individual firms operate where price (P) equals:',
      options: ['Marginal Cost (MC) and Minimum Average Total Cost (ATC)', 'Marginal Revenue with economic super-profits', 'Average Variable Cost with monopoly rents', 'Maximum Total Revenue regardless of cost'],
      correctIndex: 0,
      explanation: 'In long-run competitive equilibrium, free entry and exit drive economic profits to zero, ensuring P = MR = MC = min ATC (both allocative and productive efficiency).',
      syllabusRef: 'Ethiopian Grade 11 Economics Unit 4: Market Structures',
      teachingNote: 'Highlight why perfect competition achieves productive efficiency whereas monopoly does not.'
    }
  ],

  composite: []
};

// Procedural question template generators to synthesize questions dynamically up to 100 questions per subject!
function generateProceduralQuestion(
  subject: ExamSubject,
  index: number
): Omit<ExamQuestion, 'id' | 'questionNumber'> {
  const meta = EXAM_SUBJECTS.find(s => s.id === subject) || EXAM_SUBJECTS[0];

  switch (subject) {
    case 'math': {
      const a = (index * 3 + 2) % 11 + 2;
      const b = (index * 5 + 4) % 13 + 3;
      const c = a * b;
      const type = index % 5;

      if (type === 0) {
        // Quadratic equation
        const r1 = (index % 6) + 1;
        const r2 = ((index + 2) % 7) + 2;
        const sum = r1 + r2;
        const prod = r1 * r2;
        return {
          subject: 'math',
          subjectLabel: meta.label,
          category: 'Algebra • Quadratic Equations',
          difficulty: 'intermediate',
          question: `Find the positive solution set of the quadratic equation: x² - ${sum}x + ${prod} = 0.`,
          options: [`{${r1}, ${r2}}`, `{${r1 + 1}, ${r2 - 1}}`, `{${r1 * 2}, ${r2}}`, `{${r1 - 1}, ${r2 + 2}}`],
          correctIndex: 0,
          explanation: `Factoring x² - ${sum}x + ${prod} = (x - ${r1})(x - ${r2}) = 0 yields x = ${r1} or x = ${r2}.`,
          syllabusRef: 'Ethiopian Grade 10 Math Unit 2',
          teachingNote: 'Check factoring and sign consistency.'
        };
      } else if (type === 1) {
        // Linear functions & slope
        const m = (index % 4) + 2;
        const x1 = index % 5 + 1;
        const y1 = m * x1 + 3;
        return {
          subject: 'math',
          subjectLabel: meta.label,
          category: 'Analytical Geometry • Slope & Lines',
          difficulty: 'beginner',
          question: `What is the equation of a line passing through (${x1}, ${y1}) with slope m = ${m}?`,
          options: [
            `y = ${m}x + 3`,
            `y = ${m}x - 3`,
            `y = ${m + 1}x + 2`,
            `y = ${m}x + ${y1}`
          ],
          correctIndex: 0,
          explanation: `Using point-slope form: y - ${y1} = ${m}(x - ${x1}) ==> y = ${m}x - ${m * x1} + ${y1} = ${m}x + 3.`,
          syllabusRef: 'Ethiopian Grade 11 Math Unit 3',
          teachingNote: 'Standard point-slope to slope-intercept conversion.'
        };
      } else if (type === 2) {
        // Derivative of polynomial
        const n = (index % 3) + 3;
        const coeff = (index % 5) + 2;
        const dCoeff = coeff * n;
        return {
          subject: 'math',
          subjectLabel: meta.label,
          category: 'Calculus • Power Rule Differentiation',
          difficulty: 'intermediate',
          question: `If f(x) = ${coeff}x^${n} + ${(index % 4) + 1}x, what is the first derivative f'(x)?`,
          options: [
            `${dCoeff}x^${n - 1} + ${(index % 4) + 1}`,
            `${coeff}x^${n - 1} + ${(index % 4) + 1}`,
            `${dCoeff}x^${n}`,
            `${dCoeff * 2}x^${n - 1} + 1`
          ],
          correctIndex: 0,
          explanation: `By the power rule: d/dx(c·xⁿ) = n·c·xⁿ⁻¹. For ${coeff}x^${n}, the derivative is ${dCoeff}x^${n - 1}, plus ${(index % 4) + 1}.`,
          syllabusRef: 'Ethiopian Grade 12 Math Unit 3',
          teachingNote: 'Remind students that derivative of a constant times x is the constant.'
        };
      } else if (type === 3) {
        // Trigonometric identity
        return {
          subject: 'math',
          subjectLabel: meta.label,
          category: 'Trigonometry • Fundamental Identities',
          difficulty: 'intermediate',
          question: `Simplify the trigonometric expression: (1 - sin² θ) / cos θ for cos θ ≠ 0.`,
          options: ['cos θ', 'sin θ', 'tan θ', 'sec θ'],
          correctIndex: 0,
          explanation: `Since sin² θ + cos² θ = 1, we have 1 - sin² θ = cos² θ. Therefore, (cos² θ) / (cos θ) = cos θ.`,
          syllabusRef: 'Ethiopian Grade 11 Math Unit 5',
          teachingNote: 'Pythagorean trigonometric identity simplification.'
        };
      } else {
        // Statistics mean
        const v1 = 10 + (index % 5);
        const v2 = 14 + (index % 4);
        const v3 = 18 + (index % 6);
        const sumVal = v1 + v2 + v3;
        const mean = Math.round((sumVal / 3) * 10) / 10;
        return {
          subject: 'math',
          subjectLabel: meta.label,
          category: 'Statistics • Measures of Central Tendency',
          difficulty: 'beginner',
          question: `Calculate the arithmetic mean of the dataset: {${v1}, ${v2}, ${v3}}.`,
          options: [`${mean}`, `${mean + 2}`, `${mean - 1.5}`, `${mean + 3.2}`],
          correctIndex: 0,
          explanation: `Mean = Sum / N = (${v1} + ${v2} + ${v3}) / 3 = ${sumVal} / 3 ≈ ${mean}.`,
          syllabusRef: 'Ethiopian Grade 9 Math Unit 6',
          teachingNote: 'Fundamental measure of central tendency.'
        };
      }
    }

    case 'physics': {
      const type = index % 5;
      if (type === 0) {
        const m = (index % 6) + 2;
        const a = (index % 4) + 3;
        const force = m * a;
        return {
          subject: 'physics',
          subjectLabel: meta.label,
          category: 'Newton’s Laws of Motion',
          difficulty: 'beginner',
          question: `A net force acts on a ${m} kg mass producing an acceleration of ${a} m/s². What is the magnitude of this force?`,
          options: [`${force} N`, `${force + 5} N`, `${force - 3} N`, `${Math.round(m / a)} N`],
          correctIndex: 0,
          explanation: `According to Newton’s second law: F_net = m · a = ${m} kg × ${a} m/s² = ${force} N.`,
          syllabusRef: 'Ethiopian Grade 9 Physics Unit 3',
          teachingNote: 'Direct application of F = ma in SI units.'
        };
      } else if (type === 1) {
        const r1 = (index % 4) + 2;
        const r2 = (index % 6) + 4;
        const rTotal = r1 + r2;
        return {
          subject: 'physics',
          subjectLabel: meta.label,
          category: 'Current Electricity • Resistors in Series',
          difficulty: 'beginner',
          question: `Two resistors of resistance ${r1} Ω and ${r2} Ω are connected in series. What is the equivalent resistance?`,
          options: [`${rTotal} Ω`, `${(r1 * r2) / rTotal} Ω`, `${Math.abs(r1 - r2)} Ω`, `${rTotal * 2} Ω`],
          correctIndex: 0,
          explanation: `For resistors in series, R_eq = R1 + R2 = ${r1} + ${r2} = ${rTotal} Ω.`,
          syllabusRef: 'Ethiopian Grade 10 Physics Unit 5',
          teachingNote: 'Contrast series addition with parallel reciprocal addition.'
        };
      } else if (type === 2) {
        const v = (index % 5 + 1) * 10;
        const f = 50;
        const wavelength = v / f;
        return {
          subject: 'physics',
          subjectLabel: meta.label,
          category: 'Wave Mechanics • Wave Equation',
          difficulty: 'intermediate',
          question: `A periodic wave travels with speed ${v} m/s and frequency ${f} Hz. Calculate its wavelength.`,
          options: [`${wavelength} m`, `${v * f} m`, `${wavelength * 2} m`, `${wavelength / 2} m`],
          correctIndex: 0,
          explanation: `Using the wave relationship v = f · λ ==> λ = v / f = ${v} / ${f} = ${wavelength} m.`,
          syllabusRef: 'Ethiopian Grade 11 Physics Unit 6',
          teachingNote: 'Fundamental relationship connecting speed, frequency, and wavelength.'
        };
      } else if (type === 3) {
        const mass = (index % 4) + 1;
        const h = (index % 5) + 5;
        const g = 10;
        const pe = mass * g * h;
        return {
          subject: 'physics',
          subjectLabel: meta.label,
          category: 'Work, Energy & Power',
          difficulty: 'beginner',
          question: `How much gravitational potential energy is gained when a ${mass} kg block is lifted vertically by ${h} meters? (g = 10 m/s²)`,
          options: [`${pe} J`, `${pe / 2} J`, `${pe * 2} J`, `${mass * h} J`],
          correctIndex: 0,
          explanation: `PE = m · g · h = ${mass} kg × 10 m/s² × ${h} m = ${pe} Joules.`,
          syllabusRef: 'Ethiopian Grade 10 Physics Unit 3',
          teachingNote: 'Check energy units in Joules (kg·m²/s²).'
        };
      } else {
        return {
          subject: 'physics',
          subjectLabel: meta.label,
          category: 'Electromagnetism • Magnetic Force',
          difficulty: 'advanced',
          question: `A charge q moving with velocity v perpendicular to magnetic field B experiences a magnetic Lorentz force given by:`,
          options: ['F = q v B', 'F = q E + v B', 'F = q / (v B)', 'F = m v² / B'],
          correctIndex: 0,
          explanation: `When velocity and magnetic field are perpendicular (θ = 90°), F = q · v · B · sin(90°) = q v B.`,
          syllabusRef: 'Ethiopian Grade 12 Physics Unit 4',
          teachingNote: 'Direction determined by the right-hand rule.'
        };
      }
    }

    case 'chemistry': {
      const type = index % 5;
      if (type === 0) {
        const ph = (index % 6) + 1;
        return {
          subject: 'chemistry',
          subjectLabel: meta.label,
          category: 'Acids, Bases & pH Calculations',
          difficulty: 'beginner',
          question: `An aqueous solution has a pH of ${ph}. How is this solution categorized?`,
          options: ['Acidic', 'Basic (Alkaline)', 'Neutral', 'Insoluble'],
          correctIndex: 0,
          explanation: `Solutions with pH < 7 are acidic, pH = 7 is neutral, and pH > 7 are basic. Since pH = ${ph} (< 7), the solution is acidic.`,
          syllabusRef: 'Ethiopian Grade 10 Chemistry Unit 3',
          teachingNote: 'Reinforce the logarithmic nature of pH scale.'
        };
      } else if (type === 1) {
        const alkaneN = (index % 5) + 2;
        const hCount = 2 * alkaneN + 2;
        const names = ['ethane', 'propane', 'butane', 'pentane', 'hexane', 'heptane'];
        const name = names[alkaneN - 2] || 'alkane';
        return {
          subject: 'chemistry',
          subjectLabel: meta.label,
          category: 'Organic Chemistry • Hydrocarbons',
          difficulty: 'intermediate',
          question: `What is the chemical formula for the saturated aliphatic hydrocarbon ${name} (C${alkaneN})?`,
          options: [`C${alkaneN}H${hCount}`, `C${alkaneN}H${2 * alkaneN}`, `C${alkaneN}H${2 * alkaneN - 2}`, `C${alkaneN}H${alkaneN}`],
          correctIndex: 0,
          explanation: `Alkanes follow the general formula CₙH₂ₙ₊₂. For n = ${alkaneN}, H = 2(${alkaneN}) + 2 = ${hCount}.`,
          syllabusRef: 'Ethiopian Grade 11 Chemistry Unit 6',
          teachingNote: 'Alkanes are saturated, alkenes CnH2n, alkynes CnH2n-2.'
        };
      } else if (type === 2) {
        return {
          subject: 'chemistry',
          subjectLabel: meta.label,
          category: 'Periodic Trends • Ionization Energy',
          difficulty: 'intermediate',
          question: `Across a period from left to right in the modern Periodic Table, first ionization energy generally:`,
          options: [
            'Increases due to increasing effective nuclear charge and smaller atomic radius',
            'Decreases due to increasing electron shielding',
            'Remains constant across the period',
            'Decreases then suddenly increases at group 14'
          ],
          correctIndex: 0,
          explanation: 'As nuclear charge increases across a period with valence electrons in the same shell, atomic radius contracts and electrostatic attraction on valence electrons strengthens, raising ionization energy.',
          syllabusRef: 'Ethiopian Grade 11 Chemistry Unit 2',
          teachingNote: 'Note slight anomalies at group 13 (p-subshell entry) and group 16 (electron pairing).'
        };
      } else if (type === 3) {
        return {
          subject: 'chemistry',
          subjectLabel: meta.label,
          category: 'Reaction Kinetics • Catalysis',
          difficulty: 'beginner',
          question: 'What is the exact chemical role of a positive catalyst in a chemical reaction?',
          options: [
            'It lowers activation energy by providing an alternative reaction pathway',
            'It increases the total enthalpy change (ΔH) of the reaction',
            'It shifts the equilibrium constant Kc toward products',
            'It is consumed as a reactant to form products'
          ],
          correctIndex: 0,
          explanation: 'Catalysts lower the activation energy barrier without being consumed and without altering the thermodynamic ΔH or equilibrium constant.',
          syllabusRef: 'Ethiopian Grade 12 Chemistry Unit 1',
          teachingNote: 'Crucial distinction between kinetic rates and thermodynamic equilibrium.'
        };
      } else {
        return {
          subject: 'chemistry',
          subjectLabel: meta.label,
          category: 'Electrochemistry • Redox Reactions',
          difficulty: 'intermediate',
          question: 'In the redox reaction Zn + Cu²⁺ → Zn²⁺ + Cu, which species undergoes oxidation?',
          options: ['Zinc metal (Zn)', 'Copper ion (Cu²⁺)', 'Zinc ion (Zn²⁺)', 'Copper metal (Cu)'],
          correctIndex: 0,
          explanation: 'Oxidation is loss of electrons (OIL). Zn loses 2 electrons (oxidation state changes from 0 to +2), so Zn is oxidized.',
          syllabusRef: 'Ethiopian Grade 12 Chemistry Unit 4',
          teachingNote: 'Mnemonic: OIL RIG (Oxidation Is Loss, Reduction Is Gain).'
        };
      }
    }

    case 'biology': {
      const type = index % 5;
      if (type === 0) {
        return {
          subject: 'biology',
          subjectLabel: meta.label,
          category: 'Cell Division • Mitosis vs Meiosis',
          difficulty: 'intermediate',
          question: 'What is the primary biological consequence of crossing over during Prophase I of meiosis?',
          options: [
            'Genetic recombination and diversification of gametes',
            'Doubling the diploid chromosome count',
            'Production of genetically identical daughter cells',
            'Repair of damaged double-stranded DNA'
          ],
          correctIndex: 0,
          explanation: 'Crossing over between non-sister chromatids of homologous chromosomes exchanges genetic alleles, creating unique genetic combinations.',
          syllabusRef: 'Ethiopian Grade 10 Biology Unit 2',
          teachingNote: 'Explains why siblings are genetically distinct.'
        };
      } else if (type === 1) {
        return {
          subject: 'biology',
          subjectLabel: meta.label,
          category: 'Photosynthesis • Light Reactions',
          difficulty: 'intermediate',
          question: 'During the light-dependent reactions of photosynthesis, what is the initial electron donor that produces oxygen gas as a byproduct?',
          options: ['Water (H₂O)', 'Carbon dioxide (CO₂)', 'Glucose (C₆H₁₂O₆)', 'NADPH'],
          correctIndex: 0,
          explanation: 'Photolysis of water (2H₂O → 4H⁺ + 4e⁻ + O₂) in Photosystem II provides electrons to the electron transport chain, releasing molecular oxygen.',
          syllabusRef: 'Ethiopian Grade 11 Biology Unit 2',
          teachingNote: 'Disproves the historical misconception that oxygen originates from CO2.'
        };
      } else if (type === 2) {
        return {
          subject: 'biology',
          subjectLabel: meta.label,
          category: 'Human Physiology • Endocrine Regulation',
          difficulty: 'beginner',
          question: 'Which hormone secreted by the beta cells of the pancreas lowers blood glucose concentration?',
          options: ['Insulin', 'Glucagon', 'Adrenaline', 'Thyroxine'],
          correctIndex: 0,
          explanation: 'Insulin facilitates glucose uptake into muscle and adipose tissues and promotes glycogen synthesis in the liver, reducing blood sugar levels.',
          syllabusRef: 'Ethiopian Grade 11 Biology Unit 5',
          teachingNote: 'Antagonistic hormone is glucagon from alpha cells.'
        };
      } else if (type === 3) {
        return {
          subject: 'biology',
          subjectLabel: meta.label,
          category: 'Ecology • Biogeochemical Cycles',
          difficulty: 'intermediate',
          question: 'Which group of soil microorganisms converts atmospheric nitrogen (N₂) into usable ammonia or nitrates for leguminous plants?',
          options: ['Nitrogen-fixing bacteria (e.g. Rhizobium)', 'Denitrifying bacteria', 'Decomposing fungi', 'Lactic acid bacteria'],
          correctIndex: 0,
          explanation: 'Rhizobium bacteria residing in root nodules of legumes fix inert atmospheric nitrogen into ammonium ions usable by plants.',
          syllabusRef: 'Ethiopian Grade 10 Biology Unit 5',
          teachingNote: 'Important in crop rotation practices in Ethiopian agriculture.'
        };
      } else {
        return {
          subject: 'biology',
          subjectLabel: meta.label,
          category: 'Evolution & Classification',
          difficulty: 'beginner',
          question: 'In the Linnaean biological taxonomic hierarchy, which rank is directly above species?',
          options: ['Genus', 'Family', 'Order', 'Class'],
          correctIndex: 0,
          explanation: 'The standard hierarchy is: Domain → Kingdom → Phylum → Class → Order → Family → Genus → Species.',
          syllabusRef: 'Ethiopian Grade 9 Biology Unit 1',
          teachingNote: 'Binomial nomenclature uses Genus capitalized followed by species.'
        };
      }
    }

    case 'ict': {
      const type = index % 5;
      if (type === 0) {
        return {
          subject: 'ict',
          subjectLabel: meta.label,
          category: 'Computer Networks • IP Addressing',
          difficulty: 'intermediate',
          question: 'How many bits compose a standard IPv4 address compared to an IPv6 address?',
          options: ['IPv4 is 32 bits; IPv6 is 128 bits', 'IPv4 is 64 bits; IPv6 is 128 bits', 'IPv4 is 16 bits; IPv6 is 32 bits', 'IPv4 is 128 bits; IPv6 is 256 bits'],
          correctIndex: 0,
          explanation: 'IPv4 uses 32-bit addresses (approx 4.3 billion addresses), whereas IPv6 uses 128-bit addresses to solve IP address exhaustion.',
          syllabusRef: 'Ethiopian Grade 11 ICT Unit 3',
          teachingNote: 'IPv4 written in dotted decimal; IPv6 in hexadecimal.'
        };
      } else if (type === 1) {
        return {
          subject: 'ict',
          subjectLabel: meta.label,
          category: 'Data Representation • Binary Conversion',
          difficulty: 'beginner',
          question: `What is the binary representation of the decimal integer ${(index % 7) + 8}?`,
          options: [
            ((index % 7) + 8).toString(2),
            ((index % 7) + 9).toString(2),
            ((index % 7) + 7).toString(2),
            ((index % 7) + 10).toString(2)
          ],
          correctIndex: 0,
          explanation: `Converting decimal ${(index % 7) + 8} by successive division by 2 yields binary ${((index % 7) + 8).toString(2)}.`,
          syllabusRef: 'Ethiopian Grade 9 ICT Unit 3',
          teachingNote: 'Fundamental digital logic conversion.'
        };
      } else if (type === 2) {
        return {
          subject: 'ict',
          subjectLabel: meta.label,
          category: 'Software Engineering • Algorithms',
          difficulty: 'intermediate',
          question: 'What is the time complexity of searching a sorted array using Binary Search?',
          options: ['O(log n)', 'O(n)', 'O(n²)', 'O(1)'],
          correctIndex: 0,
          explanation: 'Binary search halves the search space at each comparison step, resulting in a logarithmic time complexity of O(log n).',
          syllabusRef: 'Ethiopian Grade 12 ICT Unit 4',
          teachingNote: 'Contrast with linear search O(n) for unsorted data.'
        };
      } else if (type === 3) {
        return {
          subject: 'ict',
          subjectLabel: meta.label,
          category: 'Information Security • Cryptography',
          difficulty: 'intermediate',
          question: 'In asymmetric public-key cryptography (such as RSA), which key is kept confidential by the recipient?',
          options: ['Private key', 'Public key', 'Hashing digest', 'Certificate authority token'],
          correctIndex: 0,
          explanation: 'In asymmetric systems, the public key encrypts data and is shared openly, while the private key is held secret to decrypt the ciphertext.',
          syllabusRef: 'Ethiopian Grade 12 ICT Unit 5',
          teachingNote: 'Essential for HTTPS/TLS web security.'
        };
      } else {
        return {
          subject: 'ict',
          subjectLabel: meta.label,
          category: 'Operating Systems • Process Management',
          difficulty: 'beginner',
          question: 'Which component of an operating system controls hardware access, process scheduling, and memory allocation?',
          options: ['Kernel', 'Graphical User Interface (GUI)', 'Web Browser', 'Command Line Shell'],
          correctIndex: 0,
          explanation: 'The kernel is the core foundational module of an operating system that has direct access to CPU hardware, memory, and devices.',
          syllabusRef: 'Ethiopian Grade 10 ICT Unit 2',
          teachingNote: 'Distinguish kernel from user space applications.'
        };
      }
    }

    case 'english': {
      const type = index % 5;
      if (type === 0) {
        return {
          subject: 'english',
          subjectLabel: meta.label,
          category: 'Grammar • Subject-Verb Agreement',
          difficulty: 'intermediate',
          question: 'Choose the grammatically correct option: "Neither the classroom teacher nor the students _______ present at the faculty assembly."',
          options: ['were', 'was', 'is', 'has been'],
          correctIndex: 0,
          explanation: 'In "neither... nor" constructions, the verb agrees in number with the subject closest to it ("the students" is plural, hence "were").',
          syllabusRef: 'Ethiopian Grade 11 English Unit 1',
          teachingNote: 'Proximity rule for correlative conjunctions.'
        };
      } else if (type === 1) {
        return {
          subject: 'english',
          subjectLabel: meta.label,
          category: 'Vocabulary • Context Clues',
          difficulty: 'intermediate',
          question: 'In the sentence "The director’s remarks were candid and transparent," the word "candid" means:',
          options: ['Frank, honest, and direct', 'Concealed and secretive', 'Hostile and antagonistic', 'Ambiguous and vague'],
          correctIndex: 0,
          explanation: '"Candid" means truthful, straightforward, and sincere in expressing oneself.',
          syllabusRef: 'Ethiopian Grade 11 English Unit 3',
          teachingNote: 'Context clues provided by coordinate "transparent".'
        };
      } else if (type === 2) {
        return {
          subject: 'english',
          subjectLabel: meta.label,
          category: 'Punctuation & Relative Clauses',
          difficulty: 'advanced',
          question: 'Identify the sentence with a non-defining (non-restrictive) relative clause:',
          options: [
            'Kellem Secondary School, which is located in Dambi Dollo, has a proud academic heritage.',
            'The student who scored highest received the national award.',
            'The book that I borrowed yesterday was inspiring.',
            'Students who attend regularly achieve higher grades.'
          ],
          correctIndex: 0,
          explanation: 'Non-defining clauses provide extra parenthetical information and are separated by commas. They can be removed without changing the core meaning.',
          syllabusRef: 'Ethiopian Grade 12 English Unit 2',
          teachingNote: 'Notice commas around "which is located in Dambi Dollo".'
        };
      } else if (type === 3) {
        return {
          subject: 'english',
          subjectLabel: meta.label,
          category: 'Direct and Indirect Speech',
          difficulty: 'intermediate',
          question: 'Change to indirect speech: "I will submit the assignment tomorrow," Bilisummaa said.',
          options: [
            'Bilisummaa said that he would submit the assignment the following day.',
            'Bilisummaa said that he will submit the assignment tomorrow.',
            'Bilisummaa said that he submitted the assignment yesterday.',
            'Bilisummaa said that he would have submitted the assignment today.'
          ],
          correctIndex: 0,
          explanation: 'In reported speech with past reporting verb: "will" backshifts to "would", and "tomorrow" changes to "the following day" or "the next day".',
          syllabusRef: 'Ethiopian Grade 10 English Unit 4',
          teachingNote: 'Backshifting tense and time expression adjustments.'
        };
      } else {
        return {
          subject: 'english',
          subjectLabel: meta.label,
          category: 'Active and Passive Voice',
          difficulty: 'beginner',
          question: 'Transform to passive: "The examination board announced the official results yesterday."',
          options: [
            'The official results were announced by the examination board yesterday.',
            'The official results was announced by the examination board yesterday.',
            'The official results had announced by the examination board yesterday.',
            'The official results are announced by the examination board yesterday.'
          ],
          correctIndex: 0,
          explanation: 'Past simple active (announced) becomes "were announced" in passive because "results" is plural.',
          syllabusRef: 'Ethiopian Grade 9 English Unit 5',
          teachingNote: 'Subject-verb agreement in passive transformation.'
        };
      }
    }

    case 'construction': {
      const type = index % 5;
      if (type === 0) {
        return {
          subject: 'construction',
          subjectLabel: meta.label,
          category: 'Building Materials • Curing Concrete',
          difficulty: 'intermediate',
          question: 'Why is moist curing of freshly cast reinforced concrete mandatory for at least 7 to 28 days on building sites?',
          options: [
            'To maintain moisture for continuous cement hydration and attain target compressive strength',
            'To quickly dry the concrete so formwork can be stripped immediately',
            'To prevent aggregate from settling to the bottom of the mold',
            'To bleach the exterior architectural appearance of the wall'
          ],
          correctIndex: 0,
          explanation: 'Curing prevents premature loss of water, allowing the chemical hydration reaction of calcium silicates in cement to continue, preventing shrinkage cracking and maximizing strength.',
          syllabusRef: 'Ethiopian Technical Stream Construction Unit 3',
          teachingNote: 'Standard 28-day characteristic compressive strength test.'
        };
      } else if (type === 1) {
        return {
          subject: 'construction',
          subjectLabel: meta.label,
          category: 'Drafting • Orthographic Views',
          difficulty: 'beginner',
          question: 'In architectural blueprint drawings, a horizontal section cut taken through a building at window sill height is known as:',
          options: ['A Floor Plan', 'A Front Elevation', 'A Cross Section', 'An Isometric Axonometric Projection'],
          correctIndex: 0,
          explanation: 'A floor plan is an orthographic top-down horizontal slice (typically 1.2 to 1.5m above finished floor) displaying room partitions, doors, windows, and dimensions.',
          syllabusRef: 'Ethiopian Technical Drawing Unit 2',
          teachingNote: 'Contrast plan (horizontal cut) with elevation (exterior facade) and section (vertical cut).'
        };
      } else if (type === 2) {
        return {
          subject: 'construction',
          subjectLabel: meta.label,
          category: 'Structural Mechanics • Reinforcement Steel',
          difficulty: 'intermediate',
          question: 'Why is ribbed deformed high-yield steel embedded in the tension zones of structural concrete beams?',
          options: [
            'Concrete is strong in compression but weak in tension; steel carries the tensile forces',
            'Steel prevents concrete from becoming too heavy on the foundations',
            'Concrete is weak in compression; steel carries the compressive forces',
            'To provide electrical grounding across the building frame'
          ],
          correctIndex: 0,
          explanation: 'Plain concrete has high compressive strength but very low tensile strength (approx 10% of compressive). Steel rebar resists bending and tensile stresses.',
          syllabusRef: 'Ethiopian Construction Stream Unit 4',
          teachingNote: 'Explains bottom reinforcement in simply supported beams.'
        };
      } else if (type === 3) {
        return {
          subject: 'construction',
          subjectLabel: meta.label,
          category: 'Masonry & Mortar',
          difficulty: 'beginner',
          question: 'What is the primary function of mortar in stone and hollow concrete block (HCB) masonry construction?',
          options: [
            'To bind individual masonry units together and distribute loads uniformly across the joint',
            'To serve as primary waterproofing membrane on the foundation',
            'To insulate the building against thermal lightning strikes',
            'To replace the need for reinforced concrete ring beams'
          ],
          correctIndex: 0,
          explanation: 'Mortar (cement, sand, and water) beds and binds masonry units, sealing joints and transferring compressive stresses uniformly.',
          syllabusRef: 'Ethiopian Construction Stream Unit 5',
          teachingNote: 'HCB is the primary walling material in modern Ethiopian construction.'
        };
      } else {
        return {
          subject: 'construction',
          subjectLabel: meta.label,
          category: 'Site Safety • Scaffolding & Excavation',
          difficulty: 'intermediate',
          question: 'When excavating deep foundation trenches exceeding 1.5 meters in unstable soils, what safety precaution is mandatory to prevent trench collapse?',
          options: [
            'Installing timber shoring or stepping/battering back trench walls',
            'Sprinkling water on the trench edges to settle loose gravel',
            'Working only during nighttime hours',
            'Increasing backhoe excavation speed'
          ],
          correctIndex: 0,
          explanation: 'Trench collapses are fatal hazards. Shoring (bracing walls) or sloping/stepping the trench walls prevents cave-ins according to civil safety codes.',
          syllabusRef: 'Ethiopian Construction Occupational Safety Unit 6',
          teachingNote: 'Critical safety protocol on civil construction sites.'
        };
      }
    }

    case 'geography': {
      const type = index % 5;
      if (type === 0) {
        return {
          subject: 'geography',
          subjectLabel: meta.label,
          category: 'Geomorphology • Ethiopian Highlands',
          difficulty: 'intermediate',
          question: 'What is the highest mountain peak in Ethiopia, situated in the Semien Mountain range?',
          options: ['Ras Dashen (4,550 m)', 'Mount Batu (4,307 m)', 'Mount Tullu Dimtu (4,377 m)', 'Mount Guna (4,120 m)'],
          correctIndex: 0,
          explanation: 'Ras Dashen is the highest peak in Ethiopia at 4,550 meters above sea level, located in the Semien Gondar highlands.',
          syllabusRef: 'Ethiopian Grade 12 Geography Unit 2',
          teachingNote: 'Mount Batu and Tullu Dimtu are in the Bale Mountains.'
        };
      } else if (type === 1) {
        return {
          subject: 'geography',
          subjectLabel: meta.label,
          category: 'Hydrology • Ethiopian Rift Valley Lakes',
          difficulty: 'beginner',
          question: 'Which of the following lakes is located in the central Ethiopian Rift Valley system?',
          options: ['Lake Ziway', 'Lake Tana', 'Lake Ashenge', 'Lake Hayk'],
          correctIndex: 0,
          explanation: 'Lake Ziway (together with Langano, Abijatta, and Shala) is part of the central Ethiopian Rift Valley lake chain. Lake Tana is on the northern plateau.',
          syllabusRef: 'Ethiopian Grade 12 Geography Unit 3',
          teachingNote: 'Distinguish plateau lakes (Tana, Hayk) from tectonic rift valley lakes.'
        };
      } else if (type === 2) {
        return {
          subject: 'geography',
          subjectLabel: meta.label,
          category: 'Climate & Monsoon Winds',
          difficulty: 'intermediate',
          question: 'Which prevailing winds bring the primary summer rainfall (Kiremt) to the Ethiopian highlands between June and September?',
          options: [
            'Equatorial Guinea moist southwesterly winds from the Atlantic and Congo basin',
            'Northeast trade winds from the Arabian peninsula',
            'Southeast trade winds from the Indian ocean',
            'Subtropical jet streams from the Mediterranean sea'
          ],
          correctIndex: 0,
          explanation: 'The northward migration of the ITCZ draws moisture-laden southwesterly air masses from the Atlantic Ocean and Congo basin, triggering heavy orographic Kiremt rains.',
          syllabusRef: 'Ethiopian Grade 11 Geography Unit 4',
          teachingNote: 'Mechanism of the Ethiopian summer rainy season (Kiremt).'
        };
      } else if (type === 3) {
        return {
          subject: 'geography',
          subjectLabel: meta.label,
          category: 'Soil Types of Ethiopia',
          difficulty: 'intermediate',
          question: 'What heavy clay soil type, widely distributed in Ethiopian highland depressions, exhibits swelling when wet and deep cracking when dry?',
          options: ['Vertisols (Black cotton soils)', 'Nitisols (Red volcanic soils)', 'Fluvisols (Alluvial soils)', 'Regosols (Shallow stony soils)'],
          correctIndex: 0,
          explanation: 'Vertisols are expansive montmorillonite clay soils that expand when wet and shrink/crack when dry, requiring specialized drainage for agriculture.',
          syllabusRef: 'Ethiopian Grade 12 Geography Unit 5',
          teachingNote: 'Broadbed maker (BBM) technology was developed specifically for Vertisol drainage.'
        };
      } else {
        return {
          subject: 'geography',
          subjectLabel: meta.label,
          category: 'Settlement & Urbanization',
          difficulty: 'beginner',
          question: 'A settlement pattern where rural households are scattered across farmland rather than grouped tightly together is known as:',
          options: ['Dispersed settlement', 'Nucleated settlement', 'Linear settlement', 'Conurbation'],
          correctIndex: 0,
          explanation: 'Dispersed settlements feature homesteads scattered across the landscape near individual agricultural fields, characteristic of much of the Ethiopian highlands.',
          syllabusRef: 'Ethiopian Grade 10 Geography Unit 4',
          teachingNote: 'Nucleated settlements cluster around water or crossroads.'
        };
      }
    }

    case 'economics': {
      const type = index % 5;
      if (type === 0) {
        return {
          subject: 'economics',
          subjectLabel: meta.label,
          category: 'Microeconomics • Consumer Equilibrium',
          difficulty: 'advanced',
          question: 'According to the Law of Equi-Marginal Utility, a consumer maximizes total satisfaction when:',
          options: [
            'MU_x / P_x = MU_y / P_y (Marginal utility per dollar spent is equal across goods)',
            'Total utility of good X equals total utility of good Y',
            'Price of good X equals price of good Y',
            'The consumer saves 50% of monthly income'
          ],
          correctIndex: 0,
          explanation: 'Equilibrium occurs when the last unit of currency spent on each commodity yields identical marginal utility: MU_x/P_x = MU_y/P_y.',
          syllabusRef: 'Ethiopian Grade 11 Economics Unit 3',
          teachingNote: 'Utility maximization under budget constraints.'
        };
      } else if (type === 1) {
        return {
          subject: 'economics',
          subjectLabel: meta.label,
          category: 'Macroeconomics • Fiscal Policy',
          difficulty: 'intermediate',
          question: 'During severe economic recession and high unemployment, which Keynesian fiscal policy measure is appropriate to expand output?',
          options: [
            'Increasing government infrastructure spending and reducing taxes',
            'Decreasing government spending and increasing income taxes',
            'Austerity budget cutbacks to create government surpluses',
            'Freezing all public sector employment wages'
          ],
          correctIndex: 0,
          explanation: 'Expansionary fiscal policy boosts aggregate demand (AD = C + I + G + NX) via higher public expenditure and tax cuts.',
          syllabusRef: 'Ethiopian Grade 12 Economics Unit 4',
          teachingNote: 'Contrasts with classical self-correcting market assumptions.'
        };
      } else if (type === 2) {
        return {
          subject: 'economics',
          subjectLabel: meta.label,
          category: 'International Trade • Comparative Advantage',
          difficulty: 'intermediate',
          question: 'According to David Ricardo’s theory of comparative advantage, mutually beneficial trade between nations occurs when:',
          options: [
            'Countries specialize in producing goods where their opportunity cost is lowest',
            'One country has an absolute efficiency advantage in all products',
            'Both countries produce identical quantities of manufactured goods',
            'Currency exchange rates are legally fixed to gold'
          ],
          correctIndex: 0,
          explanation: 'Comparative advantage depends on relative opportunity costs rather than absolute production costs; nations gain by exporting goods with lower opportunity costs.',
          syllabusRef: 'Ethiopian Grade 12 Economics Unit 5',
          teachingNote: 'Crucial distinction between absolute advantage and comparative advantage.'
        };
      } else if (type === 3) {
        return {
          subject: 'economics',
          subjectLabel: meta.label,
          category: 'Market Structures • Monopoly Inefficiencies',
          difficulty: 'intermediate',
          question: 'Why does an unregulated pure monopoly typically create deadweight loss in society compared to perfect competition?',
          options: [
            'It restricts output and sets price higher than marginal cost (P > MC)',
            'It produces too much output leading to supply gluts',
            'It sells products below average variable cost',
            'It forces competitors into zero economic profit'
          ],
          correctIndex: 0,
          explanation: 'Monopolists maximize profit where MR = MC, charging a price P > MC. The underproduction of output relative to social optimum creates deadweight loss.',
          syllabusRef: 'Ethiopian Grade 11 Economics Unit 4',
          teachingNote: 'Deadweight loss represents loss of consumer and producer surplus.'
        };
      } else {
        return {
          subject: 'economics',
          subjectLabel: meta.label,
          category: 'Development Economics • HDI',
          difficulty: 'beginner',
          question: 'The United Nations Human Development Index (HDI) evaluates national progress using which three fundamental dimensions?',
          options: [
            'Life expectancy (health), expected/mean years of schooling (education), and GNI per capita (standard of living)',
            'Military budget, GDP growth rate, and commercial trade surplus',
            'Carbon emissions, gold reserves, and population growth rate',
            'Total highway mileage, electric grid capacity, and bank deposits'
          ],
          correctIndex: 0,
          explanation: 'HDI incorporates a long and healthy life (life expectancy), knowledge (education indices), and a decent standard of living (GNI per capita).',
          syllabusRef: 'Ethiopian Grade 10 Economics Unit 6',
          teachingNote: 'HDI moves beyond purely monetary measures of development.'
        };
      }
    }

    default:
      return {
        subject: 'math',
        subjectLabel: 'Mathematics',
        category: 'General Science & Reasoning',
        difficulty: 'intermediate',
        question: `Sample curriculum question #${index + 1} for secondary education.`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctIndex: 0,
        explanation: 'Detailed explanation for this standard question.',
        syllabusRef: 'Ethiopian Secondary Curriculum',
        teachingNote: 'Teaching notes and guidance.'
      };
  }
}

/**
 * Builds an authentic, rich exam of 20, 30, 50, or 100 questions.
 * Handles subject-by-subject single subject exams or composite multi-subject exams!
 */
export function buildCurriculumExam(
  subject: ExamSubject,
  count: number,
  targetRole: 'student' | 'teacher' = 'student',
  gradeLevel: string = 'Grade 12 National Entrance Standard'
): ExamQuestion[] {
  const questions: ExamQuestion[] = [];
  const targetCount = Math.max(1, count);

  if (subject === 'composite') {
    // Multi-subject composite exam generated subject by subject!
    // Distribute questions evenly across the 9 subjects
    const subjectsToInclude: ExamSubject[] = [
      'math',
      'physics',
      'chemistry',
      'biology',
      'english',
      'ict',
      'geography',
      'economics',
      'construction'
    ];

    const perSubject = Math.floor(targetCount / subjectsToInclude.length);
    let remainder = targetCount % subjectsToInclude.length;

    let globalQNumber = 1;

    subjectsToInclude.forEach((sub, subIdx) => {
      const takeCount = perSubject + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;

      const subQuestions = buildCurriculumExam(sub, takeCount, targetRole, gradeLevel);
      subQuestions.forEach(q => {
        questions.push({
          ...q,
          id: `q_composite_${subIdx}_${globalQNumber}`,
          questionNumber: globalQNumber++
        });
      });
    });

    return questions;
  }

  // Single Subject Exam
  const curated = CURATED_QUESTIONS[subject] || [];
  const meta = EXAM_SUBJECTS.find(s => s.id === subject) || EXAM_SUBJECTS[0];

  // First, add all available curated questions (shuffled)
  const shuffledCurated = [...curated].sort(() => 0.5 - Math.random());
  let qNum = 1;

  for (const item of shuffledCurated) {
    if (questions.length >= targetCount) break;
    questions.push({
      ...item,
      id: `q_${subject}_${qNum}`,
      questionNumber: qNum++,
      subject,
      subjectLabel: meta.label
    });
  }

  // Next, if we still need more questions up to targetCount (e.g. 30, 50, or 100),
  // synthesize procedural curriculum questions ensuring rich variety!
  let procIndex = 0;
  while (questions.length < targetCount) {
    const proc = generateProceduralQuestion(subject, procIndex);
    questions.push({
      ...proc,
      id: `q_${subject}_proc_${qNum}`,
      questionNumber: qNum++,
      subject,
      subjectLabel: meta.label
    });
    procIndex++;
  }

  return questions;
}
