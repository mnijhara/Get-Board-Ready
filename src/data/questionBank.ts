// Real IICA exam questions extracted from SkillArbitrage Independent Director 30-Day Program
// WhatsApp community — verified with correct answers and explanations

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  category: string;
  section?: string;
}

export const questionBank: ExamQuestion[] = [
  // ── INDEPENDENT DIRECTOR ELIGIBILITY & APPOINTMENT ──────────
  {
    id: "q001",
    question: "Which of the following committees under SEBI (LODR) Regulations, 2015 requires a majority of its members to be Independent Directors?",
    options: ["Nomination & Remuneration Committee", "Audit Committee", "CSR Committee", "Risk Management Committee"],
    correctAnswerIndex: 1,
    explanation: "As per Regulation 18 of SEBI LODR, the Audit Committee must have at least 3 directors, and a majority of them should be Independent Directors. This ensures objective oversight of financial reporting, internal controls, and audits.",
    category: "SEBI LODR",
    section: "Regulation 18"
  },
  {
    id: "q002",
    question: "Under SEBI (LODR) Regulations, 2015, if the Chairperson of the board is an Executive Director (e.g., MD/CEO), what proportion of the board must consist of Independent Directors?",
    options: ["One-third of the board", "One-fourth of the board", "Two-thirds of the board", "At least half of the board"],
    correctAnswerIndex: 3,
    explanation: "SEBI (LODR) Regulation 17(1A) states that if the chairperson of the board is an executive director (such as MD/CEO), then at least half of the board of directors must be independent.",
    category: "SEBI LODR",
    section: "Regulation 17(1A)"
  },
  {
    id: "q003",
    question: "What is the maximum tenure allowed for an Independent Director in the same company (without cooling-off)?",
    options: ["3 years", "5 years", "10 years", "7 years"],
    correctAnswerIndex: 2,
    explanation: "An Independent Director can hold office for two consecutive terms of 5 years each (total 10 years). After this, a 3-year cooling-off is mandatory before reappointment.",
    category: "Companies Act 2013",
    section: "Section 149"
  },
  {
    id: "q004",
    question: "Can an Independent Director be granted stock options?",
    options: ["Yes, without restriction", "Yes, with Board approval", "No, they are prohibited from receiving stock options", "Yes, but only after 2 years of service"],
    correctAnswerIndex: 2,
    explanation: "Independent Directors are prohibited from receiving stock options to maintain their independence and avoid conflicts of interest. This applies under both the Companies Act 2013 and SEBI LODR regulations.",
    category: "Companies Act 2013",
    section: "Section 149(9)"
  },
  {
    id: "q005",
    question: "What is the minimum number of Independent Directors required in a listed public company?",
    options: ["One-third of the Board", "One-fourth of the Board", "Two-thirds of the Board", "Half of the Board"],
    correctAnswerIndex: 0,
    explanation: "As per Section 149(4) of the Companies Act 2013, listed public companies must appoint at least one-third of their total number of directors as Independent Directors.",
    category: "Companies Act 2013",
    section: "Section 149(4)"
  },
  {
    id: "q006",
    question: "What is the 'cooling-off period' after completing two terms as an Independent Director?",
    options: ["5 years", "3 years", "2 years", "1 year"],
    correctAnswerIndex: 1,
    explanation: "After serving two consecutive terms (10 years), the Independent Director must step down for at least 3 years before being reappointed in the same company.",
    category: "Companies Act 2013",
    section: "Section 149(10)"
  },
  {
    id: "q007",
    question: "Which of the following qualifies as a material pecuniary relationship that disqualifies an Independent Director?",
    options: ["Receiving ₹500 as sitting fee", "Receiving reimbursement of travel expenses", "Receiving commission within permitted limits", "A consultancy fee exceeding 10% of the individual's total income"],
    correctAnswerIndex: 3,
    explanation: "A consultancy fee exceeding 10% of the individual's total income is considered a material pecuniary relationship, which disqualifies the person from being an Independent Director under Section 149(6).",
    category: "Companies Act 2013",
    section: "Section 149(6)"
  },
  {
    id: "q008",
    question: "An Independent Director is liable for company fraud when:",
    options: ["The fraud occurred with their knowledge and consent", "The fraud happened during their tenure regardless of knowledge", "They missed more than 3 board meetings", "The audit committee failed to detect it"],
    correctAnswerIndex: 0,
    explanation: "As per Section 149(12), an Independent Director is liable only when the fraud occurs with their knowledge, consent, or lack of due diligence. This protects IDs who act in good faith.",
    category: "Companies Act 2013",
    section: "Section 149(12)"
  },
  {
    id: "q009",
    question: "According to SEBI's eligibility rules, which of the following is NOT allowed for an Independent Director?",
    options: ["Holding more than 2% shares", "Serving on the Audit Committee", "Receiving sitting fees", "Attending AGMs"],
    correctAnswerIndex: 0,
    explanation: "SEBI rules prohibit Independent Directors from holding more than 2% of a company's shares to ensure independence. They may serve two terms of 5 years each, provided they remain free from promoter ties.",
    category: "SEBI LODR",
    section: "Regulation 16"
  },
  {
    id: "q010",
    question: "Which board committee must have two-thirds Independent Directors according to SEBI (LODR)?",
    options: ["Nomination & Remuneration Committee", "CSR Committee", "Stakeholders Relationship Committee", "Audit Committee"],
    correctAnswerIndex: 3,
    explanation: "SEBI requires the Audit Committee to consist of at least two-thirds Independent Directors to ensure fair and unbiased scrutiny of financial statements.",
    category: "SEBI LODR",
    section: "Regulation 18"
  },
  // ── BOARD MEETINGS & GENERAL MEETINGS ───────────────────────
  {
    id: "q011",
    question: "Which of the following statements regarding Board Meetings is NOT correct under the Companies Act, 2013?",
    options: ["The first Board Meeting must be held within 30 days of incorporation.", "The gap between two consecutive Board Meetings shall not exceed 120 days.", "The quorum for a Board Meeting shall be one-third or two directors, whichever is higher.", "Notice of the Board Meeting must be given at least 14 days before the meeting."],
    correctAnswerIndex: 3,
    explanation: "As per Section 173(3) of the Companies Act, 2013, a minimum of 7 days' notice is required to convene a Board Meeting. The 14-day notice period applies to general meetings, not Board Meetings. Hence, statement D is incorrect.",
    category: "Companies Act 2013",
    section: "Section 173"
  },
  {
    id: "q012",
    question: "How many Board Meetings must every company hold in each calendar year, as per Section 173(1)?",
    options: ["At least one meeting in each quarter", "At least four meetings, with not more than 120 days' gap between two meetings", "At least two meetings, with not more than 90 days' gap between two meetings", "At least one meeting every six months"],
    correctAnswerIndex: 1,
    explanation: "Section 173(1) mandates that every company must hold a minimum of four Board Meetings every year, and the gap between two consecutive meetings should not exceed 120 days.",
    category: "Companies Act 2013",
    section: "Section 173(1)"
  },
  {
    id: "q013",
    question: "Under Section 101 of the Companies Act, 2013, what is the minimum notice period required for calling an Annual General Meeting (AGM)?",
    options: ["3 days' notice", "7 days' notice", "14 clear days' notice", "21 clear days' notice"],
    correctAnswerIndex: 3,
    explanation: "For an AGM or any General Meeting, at least 21 clear days' notice must be given to all members, directors, and auditors. 'Clear days' means excluding the day of sending and the day of the meeting.",
    category: "Companies Act 2013",
    section: "Section 101"
  },
  {
    id: "q014",
    question: "Who among the following can convene an Extraordinary General Meeting (EGM) if the Board fails to do so on requisition by members?",
    options: ["Registrar of Companies", "National Company Law Tribunal", "The requisitioning members themselves", "The independent directors collectively"],
    correctAnswerIndex: 2,
    explanation: "Under Section 100(4) of the Companies Act, 2013, if the Board fails to convene an EGM within 21 days of receiving a valid requisition, the requisitionists may themselves call the meeting within 45 days of the requisition date.",
    category: "Companies Act 2013",
    section: "Section 100(4)"
  },
  {
    id: "q015",
    question: "When must a company hold the first meeting of its Board of Directors under the Companies Act, 2013?",
    options: ["Within 15 days of the date of its incorporation", "Within 30 days of the date of its incorporation", "Within 45 days of the date of its incorporation", "Within 60 days of the date of its incorporation"],
    correctAnswerIndex: 1,
    explanation: "Section 173(1) requires the first Board Meeting to be held within 30 days of incorporation. This ensures the Board is constituted and begins its governance role promptly.",
    category: "Companies Act 2013",
    section: "Section 173(1)"
  },
  {
    id: "q016",
    question: "Which of the following persons cannot be appointed as a Chairman of a general meeting as per the Companies Act, 2013?",
    options: ["A director chosen by the members present", "An independent director appointed by the Board", "Any member personally present and chosen by the members", "A proxy attending on behalf of a member"],
    correctAnswerIndex: 3,
    explanation: "A proxy may attend and vote on behalf of a member but cannot act as a chairman of a general meeting. Only a member or director personally present can be appointed as Chairman.",
    category: "Companies Act 2013",
    section: "Section 104"
  },
  // ── AUDIT & FINANCIAL REPORTING ─────────────────────────────
  {
    id: "q017",
    question: "What is the maximum fine for an auditor who fails to report fraud under Section 143(12)?",
    options: ["₹25 lakh", "₹10 lakh", "₹50 lakh", "₹5 lakh"],
    correctAnswerIndex: 0,
    explanation: "Section 143(12) mandates auditors to report fraud discovered during audit. If an auditor fails to report fraud exceeding ₹1 crore to the Central Government (within 60 days), they are liable for a penalty fine up to ₹25 lakh.",
    category: "Companies Act 2013",
    section: "Section 143(12)"
  },
  {
    id: "q018",
    question: "Within how many days must an auditor who resigns file the resignation form with the Registrar?",
    options: ["15 days", "30 days", "7 days", "45 days"],
    correctAnswerIndex: 1,
    explanation: "When an auditor resigns before the expiry of their term, they must file the resignation form with both the Registrar of Companies and the company within 30 days of resignation.",
    category: "Companies Act 2013",
    section: "Section 140"
  },
  {
    id: "q019",
    question: "What is the minimum fine for a company for non-maintenance of books of account?",
    options: ["₹10,000", "₹50,000", "₹25,000", "₹1,00,000"],
    correctAnswerIndex: 2,
    explanation: "Section 128(6) prescribes penalties for companies failing to maintain proper books of account. The company faces a fine ranging from a minimum of ₹25,000 to a maximum of ₹5,00,000.",
    category: "Companies Act 2013",
    section: "Section 128(6)"
  },
  {
    id: "q020",
    question: "Under which section of the Companies Act, 2013 is the National Financial Reporting Authority (NFRA) established?",
    options: ["Section 128", "Section 129", "Section 132", "Section 143"],
    correctAnswerIndex: 2,
    explanation: "NFRA was established under Section 132 of the Companies Act, 2013 as an independent regulator to oversee the auditing profession and accounting standards.",
    category: "Companies Act 2013",
    section: "Section 132"
  },
  {
    id: "q021",
    question: "If the first auditor is not appointed by the Board, within how many days must members appoint the auditor in an EGM?",
    options: ["30 days", "60 days", "120 days", "90 days"],
    correctAnswerIndex: 3,
    explanation: "Under Section 139, the Board of Directors must appoint the first auditor within 30 days of company registration. If the Board fails to do so, the members must convene an EGM and appoint the auditor within 90 days from the date of registration.",
    category: "Companies Act 2013",
    section: "Section 139"
  },
  // ── CSR ─────────────────────────────────────────────────────
  {
    id: "q022",
    question: "Can excess CSR spending in one year be set off against requirements of subsequent years?",
    options: ["Yes, for up to 2 years", "Yes, with Board approval", "Yes, for up to 3 years", "No, each year's obligation must be met independently"],
    correctAnswerIndex: 3,
    explanation: "The CSR Rules explicitly prohibit carrying forward excess CSR spending to subsequent years. Each financial year's 2% obligation must be calculated and fulfilled independently based on that year's average net profits.",
    category: "Companies Act 2013",
    section: "Section 135 / CSR Rules"
  },
  {
    id: "q023",
    question: "Which of the following is NOT included in Schedule VII as an eligible CSR activity?",
    options: ["Eradication of hunger and poverty", "Environmental sustainability", "Dividend distribution to shareholders", "Rural development projects"],
    correctAnswerIndex: 2,
    explanation: "Schedule VII lists specific social welfare activities as eligible CSR expenditure. Dividend distribution to shareholders is explicitly not a CSR activity because CSR funds must benefit external stakeholders and society, not return profits to company owners.",
    category: "Companies Act 2013",
    section: "Section 135 / Schedule VII"
  },
  {
    id: "q024",
    question: "Within how many days must unspent CSR amounts for ongoing projects be transferred to a special account?",
    options: ["15 days of financial year-end", "30 days of financial year-end", "60 days of financial year-end", "90 days of financial year-end"],
    correctAnswerIndex: 1,
    explanation: "For ongoing CSR projects, unspent amounts must be transferred to a special 'Unspent Corporate Social Responsibility Account' with a scheduled bank within 30 days from financial year end.",
    category: "Companies Act 2013",
    section: "Section 135(6)"
  },
  {
    id: "q025",
    question: "What is the maximum fine for a company for non-compliance with CSR provisions?",
    options: ["₹5 lakh", "₹10 lakh", "₹50 lakh", "₹25 lakh"],
    correctAnswerIndex: 3,
    explanation: "The Companies Act prescribes a penalty for companies failing to comply with CSR provisions—a fine of at least ₹50,000, which may extend up to ₹25 lakh.",
    category: "Companies Act 2013",
    section: "Section 135"
  },
  {
    id: "q026",
    question: "What is the maximum imprisonment term for officers in default for CSR non-compliance?",
    options: ["One year", "Two years", "Five years", "Three years"],
    correctAnswerIndex: 3,
    explanation: "Officers in default face personal criminal liability for CSR non-compliance—imprisonment up to three years OR fine of ₹50,000 to ₹5 lakh, OR both.",
    category: "Companies Act 2013",
    section: "Section 135"
  },
  // ── SEBI LODR REGULATIONS ───────────────────────────────────
  {
    id: "q027",
    question: "Under Regulation 17 of SEBI (LODR), which of the following is mandatory for listed companies?",
    options: ["At least 1 woman director", "At least 2 CEO positions", "No requirement for independent directors", "Chairperson must be CEO"],
    correctAnswerIndex: 0,
    explanation: "Regulation 17 mandates at least one woman director on the Board of a listed company, in addition to the minimum proportion of independent directors.",
    category: "SEBI LODR",
    section: "Regulation 17"
  },
  {
    id: "q028",
    question: "Under Regulation 18 of SEBI (LODR), which of the following is true?",
    options: ["Audit Committee can include executives", "Majority of members must be independent directors", "Chairman must be the CEO", "Committee is optional"],
    correctAnswerIndex: 1,
    explanation: "Regulation 18 requires independent directors to form a majority in the Audit Committee to ensure unbiased oversight of financial reporting and internal controls.",
    category: "SEBI LODR",
    section: "Regulation 18"
  },
  {
    id: "q029",
    question: "Under Regulation 20, the Stakeholders' Relationship Committee (SRC) primarily deals with:",
    options: ["Board composition", "Shareholders' complaints and investor grievances", "Internal audits", "Corporate Social Responsibility projects"],
    correctAnswerIndex: 1,
    explanation: "SRC ensures timely resolution of complaints related to transfers, dividends, or dematerialization. It primarily handles shareholder and investor grievance redressal.",
    category: "SEBI LODR",
    section: "Regulation 20"
  },
  {
    id: "q030",
    question: "What is the threshold for a material pecuniary relationship that would disqualify an independent director?",
    options: ["Transaction exceeding 5% of revenues or ₹1 crore, whichever is lower", "Transaction exceeding 10% of revenues or ₹2 crores, whichever is lower", "Transaction exceeding 15% of revenues or ₹5 crores, whichever is lower", "Transaction exceeding 20% of revenues or ₹10 crores, whichever is lower"],
    correctAnswerIndex: 1,
    explanation: "Section 149(6) states a relationship is 'material' if transaction value exceeds 10% of company's revenues OR ₹2 crores (whichever is lower). Sitting fees and reimbursements are excluded.",
    category: "Companies Act 2013",
    section: "Section 149(6)"
  },
  // ── GOVERNANCE & CASE STUDIES ───────────────────────────────
  {
    id: "q031",
    question: "Which of the following represents the most critical failure of Independent Directors in the Satyam case?",
    options: ["Not attending enough board meetings", "Not questioning related party transactions and inflated accounts", "Not filing MCA returns on time", "Not appointing an internal auditor"],
    correctAnswerIndex: 1,
    explanation: "Independent Directors failed to exercise due diligence when Satyam proposed acquiring Maytas Infra and Properties (owned by the promoter's sons). Their silence on such a blatant conflict of interest showed a breakdown in corporate governance and vigilance.",
    category: "Corporate Governance",
    section: "Case Study: Satyam"
  },
  {
    id: "q032",
    question: "The Satyam scandal directly led to which of the following key reforms under the Companies Act, 2013?",
    options: ["Removal of requirement for Independent Directors", "Establishment of the National Financial Reporting Authority (NFRA)", "Abolition of the Audit Committee", "Reduction in penalty for fraud"],
    correctAnswerIndex: 1,
    explanation: "After the Satyam scam, the Companies Act, 2013 introduced NFRA to strengthen audit oversight, enforce auditor accountability, and ensure higher standards of corporate governance.",
    category: "Corporate Governance",
    section: "Section 132 / Satyam Reform"
  },
  {
    id: "q033",
    question: "When a company reports rising profits but consistently negative cash flow from operations, what should be the ID's immediate concern?",
    options: ["Excessive dividend payout", "Manipulated accruals or fake revenue", "High tax payments", "Rapid expansion plans"],
    correctAnswerIndex: 1,
    explanation: "Negative cash flow despite high profits often means profits exist only 'on paper,' indicating aggressive accounting or questionable revenue recognition. This is a major governance red flag.",
    category: "Financial Forensics",
    section: "Balance Sheet Analysis"
  },
  {
    id: "q034",
    question: "Rapid increase in receivables compared to revenue suggests which governance issue?",
    options: ["Excessive tax provisioning", "Strong sales performance", "Potential round-tripping or fake sales", "Improving collection efficiency"],
    correctAnswerIndex: 2,
    explanation: "When receivables rise disproportionately, it suggests sales may be inflated through fake or credit-heavy transactions not collected in cash — a classic sign of round-tripping or revenue manipulation.",
    category: "Financial Forensics",
    section: "Balance Sheet Analysis"
  },
  {
    id: "q035",
    question: "Frequent related-party transactions (RPTs) in the balance sheet generally indicate:",
    options: ["Strong operational efficiency", "Risk of promoter-driven diversion of funds", "Good corporate governance", "Healthy business relationships"],
    correctAnswerIndex: 1,
    explanation: "Excessive RPTs often allow promoters to shift resources to their own entities, posing a major governance risk. IDs must scrutinize RPTs carefully under Section 188.",
    category: "Corporate Governance",
    section: "Section 188 / Related Party Transactions"
  },
  // ── SHARE CAPITAL & COMPANY LAW ─────────────────────────────
  {
    id: "q036",
    question: "Which of the following individuals are considered the true owners of a company?",
    options: ["Debenture holders", "Creditors", "Shareholders", "Employees"],
    correctAnswerIndex: 2,
    explanation: "Shareholders are the true owners of a company. They have ownership rights, including voting and dividends, and bear the residual risk and reward.",
    category: "Companies Act 2013",
    section: "Company Law Basics"
  },
  {
    id: "q037",
    question: "What does share capital primarily represent?",
    options: ["A loan obligation", "Ownership of the company by shareholders", "Fixed interest payments", "Government contribution"],
    correctAnswerIndex: 1,
    explanation: "Share capital gives shareholders ownership rights, including voting and dividends, unlike loans which are liabilities. Shareholders become co-owners sharing both profits and risks.",
    category: "Companies Act 2013",
    section: "Section 43"
  },
  {
    id: "q038",
    question: "What is the nature of shares/debentures as mentioned in Section 44 of the Companies Act, 2013?",
    options: ["Immovable property", "Movable property", "Intangible property", "Fixed asset"],
    correctAnswerIndex: 1,
    explanation: "Section 44 of the Companies Act, 2013 explicitly states that the shares or debentures and any interest therein of a company shall be movable property.",
    category: "Companies Act 2013",
    section: "Section 44"
  },
  {
    id: "q039",
    question: "Under the Companies Act, 2013, what is the maximum limit up to which a company can accept deposits from its members and the public (excluding inter-corporate deposits)?",
    options: ["25% of net worth of the company", "35% of net worth", "50% of net worth", "10% of net worth"],
    correctAnswerIndex: 0,
    explanation: "A company cannot accept deposits exceeding 25% of its net worth from members/shareholders and the public combined (excluding inter-corporate deposits), as per Section 73(2). This ensures financial stability.",
    category: "Companies Act 2013",
    section: "Section 73(2)"
  },
  {
    id: "q040",
    question: "How can an Independent Director be reappointed for a second term?",
    options: ["By passing an ordinary resolution in the Board meeting", "By passing an ordinary resolution in a shareholder meeting", "By passing a special resolution in a shareholder meeting", "By a simple majority vote of the Audit Committee"],
    correctAnswerIndex: 2,
    explanation: "Reappointment of an Independent Director for a second term requires a special resolution (75% majority) in a shareholders' meeting, after evaluating their performance.",
    category: "Companies Act 2013",
    section: "Section 149(10)"
  },
  {
    id: "q041",
    question: "What is the minimum number of members required for formation of a private company?",
    options: ["1", "2", "7", "5"],
    correctAnswerIndex: 1,
    explanation: "A private company requires a minimum of 2 members for formation under the Companies Act, 2013, while a public company requires a minimum of 7 members.",
    category: "Companies Act 2013",
    section: "Section 3"
  },
  {
    id: "q042",
    question: "Under Regulation 17 of SEBI (LODR), which of the following is true regarding independent directors?",
    options: ["They should form at least 1/3rd of the Board in listed companies", "They can hold unlimited directorships", "They can be full-time employees of the company", "They are not required to attend Board meetings"],
    correctAnswerIndex: 0,
    explanation: "Regulation 17 specifies that independent directors must form at least one-third of the Board for independence and oversight in listed companies.",
    category: "SEBI LODR",
    section: "Regulation 17(1)"
  },
  {
    id: "q043",
    question: "What forms the majority in the composition of the Audit Committee as per the Companies Act, 2013?",
    options: ["Executive directors", "Shareholders", "Independent directors", "Company employees"],
    correctAnswerIndex: 2,
    explanation: "The Audit Committee must have a majority of independent directors to ensure unbiased oversight of financial reporting, internal controls, and audit processes.",
    category: "Companies Act 2013",
    section: "Section 177"
  },
  {
    id: "q044",
    question: "What is the minimum number of independent directors required on the Nomination and Remuneration Committee for listed public companies?",
    options: ["Two", "Three", "One-third of total members", "One-half of total members"],
    correctAnswerIndex: 2,
    explanation: "The Nomination and Remuneration Committee for listed companies must have at least one-third of total members as independent directors, ensuring fair determination of director remuneration.",
    category: "Companies Act 2013",
    section: "Section 178"
  },
  {
    id: "q045",
    question: "How many members' support OR what percentage of voting power is required as an alternative to the deposit for director nomination?",
    options: ["50 members or 5% voting power", "75 members or 7.5% voting power", "100 members or 10% voting power", "150 members or 15% voting power"],
    correctAnswerIndex: 2,
    explanation: "Instead of ₹1,00,000 deposit (refundable if 25%+ votes are secured), candidates can get support from 100 members OR 10% voting power (whichever is lower). This protects minority shareholders' rights.",
    category: "Companies Act 2013",
    section: "Section 160"
  },
  {
    id: "q046",
    question: "Which of the following is NOT a fiduciary duty of directors?",
    options: ["Duty to act honestly", "Duty to protect shareholder interests", "Duty to act with due care and skill", "Duty to prepare Annual Report"],
    correctAnswerIndex: 3,
    explanation: "Preparing the annual report is a statutory duty (Section 134), not a fiduciary obligation arising from trust or loyalty. Fiduciary duties relate to honesty, loyalty, and acting in good faith.",
    category: "Companies Act 2013",
    section: "Section 166"
  },
  {
    id: "q047",
    question: "How can Directors participate in a meeting of the Board under the Companies Act, 2013?",
    options: ["In person only", "Through video conferencing or other audio visual means only", "In person or through video conferencing or other audio visual means", "Through telephonic conversation only"],
    correctAnswerIndex: 2,
    explanation: "Directors can participate in Board meetings either in person or through video conferencing or other audio visual means, as per Section 173(2) of the Companies Act 2013.",
    category: "Companies Act 2013",
    section: "Section 173(2)"
  },
  {
    id: "q048",
    question: "A company shows consistent profits but falling dividends. Which flag applies from an Independent Director's perspective?",
    options: ["Red flag – weak liquidity or cash flow strain", "Green flag – company is reinvesting profits", "Yellow flag – change in dividend policy", "No concern – dividends are optional"],
    correctAnswerIndex: 0,
    explanation: "If dividends fall despite profits, it may indicate hidden cash flow problems or stressed liquidity, not visible in the profit figure. IDs should probe this inconsistency.",
    category: "Financial Forensics",
    section: "Balance Sheet Analysis"
  },
  {
    id: "q049",
    question: "In a Partnership Form, if one partner commits a mistake, the other suffers. This feature represents which principle?",
    options: ["Joint and several liability", "Limited liability", "Corporate veil", "Perpetual succession"],
    correctAnswerIndex: 0,
    explanation: "In a partnership, all partners are equally responsible for each other's actions under the principle of joint and several liability. If one commits a mistake, the others are automatically liable too.",
    category: "Business Structures",
    section: "Partnership Law"
  },
  {
    id: "q050",
    question: "Which type of share gives voting rights in company decisions?",
    options: ["Preference shares", "Debentures", "Equity shares", "Bonds"],
    correctAnswerIndex: 2,
    explanation: "Equity shares provide voting rights and allow participation in management. Preference shares get priority in dividends but have limited or no voting rights.",
    category: "Companies Act 2013",
    section: "Section 43"
  },

  // ── NEW QUESTIONS FROM JULY 19-21, 2026 COMMUNITY SESSIONS ──
  {
    id: "q051",
    question: "A person becomes a 'member' of a company when:",
    options: ["They are employed by the company", "They are appointed as a director", "Their name is entered in the Register of Members", "They purchase debentures"],
    correctAnswerIndex: 2,
    explanation: "Membership is established when a person's name is entered in the Register of Members. Buying shares alone is not sufficient — formal registration is required.",
    category: "Companies Act 2013",
    section: "Section 2(55)"
  },
  {
    id: "q052",
    question: "Which section of the Companies Act requires directors to act with due care, skill, and diligence?",
    options: ["Section 149", "Section 166(3)", "Section 177", "Section 188"],
    correctAnswerIndex: 1,
    explanation: "Section 166(3) requires directors to act with due and reasonable care, skill, and diligence and to exercise independent judgment. This is a core fiduciary duty.",
    category: "Companies Act 2013",
    section: "Section 166(3)"
  },
  {
    id: "q053",
    question: "Under Section 244, depositors can file oppression complaints if they represent at least what percentage of total deposits?",
    options: ["2%", "5%", "10%", "15%"],
    correctAnswerIndex: 1,
    explanation: "Under Section 244, depositors can file oppression complaints if they represent 5% of total deposits OR at least 100 depositors, whichever is fewer. This prevents frivolous complaints while protecting significant creditors.",
    category: "Companies Act 2013",
    section: "Section 244"
  },
  {
    id: "q054",
    question: "Which section grants NCLT wide remedial powers including removing directors and recovering misapplied funds in oppression cases?",
    options: ["Section 241", "Section 242", "Section 244", "Section 246"],
    correctAnswerIndex: 1,
    explanation: "Section 242 grants NCLT wide powers including regulatory orders, remedial orders (removing directors, recovering misapplied funds), and protective orders. Section 241 deals with filing applications for oppression/mismanagement.",
    category: "Companies Act 2013",
    section: "Section 242"
  },
  {
    id: "q055",
    question: "Under Section 236, what minimum percentage of shareholders must agree before a parent company can squeeze out minority shareholders?",
    options: ["75%", "80%", "85%", "90%"],
    correctAnswerIndex: 3,
    explanation: "Section 236 allows parent companies to acquire minority shareholders' shares if at least 90% of shareholders have agreed to the transfer. This ensures overwhelming consent before forcing minority shareholders to sell.",
    category: "Companies Act 2013",
    section: "Section 236"
  },
  {
    id: "q056",
    question: "Within how many days must parties notify the Competition Commission of India (CCI) of a qualifying combination?",
    options: ["15 days", "30 days", "45 days", "60 days"],
    correctAnswerIndex: 1,
    explanation: "Parties must notify the CCI of qualifying combinations within 30 days of execution. The CCI reviews whether the combination causes adverse effects on competition, typically approving within 210 days.",
    category: "Corporate Governance",
    section: "Competition Act / CCI"
  },
  {
    id: "q057",
    question: "What minimum Debenture Redemption Reserve (DRR) must a company maintain before debenture redemption commences?",
    options: ["10% of debenture value", "20% of debenture value", "25% of debenture value", "30% of debenture value"],
    correctAnswerIndex: 2,
    explanation: "Section 71(2) mandates companies to create a DRR of at least 25% of debenture value before redemption commences. This reserve ensures adequate funds are available for repayment.",
    category: "Companies Act 2013",
    section: "Section 71(2)"
  },
  {
    id: "q058",
    question: "Within how many months of issue closure must a debenture trust deed be executed for secured debentures?",
    options: ["3 months", "6 months", "9 months", "12 months"],
    correctAnswerIndex: 1,
    explanation: "Under Section 71(1), the debenture trust deed must be executed within 6 months of issue closure for secured debentures. The trustee protects debenture holders' interests.",
    category: "Companies Act 2013",
    section: "Section 71(1)"
  },
  {
    id: "q059",
    question: "Within how many days must Form CHG-1 be filed after creation or modification of a charge?",
    options: ["15 days", "21 days", "30 days", "60 days"],
    correctAnswerIndex: 2,
    explanation: "Form CHG-1 must be filed within 30 days of charge creation or modification. Non-compliance leads to penalties, and the charge becomes void against the liquidator and creditors.",
    category: "Companies Act 2013",
    section: "Section 77 / CHG-1"
  },
  {
    id: "q060",
    question: "What minimum subscription percentage is required before allotment in a public issue of debentures?",
    options: ["75% of issue size", "80% of issue size", "90% of issue size", "100% of issue size"],
    correctAnswerIndex: 2,
    explanation: "Public issues of debentures require minimum 90% subscription before allotment. If not met within the specified period, all application money must be refunded.",
    category: "Companies Act 2013",
    section: "SEBI / Debenture Rules"
  },
  {
    id: "q061",
    question: "In the Bhushan Power & Steel (BPSL) insolvency case, why did the Supreme Court reverse the approved resolution plan?",
    options: ["Financial creditors withdrew consent", "Non-compliance with IBC procedural requirements including non-filing of Form H", "Failure of JSW Steel to infuse funds", "Dispute between JSW Steel and operational creditors"],
    correctAnswerIndex: 1,
    explanation: "The Supreme Court found major procedural lapses — non-filing of Form H, failure to verify Section 29A eligibility, and exceeding the 270-day CIRP timeline. This led to reversal and liquidation order.",
    category: "Corporate Governance",
    section: "IBC / CIRP Case Study"
  },
  {
    id: "q062",
    question: "What CoC voting threshold amendment enabled the Alok Industries resolution plan approval?",
    options: ["Introduction of Section 32A of IBC", "Reduction of CoC voting threshold from 75% to 66%", "Extension of CIRP timeline from 270 to 330 days", "Ordinance allowing retrospective immunity"],
    correctAnswerIndex: 1,
    explanation: "The June 2018 ordinance reduced the voting threshold for plan approval from 75% to 66%. This allowed the Reliance-JM Financial ARC plan to be approved, rescuing Alok Industries from liquidation.",
    category: "Corporate Governance",
    section: "IBC Amendment 2018"
  },
  {
    id: "q063",
    question: "In the Alok Industries insolvency case, what percentage haircut did the Committee of Creditors accept?",
    options: ["50%", "70%", "83%", "90%"],
    correctAnswerIndex: 2,
    explanation: "The CoC approved the plan with an 83% haircut — creditors recovered only about 17% of dues. This prioritized company revival over full debt recovery.",
    category: "Corporate Governance",
    section: "IBC Case Study"
  },
  {
    id: "q064",
    question: "How should a company strengthen its Independent Directors' effectiveness per SEBI LODR?",
    options: ["By excluding them from key meetings", "By conducting regular performance evaluation and providing training", "By avoiding disclosures to IDs", "By removing independent directors frequently"],
    correctAnswerIndex: 1,
    explanation: "SEBI LODR promotes structured evaluation and orientation programs to strengthen directors' competence, ensure independence, and improve governance effectiveness. Regular evaluation is mandatory for listed companies.",
    category: "SEBI LODR",
    section: "SEBI LODR / Schedule IV"
  },
  {
    id: "q065",
    question: "Which of the following best preserves an Independent Director's independence in practice?",
    options: ["Maintaining transparent disclosures and conflict-of-interest registers", "Avoiding Board meetings when conflicts arise", "Ignoring dissent opinions to maintain harmony", "Keeping related party information confidential from the Board"],
    correctAnswerIndex: 0,
    explanation: "Transparent disclosures, conflict-of-interest registers, and open Board deliberations preserve directors' independence and ensure ethical decision-making per Schedule IV of the Companies Act.",
    category: "Corporate Governance",
    section: "Schedule IV / Section 149"
  }
];

// Group questions by category for mock exam selection
export const questionsByCategory = questionBank.reduce((acc, q) => {
  if (!acc[q.category]) acc[q.category] = [];
  acc[q.category].push(q);
  return acc;
}, {} as Record<string, ExamQuestion[]>);

export const categories = Object.keys(questionsByCategory);
