import { StudyModule, Flashcard } from "../types";

export const syllabus: StudyModule[] = [
  {
    day: 1,
    title: "Introduction to Independent Directors & Qualifications",
    category: "Companies Act",
    description: "Understand who is an Independent Director (ID), basic rules under Section 149(6), and the critical eligibility criteria for Indian companies.",
    keySections: ["Section 149", "Rule 4", "Rule 5 of Companies (Appointment & Qualification) Rules, 2014"],
    outline: [
      "Definition of Independent Director under Section 149(6) of Companies Act 2013",
      "Which companies must appoint an Independent Director (public listed vs unlisted thresholds)",
      "The 'Pecuniary Relationship' rule - strict financial boundaries",
      "Relative restrictions and limits on holding shares or security",
      "Key exclusion criteria (e.g., being a promoter, employee, or key managerial person)"
    ]
  },
  {
    day: 2,
    title: "Role, Duties & Code of Conduct (Schedule IV)",
    category: "Companies Act",
    description: "Deep dive into Schedule IV of the Companies Act 2013, which contains the official code, guidelines, and structural duties for IDs.",
    keySections: ["Schedule IV", "Section 149(8)"],
    outline: [
      "The statutory Code for Independent Directors (Schedule IV)",
      "Guidelines of professional conduct (independence, ethics, objective judgment)",
      "Key duties during Board and committee meetings",
      "Responsibilities regarding fraud prevention and reporting",
      "Holding separate meetings of Independent Directors (without promoters or executive staff)"
    ]
  },
  {
    day: 3,
    title: "Liabilities, Retirability & Term of Office",
    category: "Companies Act",
    description: "Explore the legal liabilities of Independent Directors, how terms are calculated, and protection from prosecution under S. 149(12).",
    keySections: ["Section 149(10)", "Section 149(11)", "Section 149(12)", "Section 152"],
    outline: [
      "Term of office: 5 consecutive years, eligible for re-appointment by special resolution",
      "Maximum tenure constraint: 2 terms (10 years) followed by 3 years cooling-off period",
      "Exemption from retirability by rotation (S. 149(13))",
      "Liability shield (Section 149(12)): only liable for acts of omission or commission with consent, connivance, or lack of diligence",
      "Practical strategies to document dissent in board minutes to protect yourself from liability"
    ]
  },
  {
    day: 4,
    title: "Board Meetings, Quorum & Notice Mechanics",
    category: "Companies Act",
    description: "Master the regulatory frameworks of holding board meetings, required notice intervals, and the quorum guidelines.",
    keySections: ["Section 173", "Section 174", "Secretarial Standard 1 (SS-1)"],
    outline: [
      "Notice of Board meeting (minimum 7 days notice required under Section 173)",
      "Quorum for Board meetings: 1/3rd of total strength or 2 directors, whichever is higher",
      "Specific SEBI quorum guidelines for listed companies (top 1000/2000 companies require independent directors presence)",
      "Participation via Video Conferencing (rules, safety, and recording requirements)",
      "Consequences of failing to convene 4 meetings in a calendar year (maximum 120 days gap)"
    ]
  },
  {
    day: 5,
    title: "Related Party Transactions & Conflict of Interest",
    category: "Companies Act",
    description: "Learn how to spot, analyze, and approve transactions with related parties. This is one of the highest-tested areas on the IICA exam.",
    keySections: ["Section 188", "Section 2(76)", "Section 184", "SEBI Reg 23"],
    outline: [
      "Defining a 'Related Party' (Section 2(76))",
      "What constitutes a Related Party Transaction (RPT) under Section 188(1)",
      "When is Audit Committee approval mandatory (omnibus approvals and materiality thresholds)",
      "Exemption for transactions in the 'ordinary course of business' and at 'arm's length'",
      "Disclosure of interest by directors (Section 184) and voting restrictions"
    ]
  },
  {
    day: 6,
    title: "Loans, Guarantees & Investments (S. 185 & 186)",
    category: "Companies Act",
    description: "Understand the heavy restrictions on corporate lending and guarantees. Crucial for guarding corporate assets.",
    keySections: ["Section 185", "Section 186"],
    outline: [
      "Strict prohibition of loans to directors or entities in which directors are interested (Section 185)",
      "Exemptions to Section 185 (managing director exceptions, holding-subsidiary cases)",
      "Limits on loans, guarantees, and security to other bodies corporate (Section 186)",
      "Approvals required: Board resolution (unanimous) and Special Resolution when exceeding limits",
      "Role of the ID in verifying compliance to avoid criminal penalties"
    ]
  },
  {
    day: 7,
    title: "Board Committees Overview & Constitution",
    category: "Corporate Governance",
    description: "Understand the ecosystem of board committees, their mandatory thresholds, and why committee work is where IDs spend most of their time.",
    keySections: ["Section 177", "Section 178", "Section 135"],
    outline: [
      "Why committees exist (focused scrutiny and governance)",
      "The four mandatory board committees (Audit, NRC, SRC, CSR)",
      "Thresholds and triggers for establishing committees in private vs public companies",
      "The relationship between the main Board and its committees",
      "Minutes, reports, and recommendations of committees to the Board"
    ]
  },
  {
    day: 8,
    title: "Audit Committee: Composition & Core Terms",
    category: "Corporate Governance",
    description: "Deep dive into the Audit Committee—the most powerful committee. Composition rules, terms of reference, and financial literacy requirements.",
    keySections: ["Section 177", "SEBI Regulation 18"],
    outline: [
      "Mandatory Composition: Minimum 3 directors, majority must be independent (SEBI requires 2/3rds independent)",
      "The financial literacy requirement: All members must be financially literate, at least one must have accounting/financial management expertise",
      "Terms of reference: Appointment and remuneration of auditors, review of financial statements, valuation of assets",
      "Rights of the Audit Committee: To call for comments of auditors, inspect accounts, seek external legal advice",
      "Interaction with Statutory and Internal Auditors"
    ]
  },
  {
    day: 9,
    title: "Nomination and Remuneration Committee (NRC)",
    category: "Corporate Governance",
    description: "Learn how the NRC shapes the board's leadership and compensation. Understand evaluation criteria and independence tests.",
    keySections: ["Section 178", "SEBI Regulation 19"],
    outline: [
      "Composition: Minimum 3 non-executive directors, at least half must be independent, Chairperson of the board cannot chair NRC",
      "Formulating 'Fit and Proper' criteria for director appointments",
      "Determining remuneration policies (finding the balance between incentivizing and maintaining independence)",
      "Formulating board evaluation metrics and overseeing succession planning",
      "NRC disclosures in the Board's Report"
    ]
  },
  {
    day: 10,
    title: "Stakeholders Relationship & CSR Committees",
    category: "Corporate Governance",
    description: "Examine the role of the Stakeholders Relationship Committee (SRC) and Corporate Social Responsibility (CSR) Committee.",
    keySections: ["Section 178(5)", "Section 135", "SEBI Regulation 20"],
    outline: [
      "Trigger for SRC: Companies having more than 1000 shareholders, debenture holders, or security holders",
      "Composition and role of SRC (resolving security holder grievances, dividends, transfers)",
      "Trigger for CSR Committee: Net worth >= 500 cr, Turnover >= 1000 cr, or Net Profit >= 5 cr",
      "Formulating CSR policies, approving activities listed in Schedule VII, and monitoring spending",
      "Responsibilities of IDs in ensuring CSR funds are utilized genuinely"
    ]
  },
  {
    day: 11,
    title: "Vigil Mechanism & Whistleblower Policies",
    category: "Corporate Governance",
    description: "Understand the statutory requirement for establishing a whistleblowing portal and the role of Audit Committee as a safeguard.",
    keySections: ["Section 177(9)", "Section 177(10)", "SEBI Reg 22"],
    outline: [
      "Which companies must establish a Vigil Mechanism (all listed, and public companies with high deposits/loans)",
      "Drafting a robust Whistleblower Policy with protection against victimization",
      "Provision for direct access to the Chairperson of the Audit Committee in exceptional cases",
      "Disclosures required on the company website and in the Board report",
      "Case studies on corporate whistleblower revelations (Infosys, ICICI bank, etc.)"
    ]
  },
  {
    day: 12,
    title: "Board Evaluation & Training of Directors",
    category: "Corporate Governance",
    description: "Master the processes of evaluating the performance of the Board, its committees, individual directors, and the training (induction) of IDs.",
    keySections: ["Schedule IV (Section VIII)", "SEBI Regulation 25(7)"],
    outline: [
      "The mandatory requirement for annual board evaluation under Companies Act and SEBI LODR",
      "Who evaluates whom? (NRC role, peer evaluation, independent directors evaluating the chairman)",
      "Familiarization programmes for Independent Directors (business, risk, industry, legal landscape)",
      "External facilitators and evaluation frameworks (feedback, interviews, structured questionnaires)",
      "How to use evaluation reports to improve board functioning"
    ]
  },
  {
    day: 13,
    title: "SEBI (LODR) Regulations 2015 Overview & Reg 17",
    category: "SEBI LODR",
    description: "Begin the SEBI LODR section. Learn how listed companies face tighter regulations and higher standards for board compositions.",
    keySections: ["SEBI (LODR) Regulations, 2015", "Regulation 17"],
    outline: [
      "What is LODR? (Listing Obligations and Disclosure Requirements)",
      "Reg 17: Board composition rules (gender diversity, non-executive ratio)",
      "When is 1/3rd vs 1/2 of the board required to be independent? (Depending on whether the chairperson is executive or non-executive/promoter)",
      "Age limits (75 years requirement for non-executive directors unless special resolution passed)",
      "Maximum directorship limits: An individual can be an ID in at most 7 listed companies (3 if serving as a Whole-time Director)"
    ]
  },
  {
    day: 14,
    title: "SEBI LODR: Committee-Specific Overrides (Reg 18 & 19)",
    category: "SEBI LODR",
    description: "Learn how SEBI LODR overrides the Companies Act for listed companies' Audit and NRC Committees.",
    keySections: ["Regulation 18", "Regulation 19"],
    outline: [
      "Audit Committee: SEBI requires minimum 3 directors, 2/3rds must be independent, and Chairperson MUST be independent (Companies Act only requires majority)",
      "Quorum under LODR: 2 members or 1/3rd, with at least 2 independent directors present",
      "NRC under LODR: Minimum 3 directors, at least 2/3rds must be independent (Companies Act only requires 1/2)",
      "Frequent board committee meetings requirement under SEBI regulations",
      "The consequences of non-compliance (SEBI fines, suspension of trading)"
    ]
  },
  {
    day: 15,
    title: "SEBI Reg 23 & 24: RPT and Subsidiary Governance",
    category: "SEBI LODR",
    description: "Explore SEBI's strict material related party transaction laws and the oversight of unlisted subsidiaries by holding company IDs.",
    keySections: ["Regulation 23", "Regulation 24"],
    outline: [
      "SEBI's definition of 'Material RPT' (transactions exceeding Rs 1000 crore or 10% of consolidated annual turnover)",
      "Prior approval of only independent directors in the Audit Committee for RPTs",
      "Material unlisted subsidiary rule: At least one Independent Director of the holding company must be a director in the material unlisted subsidiary",
      "Review of consolidated subsidiary financial statements and investments by the holding company's Audit Committee",
      "Disposal of shares or assets of a material subsidiary (requires shareholder special resolution)"
    ]
  },
  {
    day: 16,
    title: "Disclosures, Transparency & Reg 30",
    category: "SEBI LODR",
    description: "Master the disclosure timelines and transparency requirements. Learn what information must be disclosed immediately to stock exchanges.",
    keySections: ["Regulation 30", "Schedule III of LODR"],
    outline: [
      "Regulation 30: Disclosure of material events or information within 24 hours (or 30 minutes for board decisions)",
      "What constitutes 'material' (quantitative and qualitative tests)",
      "Independent Director resignation disclosures (reasons for resignation, confirmation that there are no other material reasons, resignation letter public)",
      "Quarterly corporate governance compliance reports (submitted to Stock Exchanges)",
      "Main website disclosures checklist"
    ]
  },
  {
    day: 17,
    title: "SEBI (Prohibition of Insider Trading) Regulations",
    category: "SEBI LODR",
    description: "Understand insider trading, UPSI, trading windows, and the ID's role in oversight of the Chinese wall and code of conduct.",
    keySections: ["SEBI (PIT) Regulations, 2015", "Regulation 9", "Schedule B"],
    outline: [
      "Definition of Insider, Connected Person, and Generally Available Information",
      "Unpublished Price Sensitive Information (UPSI) handling and 'Need-to-know' basis sharing",
      "The Trading Window closures during financial result finalizations",
      "The Role of the Audit Committee in reviewing compliance with PIT regulations and verifying internal controls",
      "Strict penal provisions for insider trading breaches"
    ]
  },
  {
    day: 18,
    title: "SEBI Takeover Code & SAST Implications",
    category: "SEBI LODR",
    description: "Examine SEBI (Substantial Acquisition of Shares and Takeovers) Regulations and the committee of independent directors' role in open offers.",
    keySections: ["SEBI (SAST) Regulations, 2011", "Regulation 26"],
    outline: [
      "What is a Hostile Takeover and how does an open offer trigger?",
      "The mandatory Committee of Independent Directors (IDC) formed upon receipt of an open offer",
      "IDC's responsibility to provide a reasoned, unbiased recommendation on the open offer to shareholders",
      "Publishing recommendations in newspapers and sending them to SEBI and Stock Exchanges",
      "Strict restriction on IDC seeking promoters' side in violation of minority shareholder interests"
    ]
  },
  {
    day: 19,
    title: "Financial Statements Demystified (BS, PL, CF)",
    category: "Financials",
    description: "Start the financials section. Learn to read a Balance Sheet, P&L Statement, and Cash Flow Statement from a director's perspective.",
    keySections: ["Schedule III of Companies Act", "Section 129", "Section 134"],
    outline: [
      "The structure of Balance Sheet: Equity, Liabilities, Assets (Schedule III format)",
      "The Profit & Loss statement: Revenue, Operating Margin, EBIT, EBITDA, PAT",
      "Cash Flow Statement: Operating, Investing, and Financing flows. (Why cash flow is harder to manipulate than profit)",
      "Accounting standards (AS vs Ind AS) - key differences to watch",
      "Direct questions an ID should ask the CFO during financial audits"
    ]
  },
  {
    day: 20,
    title: "Key Financial Ratios & Warning Red Flags",
    category: "Financials",
    description: "Master financial ratios to spot distress or accounting manipulations before they become corporate disasters.",
    keySections: ["Ratio Analysis", "Forensic Accounting Basics"],
    outline: [
      "Liquidity Ratios: Current Ratio, Quick Ratio (testing short-term viability)",
      "Leverage Ratios: Debt-to-Equity, Interest Coverage Ratio (measuring insolvency risk)",
      "Profitability Ratios: ROCE, ROE, Operating Profit Margin",
      "Forensic indicators: Divergence in PAT vs Operating Cash Flow, inventory bloating, trade receivables rising faster than revenue",
      "Case studies of corporate financial failures: IL&FS, Satyam, DHFL"
    ]
  },
  {
    day: 21,
    title: "Directors' Responsibility Statement & IFC",
    category: "Financials",
    description: "Understand what directors are certifying in the Directors' Responsibility Statement (DRS) and the internal financial controls framework.",
    keySections: ["Section 134(5)", "Section 143(3)(i)"],
    outline: [
      "The content of the Directors' Responsibility Statement (DRS) in the Board's Report",
      "Compliance with accounting standards, selection of prudent accounting policies",
      "Maintaining adequate accounting records for safeguarding assets and preventing fraud",
      "Internal Financial Controls (IFC): Designing, implementing, and operating controls effectively",
      "Auditor's reporting duty on IFC and the Board's response"
    ]
  },
  {
    day: 22,
    title: "Secretarial Standards (SS-1 & SS-2)",
    category: "Financials",
    description: "Learn the ICSI Secretarial Standards (SS-1 on Board Meetings and SS-2 on General Meetings) which are legally binding.",
    keySections: ["Section 118(10)", "SS-1 (Board Meetings)", "SS-2 (General Meetings)"],
    outline: [
      "The legal mandate under Section 118(10) of Companies Act to comply with Secretarial Standards",
      "SS-1: Detailed rules on agenda notes, notice delivery proof, and recording of dissent in minutes",
      "Drafting and circulating draft minutes (within 15 days of meeting) and finalized minutes (within 30 days)",
      "SS-2: Rules on conducting General Meetings (AGM/EGM), proxies, voting, and video layouts",
      "Penalties for non-compliance with Secretarial Standards"
    ]
  },
  {
    day: 23,
    title: "Statutory, Internal & Cost Audits",
    category: "Financials",
    description: "Understand the different types of audits a company undergoes, and how the Audit Committee coordinates them.",
    keySections: ["Section 139", "Section 138", "Section 148", "Section 143"],
    outline: [
      "Statutory Audit: Appointment, qualification, rotation of auditors (individual 5 years, firm 10 years limit)",
      "Internal Audit (Section 138): Mandatory for listed and large unlisted companies. Role in checking internal controls",
      "Cost Audit (Section 148): Specific manufacturing/regulated sectors requirements",
      "Auditor's right to access, reporting duties, and direct report to Central Government in case of fraud (S. 143(12))",
      "Protecting the Independence of the Auditor (services auditor cannot perform under Section 144)"
    ]
  },
  {
    day: 24,
    title: "CARO 2020: Implications for Board Members",
    category: "Financials",
    description: "Examine CARO 2020 (Companies Auditor's Report Order) - what the auditor has to report to the government, and why IDs must study CARO report drafts.",
    keySections: ["CARO 2020", "Section 143(11)"],
    outline: [
      "What is CARO 2020? (Comprehensive reporting checklist for auditors of public/large companies)",
      "Critical reporting clauses: Property, Plant and Equipment title deeds, inventory physical verification, loans to related parties",
      "Reporting on default in repayment of loans, whistleblowing complaints received, and cash losses",
      "Reporting on material uncertainty of meeting liabilities within 1 year (testing solvency)",
      "How to use CARO drafts to flag executive misbehavior in board meetings"
    ]
  },
  {
    day: 25,
    title: "Business Ethics & Professional Conduct",
    category: "Ethics & CSR",
    description: "Explore the philosophy of ethics in the boardroom. Learn how to navigate gray areas where something is legal but unethical.",
    keySections: ["Schedule IV (Section I)", "Corporate Social Responsibility Code"],
    outline: [
      "Defining business ethics and its impact on brand value and long-term shareholder returns",
      "Fiduciary duty of directors: Acting in good faith to promote the objects of the company for all stakeholders",
      "Recognizing systemic biases in executive reports (optimism bias, groupthink)",
      "Managing conflicts of interest: When to rescue yourself from discussions and votes",
      "Setting the 'Tone from the Top'—whistleblower channels, ethical guidelines"
    ]
  },
  {
    day: 26,
    title: "Corporate Social Responsibility (Section 135)",
    category: "Ethics & CSR",
    description: "Deep dive into CSR legislation in India—one of the few countries with mandated CSR spending. Rules, allocations, and penalties.",
    keySections: ["Section 135", "Schedule VII", "CSR Rules 2014"],
    outline: [
      "The CSR spending requirement: 2% of average net profits of preceding 3 financial years",
      "Treatment of unspent CSR funds (transfer to designated government funds vs unspent CSR account for ongoing projects)",
      "Permitted activities under Schedule VII (poverty eradication, education, gender equality, environment, PM CARES fund)",
      "Impact assessment rules for large CSR projects",
      "The severe penal provisions for non-compliance with S. 135 (fines on company and officers in default)"
    ]
  },
  {
    day: 27,
    title: "Managing Boardroom Conflict & Dissent",
    category: "Boardroom",
    description: "Develop the soft skills needed to voice concerns in a hostile boardroom. Learn how to navigate pushback from promoters.",
    keySections: ["Dissent Recording", "Schedule IV Guidelines"],
    outline: [
      "The role of the ID as a constructive critic—not an adversary, but a guard",
      "How to raise hard questions without shutting down conversation (using open-ended, data-driven questions)",
      "The absolute necessity of recording 'Dissent' in the minutes of the board meetings",
      "Handling pushback: Retaliatory removal, withholding information, exclusion from unofficial pre-board briefings",
      "Case studies of famous boardroom battles (Tata-Mistry, Fortis, etc.)"
    ]
  },
  {
    day: 28,
    title: "Insolvency & Bankruptcy Code (IBC) Overview",
    category: "Boardroom",
    description: "Learn what happens when a company defaults on debt. Understand the insolvency resolution process and the liabilities of directors during insolvency.",
    keySections: ["IBC 2016", "Section 66 (Wrongful Trading)"],
    outline: [
      "The trigger for Insolvency: Default of Rs 1 crore or more by corporate debtor",
      "Corporate Insolvency Resolution Process (CIRP) timeline and suspension of the Board of Directors",
      "Powers shift to the Resolution Professional (RP) and the Committee of Creditors (CoC)",
      "Section 66 of IBC: 'Wrongful Trading' liability for directors who failed to take diligence during impending insolvency",
      "Avoiding look-back transactions, undervalued transactions, or preferential payments"
    ]
  },
  {
    day: 29,
    title: "Crisis Management & Fraud (S. 447)",
    category: "Boardroom",
    description: "Understand legal definitions of fraud under Section 447, and prepare a plan of action for when a crisis hits.",
    keySections: ["Section 447", "Section 448", "Section 143(12)"],
    outline: [
      "The severe definition and penalty of 'Fraud' under Section 447 (cognizable, non-bailable, heavy imprisonment and fine)",
      "Reporting of fraud by auditors (Section 143(12)) to the Audit Committee/Government",
      "IDs role in triggering internal forensic investigations",
      "Crisis communication: Formulating press releases, handling SEBI queries, maintaining investor confidence",
      "Setting up independent investigation committees (unbiased board sub-units)"
    ]
  },
  {
    day: 30,
    title: "Grand Review & Mock Boardroom Scenarios",
    category: "Boardroom",
    description: "The ultimate synthesis of the 30-day course. Master the art of solving complex real-world situational MCQs.",
    keySections: ["Final Prep", "IICA Mock Exam Prep"],
    outline: [
      "Review of high-weightage chapters (Companies Act, Audit Committee, RPT)",
      "Analyzing case-study based questions (Which require balancing shareholder interests, legal regulations, and ethical judgments)",
      "Exam-taking strategy: managing the 2-hour window, handling tricky phrasing, elimination techniques",
      "Post-exam compliance: Registration on the IICA Databank and annual filing requirements",
      "Continuous professional development guidelines for Independent Directors"
    ]
  }
];

