/* Dixon Case Manager - seed data (demo only, all names fictional) */

const STAGES = ["Intake", "Investigation", "Treating", "Demand Prep", "Negotiation", "Litigation", "Settled"];

const FOLDER_TEMPLATE = [
  "01 Intake & Retainer",
  "02 Medical Records",
  "03 Bills & Liens",
  "04 Insurance",
  "05 Evidence & Police Report",
  "06 Demand",
  "07 Pleadings",
  "08 Settlement"
];

const CASES = [
  {
    id: "c1", num: "DIF-2026-041", client: "Marcus Reed", type: "Car Accident",
    stage: "Negotiation", opened: "2025-11-03", incident: "2025-10-21",
    phone: "(314) 555-0164", email: "marcus.reed@gmail.com",
    insurer: "State Farm", adjuster: "Karen Voss", claimNo: "55-J884-201",
    paralegal: "Dana Ellis", attorney: "Chris Dixon",
    estValue: 145000, sol: "2030-10-21",
    facts: "Rear-end collision on I-64 near Kingshighway. Client struck by a distracted driver, treated at SSM Health for cervical strain and a herniated disc at C5-C6.",
    medicals: [
      { provider: "SSM Health St. Mary's ER", status: "Complete", billed: 8420, lien: 0 },
      { provider: "Gateway Spine & Rehab", status: "Received", billed: 21350, lien: 12800 },
      { provider: "Metro Imaging (MRI)", status: "Received", billed: 3200, lien: 0 },
      { provider: "Dr. Alan Hurst, Orthopedics", status: "Requested", billed: 9600, lien: 9600 }
    ],
    negotiation: [
      { date: "2026-06-12", party: "Firm", kind: "Demand", amount: 175000, note: "Initial demand package sent to State Farm" },
      { date: "2026-07-08", party: "State Farm", kind: "Offer", amount: 62500, note: "First offer, disputes future treatment" },
      { date: "2026-07-21", party: "Firm", kind: "Counter", amount: 152000, note: "Countered with treating physician narrative" },
      { date: "2026-08-04", party: "State Farm", kind: "Offer", amount: 98000, note: "Second offer, requesting wage documentation" }
    ],
    checklist: [
      { label: "Retainer signed", done: true, date: "2025-11-03" },
      { label: "Police report obtained", done: true, date: "2025-11-10" },
      { label: "All medical records received", done: false, due: "2026-08-14" },
      { label: "Wage loss documentation to adjuster", done: false, due: "2026-08-11" },
      { label: "Evaluate second offer with client", done: false, due: "2026-08-10" }
    ],
    notes: [
      { date: "2026-08-04", by: "Dana Ellis", text: "State Farm at $98k. Client wants at least $125k. Chris to call adjuster Thursday." },
      { date: "2026-07-30", by: "Chris Dixon", text: "Client finished PT. Final orthopedic narrative requested from Dr. Hurst." }
    ],
    docs: [
      { folder: "04 Insurance", name: "State Farm second offer letter.pdf", date: "2026-08-04", isNew: true, ai: "Offer of $98,000. Disputes future care, requests wage records within 14 days." },
      { folder: "02 Medical Records", name: "Gateway Spine - final PT notes.pdf", date: "2026-08-01", isNew: true, ai: "Discharge after 22 sessions. Notes residual cervical pain, 8 percent impairment rating." },
      { folder: "06 Demand", name: "Demand package v2.pdf", date: "2026-07-21", isNew: false, ai: "Counter-demand of $152,000 with physician narrative and lien summary." },
      { folder: "05 Evidence & Police Report", name: "Crash report MO-25-118842.pdf", date: "2025-11-10", isNew: false, ai: "Defendant cited for following too closely. Two independent witnesses listed." },
      { folder: "01 Intake & Retainer", name: "Signed retainer - Reed.pdf", date: "2025-11-03", isNew: false, ai: "Standard contingency agreement, 33.3 percent pre-litigation." }
    ]
  },
  {
    id: "c2", num: "DIF-2026-038", client: "Angela Whitfield", type: "Car Accident",
    stage: "Treating", opened: "2026-02-17", incident: "2026-02-09",
    phone: "(314) 555-0187", email: "a.whitfield@outlook.com",
    insurer: "Progressive", adjuster: "Tom Brennan", claimNo: "26-4471-880",
    paralegal: "Dana Ellis", attorney: "Chris Dixon",
    estValue: 85000, sol: "2031-02-09",
    facts: "T-bone collision at Kingshighway and Delmar. Defendant ran a red light. Client treating for shoulder labrum tear, surgery under evaluation.",
    medicals: [
      { provider: "BJC Barnes-Jewish ER", status: "Complete", billed: 11200, lien: 0 },
      { provider: "STL Orthopedic Group", status: "Received", billed: 6800, lien: 6800 },
      { provider: "Momentum Physical Therapy", status: "Requested", billed: 4100, lien: 0 }
    ],
    negotiation: [],
    checklist: [
      { label: "Retainer signed", done: true, date: "2026-02-17" },
      { label: "Letter of representation to Progressive", done: true, date: "2026-02-19" },
      { label: "Surgery consult scheduled", done: false, due: "2026-08-20" },
      { label: "Order updated records from STL Ortho", done: false, due: "2026-09-01" }
    ],
    notes: [
      { date: "2026-08-03", by: "Dana Ellis", text: "Client leaning toward arthroscopic surgery. Hold demand until decision." }
    ],
    docs: [
      { folder: "02 Medical Records", name: "STL Ortho - surgery consult.pdf", date: "2026-08-05", isNew: true, ai: "Labrum tear confirmed on MRI. Surgeon recommends arthroscopic repair, est. $28,000." },
      { folder: "05 Evidence & Police Report", name: "Intersection camera still frames.pdf", date: "2026-03-02", isNew: false, ai: "Four frames showing defendant entering on red. Timestamp matches crash report." },
      { folder: "01 Intake & Retainer", name: "Signed retainer - Whitfield.pdf", date: "2026-02-17", isNew: false, ai: "Standard contingency agreement." }
    ]
  },
  {
    id: "c3", num: "DIF-2026-033", client: "Derrick Boyd", type: "Workers Comp",
    stage: "Demand Prep", opened: "2026-01-12", incident: "2025-12-28",
    phone: "(314) 555-0122", email: "dboyd.stl@gmail.com",
    insurer: "Travelers", adjuster: "Miguel Santos", claimNo: "WC-88-20441",
    paralegal: "Renee Carter", attorney: "Chris Dixon",
    estValue: 60000, sol: "2027-12-28",
    facts: "Forklift pallet fall at a Hazelwood distribution warehouse. Lumbar fracture at L2, released at MMI with permanent lifting restrictions.",
    medicals: [
      { provider: "Mercy Hospital St. Louis", status: "Complete", billed: 18900, lien: 0 },
      { provider: "Advanced Pain Management", status: "Complete", billed: 7300, lien: 0 }
    ],
    negotiation: [],
    checklist: [
      { label: "Claim filed with Division of Workers Comp", done: true, date: "2026-01-15" },
      { label: "MMI rating received", done: true, date: "2026-07-22" },
      { label: "Draft demand from rating report", done: false, due: "2026-08-12" }
    ],
    notes: [
      { date: "2026-07-22", by: "Renee Carter", text: "12 percent PPD rating to the body as a whole. Ready to build demand." }
    ],
    docs: [
      { folder: "02 Medical Records", name: "MMI rating report - Dr. Feld.pdf", date: "2026-07-22", isNew: true, ai: "12 percent permanent partial disability, body as a whole. Permanent 30 lb lifting restriction." },
      { folder: "01 Intake & Retainer", name: "Signed retainer - Boyd.pdf", date: "2026-01-12", isNew: false, ai: "Workers comp fee agreement, 25 percent." }
    ]
  },
  {
    id: "c4", num: "DIF-2026-047", client: "Tamika Johnson", type: "Slip and Fall",
    stage: "Investigation", opened: "2026-06-30", incident: "2026-06-18",
    phone: "(314) 555-0139", email: "tamika.j@yahoo.com",
    insurer: "Safeco", adjuster: "Unassigned", claimNo: "Pending",
    paralegal: "Renee Carter", attorney: "Chris Dixon",
    estValue: 40000, sol: "2031-06-18",
    facts: "Fall on an unmarked wet floor at a Dutchtown grocery store. Fractured wrist, ORIF surgery completed.",
    medicals: [
      { provider: "SLU Hospital ER", status: "Received", billed: 9400, lien: 0 },
      { provider: "Hand & Wrist Center STL", status: "Requested", billed: 15600, lien: 15600 }
    ],
    negotiation: [],
    checklist: [
      { label: "Preservation letter for CCTV footage", done: true, date: "2026-07-02" },
      { label: "Incident report from store", done: false, due: "2026-08-15" },
      { label: "Identify premises insurer of record", done: false, due: "2026-08-22" }
    ],
    notes: [
      { date: "2026-07-28", by: "Renee Carter", text: "Store manager confirmed camera covers aisle 9. Footage preservation acknowledged in writing." }
    ],
    docs: [
      { folder: "05 Evidence & Police Report", name: "CCTV preservation acknowledgment.pdf", date: "2026-07-28", isNew: true, ai: "Store counsel confirms 6 hours of aisle 9 footage preserved for the incident date." },
      { folder: "01 Intake & Retainer", name: "Signed retainer - Johnson.pdf", date: "2026-06-30", isNew: false, ai: "Standard contingency agreement." }
    ]
  },
  {
    id: "c5", num: "DIF-2026-029", client: "Robert Kessler", type: "Motorcycle Accident",
    stage: "Litigation", opened: "2025-09-08", incident: "2025-08-30",
    phone: "(636) 555-0171", email: "rkessler@charter.net",
    paralegal: "Dana Ellis", attorney: "Chris Dixon",
    insurer: "GEICO", adjuster: "Sandra Liu", claimNo: "0483-772-1",
    estValue: 320000, sol: "2030-08-30",
    facts: "Left-turn collision on Route 141 in Fenton. Femur fracture with rod placement. Suit filed in St. Louis County after GEICO refused policy limits.",
    medicals: [
      { provider: "Mercy Hospital South", status: "Complete", billed: 84200, lien: 61000 },
      { provider: "Restore Rehab Fenton", status: "Complete", billed: 12750, lien: 0 }
    ],
    negotiation: [
      { date: "2026-02-10", party: "Firm", kind: "Demand", amount: 300000, note: "Policy limits demand, 30 day deadline" },
      { date: "2026-03-06", party: "GEICO", kind: "Offer", amount: 110000, note: "Rejected. Suit filed 2026-04-02." }
    ],
    checklist: [
      { label: "Petition filed, St. Louis County", done: true, date: "2026-04-02" },
      { label: "Defendant deposition", done: false, due: "2026-09-16" },
      { label: "Respond to first interrogatories", done: false, due: "2026-08-25" }
    ],
    notes: [
      { date: "2026-08-01", by: "Chris Dixon", text: "Defense filed answer with comparative fault claim. Deposition set for September 16." }
    ],
    docs: [
      { folder: "07 Pleadings", name: "Defendant answer and affirmative defenses.pdf", date: "2026-08-01", isNew: true, ai: "Answer denies negligence, pleads comparative fault. No counterclaim." },
      { folder: "07 Pleadings", name: "First interrogatories to plaintiff.pdf", date: "2026-07-29", isNew: true, ai: "24 interrogatories. Responses due August 25. Flag: requests prior injury history." },
      { folder: "06 Demand", name: "Policy limits demand.pdf", date: "2026-02-10", isNew: false, ai: "Time-limited demand for $300,000 policy limits with full medical specials." }
    ]
  },
  {
    id: "c6", num: "DIF-2026-050", client: "Lakeisha Simmons", type: "Dog Bite",
    stage: "Intake", opened: "2026-08-04", incident: "2026-07-31",
    phone: "(314) 555-0146", email: "lsimmons314@gmail.com",
    insurer: "Allstate (homeowner)", adjuster: "Unassigned", claimNo: "Pending",
    paralegal: "Renee Carter", attorney: "Chris Dixon",
    estValue: 25000, sol: "2031-07-31",
    facts: "Bitten by a neighbor's dog in Tower Grove South. Puncture wounds to the forearm, treated at urgent care, scarring evaluation pending.",
    medicals: [
      { provider: "Total Access Urgent Care", status: "Requested", billed: 1850, lien: 0 }
    ],
    negotiation: [],
    checklist: [
      { label: "Retainer signed", done: true, date: "2026-08-04" },
      { label: "Animal control report", done: false, due: "2026-08-13" },
      { label: "Identify homeowner policy", done: false, due: "2026-08-18" }
    ],
    notes: [
      { date: "2026-08-04", by: "Renee Carter", text: "Client photographed wounds. Neighbor confirmed Allstate homeowner policy verbally." }
    ],
    docs: [
      { folder: "01 Intake & Retainer", name: "Signed retainer - Simmons.pdf", date: "2026-08-04", isNew: true, ai: "Standard contingency agreement." },
      { folder: "05 Evidence & Police Report", name: "Wound photos day 1.pdf", date: "2026-08-04", isNew: true, ai: "Six photos, two deep punctures to the right forearm." }
    ]
  },
  {
    id: "c7", num: "DIF-2026-025", client: "James O'Donnell", type: "Truck Accident",
    stage: "Negotiation", opened: "2025-08-19", incident: "2025-08-05",
    phone: "(314) 555-0110", email: "jodonnell@sbcglobal.net",
    insurer: "Great West Casualty", adjuster: "Beth Kramer", claimNo: "GW-51-99012",
    paralegal: "Dana Ellis", attorney: "Chris Dixon",
    estValue: 480000, sol: "2030-08-05",
    facts: "Struck by a commercial box truck merging on I-70 near Bridgeton. Three fractured ribs, punctured lung, ongoing pulmonary follow-up.",
    medicals: [
      { provider: "BJC Christian Hospital", status: "Complete", billed: 96300, lien: 72000 },
      { provider: "Midwest Pulmonary Associates", status: "Received", billed: 8900, lien: 0 }
    ],
    negotiation: [
      { date: "2026-05-20", party: "Firm", kind: "Demand", amount: 650000, note: "Demand with ELD and dashcam evidence" },
      { date: "2026-06-30", party: "Great West", kind: "Offer", amount: 275000, note: "First offer" },
      { date: "2026-07-25", party: "Firm", kind: "Counter", amount: 560000, note: "Countered citing driver logbook violations" }
    ],
    checklist: [
      { label: "ELD data preserved", done: true, date: "2025-09-01" },
      { label: "Counter response deadline", done: false, due: "2026-08-15" }
    ],
    notes: [
      { date: "2026-07-25", by: "Chris Dixon", text: "Carrier motivated to settle before FMCSA audit becomes public. Hold firm above $500k." }
    ],
    docs: [
      { folder: "04 Insurance", name: "Great West counter acknowledgment.pdf", date: "2026-07-26", isNew: true, ai: "Carrier acknowledges $560,000 counter, response promised by August 15." },
      { folder: "05 Evidence & Police Report", name: "Driver ELD log export.pdf", date: "2025-09-14", isNew: false, ai: "Driver exceeded 11-hour limit on incident date. Two prior violations in 30 days." }
    ]
  },
  {
    id: "c8", num: "DIF-2026-044", client: "Maria Alvarez", type: "Pedestrian Accident",
    stage: "Treating", opened: "2026-04-22", incident: "2026-04-15",
    phone: "(314) 555-0198", email: "malvarez.stl@gmail.com",
    insurer: "Progressive", adjuster: "Tom Brennan", claimNo: "26-5120-334",
    paralegal: "Renee Carter", attorney: "Chris Dixon",
    estValue: 110000, sol: "2031-04-15",
    facts: "Struck in a marked crosswalk on Grand Blvd near SLU. Tibial plateau fracture, non-surgical, in week 14 of rehab.",
    medicals: [
      { provider: "SLU Hospital ER", status: "Complete", billed: 14100, lien: 0 },
      { provider: "Peak Performance PT", status: "Requested", billed: 6200, lien: 0 }
    ],
    negotiation: [],
    checklist: [
      { label: "Crosswalk signal timing records", done: true, date: "2026-05-30" },
      { label: "Order week 12 progress notes", done: false, due: "2026-08-19" }
    ],
    notes: [
      { date: "2026-08-02", by: "Renee Carter", text: "Rehab ahead of schedule. Expect MMI by late September." }
    ],
    docs: [
      { folder: "02 Medical Records", name: "PT week 12 progress notes.pdf", date: "2026-08-02", isNew: true, ai: "Weight-bearing at 90 percent. Discharge projected at week 20." }
    ]
  },
  {
    id: "c9", num: "DIF-2025-096", client: "Cheryl Dunn", type: "Workers Comp",
    stage: "Settled", opened: "2025-03-10", incident: "2025-02-20",
    phone: "(636) 555-0157", email: "cdunn64@gmail.com",
    insurer: "Zurich", adjuster: "Paul Wexler", claimNo: "WC-77-10288",
    paralegal: "Renee Carter", attorney: "Chris Dixon",
    estValue: 47500, sol: "2027-02-20",
    facts: "Repetitive stress shoulder injury at a Maryland Heights packaging plant. Settled at mediation for $47,500.",
    medicals: [
      { provider: "Mercy Hospital St. Louis", status: "Complete", billed: 12400, lien: 0 }
    ],
    negotiation: [
      { date: "2026-06-18", party: "Both", kind: "Settlement", amount: 47500, note: "Settled at mediation" }
    ],
    checklist: [
      { label: "Settlement approved by ALJ", done: true, date: "2026-07-09" },
      { label: "Disbursement complete", done: true, date: "2026-07-24" },
      { label: "File closed", done: true, date: "2026-07-24" }
    ],
    notes: [
      { date: "2026-07-24", by: "Renee Carter", text: "Disbursement issued. File auto-closed by workflow." }
    ],
    docs: [
      { folder: "08 Settlement", name: "Settlement statement - Dunn.pdf", date: "2026-07-24", isNew: false, ai: "Gross $47,500. Fees $11,875, net to client $32,410 after expenses." }
    ]
  },
  {
    id: "c10", num: "DIF-2026-049", client: "Anthony Pham", type: "Rideshare Accident",
    stage: "Intake", opened: "2026-07-29", incident: "2026-07-25",
    phone: "(314) 555-0181", email: "apham.stl@icloud.com",
    insurer: "James River (Uber)", adjuster: "Unassigned", claimNo: "Pending",
    paralegal: "Dana Ellis", attorney: "Chris Dixon",
    estValue: 55000, sol: "2031-07-25",
    facts: "Rear-seat passenger in an Uber sideswiped on Hampton Ave. Whiplash and a wrist sprain, treating with a chiropractor.",
    medicals: [
      { provider: "Chiro One Southampton", status: "Requested", billed: 1200, lien: 0 }
    ],
    negotiation: [],
    checklist: [
      { label: "Retainer signed", done: true, date: "2026-07-29" },
      { label: "Confirm rideshare period 3 coverage", done: false, due: "2026-08-12" }
    ],
    notes: [
      { date: "2026-07-29", by: "Dana Ellis", text: "Trip receipt confirms active ride. $1M James River policy should apply." }
    ],
    docs: [
      { folder: "01 Intake & Retainer", name: "Uber trip receipt.pdf", date: "2026-07-29", isNew: true, ai: "Active trip at time of collision. Period 3 coverage, $1,000,000 liability limit." }
    ]
  },
  {
    id: "c11", num: "DIF-2026-036", client: "Kevin Brantley", type: "Bicycle Accident",
    stage: "Demand Prep", opened: "2026-02-02", incident: "2026-01-24",
    phone: "(314) 555-0129", email: "kbrantley@gmail.com",
    insurer: "State Farm", adjuster: "Karen Voss", claimNo: "55-K102-887",
    paralegal: "Dana Ellis", attorney: "Chris Dixon",
    estValue: 72000, sol: "2031-01-24",
    facts: "Doored on a bike lane on Tower Grove Ave. Fractured clavicle, plate fixation, released at MMI in July.",
    medicals: [
      { provider: "BJC Barnes-Jewish", status: "Complete", billed: 31800, lien: 22400 },
      { provider: "Forest Park PT", status: "Complete", billed: 5400, lien: 0 }
    ],
    negotiation: [],
    checklist: [
      { label: "All records and bills in", done: true, date: "2026-07-30" },
      { label: "AI demand draft review", done: false, due: "2026-08-11" }
    ],
    notes: [
      { date: "2026-08-05", by: "Dana Ellis", text: "Demand draft generated from file. Chris to review Monday." }
    ],
    docs: [
      { folder: "06 Demand", name: "Demand draft v1 (AI generated).docx", date: "2026-08-05", isNew: true, ai: "Draft demand of $115,000 built from records, bills, and lien ledger. Awaiting attorney review." },
      { folder: "03 Bills & Liens", name: "BJC lien ledger.pdf", date: "2026-07-30", isNew: false, ai: "Hospital lien of $22,400, negotiable per BJC policy after fee reduction request." }
    ]
  },
  {
    id: "c12", num: "DIF-2026-046", client: "Denise Walker", type: "Car Accident",
    stage: "Investigation", opened: "2026-06-09", incident: "2026-05-29",
    phone: "(314) 555-0175", email: "dwalker.stl@gmail.com",
    insurer: "GEICO", adjuster: "Sandra Liu", claimNo: "0491-208-5",
    paralegal: "Renee Carter", attorney: "Chris Dixon",
    estValue: 65000, sol: "2031-05-29",
    facts: "Multi-car chain collision on I-44 at Jamieson. Liability apportionment in dispute between two defendant insurers.",
    medicals: [
      { provider: "SSM Health St. Mary's", status: "Received", billed: 7600, lien: 0 },
      { provider: "Gateway Spine & Rehab", status: "Requested", billed: 3800, lien: 0 }
    ],
    negotiation: [],
    checklist: [
      { label: "Obtain both defendants' policy info", done: true, date: "2026-07-01" },
      { label: "Accident reconstruction consult", done: false, due: "2026-08-28" }
    ],
    notes: [
      { date: "2026-07-15", by: "Renee Carter", text: "GEICO accepts 60 percent, Shelter disputes the remainder. May need recon expert." }
    ],
    docs: [
      { folder: "05 Evidence & Police Report", name: "Crash report MO-26-044120.pdf", date: "2026-06-20", isNew: false, ai: "Three-vehicle chain. Officer assigns primary fault to rear vehicle, secondary contested." }
    ]
  },
  {
    id: "c13", num: "DIF-2026-019", client: "Gloria Sandoval", type: "Car Accident",
    stage: "Litigation", opened: "2025-06-16", incident: "2025-06-02",
    phone: "(314) 555-0114", email: "gsandoval@gmail.com",
    insurer: "Shelter Insurance", adjuster: "Craig Toole", claimNo: "SH-30-77245",
    paralegal: "Dana Ellis", attorney: "Chris Dixon",
    estValue: 210000, sol: "2030-06-02",
    facts: "Head-on collision on Gravois Ave, defendant crossed the center line. Bilateral wrist fractures, two surgeries. Suit filed after Shelter's final offer stalled at $85,000.",
    medicals: [
      { provider: "SLU Hospital", status: "Complete", billed: 52700, lien: 34000 },
      { provider: "Hand & Wrist Center STL", status: "Complete", billed: 24100, lien: 0 }
    ],
    negotiation: [
      { date: "2026-01-22", party: "Firm", kind: "Demand", amount: 275000, note: "Demand with surgical records and wage loss" },
      { date: "2026-02-27", party: "Shelter", kind: "Offer", amount: 85000, note: "Final pre-suit offer. Suit filed 2026-03-18." }
    ],
    checklist: [
      { label: "Petition filed, City of St. Louis", done: true, date: "2026-03-18" },
      { label: "Plaintiff deposition prep", done: false, due: "2026-08-27" },
      { label: "Mediation scheduled", done: false, due: "2026-10-06" }
    ],
    notes: [
      { date: "2026-07-31", by: "Dana Ellis", text: "Mediation set for October 6 with Judge Rehm (ret.). Client deposition prep the last week of August." }
    ],
    docs: [
      { folder: "07 Pleadings", name: "Notice of deposition - plaintiff.pdf", date: "2026-08-03", isNew: true, ai: "Plaintiff deposition noticed for September 2 at defense counsel's office. Prep session needed." }
    ]
  },
  {
    id: "c14", num: "DIF-2026-052", client: "Terrence Mabry", type: "Car Accident",
    stage: "Intake", opened: "2026-08-06", incident: "2026-08-02",
    phone: "(314) 555-0192", email: "tmabry88@gmail.com",
    insurer: "American Family", adjuster: "Unassigned", claimNo: "Pending",
    paralegal: "Dana Ellis", attorney: "Chris Dixon",
    estValue: 35000, sol: "2031-08-02",
    facts: "Sideswiped on Natural Bridge Ave by a driver changing lanes. Neck and shoulder pain, started chiropractic care yesterday. Signed from a website chat lead.",
    medicals: [
      { provider: "Chiro One Northside", status: "Requested", billed: 850, lien: 0 }
    ],
    negotiation: [],
    checklist: [
      { label: "Retainer signed", done: true, date: "2026-08-06" },
      { label: "Letter of representation to American Family", done: false, due: "2026-08-10" },
      { label: "Crash report request", done: false, due: "2026-08-12" }
    ],
    notes: [
      { date: "2026-08-06", by: "Dana Ellis", text: "Signed via e-sign 40 minutes after chat intake. Workflow opened the file and built the Drive folders automatically." }
    ],
    docs: [
      { folder: "01 Intake & Retainer", name: "Signed retainer - Mabry.pdf", date: "2026-08-06", isNew: true, ai: "Standard contingency agreement, signed electronically. File and Drive folders auto-created." }
    ]
  },
  {
    id: "c15", num: "DIF-2026-031", client: "Yolanda Pryor", type: "Premises Liability",
    stage: "Treating", opened: "2026-01-26", incident: "2026-01-14",
    phone: "(314) 555-0158", email: "ypryor@sbcglobal.net",
    insurer: "Liberty Mutual", adjuster: "Dan Whitcomb", claimNo: "LM-44-90218",
    paralegal: "Renee Carter", attorney: "Chris Dixon",
    estValue: 95000, sol: "2031-01-14",
    facts: "Fell on unsalted ice outside a Clayton office building's main entrance. Fractured hip, partial replacement, in a rehab facility six weeks, now home health.",
    medicals: [
      { provider: "Barnes-Jewish West County", status: "Complete", billed: 61200, lien: 41500 },
      { provider: "The Rehab Institute of STL", status: "Received", billed: 18400, lien: 0 },
      { provider: "BJC Home Care", status: "Requested", billed: 5200, lien: 0 }
    ],
    negotiation: [],
    checklist: [
      { label: "Snow removal contract subpoenaed", done: true, date: "2026-04-20" },
      { label: "Property management deposition", done: false, due: "2026-09-10" },
      { label: "Updated home health records", done: false, due: "2026-08-21" }
    ],
    notes: [
      { date: "2026-07-29", by: "Renee Carter", text: "Snow contractor's log shows no salting between 5 AM and noon. Strong notice argument." }
    ],
    docs: [
      { folder: "05 Evidence & Police Report", name: "Snow removal service log.pdf", date: "2026-07-29", isNew: true, ai: "Contractor log shows last salt application 9:40 PM the prior night. Incident at 8:15 AM." }
    ]
  },
  {
    id: "c16", num: "DIF-2025-088", client: "Frank Delgado", type: "Truck Accident",
    stage: "Settled", opened: "2025-02-03", incident: "2025-01-20",
    phone: "(636) 555-0133", email: "fdelgado@charter.net",
    insurer: "Nationwide E&S", adjuster: "Rita Cole", claimNo: "NW-71-40092",
    paralegal: "Dana Ellis", attorney: "Chris Dixon",
    estValue: 385000, sol: "2030-01-20",
    facts: "Dump truck ran a stop sign in Affton. Fractured pelvis and internal injuries. Settled for $385,000 three weeks before trial.",
    medicals: [
      { provider: "Mercy Hospital South", status: "Complete", billed: 118000, lien: 76000 }
    ],
    negotiation: [
      { date: "2026-04-14", party: "Firm", kind: "Demand", amount: 550000, note: "Pre-trial demand" },
      { date: "2026-06-02", party: "Both", kind: "Settlement", amount: 385000, note: "Settled at pre-trial conference" }
    ],
    checklist: [
      { label: "Liens negotiated and paid", done: true, date: "2026-07-10" },
      { label: "Disbursement complete", done: true, date: "2026-07-15" },
      { label: "File closed", done: true, date: "2026-07-15" }
    ],
    notes: [
      { date: "2026-07-15", by: "Dana Ellis", text: "Mercy lien reduced from $76,000 to $49,400. Client netted $198,600." }
    ],
    docs: [
      { folder: "08 Settlement", name: "Settlement statement - Delgado.pdf", date: "2026-07-15", isNew: false, ai: "Gross $385,000. Fees $128,333, liens $49,400 after reduction, net to client $198,600." }
    ]
  },
  {
    id: "c17", num: "DIF-2026-042", client: "Nina Kowalski", type: "Workers Comp",
    stage: "Investigation", opened: "2026-05-11", incident: "2026-04-30",
    phone: "(314) 555-0169", email: "nkowalski@yahoo.com",
    insurer: "The Hartford", adjuster: "Joel Pratt", claimNo: "WC-91-33807",
    paralegal: "Renee Carter", attorney: "Chris Dixon",
    estValue: 50000, sol: "2028-04-30",
    facts: "Nurse injured lifting a patient at a Creve Coeur hospital. L4-L5 disc herniation, employer disputing that the injury arose out of employment.",
    medicals: [
      { provider: "Concentra (employer clinic)", status: "Received", billed: 1400, lien: 0 },
      { provider: "Midwest Spine Institute", status: "Requested", billed: 8900, lien: 0 }
    ],
    negotiation: [],
    checklist: [
      { label: "Claim filed with Division", done: true, date: "2026-05-14" },
      { label: "Coworker witness statements", done: false, due: "2026-08-18" },
      { label: "Independent medical exam", done: false, due: "2026-09-08" }
    ],
    notes: [
      { date: "2026-07-27", by: "Renee Carter", text: "Two coworkers will confirm the lift assist request was ignored. Statements scheduled." }
    ],
    docs: [
      { folder: "02 Medical Records", name: "MRI report - Midwest Spine.pdf", date: "2026-07-24", isNew: true, ai: "L4-L5 herniation with nerve root contact. Consistent with acute lifting injury." }
    ]
  },
  {
    id: "c18", num: "DIF-2026-048", client: "Douglas Ferry", type: "Dog Bite",
    stage: "Demand Prep", opened: "2026-03-09", incident: "2026-02-27",
    phone: "(314) 555-0151", email: "dferry.stl@icloud.com",
    insurer: "State Farm (homeowner)", adjuster: "Karen Voss", claimNo: "55-M441-023",
    paralegal: "Renee Carter", attorney: "Chris Dixon",
    estValue: 48000, sol: "2031-02-27",
    facts: "Mail carrier bitten by an unrestrained dog in Shrewsbury. Calf laceration, 14 stitches, permanent scarring documented by a plastic surgeon.",
    medicals: [
      { provider: "Total Access Urgent Care", status: "Complete", billed: 2300, lien: 0 },
      { provider: "STL Plastic Surgery Group", status: "Complete", billed: 4800, lien: 0 }
    ],
    negotiation: [],
    checklist: [
      { label: "Animal control history obtained", done: true, date: "2026-04-02" },
      { label: "Scarring photos at 6 months", done: true, date: "2026-08-01" },
      { label: "Send demand", done: false, due: "2026-08-17" }
    ],
    notes: [
      { date: "2026-08-01", by: "Renee Carter", text: "Prior bite on record from 2024. Strict liability plus negligence per se. Demand ready this week." }
    ],
    docs: [
      { folder: "06 Demand", name: "Demand draft - Ferry.docx", date: "2026-08-05", isNew: true, ai: "Draft demand of $65,000 citing prior bite history and permanent scarring. Ready for review." },
      { folder: "05 Evidence & Police Report", name: "Animal control incident history.pdf", date: "2026-04-02", isNew: false, ai: "Same dog reported for a bite in June 2024. Owner cited twice for leash violations." }
    ]
  }
];

