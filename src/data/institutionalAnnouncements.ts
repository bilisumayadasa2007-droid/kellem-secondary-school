import { InstitutionalAnnouncement } from '../types';

export const INITIAL_ANNOUNCEMENTS: InstitutionalAnnouncement[] = [
  {
    id: 'ann_euee_2026_schedule',
    title: 'EUEE 2026 National University Entrance Exam Timetable & Candidate Admission Slips',
    category: 'examinations',
    priority: 'urgent',
    publishDate: '2026-11-02T08:00:00Z',
    author: 'Directorate of Academic Assessment & Examination Board',
    referenceNo: 'KSS/EXAM/2026-088',
    summary: 'Official distribution of national admission verification cards for Grade 12 Natural & Social Science candidates begins next week at the main registrar.',
    fullContent: `All enrolled Grade 12 students preparing for the Ethiopian University Entrance Examination (EUEE 2026) are hereby notified that candidate registration clearance has been officially finalized.

Key Directives:
1. Candidate Admission Cards: Photo-verified examination identity slips will be issued starting Monday from 8:30 AM to 4:30 PM at the Directorate Admissions Window.
2. Natural Science Candidates: Will sit for English, Mathematics (Natural), Physics, Chemistry, Biology, and General Scholastic Aptitude.
3. Social Science Candidates: Will sit for English, Mathematics (Social), Economics, Geography, History, and General Scholastic Aptitude.
4. Examination Center Regulations: Candidates must present both their official KSS Digital Student ID Card and National Admission Slip upon entering the exam halls. Electronic devices, smartwatches, and programmable calculators are strictly prohibited.`,
    actionUrl: '#exam-generator',
    actionLabel: 'Launch 100-Question National Mock'
  },
  {
    id: 'ann_admin_clearance_verification',
    title: 'Mandatory Student Profile Verification & Administrator Approval Policy',
    category: 'admissions',
    priority: 'high',
    publishDate: '2026-11-01T14:30:00Z',
    author: 'Office of the Principal Administrator (Bilisatech4@gmail.com)',
    referenceNo: 'KSS/ADM/2026-042',
    summary: 'New registrants are placed in PENDING status pending enrollment verification against the official school registry. Photo and contact details are self-managed.',
    fullContent: `To uphold academic integrity and ensure safe campus recordkeeping, Kellem Secondary School enforces a strict registration-only administrator approval protocol.

Policy Highlights:
• Self-Management: Only the student themselves can upload their personal photo, update their contact telephone number, and enter their age in Account Settings. Cross-student modifications are blocked.
• Administrator Review: Once a registration is submitted, an approval verification alert is dispatched to Administrator (Bilisatech4@gmail.com).
• Uninterrupted Access: Once approved, students retain perpetual normal login access without recurring approvals.
• Portal Security: Protected question banks, streak bonuses, and digital ID card issuances are restricted to verified accounts.`,
    actionUrl: '#student-data',
    actionLabel: 'Verify School Roster'
  },
  {
    id: 'ann_nat_soc_mock_sessions',
    title: 'Grade 12 Laboratory Practicals & Model Exam Revision Circles',
    category: 'academic',
    priority: 'high',
    publishDate: '2026-10-30T10:15:00Z',
    author: 'Science & Humanities Academic Council',
    referenceNo: 'KSS/ACAD/2026-114',
    summary: 'Comprehensive Saturday and Sunday study sessions in the campus laboratories and library reading center for Physics, Chemistry, and Economics.',
    fullContent: `In preparation for national exit examinations, Kellem Secondary School has scheduled weekend intensive revision circles led by academic department heads.

Schedule & Venues:
• Natural Science Laboratory: Physics Mechanics & Optical Bench experiments every Saturday 9:00 AM – 12:30 PM. Acid-Base Titrations & Organic Synthesis every Saturday 2:00 PM – 4:30 PM.
• Social Science Resource Room: Macroeconomic fiscal/monetary policy review and Ethiopian physical cartography every Sunday 9:30 AM – 1:00 PM.
• Digital Access: All study guides (Economics, Geography, and Physics) are downloadable in PDF format on the Win Entrance portal.`,
    actionUrl: '#win-entrance',
    actionLabel: 'Access Study Guides'
  },
  {
    id: 'ann_english_club_tournament',
    title: 'Kellem English Club: Annual Inter-Class Oratory & Academic Debate Championship',
    category: 'campus_life',
    priority: 'normal',
    publishDate: '2026-10-28T16:00:00Z',
    author: 'Department of Languages & Kellem English Club Directorate',
    referenceNo: 'KSS/ENG/2026-019',
    summary: 'Registration is now open for students across Grades 9-12 for the parliamentary debate and persuasive speaking tournament on Telegram and the main assembly hall.',
    fullContent: `The Kellem English Club invites all passionate communicators and scholars to take part in the upcoming 2026 Inter-Class Oratory and Parliamentary Debate Championship.

Tournament Details:
• Theme: "Harnessing STEM and Humanities for Regional Development in Western Oromia."
• Divisions: Senior Division (Grades 11-12) & Junior Division (Grades 9-10).
• Preparation Sessions: Daily English speech practice and conversational pronunciation phrases are posted on Kellem AI and the official Telegram channel (@kellemenglishclub).
• Awards: Trophies, academic book collections, and distinction commendations will be awarded at the end-of-term assembly.`,
    actionUrl: 'https://t.me/kellemenglishclub',
    actionLabel: 'Join Telegram Community'
  },
  {
    id: 'ann_campus_library_extended_hours',
    title: 'Extended Evening Library & High-Speed Reading Center Operations',
    category: 'academic',
    priority: 'normal',
    publishDate: '2026-10-25T11:00:00Z',
    author: 'School Directorate & Library Services',
    referenceNo: 'KSS/LIB/2026-007',
    summary: 'The main campus reading hall will remain open until 8:30 PM on weekdays to accommodate study groups and entrance exam revision.',
    fullContent: `To support candidates preparing for regional and national examinations, Kellem Secondary School has extended the operational hours of the campus library and digital reading rooms.

Guidelines:
• Operating Hours: Monday through Friday: 7:30 AM – 8:30 PM; Saturdays: 8:00 AM – 5:00 PM.
• Digital Resources: Offline curriculum syllabi, past national entrance papers, and Kellem AI interactive practice terminals are available at the digital desk.
• Quiet Study Zones: Complete silence is mandated in Hall A; Hall B is allocated for collaborative study circles.`,
    actionUrl: '#about',
    actionLabel: 'Campus Facility Info'
  }
];