export const sampleFlashcards: Flashcard[] = [
  {
    id: "fc_1",
    topic: "Quorum",
    question: "What is the quorum requirement for board meetings under the Companies Act 2013?",
    answer: "The quorum is 1/3rd of the total strength of the Board of Directors or 2 directors, whichever is higher. Participation via video conferencing is counted towards the quorum.",
    section: "Section 174"
  },
  {
    id: "fc_2",
    topic: "Term of Office",
    question: "What is the maximum term an Independent Director can serve consecutively?",
    answer: "An Independent Director can hold office for up to 5 consecutive years, and is eligible for re-appointment for a second term of 5 years by passing a Special Resolution. After 2 consecutive terms (10 years), a mandatory cooling-off period of 3 years is required before re-appointment.",
    section: "Section 149(10) & 149(11)"
  },
  {
    id: "fc_3",
    topic: "Audit Committee",
    question: "What is the composition requirement of the Audit Committee under SEBI LODR?",
    answer: "Under SEBI LODR Reg 18, the Audit Committee must have at least 3 members, all of whom must be financially literate. At least 2/3rds of the members must be Independent Directors, and the Chairperson MUST be an Independent Director.",
    section: "SEBI LODR Regulation 18"
  },
  {
    id: "fc_4",
    topic: "Related Party Transactions",
    question: "Does a Related Party Transaction in the ordinary course of business at arm's length require Board approval under Section 188?",
    answer: "No. Transactions entered into by the company in its 'ordinary course of business' and done at 'arm's length basis' are exempt from the restrictive provisions and approvals of Section 188(1). However, Audit Committee approval is still generally required under SEBI/Omnibus policies.",
    section: "Section 188(1) Proviso"
  },
  {
    id: "fc_5",
    topic: "Vigil Mechanism",
    question: "Which unlisted public companies must establish a Vigil Mechanism under the Companies Act 2013?",
    answer: "Unlisted public companies that have: (a) accepted deposits from the public, or (b) borrowed money from banks/public financial institutions in excess of Rs. 50 crore.",
    section: "Section 177(9) & Rule 7"
  },
  {
    id: "fc_6",
    topic: "Liability Shield",
    question: "Under what conditions is an Independent Director held liable for company defaults?",
    answer: "An Independent Director is only liable for acts of omission or commission which occurred with their knowledge (attributable through Board processes), and with their consent or connivance, or where they failed to act diligently.",
    section: "Section 149(12)"
  }
];