/* Litigation details for cases in suit */
CASES[4].court = { venue: "St. Louis County Circuit Court", judge: "Hon. Patricia Grimes", caseNo: "26SL-CC02841", division: "Division 14" };
CASES[12].court = { venue: "City of St. Louis Circuit Court", judge: "Hon. Marcus Bell", caseNo: "2622-CC00917", division: "Division 6" };

/* Lien negotiation ledgers (other cases get an "Asserted" default in enrich.js) */
CASES[0].lienLedger = [
  { holder: "Gateway Spine & Rehab", original: 12800, current: 8960, status: "Negotiating", note: "Requested 30 percent reduction, verbal agreement pending letter", date: "2026-08-03" },
  { holder: "Dr. Alan Hurst, Orthopedics", original: 9600, current: 9600, status: "Asserted", note: "Lien letter on file, negotiate once the settlement range firms up", date: "2026-07-12" }
];
CASES[6].lienLedger = [
  { holder: "BJC Christian Hospital", original: 72000, current: 51000, status: "Negotiating", note: "Hospital countered at $51,000 against our $43,200 ask", date: "2026-07-30" }
];
CASES[15].lienLedger = [
  { holder: "Mercy Hospital South", original: 76000, current: 49400, status: "Reduced", note: "Final reduction letter received, paid at disbursement", date: "2026-07-10" }
];

/* Two-way client texting thread for the featured case */
CASES[0].texts = [
  { from: "firm", text: "Hi Marcus, State Farm sent a revised offer of $98,000. Chris would like to walk you through it. Does Thursday at 10 AM work for a call?", when: "Aug 4, 2:12 PM" },
  { from: "client", text: "Thursday 10 works. My neighbor said I shouldn't take less than six figures", when: "Aug 4, 3:40 PM" },
  { from: "firm", text: "Noted. Chris will lay out where we think it lands after your final PT records. Talk Thursday.", when: "Aug 4, 3:52 PM" },
  { from: "client", text: "Sounds good, thank you", when: "Aug 4, 3:55 PM" }
];

/* Hand-written emails for featured cases; the rest are generated in enrich.js */
CASES[0].emails = [
  { from: "Karen Voss (State Farm)", subject: "Reed claim 55-J884-201 - revised offer", date: "2026-08-04", filed: "04 Insurance",
    body: "Counsel, please find our revised offer of $98,000 attached. We will need current wage documentation within 14 days to evaluate further movement." },
  { from: "Dana Ellis", subject: "RE: Records request - Gateway Spine", date: "2026-08-01", filed: "02 Medical Records",
    body: "Final PT notes received and filed. Discharge summary notes an 8 percent impairment rating, flagged for the demand update." },
  { from: "Marcus Reed", subject: "Question about the offer", date: "2026-07-29", filed: null,
    body: "Hi Dana, my neighbor said I should not take less than six figures. Can Chris call me this week to talk through where we stand?" },
  { from: "Dr. Alan Hurst office", subject: "Narrative report status", date: "2026-07-28", filed: "02 Medical Records",
    body: "The narrative report for Mr. Reed is with Dr. Hurst for signature. Expect it by August 12. Invoice for $450 to follow." }
];

const EVENTS = [
  { date: "2026-08-10", time: "10:00 AM", title: "Reed: evaluate second offer with client", kind: "Call", caseId: "c1" },
  { date: "2026-08-11", time: "9:00 AM", title: "Brantley: AI demand draft review", kind: "Internal", caseId: "c11" },
  { date: "2026-08-12", time: "2:30 PM", title: "Pham: rideshare coverage call with James River", kind: "Call", caseId: "c10" },
  { date: "2026-08-14", time: "All day", title: "O'Donnell: Great West counter response due", kind: "Deadline", caseId: "c7" },
  { date: "2026-08-17", time: "All day", title: "Ferry: demand out the door", kind: "Deadline", caseId: "c18" },
  { date: "2026-08-19", time: "11:00 AM", title: "Hector Ruiz consult (lead)", kind: "Consult", caseId: null },
  { date: "2026-08-21", time: "1:00 PM", title: "Whitfield: surgery decision call", kind: "Call", caseId: "c2" },
  { date: "2026-08-25", time: "All day", title: "Kessler: interrogatory responses due", kind: "Deadline", caseId: "c5" },
  { date: "2026-08-27", time: "9:30 AM", title: "Sandoval: deposition prep session", kind: "Meeting", caseId: "c13" },
  { date: "2026-09-02", time: "10:00 AM", title: "Sandoval: plaintiff deposition", kind: "Deposition", caseId: "c13" },
  { date: "2026-09-08", time: "8:30 AM", title: "Kowalski: independent medical exam", kind: "Exam", caseId: "c17" },
  { date: "2026-09-16", time: "10:00 AM", title: "Kessler: defendant deposition", kind: "Deposition", caseId: "c5" },
  { date: "2026-10-06", time: "9:00 AM", title: "Sandoval: mediation, Judge Rehm (ret.)", kind: "Mediation", caseId: "c13" }
];

const LEADS = [
  { id: "l1", name: "Brianna Cole", matter: "Car Accident", source: "Website chat", score: 92, status: "New", received: "2026-08-06 9:41 PM",
    summary: "Rear-ended on I-270 two days ago by a commercial van. Went to the ER, has a police report. Wants a call back tomorrow morning." },
  { id: "l2", name: "Gerald Okafor", matter: "Workers Comp", source: "Website chat", score: 78, status: "New", received: "2026-08-06 4:17 PM",
    summary: "Warehouse ladder fall in Earth City last week. Employer sent him to their clinic, no attorney yet." },
  { id: "l3", name: "Stephanie Marsh", matter: "Slip and Fall", source: "Referral", score: 55, status: "Contacted", received: "2026-08-05 11:02 AM",
    summary: "Fell in a restaurant parking lot in March. No treatment for first month. Referred by past client." },
  { id: "l4", name: "Hector Ruiz", matter: "Car Accident", source: "Website chat", score: 88, status: "Qualified", received: "2026-08-03 8:55 AM",
    summary: "T-boned in Overland, airbag deployment, currently treating at Mercy. Other driver cited. Consult scheduled Friday 10 AM." },
  { id: "l5", name: "Patrice Long", matter: "Dog Bite", source: "Google Ads", score: 61, status: "Contacted", received: "2026-08-02 2:30 PM",
    summary: "Bitten while delivering packages in Webster Groves. Photos provided, identifying homeowner." },
  { id: "l6", name: "Darnell Weeks", matter: "Motorcycle Accident", source: "Website chat", score: 95, status: "Qualified", received: "2026-08-01 6:12 PM",
    summary: "Serious leg injury on Route 30, hospitalized 4 days, other driver admitted fault at scene. Retainer sent for signature." }
];

const CONTACTS = [
  { name: "Karen Voss", org: "State Farm", role: "Adjuster", phone: "(800) 555-2662", email: "karen.voss@statefarm.example", kind: "Insurance" },
  { name: "Tom Brennan", org: "Progressive", role: "Adjuster", phone: "(800) 555-8109", email: "t.brennan@progressive.example", kind: "Insurance" },
  { name: "Sandra Liu", org: "GEICO", role: "Adjuster", phone: "(800) 555-4310", email: "sliu@geico.example", kind: "Insurance" },
  { name: "Beth Kramer", org: "Great West Casualty", role: "Adjuster", phone: "(800) 555-7728", email: "bkramer@gwccnet.example", kind: "Insurance" },
  { name: "Miguel Santos", org: "Travelers", role: "Adjuster", phone: "(800) 555-9914", email: "msantos@travelers.example", kind: "Insurance" },
  { name: "Records Dept", org: "SSM Health St. Mary's", role: "Medical Records", phone: "(314) 555-6400", email: "records@ssmhealth.example", kind: "Medical" },
  { name: "Records Dept", org: "BJC Barnes-Jewish", role: "Medical Records", phone: "(314) 555-5000", email: "him@bjc.example", kind: "Medical" },
  { name: "Dr. Alan Hurst", org: "Hurst Orthopedics", role: "Treating Physician", phone: "(314) 555-3377", email: "office@hurstortho.example", kind: "Medical" },
  { name: "Gateway Spine & Rehab", org: "Gateway Spine & Rehab", role: "Treatment Provider", phone: "(314) 555-2210", email: "front@gatewayspine.example", kind: "Medical" },
  { name: "David Ashcroft", org: "Ashcroft & Bell LLC", role: "Defense Counsel (Kessler)", phone: "(314) 555-8823", email: "dashcroft@ashbell.example", kind: "Counsel" },
  { name: "Dana Ellis", org: "The Dixon Injury Firm", role: "Senior Paralegal", phone: "(314) 208-2808", email: "dana@dixoninjuryfirm.example", kind: "Firm" },
  { name: "Renee Carter", org: "The Dixon Injury Firm", role: "Paralegal", phone: "(314) 208-2808", email: "renee@dixoninjuryfirm.example", kind: "Firm" }
];

const ACTIVITY = [
  { when: "Today 8:14 AM", icon: "doc", text: "State Farm second offer letter filed to Reed 04 Insurance from Outlook", caseId: "c1" },
  { when: "Today 7:52 AM", icon: "bolt", text: "Workflow: wage documentation task created from offer letter deadline", caseId: "c1" },
  { when: "Yesterday 4:30 PM", icon: "doc", name: "", text: "Surgery consult filed to Whitfield 02 Medical Records", caseId: "c2" },
  { when: "Yesterday 2:05 PM", icon: "lead", text: "New website chat lead: Brianna Cole, car accident, score 92", caseId: null },
  { when: "Yesterday 11:20 AM", icon: "doc", text: "AI demand draft generated for Brantley from records and lien ledger", caseId: "c11" },
  { when: "Aug 4, 3:45 PM", icon: "case", text: "New case opened from signed retainer: Lakeisha Simmons, dog bite", caseId: "c6" },
  { when: "Aug 1, 9:00 AM", icon: "doc", text: "Defendant answer filed to Kessler 07 Pleadings, response deadline tracked", caseId: "c5" },
  { when: "Jul 24, 5:12 PM", icon: "check", text: "Dunn disbursement complete, file auto-closed by workflow", caseId: "c9" }
];

window.DB = { STAGES, FOLDER_TEMPLATE, CASES, LEADS, CONTACTS, ACTIVITY, EVENTS };
