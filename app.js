/* ============================================================================
   Project Lighthouse – PMO Command Center
   Plain JS single-page app · Chart.js · localStorage persistence
   ----------------------------------------------------------------------------
   Data provenance tags used throughout:
     confirmed    – fact stated in the capstone scenario
     proposed     – target / allocation proposed by Group 15
     illustrative – sample data to demonstrate the dashboard, not project data
     pending      – awaiting input (e.g. the three reported benefit figures)
   ========================================================================== */

const STORE_KEY = "plc.pmo.v1";
const WS = ["Trust & Safety", "Vendor Management", "Marketing", "Operations", "GPA / PMO"];
const TEAM_NAMES = ["Varun Varma", "Zaiyan", "Yash Runwal", "Tiya Gupta", "Urvi Ramekar", "Yagnesh Reddy", "Vinayak Chauhan"];
const C = { blue: "#4285F4", red: "#EA4335", green: "#34A853", yellow: "#FBBC05", navy: "#14243A", grey: "#DADCE0", blueBg: "#E8F0FE" };

/* ────────────────────────────── Seed data ────────────────────────────── */
const SEED = {
  workstreams: [
    { id: "WS-01", name: "Trust & Safety", scope: "Data protection and compliance", situation: "Audit identified unmasked customer data.", status: "At Risk", owner: "Workstream Lead – Trust & Safety", deliverables: ["Privacy audit remediation plan", "Data masking controls", "Compliance sign-off"], milestones: ["Validation of privacy controls"], prov: "confirmed" },
    { id: "WS-02", name: "Vendor Management", scope: "Vendor delivery and SLA performance", situation: "Vendor missed SLAs for two weeks.", status: "Critical", owner: "Workstream Lead – Vendor Management", deliverables: ["SLA recovery plan", "Vendor performance review", "Contract compliance report"], milestones: ["SLA performance review"], prov: "confirmed" },
    { id: "WS-03", name: "Marketing", scope: "Regional communication and adoption", situation: "12% adoption against a 40% target.", status: "At Risk", owner: "Workstream Lead – Marketing", deliverables: ["Regional communication plan", "Adoption campaign", "Adoption reporting"], milestones: ["Adoption baseline confirmed"], prov: "confirmed" },
    { id: "WS-04", name: "Operations", scope: "Support capacity and service delivery", situation: "Ticket volume increased by 35%.", status: "At Risk", owner: "Workstream Lead – Operations", deliverables: ["Capacity plan", "Queue management approach", "Service-level reporting"], milestones: ["Capacity assessment"], prov: "confirmed" },
    { id: "WS-05", name: "GPA / PMO", scope: "Governance and benefits reporting", situation: "Three conflicting benefit reports.", status: "Under Review", owner: "Varun Varma (PMO Lead)", deliverables: ["KPI dictionary", "Benefits reconciliation", "Governance framework", "Benefits register"], milestones: ["Consolidated benefit figure approved"], prov: "confirmed" },
  ],

  reports: [
    { id: "BR-01", team: "Team A", kpi: "Program benefit", value: "", unit: "", baseline: "", period: "", method: "", source: "", owner: "", status: "Pending validation", explanation: "", prov: "pending" },
    { id: "BR-02", team: "Team B", kpi: "Program benefit", value: "", unit: "", baseline: "", period: "", method: "", source: "", owner: "", status: "Pending validation", explanation: "", prov: "pending" },
    { id: "BR-03", team: "Team C", kpi: "Program benefit", value: "", unit: "", baseline: "", period: "", method: "", source: "", owner: "", status: "Pending validation", explanation: "", prov: "pending" },
  ],

  kpis: [
    { id: "KPI-01", name: "Platform adoption", ws: "Marketing", definition: "Share of eligible agents actively using the AI-assisted support platform", baseline: "12", target: "40", actual: "12", unit: "%", frequency: "Weekly", owner: "Zaiyan", status: "At Risk", trend: "flat", prov: "confirmed" },
    { id: "KPI-02", name: "Ticket volume change", ws: "Operations", definition: "Change in support ticket volume versus pre-program baseline", baseline: "0", target: "0", actual: "+35", unit: "%", frequency: "Weekly", owner: "Zaiyan", status: "At Risk", trend: "up", prov: "confirmed" },
    { id: "KPI-03", name: "SLA achievement", ws: "Vendor Management", definition: "Weeks in period in which the vendor met contracted SLAs", baseline: "TBC", target: "100", actual: "2 weeks missed", unit: "% of weeks", frequency: "Weekly", owner: "Zaiyan", status: "Critical", trend: "down", prov: "confirmed" },
    { id: "KPI-04", name: "Privacy control compliance", ws: "Trust & Safety", definition: "Audit findings open versus closed for customer-data masking controls", baseline: "Audit finding open", target: "0 open findings", actual: "1 open finding", unit: "count", frequency: "Monthly", owner: "Zaiyan", status: "At Risk", trend: "flat", prov: "confirmed" },
    { id: "KPI-05", name: "Benefit reporting consistency", ws: "GPA / PMO", definition: "Number of distinct benefit figures reported to leadership for the same period", baseline: "3", target: "1", actual: "3", unit: "count", frequency: "Monthly", owner: "Yash Runwal", status: "Critical", trend: "flat", prov: "confirmed" },
  ],

  milestones: [
    { id: "MS-01", phase: "1. Assessment", activity: "Understand reporting gaps", output: "Problem assessment", start: "2026-11-02", end: "2026-11-20", owner: "Varun Varma", pct: 70, status: "In Progress", deps: "—", horizon: "Now", prov: "illustrative" },
    { id: "MS-02", phase: "2. Standardization", activity: "Define common KPIs", output: "KPI dictionary", start: "2026-11-16", end: "2026-12-11", owner: "Zaiyan", pct: 30, status: "In Progress", deps: "MS-01", horizon: "Now", prov: "illustrative" },
    { id: "MS-03", phase: "3. Validation", activity: "Review source data", output: "Validated benefit information", start: "2026-12-07", end: "2027-01-15", owner: "Yash Runwal", pct: 0, status: "Not Started", deps: "MS-02", horizon: "Next", prov: "illustrative" },
    { id: "MS-04", phase: "4. Governance", activity: "Establish reporting ownership", output: "Governance framework", start: "2026-12-14", end: "2027-01-29", owner: "Tiya Gupta", pct: 0, status: "Not Started", deps: "MS-02", horizon: "Next", prov: "illustrative" },
    { id: "MS-05", phase: "5. Benefits Tracking", activity: "Set baselines and targets", output: "Benefits register", start: "2027-01-18", end: "2027-03-05", owner: "Yagnesh Reddy", pct: 0, status: "Not Started", deps: "MS-03, MS-04", horizon: "Later", prov: "illustrative" },
    { id: "MS-06", phase: "6. Review", activity: "Monitor and improve", output: "Program recommendations", start: "2027-03-01", end: "2027-04-16", owner: "Vinayak Chauhan", pct: 0, status: "Not Started", deps: "MS-05", horizon: "Later", prov: "illustrative" },
  ],

  budget: [
    { id: "BG-01", category: "PMO personnel", approved: 120000, planned: 115000, actual: 48000, kind: "Estimate", owner: "Yagnesh Reddy", prov: "illustrative" },
    { id: "BG-02", category: "Data analysis", approved: 45000, planned: 42000, actual: 12500, kind: "Estimate", owner: "Zaiyan", prov: "illustrative" },
    { id: "BG-03", category: "Reporting tools", approved: 30000, planned: 28000, actual: 9000, kind: "Estimate", owner: "Urvi Ramekar", prov: "illustrative" },
    { id: "BG-04", category: "Training", approved: 20000, planned: 18000, actual: 3500, kind: "Estimate", owner: "Vinayak Chauhan", prov: "illustrative" },
    { id: "BG-05", category: "Governance activities", approved: 15000, planned: 15000, actual: 4200, kind: "Estimate", owner: "Tiya Gupta", prov: "illustrative" },
    { id: "BG-06", category: "Contingency", approved: 23000, planned: 0, actual: 0, kind: "Estimate", owner: "Varun Varma", prov: "illustrative" },
  ],

  raid: [
    { id: "R-01", type: "Risk", desc: "Vendor SLA performance continues to deteriorate, affecting service levels in multiple regions", ws: "Vendor Management", impact: "High", probability: "High", priority: "Critical", owner: "Vinayak Chauhan", action: "Agree SLA recovery plan with vendor; weekly performance review; escalate contract remedies if two further weeks are missed", due: "2026-11-27", status: "Open", prov: "proposed" },
    { id: "R-02", type: "Risk", desc: "Platform adoption remains far below target, reducing expected benefits", ws: "Marketing", impact: "High", probability: "Medium", priority: "High", owner: "Zaiyan", action: "Regional adoption plan; weekly adoption KPI; remove usage blockers identified by Operations", due: "2026-12-11", status: "In Progress", prov: "proposed" },
    { id: "R-03", type: "Risk", desc: "Increased ticket volume exceeds support capacity during the transition", ws: "Operations", impact: "High", probability: "Medium", priority: "High", owner: "Yagnesh Reddy", action: "Capacity assessment; queue triage approach; agree temporary coverage with Vendor Management", due: "2026-12-04", status: "Open", prov: "proposed" },
    { id: "A-01", type: "Assumption", desc: "All three reporting teams can provide calculation methods and source data for their benefit figures", ws: "GPA / PMO", impact: "Medium", probability: "—", priority: "High", owner: "Yash Runwal", action: "Confirm with each data owner during reconciliation step 1", due: "2026-11-20", status: "Open", prov: "proposed" },
    { id: "A-02", type: "Assumption", desc: "The 40% adoption target remains valid for the current reporting period", ws: "Marketing", impact: "Medium", probability: "—", priority: "Medium", owner: "Zaiyan", action: "Validate target with Marketing lead and steering committee", due: "2026-12-04", status: "Open", prov: "proposed" },
    { id: "I-01", type: "Issue", desc: "Three workstreams have reported different benefit figures to the VP", ws: "GPA / PMO", impact: "High", probability: "—", priority: "Critical", owner: "Yash Runwal", action: "Run benefit reconciliation workflow; no figure is presented to leadership until validated", due: "2026-12-11", status: "In Progress", prov: "confirmed" },
    { id: "I-02", type: "Issue", desc: "Audit identified unmasked customer data", ws: "Trust & Safety", impact: "High", probability: "—", priority: "Critical", owner: "Tiya Gupta", action: "Containment and remediation plan; compliance sign-off before further rollout", due: "2026-11-27", status: "Escalated", prov: "confirmed" },
    { id: "I-03", type: "Issue", desc: "Vendor missed SLAs for two consecutive weeks", ws: "Vendor Management", impact: "High", probability: "—", priority: "Critical", owner: "Vinayak Chauhan", action: "Formal SLA breach notice; recovery plan; weekly review", due: "2026-11-20", status: "Open", prov: "confirmed" },
    { id: "D-01", type: "Dependency", desc: "KPI dictionary depends on data owners from all five workstreams confirming definitions", ws: "GPA / PMO", impact: "High", probability: "—", priority: "High", owner: "Zaiyan", action: "Schedule definition workshops; track confirmations", due: "2026-12-11", status: "In Progress", prov: "proposed" },
    { id: "D-02", type: "Dependency", desc: "Adoption reporting depends on Operations providing agent activity data", ws: "Marketing", impact: "Medium", probability: "—", priority: "Medium", owner: "Urvi Ramekar", action: "Agree data feed and reporting cadence with Operations", due: "2026-12-04", status: "Open", prov: "proposed" },
  ],

  decisions: [
    { id: "DEC-01", decision: "No benefit figure is presented to leadership until it has passed the reconciliation workflow", owner: "Steering Committee", date: "2026-11-10", reason: "Three conflicting figures have been reported; presenting any of them unvalidated would undermine trust", impact: "Benefits Reconciliation; all workstream reporting", status: "Approved", prov: "proposed" },
    { id: "DEC-02", decision: "Adopt a single KPI dictionary owned by the PMO as the standard for all program reporting", owner: "Program Manager", date: "2026-11-12", reason: "Different KPI definitions are the most likely cause of the conflicting figures", impact: "KPI Management; Benefits Realization", status: "Approved", prov: "proposed" },
    { id: "DEC-03", decision: "Reported figures will never be averaged; discrepancies are resolved through agreed definitions and validated source data", owner: "PMO Lead", date: "2026-11-12", reason: "Averaging hides the cause of the discrepancy and produces a number nobody owns", impact: "Benefits Reconciliation", status: "Approved", prov: "proposed" },
    { id: "DEC-04", decision: "Confirm whether the 40% adoption target applies to the current period or to program completion", owner: "Steering Committee", date: "", reason: "Target interpretation affects how the 12% actual is assessed", impact: "KPI Management; Marketing workstream", status: "Pending", prov: "proposed" },
  ],

  benefits: [
    { id: "BEN-01", category: "Customer Experience", desc: "Better customer support quality", owner: "Operations Lead", baseline: "TBC", target: "TBC", actual: "—", frequency: "Monthly", source: "Customer satisfaction reporting", validation: "Pending validation", realization: "Not started", prov: "proposed" },
    { id: "BEN-02", category: "Operational Efficiency", desc: "Improved agent productivity", owner: "Operations Lead", baseline: "TBC", target: "TBC", actual: "—", frequency: "Monthly", source: "Support operations data", validation: "Pending validation", realization: "Not started", prov: "proposed" },
    { id: "BEN-03", category: "Platform Adoption", desc: "Increased use of AI-assisted tools", owner: "Marketing Lead", baseline: "12%", target: "40%", actual: "12%", frequency: "Weekly", source: "Platform usage data", validation: "Under investigation", realization: "Behind plan", prov: "confirmed" },
    { id: "BEN-04", category: "Vendor Performance", desc: "Improved SLA compliance", owner: "Vendor Management Lead", baseline: "2 weeks of missed SLAs", target: "100% of weeks within SLA", actual: "—", frequency: "Weekly", source: "Vendor SLA reports", validation: "Pending validation", realization: "Behind plan", prov: "confirmed" },
    { id: "BEN-05", category: "Data Protection", desc: "Stronger privacy and compliance controls", owner: "Trust & Safety Lead", baseline: "Audit finding open", target: "No open findings", actual: "1 open finding", frequency: "Monthly", source: "Privacy audit", validation: "Under investigation", realization: "Behind plan", prov: "confirmed" },
    { id: "BEN-06", category: "Program Transparency", desc: "More reliable benefit reporting", owner: "Varun Varma (PMO Lead)", baseline: "3 conflicting figures", target: "1 validated figure", actual: "3", frequency: "Monthly", source: "Benefits reconciliation log", validation: "Under investigation", realization: "In progress", prov: "confirmed" },
  ],

  activities: [
    { id: "ACT-01", date: "2026-11-13", ws: "GPA / PMO", update: "Reconciliation workflow opened for the three reported benefit figures; data owners requested to submit calculation methods.", owner: "Yash Runwal", status: "In Progress", prov: "illustrative" },
    { id: "ACT-02", date: "2026-11-12", ws: "Vendor Management", update: "Second consecutive week of missed SLAs logged; breach notice drafted.", owner: "Vinayak Chauhan", status: "Escalated", prov: "confirmed" },
    { id: "ACT-03", date: "2026-11-11", ws: "Trust & Safety", update: "Audit finding on unmasked customer data recorded; remediation owner assigned.", owner: "Tiya Gupta", status: "Open", prov: "confirmed" },
    { id: "ACT-04", date: "2026-11-10", ws: "Marketing", update: "Adoption reported at 12% against the 40% target; regional breakdown requested.", owner: "Zaiyan", status: "At Risk", prov: "confirmed" },
    { id: "ACT-05", date: "2026-11-10", ws: "Operations", update: "Ticket volume up 35%; capacity assessment started.", owner: "Yagnesh Reddy", status: "At Risk", prov: "confirmed" },
  ],

  team: [
    { name: "Varun Varma", role: "PMO Lead and overall coordination", color: C.blue, deliverables: ["Executive Overview", "Program integration", "Steering committee pack"], tasks: ["Run weekly PMO review", "Approve KPI dictionary scope"], pending: ["Confirm reconciliation timeline with VP office"] },
    { name: "Zaiyan", role: "Data and KPI Management", color: C.green, deliverables: ["KPI dictionary", "KPI register", "Data-owner confirmations"], tasks: ["Define KPI-01 to KPI-05", "Collect definitions from workstreams"], pending: ["Adoption data feed from Operations (D-02)"] },
    { name: "Yash Runwal", role: "Benefits Management", color: C.yellow, deliverables: ["Benefits reconciliation", "Consolidated benefit figure"], tasks: ["Collect three reported figures", "Document discrepancies"], pending: ["Team A/B/C calculation methods (A-01)"] },
    { name: "Tiya Gupta", role: "Governance and RAID", color: C.red, deliverables: ["Governance framework", "RAID register", "Decision log"], tasks: ["Maintain RAID register", "Prepare decision log for SteerCo"], pending: ["Trust & Safety remediation plan (I-02)"] },
    { name: "Urvi Ramekar", role: "Reporting and dashboard management", color: C.navy, deliverables: ["PMO Command Center dashboard", "Reporting standards"], tasks: ["Maintain dashboard data", "Publish weekly report"], pending: ["Agree reporting cadence with Operations"] },
    { name: "Yagnesh Reddy", role: "Roadmap and budget coordination", color: "#1967D2", deliverables: ["Roadmap & milestones", "Budget tracker"], tasks: ["Update milestone progress", "Track planned vs actual"], pending: ["Capacity assessment input (R-03)"] },
    { name: "Vinayak Chauhan", role: "Workstream integration and documentation", color: "#1E8E3E", deliverables: ["Workstream monitoring", "Program recommendations"], tasks: ["Collect workstream updates", "Document vendor SLA recovery"], pending: ["Vendor recovery plan (I-03)"] },
  ],

  meetings: [
    { meeting: "Workstream updates", frequency: "Weekly", purpose: "Each workstream reports progress, risks and data changes" },
    { meeting: "PMO review", frequency: "Weekly", purpose: "PMO reviews KPIs, RAID and reconciliation progress" },
    { meeting: "Cross-functional review", frequency: "Biweekly", purpose: "Resolve dependencies between workstreams" },
    { meeting: "Steering committee", frequency: "Monthly or as scheduled", purpose: "Decisions, escalations and approval of consolidated figures" },
    { meeting: "Benefits review", frequency: "Monthly or as agreed", purpose: "Review benefits register and validation status" },
  ],
};

/* ────────────────────────────── Schemas (forms) ────────────────────────────── */
const PROV_OPTS = ["confirmed", "proposed", "illustrative", "pending"];
const SCHEMAS = {
  reports: { title: "Reported benefit figure", prefix: "BR", fields: [
    { k: "team", l: "Reporting team", t: "text", req: true }, { k: "kpi", l: "KPI name", t: "text", req: true },
    { k: "value", l: "Reported benefit value", t: "text" }, { k: "unit", l: "Unit of measurement", t: "text" },
    { k: "baseline", l: "Baseline", t: "text" }, { k: "period", l: "Reporting period", t: "text" },
    { k: "method", l: "Calculation method", t: "textarea", full: true }, { k: "source", l: "Data source", t: "text" },
    { k: "owner", l: "Data owner", t: "text" }, { k: "status", l: "Validation status", t: "select", o: ["Pending validation", "Under investigation", "Validated", "Disputed / Escalated"], req: true },
    { k: "explanation", l: "Explanation for differences", t: "textarea", full: true }, { k: "prov", l: "Data provenance", t: "select", o: PROV_OPTS, req: true } ] },
  kpis: { title: "KPI", prefix: "KPI", fields: [
    { k: "name", l: "KPI name", t: "text", req: true }, { k: "ws", l: "Workstream", t: "select", o: WS, req: true },
    { k: "definition", l: "Definition", t: "textarea", full: true, req: true }, { k: "baseline", l: "Baseline", t: "text" },
    { k: "target", l: "Target", t: "text" }, { k: "actual", l: "Actual", t: "text" }, { k: "unit", l: "Unit", t: "text" },
    { k: "frequency", l: "Frequency", t: "select", o: ["Weekly", "Biweekly", "Monthly", "Quarterly"] }, { k: "owner", l: "Owner", t: "select", o: TEAM_NAMES },
    { k: "status", l: "Status", t: "select", o: ["On Track", "At Risk", "Critical"], req: true }, { k: "trend", l: "Trend", t: "select", o: ["up", "flat", "down"] },
    { k: "prov", l: "Data provenance", t: "select", o: PROV_OPTS, req: true } ] },
  milestones: { title: "Milestone", prefix: "MS", fields: [
    { k: "phase", l: "Phase", t: "text", req: true }, { k: "activity", l: "Activities", t: "text", req: true }, { k: "output", l: "Output", t: "text" },
    { k: "start", l: "Start date", t: "date", req: true }, { k: "end", l: "End date", t: "date", req: true }, { k: "owner", l: "Owner", t: "select", o: TEAM_NAMES },
    { k: "pct", l: "Completion %", t: "number", min: 0, max: 100 }, { k: "status", l: "Status", t: "select", o: ["Not Started", "In Progress", "Completed", "Delayed"], req: true },
    { k: "deps", l: "Dependencies", t: "text" }, { k: "horizon", l: "Horizon", t: "select", o: ["Now", "Next", "Later"], req: true }, { k: "prov", l: "Data provenance", t: "select", o: PROV_OPTS, req: true } ] },
  budget: { title: "Budget line", prefix: "BG", fields: [
    { k: "category", l: "Category", t: "text", req: true }, { k: "kind", l: "Amount type", t: "select", o: ["Estimate", "Approved"], req: true },
    { k: "approved", l: "Approved budget", t: "number", min: 0, req: true }, { k: "planned", l: "Planned expenditure", t: "number", min: 0, req: true },
    { k: "actual", l: "Actual expenditure", t: "number", min: 0, req: true }, { k: "owner", l: "Owner", t: "select", o: TEAM_NAMES }, { k: "prov", l: "Data provenance", t: "select", o: PROV_OPTS, req: true } ] },
  raid: { title: "RAID entry", prefix: null, fields: [
    { k: "type", l: "Type", t: "select", o: ["Risk", "Assumption", "Issue", "Dependency"], req: true }, { k: "ws", l: "Workstream / category", t: "select", o: WS, req: true },
    { k: "desc", l: "Description", t: "textarea", full: true, req: true }, { k: "impact", l: "Impact", t: "select", o: ["Low", "Medium", "High"], req: true },
    { k: "probability", l: "Probability (risks)", t: "select", o: ["—", "Low", "Medium", "High"] }, { k: "priority", l: "Priority", t: "select", o: ["Low", "Medium", "High", "Critical"], req: true },
    { k: "owner", l: "Owner", t: "select", o: TEAM_NAMES, req: true }, { k: "due", l: "Due date", t: "date" },
    { k: "action", l: "Mitigation / resolution action", t: "textarea", full: true }, { k: "status", l: "Status", t: "select", o: ["Open", "In Progress", "Resolved", "Escalated"], req: true },
    { k: "prov", l: "Data provenance", t: "select", o: PROV_OPTS, req: true } ] },
  decisions: { title: "Decision", prefix: "DEC", fields: [
    { k: "decision", l: "Decision", t: "textarea", full: true, req: true }, { k: "owner", l: "Decision owner", t: "select", o: ["Vice President", "Steering Committee", "Program Manager", "PMO Lead", "Workstream Lead", "Data Owner"], req: true },
    { k: "date", l: "Date", t: "date" }, { k: "status", l: "Status", t: "select", o: ["Pending", "Approved", "Rejected"], req: true },
    { k: "reason", l: "Reason", t: "textarea", full: true }, { k: "impact", l: "Impact", t: "text", full: true }, { k: "prov", l: "Data provenance", t: "select", o: PROV_OPTS, req: true } ] },
  benefits: { title: "Benefit", prefix: "BEN", fields: [
    { k: "category", l: "Category", t: "select", o: ["Customer Experience", "Operational Efficiency", "Platform Adoption", "Vendor Performance", "Data Protection", "Program Transparency"], req: true },
    { k: "desc", l: "Benefit description", t: "text", full: true, req: true }, { k: "owner", l: "Business owner", t: "text", req: true },
    { k: "baseline", l: "Baseline", t: "text" }, { k: "target", l: "Expected target", t: "text" }, { k: "actual", l: "Actual result", t: "text" },
    { k: "frequency", l: "Measurement frequency", t: "select", o: ["Weekly", "Monthly", "Quarterly"] }, { k: "source", l: "Data source", t: "text" },
    { k: "validation", l: "Validation status", t: "select", o: ["Pending validation", "Under investigation", "Validated", "Disputed / Escalated"], req: true },
    { k: "realization", l: "Realization status", t: "select", o: ["Not started", "In progress", "Behind plan", "Realized"], req: true }, { k: "prov", l: "Data provenance", t: "select", o: PROV_OPTS, req: true } ] },
  activities: { title: "Workstream update", prefix: "ACT", fields: [
    { k: "date", l: "Date", t: "date", req: true }, { k: "ws", l: "Workstream", t: "select", o: WS, req: true },
    { k: "update", l: "Update", t: "textarea", full: true, req: true }, { k: "owner", l: "Owner", t: "select", o: TEAM_NAMES, req: true },
    { k: "status", l: "Status", t: "select", o: ["Open", "In Progress", "At Risk", "Escalated", "Done"], req: true }, { k: "prov", l: "Data provenance", t: "select", o: PROV_OPTS, req: true } ] },
};

/* ────────────────────────────── Store ────────────────────────────── */
const deep = (o) => JSON.parse(JSON.stringify(o));
let DB;
function load() { try { const s = localStorage.getItem(STORE_KEY); DB = s ? JSON.parse(s) : deep(SEED); } catch { DB = deep(SEED); } for (const k in SEED) if (!DB[k]) DB[k] = deep(SEED[k]); }
function save() { localStorage.setItem(STORE_KEY, JSON.stringify(DB)); }
function nextId(coll, prefix) { const n = DB[coll].map(r => parseInt((r.id || "").split("-").pop(), 10) || 0); return `${prefix}-${String(Math.max(0, ...n) + 1).padStart(2, "0")}`; }
function raidId(type) { const p = type[0]; const n = DB.raid.filter(r => r.id.startsWith(p + "-")).map(r => parseInt(r.id.split("-")[1], 10) || 0); return `${p}-${String(Math.max(0, ...n) + 1).padStart(2, "0")}`; }

/* ────────────────────────────── Helpers ────────────────────────────── */
const $ = (s, r = document) => r.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (n) => "$" + Number(n || 0).toLocaleString("en-US");
const fmtDate = (d) => d ? new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const today = () => new Date().toISOString().slice(0, 10);
const prov = (p) => `<span class="prov prov--${p || "illustrative"}">${{ confirmed: "Confirmed", proposed: "Proposed", illustrative: "Illustrative", pending: "Pending" }[p] || "Illustrative"}</span>`;
const STATUS_COLOR = {
  "On Track": "green", "Completed": "green", "Resolved": "green", "Validated": "green", "Approved": "green", "Realized": "green", "Done": "green",
  "At Risk": "yellow", "In Progress": "blue", "Under Review": "yellow", "Under investigation": "yellow", "Pending": "yellow", "Pending validation": "yellow", "Delayed": "yellow", "Behind plan": "yellow", "Open": "blue",
  "Critical": "red", "Escalated": "red", "Disputed / Escalated": "red", "Rejected": "red",
  "Not Started": "grey", "Not started": "grey",
};
const status = (s) => `<span class="status status--${STATUS_COLOR[s] || "grey"}">${esc(s)}</span>`;
const wsColor = (s) => ({ "Critical": C.red, "At Risk": C.yellow, "Under Review": C.blue, "On Track": C.green }[s] || C.grey);
const trendIcon = (t) => ({ up: "trending_up", down: "trending_down", flat: "trending_flat" }[t] || "trending_flat");
let toastTimer; function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2600); }

let charts = [];
function chart(canvas, cfg) { const c = new Chart(canvas, cfg); charts.push(c); return c; }
function destroyCharts() { charts.forEach(c => c.destroy()); charts = []; }
Chart.defaults.font.family = '"Google Sans Text", "Google Sans", system-ui, sans-serif';
Chart.defaults.font.size = 12; Chart.defaults.color = "#5F6368";
Chart.defaults.plugins.legend.labels.boxWidth = 12; Chart.defaults.plugins.legend.labels.boxHeight = 12;
Chart.defaults.plugins.tooltip.backgroundColor = "#1F1F1F"; Chart.defaults.plugins.tooltip.cornerRadius = 8;

function toCSV(rows, cols) {
  const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [cols.map(c => q(c.l)).join(","), ...rows.map(r => cols.map(c => q(r[c.k])).join(","))].join("\n");
}
function download(name, text) { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/csv" })); a.download = name; a.click(); URL.revokeObjectURL(a.href); }

/* ────────────────────────────── Modal: forms & confirm ────────────────────────────── */
function openModal(title, bodyHTML, buttons) {
  $("#modal-title").textContent = title; const f = $("#modal-form"); f.innerHTML = bodyHTML;
  const foot = $("#modal-foot"); foot.innerHTML = "";
  buttons.forEach(b => { const btn = el("button", `btn ${b.cls || "btn--outlined"}`, b.label); btn.type = "button"; btn.onclick = b.onClick; foot.appendChild(btn); });
  $("#modal").classList.add("open"); $("#modal").setAttribute("aria-hidden", "false");
  const first = f.querySelector("input, select, textarea"); if (first) first.focus();
}
function closeModal() { $("#modal").classList.remove("open"); $("#modal").setAttribute("aria-hidden", "true"); }
function confirmDialog(msg, onYes) {
  openModal("Please confirm", `<div class="confirm">${msg}</div>`, [
    { label: "Cancel", onClick: closeModal }, { label: "Delete", cls: "btn--danger", onClick: () => { closeModal(); onYes(); } }]);
}
function recordForm(coll, rec, onSaved) {
  const sch = SCHEMAS[coll]; const isNew = !rec; rec = rec || {};
  const html = sch.fields.map(f => {
    const v = rec[f.k] ?? (f.t === "select" ? f.o[0] : "");
    let input;
    if (f.t === "select") input = `<select name="${f.k}">${f.o.map(o => `<option ${o === v ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
    else if (f.t === "textarea") input = `<textarea name="${f.k}">${esc(v)}</textarea>`;
    else input = `<input class="input" type="${f.t}" name="${f.k}" value="${esc(v)}" ${f.min !== undefined ? `min="${f.min}"` : ""} ${f.max !== undefined ? `max="${f.max}"` : ""}>`;
    return `<div class="field ${f.full ? "full" : ""}" data-k="${f.k}"><label>${f.l}${f.req ? " *" : ""}</label>${input}<div class="err"></div></div>`;
  }).join("");
  openModal(`${isNew ? "Add" : "Edit"} ${sch.title}${rec.id ? " · " + rec.id : ""}`, html, [
    { label: "Cancel", onClick: closeModal },
    { label: isNew ? "Add record" : "Save changes", cls: "btn--filled", onClick: () => {
      const form = $("#modal-form"); const out = { ...rec }; let ok = true;
      sch.fields.forEach(f => {
        const node = form.querySelector(`[name="${f.k}"]`); const wrap = form.querySelector(`.field[data-k="${f.k}"]`); const err = wrap.querySelector(".err");
        let v = node.value.trim(); wrap.classList.remove("invalid"); err.textContent = "";
        if (f.req && !v) { ok = false; wrap.classList.add("invalid"); err.textContent = "This field is required."; }
        if (f.t === "number" && v !== "") { const n = Number(v); if (Number.isNaN(n) || (f.min !== undefined && n < f.min) || (f.max !== undefined && n > f.max)) { ok = false; wrap.classList.add("invalid"); err.textContent = `Enter a number${f.min !== undefined ? ` ≥ ${f.min}` : ""}${f.max !== undefined ? ` and ≤ ${f.max}` : ""}.`; } v = v === "" ? 0 : n; }
        out[f.k] = v;
      });
      if (coll === "milestones" && out.start && out.end && out.end < out.start) { ok = false; const w = form.querySelector('.field[data-k="end"]'); w.classList.add("invalid"); w.querySelector(".err").textContent = "End date must be after the start date."; }
      if (!ok) return;
      if (isNew) { out.id = coll === "raid" ? raidId(out.type) : nextId(coll, sch.prefix); DB[coll].push(out); } else { const i = DB[coll].findIndex(r => r.id === rec.id); DB[coll][i] = out; }
      save(); closeModal(); toast(`${sch.title} ${out.id} ${isNew ? "added" : "updated"}.`); onSaved && onSaved();
    } }]);
}
function deleteRecord(coll, id, onDone) {
  confirmDialog(`Delete <b>${esc(id)}</b> from ${SCHEMAS[coll].title.toLowerCase()} records? This cannot be undone.`, () => { DB[coll] = DB[coll].filter(r => r.id !== id); save(); toast(`${id} deleted.`); onDone && onDone(); });
}

/* ────────────────────────────── Generic data table ────────────────────────────── */
const state = { view: "overview", query: "", filters: {}, raidTab: "all", horizon: "all", wsSel: "WS-05" };

function dataTable(opts) {
  // opts: coll, cols [{k,l,render,num}], filters [{k,l}], searchKeys, title, icon, sub, extraToolbar(html), onRefresh
  const card = el("div", "card card--flush");
  const head = el("div", "card__head", `<h2><span class="material-symbols-rounded">${opts.icon || "table_chart"}</span>${opts.title}</h2><div class="spacer"></div>`);
  const addBtn = el("button", "btn btn--filled btn--sm", `<span class="material-symbols-rounded">add</span>Add`); addBtn.onclick = () => recordForm(opts.coll, null, render);
  const csvBtn = el("button", "btn btn--outlined btn--sm", `<span class="material-symbols-rounded">download</span>Export CSV`);
  head.append(csvBtn, addBtn); card.appendChild(head);
  if (opts.sub) card.appendChild(el("div", "card__sub", opts.sub)).style.padding = "0 20px";
  const tb = el("div", "toolbar");
  const search = el("div", "search", `<span class="material-symbols-rounded">search</span><input type="search" placeholder="Search ${opts.title.toLowerCase()}…">`); search.style.minWidth = "240px";
  tb.appendChild(search);
  const selects = {};
  (opts.filters || []).forEach(f => {
    const vals = [...new Set(DB[opts.coll].map(r => r[f.k]).filter(Boolean))].sort();
    const fld = el("div", "field", `<label>${f.l}</label>`); const s = el("select"); s.className = "input--sm"; s.innerHTML = `<option value="">All</option>` + vals.map(v => `<option>${esc(v)}</option>`).join("");
    fld.appendChild(s); tb.appendChild(fld); selects[f.k] = s; s.onchange = render;
  });
  if (opts.extraToolbar) tb.appendChild(opts.extraToolbar);
  const count = el("div", "muted sm"); tb.appendChild(el("div", "spacer")); tb.appendChild(count);
  card.appendChild(tb);
  const wrap = el("div", "table-wrap"); card.appendChild(wrap);
  const input = search.querySelector("input"); input.oninput = render;

  function filtered() {
    const q = (input.value || state.query || "").toLowerCase();
    return DB[opts.coll].filter(r => {
      for (const k in selects) if (selects[k].value && String(r[k]) !== selects[k].value) return false;
      if (opts.rowFilter && !opts.rowFilter(r)) return false;
      if (!q) return true;
      return (opts.searchKeys || Object.keys(r)).some(k => String(r[k] ?? "").toLowerCase().includes(q));
    });
  }
  function render() {
    const rows = filtered(); count.textContent = `${rows.length} of ${DB[opts.coll].length} records`;
    if (!rows.length) { wrap.innerHTML = `<div class="empty"><span class="material-symbols-rounded">inbox</span><b>No records match</b><span class="sm">Adjust the search or filters, or add a new record.</span></div>`; return; }
    const t = el("table", "tbl");
    t.innerHTML = `<thead><tr>${opts.cols.map(c => `<th>${c.l}</th>`).join("")}<th></th></tr></thead>`;
    const body = el("tbody");
    rows.forEach(r => {
      const tr = el("tr");
      tr.innerHTML = opts.cols.map(c => `<td class="${c.num ? "num" : ""} ${c.cls || ""}">${c.render ? c.render(r) : esc(r[c.k])}</td>`).join("") +
        `<td class="actions row-actions"><button class="icon-btn" title="Edit" data-act="edit"><span class="material-symbols-rounded">edit</span></button><button class="icon-btn" title="Delete" data-act="del"><span class="material-symbols-rounded">delete</span></button></td>`;
      tr.querySelector('[data-act="edit"]').onclick = () => recordForm(opts.coll, r, () => { render(); opts.onRefresh && opts.onRefresh(); });
      tr.querySelector('[data-act="del"]').onclick = () => deleteRecord(opts.coll, r.id, () => { render(); opts.onRefresh && opts.onRefresh(); });
      body.appendChild(tr);
    });
    t.appendChild(body); wrap.innerHTML = ""; wrap.appendChild(t);
    if (opts.onRefresh) opts.onRefresh();
  }
  csvBtn.onclick = () => { download(`${opts.coll}.csv`, toCSV(filtered(), SCHEMAS[opts.coll].fields.concat([{ k: "id", l: "ID" }]))); toast("CSV exported."); };
  card.refresh = render; render();
  return card;
}

function pageHead(title, desc, actions = "") { return `<div class="page-head"><div><h1>${title}</h1><p>${desc}</p></div><div class="actions">${actions}</div></div>`; }

/* ────────────────────────────── Notifications ────────────────────────────── */
function attentionItems() {
  const t = today(); const items = [];
  DB.raid.filter(r => r.due && r.due < t && !["Resolved"].includes(r.status)).forEach(r => items.push({ lvl: "red", icon: "schedule", title: `${r.id} overdue`, text: `${r.desc} · due ${fmtDate(r.due)} · ${r.owner}`, view: "raid" }));
  DB.raid.filter(r => r.priority === "Critical" && r.status !== "Resolved" && !(r.due && r.due < t)).forEach(r => items.push({ lvl: "red", icon: "priority_high", title: `${r.id} critical · ${r.status}`, text: `${r.desc} · ${r.owner}`, view: "raid" }));
  DB.reports.filter(r => r.status !== "Validated").forEach(r => items.push({ lvl: "yellow", icon: "balance", title: `${r.id} ${r.team} · ${r.status}`, text: r.value ? `Reported ${r.value} ${r.unit}` : "Reported figure pending input", view: "reconciliation" }));
  DB.decisions.filter(d => d.status === "Pending").forEach(d => items.push({ lvl: "blue", icon: "gavel", title: `${d.id} pending decision`, text: d.decision, view: "governance" }));
  DB.milestones.filter(m => m.end < t && m.status !== "Completed").forEach(m => items.push({ lvl: "yellow", icon: "flag", title: `${m.id} past end date`, text: `${m.phase} · ${m.owner}`, view: "roadmap" }));
  return items;
}
function refreshBadges() {
  const items = attentionItems();
  $("#notify-dot").classList.toggle("show", items.length > 0);
  const recon = DB.reports.filter(r => r.status !== "Validated").length; const nb = $("#nav-badge-recon"); nb.textContent = recon; nb.classList.toggle("show", recon > 0);
  const raid = DB.raid.filter(r => r.priority === "Critical" && r.status !== "Resolved").length; const rb = $("#nav-badge-raid"); rb.textContent = raid; rb.classList.toggle("show", raid > 0);
  const body = $("#drawer-body"); body.innerHTML = items.length ? "" : `<div class="empty"><span class="material-symbols-rounded">check_circle</span>Nothing needs attention.</div>`;
  items.forEach(i => { const n = el("div", "attn__item", `<span class="material-symbols-rounded" style="color:${{ red: C.red, yellow: "#E37400", blue: C.blue }[i.lvl]}">${i.icon}</span><div><b>${esc(i.title)}</b><small>${esc(i.text)}</small></div><button class="btn btn--text btn--sm">Open</button>`); n.querySelector("button").onclick = () => { closeDrawer(); go(i.view); }; body.appendChild(n); });
}
function openDrawer() { $("#drawer").classList.add("open"); } function closeDrawer() { $("#drawer").classList.remove("open"); }

/* ────────────────────────────── Views ────────────────────────────── */
const VIEWS = {
  overview() {
    const open = DB.raid.filter(r => r.priority === "Critical" && r.status !== "Resolved").length;
    const pending = DB.decisions.filter(d => d.status === "Pending").length;
    const recon = DB.reports.filter(r => r.status === "Validated").length;
    const sev = { Critical: 0, "At Risk": 0, "Under Review": 0, "On Track": 0 }; DB.workstreams.forEach(w => sev[w.status] = (sev[w.status] || 0) + 1);
    const overall = sev.Critical ? "Critical" : sev["At Risk"] ? "At Risk" : "On Track";
    const c = el("div"); c.innerHTML = pageHead("Executive Overview", "What is happening with Project Lighthouse right now? Program health, items needing leadership attention and the latest workstream activity.") + `
      <div class="grid g6" style="margin-top:4px">
        <div class="kpi"><div class="kpi__icon ic-blue"><span class="material-symbols-rounded">hub</span></div><div class="kpi__label">Total workstreams</div><div class="kpi__value">5</div><div class="kpi__sub">${prov("confirmed")}</div></div>
        <div class="kpi"><div class="kpi__icon ic-blue"><span class="material-symbols-rounded">public</span></div><div class="kpi__label">Regions covered</div><div class="kpi__value">12</div><div class="kpi__sub">${prov("confirmed")}</div></div>
        <div class="kpi"><div class="kpi__icon ic-${overall === "Critical" ? "red" : "yellow"}"><span class="material-symbols-rounded">monitor_heart</span></div><div class="kpi__label">Overall program status</div><div class="kpi__value" style="font-size:22px;padding-top:6px">${status(overall)}</div><div class="kpi__sub">Derived from workstream health</div></div>
        <div class="kpi"><div class="kpi__icon ic-red"><span class="material-symbols-rounded">error</span></div><div class="kpi__label">Open critical issues</div><div class="kpi__value">${open}</div><div class="kpi__sub">RAID priority = Critical</div></div>
        <div class="kpi"><div class="kpi__icon ic-yellow"><span class="material-symbols-rounded">gavel</span></div><div class="kpi__label">Pending decisions</div><div class="kpi__value">${pending}</div><div class="kpi__sub">Awaiting approver</div></div>
        <div class="kpi"><div class="kpi__icon ic-yellow"><span class="material-symbols-rounded">balance</span></div><div class="kpi__label">Benefits reconciliation</div><div class="kpi__value" style="font-size:22px;padding-top:6px">${status(recon === DB.reports.length && recon ? "Validated" : "Under Review")}</div><div class="kpi__sub">${recon} of ${DB.reports.length} figures validated</div></div>
      </div>
      <div class="grid g21">
        <div class="card"><div class="card__head"><h2><span class="material-symbols-rounded">monitor_heart</span>Program health</h2><div class="spacer"></div><span class="note"><span class="material-symbols-rounded">info</span>Statuses reflect the scenario's initial situation, not a verified live assessment</span></div><div class="health" id="ov-health"></div></div>
        <div class="card"><div class="card__head"><h2><span class="material-symbols-rounded">pie_chart</span>Health distribution</h2></div><div class="chart chart--sm"><canvas id="ov-chart"></canvas></div><div class="rule"><span class="material-symbols-rounded">report</span><div><b>Benefit reporting status: Under review.</b> Three workstreams have submitted different benefit figures. Reconciliation is required before leadership approval.</div></div></div>
      </div>
      <div class="grid g12">
        <div class="card card--accent-red"><div class="card__head"><h2><span class="material-symbols-rounded">campaign</span>Leadership attention required</h2></div><div class="attn" id="ov-attn"></div></div>
        <div class="card"><div class="card__head"><h2><span class="material-symbols-rounded">history</span>Recent activities</h2><div class="spacer"></div><button class="btn btn--tonal btn--sm" id="ov-add-act"><span class="material-symbols-rounded">add</span>Log update</button></div><div class="feed" id="ov-feed"></div></div>
      </div>`;
    const health = $("#ov-health", c);
    DB.workstreams.forEach(w => health.appendChild(el("div", "health__row", `<b>${esc(w.name)}</b><span class="sm">${esc(w.situation)}</span>${status(w.status)}`)));
    const attn = [
      { i: "balance", t: "Conflicting benefit reports", s: "Three different figures reported to the VP — reconciliation in progress", v: "reconciliation", l: C.red },
      { i: "fact_check", t: "Data validation requirements", s: "Calculation methods and source data requested from all data owners", v: "reconciliation", l: "#E37400" },
      { i: "handshake", t: "Vendor SLA performance", s: "Two consecutive weeks of missed SLAs", v: "raid", l: C.red },
      { i: "shield", t: "Privacy and compliance concerns", s: "Audit identified unmasked customer data", v: "raid", l: C.red },
      { i: "groups", t: "Operational capacity constraints", s: "Ticket volume increased by 35%", v: "workstreams", l: "#E37400" },
    ];
    const ab = $("#ov-attn", c); attn.forEach(a => { const n = el("div", "attn__item", `<span class="material-symbols-rounded" style="color:${a.l}">${a.i}</span><div><b>${a.t}</b><small>${a.s}</small></div><button class="btn btn--text btn--sm">View</button>`); n.querySelector("button").onclick = () => go(a.v); ab.appendChild(n); });
    const feed = $("#ov-feed", c);
    [...DB.activities].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6).forEach(a => feed.appendChild(el("div", "feed__item", `<span class="feed__date">${fmtDate(a.date)}</span><div><b>${esc(a.ws)}</b> — ${esc(a.update)}<small>${esc(a.owner)} · ${prov(a.prov)}</small></div>${status(a.status)}`)));
    $("#ov-add-act", c).onclick = () => recordForm("activities", null, () => render());
    $("#content").appendChild(c);
    chart($("#ov-chart"), { type: "doughnut", data: { labels: Object.keys(sev), datasets: [{ data: Object.values(sev), backgroundColor: [C.red, C.yellow, C.blue, C.green], borderWidth: 2 }] }, options: { cutout: "65%", plugins: { legend: { position: "right" } } } });
  },

  reconciliation() {
    const c = el("div"); c.innerHTML = pageHead("Benefits Reconciliation", "Three teams have provided three different benefit figures to the VP. This section makes the problem visible and provides a structured way to resolve it. Figures are never averaged — the correct figure is established through agreed definitions and validated source data.") + `
      <div class="grid g21">
        <div class="card"><div class="card__head"><h2><span class="material-symbols-rounded">compare_arrows</span>Conflicting benefit reports — side by side</h2></div><div class="compare" id="rc-compare"></div><div class="note"><span class="material-symbols-rounded">info</span>Bars render once a numeric value and unit are entered for each team. Invented numbers are not pre-filled.</div></div>
        <div class="card"><div class="card__head"><h2><span class="material-symbols-rounded">donut_small</span>Reconciliation outcomes</h2></div><div class="chart chart--sm"><canvas id="rc-chart"></canvas></div></div>
      </div>
      <div class="card"><div class="card__head"><h2><span class="material-symbols-rounded">route</span>Benefit reconciliation process</h2></div><div class="steps">
        ${["Collect figures from all three reporting teams.", "Compare KPI definitions and measurement methods.", "Validate source data and reporting periods.", "Investigate and document discrepancies.", "Obtain confirmation from the relevant data owners.", "Record the approved or qualified consolidated figure."].map((s, i) => `<div class="step"><div class="step__n">${i + 1}</div>${s}</div>`).join("")}
      </div><div class="rule"><span class="material-symbols-rounded">block</span><div><b>Design principle:</b> never automatically average the three reported figures. A figure moves to <i>Validated</i> only when its definition, period, calculation method, data source and data owner have all been confirmed.</div></div></div>
      <div id="rc-table"></div>`;
    $("#content").appendChild(c);
    let oc;
    const table = dataTable({ coll: "reports", title: "Reported figures & reconciliation fields", icon: "balance", sub: "Every reported figure carries the full set of reconciliation fields. Add the actual scenario figures when they are provided.",
      filters: [{ k: "status", l: "Validation status" }, { k: "team", l: "Team" }],
      cols: [{ k: "id", l: "ID", render: r => `<span class="id">${r.id}</span>` }, { k: "team", l: "Reporting team" }, { k: "kpi", l: "KPI" },
        { k: "value", l: "Reported figure", render: r => r.value ? `<b>${esc(r.value)} ${esc(r.unit)}</b>` : `<span class="prov prov--pending">Pending input</span>` },
        { k: "baseline", l: "Baseline", render: r => esc(r.baseline || "To be confirmed") }, { k: "period", l: "Period", render: r => esc(r.period || "—") },
        { k: "method", l: "Calculation method", render: r => esc(r.method || "To be confirmed") }, { k: "source", l: "Data source", render: r => esc(r.source || "—") }, { k: "owner", l: "Data owner", render: r => esc(r.owner || "—") },
        { k: "status", l: "Status", render: r => status(r.status) }, { k: "explanation", l: "Explanation for differences", render: r => `<span class="muted">${esc(r.explanation || "—")}</span>` }, { k: "prov", l: "Provenance", render: r => prov(r.prov) }],
      onRefresh: () => { drawCompare(); drawOutcomes(); refreshBadges(); } });
    $("#rc-table", c).appendChild(table);
    function drawCompare() {
      const box = $("#rc-compare"); box.innerHTML = "";
      const nums = DB.reports.map(r => parseFloat(String(r.value).replace(/[^0-9.\-]/g, ""))); const max = Math.max(...nums.filter(n => !Number.isNaN(n)), 0);
      DB.reports.forEach((r, i) => { const n = nums[i]; const ok = !Number.isNaN(n) && max > 0;
        box.appendChild(el("div", "compare__row", `<b>${esc(r.team)}</b><div class="compare__bar">${ok ? `<span style="width:${Math.max(8, n / max * 100)}%">${esc(r.value)} ${esc(r.unit)}</span>` : `<span class="pending">Pending input</span>`}</div>${status(r.status)}`)); });
    }
    function drawOutcomes() {
      const cats = ["Pending validation", "Under investigation", "Validated", "Disputed / Escalated"]; const counts = cats.map(k => DB.reports.filter(r => r.status === k).length);
      if (oc) { oc.data.datasets[0].data = counts; oc.update(); return; }
      oc = chart($("#rc-chart"), { type: "doughnut", data: { labels: cats, datasets: [{ data: counts, backgroundColor: [C.yellow, C.blue, C.green, C.red], borderWidth: 2 }] }, options: { cutout: "65%", plugins: { legend: { position: "right" } } } });
    }
    drawCompare(); drawOutcomes();
  },

  kpis() {
    const c = el("div"); c.innerHTML = pageHead("KPI Management", "One standard definition for every important performance indicator. Each KPI shows its baseline, target, actual, trend and owner.") + `
      <div class="grid g21"><div class="card"><div class="card__head"><h2><span class="material-symbols-rounded">bar_chart</span>Target vs actual — numeric KPIs</h2><div class="spacer"></div>${prov("confirmed")}</div><div class="chart"><canvas id="kpi-chart"></canvas></div><div class="note"><span class="material-symbols-rounded">info</span>Only KPIs with numeric baseline/target/actual values are charted; descriptive KPIs appear in the register below.</div></div>
      <div class="card"><div class="card__head"><h2><span class="material-symbols-rounded">pie_chart</span>KPI status</h2></div><div class="chart chart--sm"><canvas id="kpi-status"></canvas></div></div></div>
      <div id="kpi-table"></div>`;
    $("#content").appendChild(c);
    let ch1, ch2;
    function draw() {
      const isNum = (v) => /^[+\-]?\d+(\.\d+)?$/.test(String(v).trim()); const num = DB.kpis.filter(k => isNum(k.target) && isNum(k.actual));
      const d1 = { labels: num.map(k => `${k.name} (${k.unit})`), datasets: [{ label: "Target", data: num.map(k => parseFloat(k.target)), backgroundColor: C.grey, borderRadius: 6 }, { label: "Actual", data: num.map(k => parseFloat(k.actual)), backgroundColor: num.map(k => ({ Critical: C.red, "At Risk": C.yellow, "On Track": C.green }[k.status])), borderRadius: 6 }] };
      const st = ["On Track", "At Risk", "Critical"]; const d2 = { labels: st, datasets: [{ data: st.map(s => DB.kpis.filter(k => k.status === s).length), backgroundColor: [C.green, C.yellow, C.red], borderWidth: 2 }] };
      if (ch1) { ch1.data = d1; ch1.update(); ch2.data = d2; ch2.update(); return; }
      ch1 = chart($("#kpi-chart"), { type: "bar", data: d1, options: { plugins: { legend: { position: "top" } }, scales: { y: { beginAtZero: true, grid: { color: "#EEF1F6" } }, x: { grid: { display: false } } } } });
      ch2 = chart($("#kpi-status"), { type: "doughnut", data: d2, options: { cutout: "65%", plugins: { legend: { position: "right" } } } });
    }
    $("#kpi-table", c).appendChild(dataTable({ coll: "kpis", title: "KPI register", icon: "monitoring", filters: [{ k: "ws", l: "Workstream" }, { k: "status", l: "Status" }, { k: "owner", l: "Owner" }],
      cols: [{ k: "id", l: "KPI ID", render: r => `<span class="id">${r.id}</span>` }, { k: "name", l: "KPI name", render: r => `<b>${esc(r.name)}</b><div class="muted sm">${esc(r.definition)}</div>` }, { k: "ws", l: "Workstream" },
        { k: "baseline", l: "Baseline", num: true }, { k: "target", l: "Target", num: true }, { k: "actual", l: "Actual", num: true, render: r => `<b>${esc(r.actual)}</b> <span class="material-symbols-rounded" style="font-size:16px;color:${{ up: C.red, down: C.red, flat: "#5F6368" }[r.trend]}">${trendIcon(r.trend)}</span>` },
        { k: "unit", l: "Unit" }, { k: "frequency", l: "Frequency" }, { k: "owner", l: "Owner" }, { k: "status", l: "Status", render: r => status(r.status) }, { k: "prov", l: "Provenance", render: r => prov(r.prov) }],
      onRefresh: draw }));
    draw();
  },

  workstreams() {
    const c = el("div"); c.innerHTML = pageHead("Workstream Monitoring", "Consolidated view of all five teams. Select a workstream to see its status, deliverables, owner, updates, risks, dependencies and milestones.") + `
      <div class="grid g3" id="ws-cards"></div>
      <div class="grid g21"><div class="card" id="ws-detail"></div><div class="card"><div class="card__head"><h2><span class="material-symbols-rounded">pie_chart</span>Status distribution</h2></div><div class="chart chart--sm"><canvas id="ws-chart"></canvas></div><div class="note"><span class="material-symbols-rounded">info</span>Statuses reflect the scenario's initial situation.</div></div></div>`;
    $("#content").appendChild(c);
    const cards = $("#ws-cards", c);
    DB.workstreams.forEach(w => { const n = el("div", `ws ${state.wsSel === w.id ? "is-selected" : ""}`, `<div class="ws__name">${esc(w.name)}</div><div class="ws__scope">${esc(w.scope)}</div><div class="ws__sit">${esc(w.situation)}</div><div>${status(w.status)} ${prov(w.prov)}</div>`); n.style.borderLeftColor = wsColor(w.status); n.onclick = () => { state.wsSel = w.id; render(); }; cards.appendChild(n); });
    const w = DB.workstreams.find(x => x.id === state.wsSel) || DB.workstreams[0];
    const li = (arr, f) => arr.length ? `<ul>${arr.map(f).join("")}</ul>` : `<div class="muted sm">None recorded</div>`;
    $("#ws-detail", c).innerHTML = `<div class="card__head"><h2><span class="material-symbols-rounded">info</span>${esc(w.name)} — detail</h2><div class="spacer"></div>${status(w.status)}</div>
      <div class="detail">
        <div><h4>Assigned owner</h4>${esc(w.owner)}</div><div><h4>Scope</h4>${esc(w.scope)}</div>
        <div><h4>Key deliverables</h4>${li(w.deliverables, d => `<li>${esc(d)}</li>`)}</div>
        <div><h4>Upcoming milestones</h4>${li(w.milestones.map(x => ({ t: x })).concat(w.name === "GPA / PMO" ? DB.milestones.filter(m => m.status !== "Completed").slice(0, 3).map(m => ({ t: `${m.phase} — ${m.output} (${fmtDate(m.end)})` })) : []), x => `<li>${esc(x.t)}</li>`)}</div>
        <div><h4>Progress updates</h4>${li(DB.activities.filter(a => a.ws === w.name).sort((a, b) => b.date.localeCompare(a.date)), a => `<li><span class="muted">${fmtDate(a.date)}</span> ${esc(a.update)}</li>`)}</div>
        <div><h4>Risks and issues</h4>${li(DB.raid.filter(r => r.ws === w.name && ["Risk", "Issue"].includes(r.type)), r => `<li><span class="id">${r.id}</span> ${esc(r.desc)} ${status(r.status)}</li>`)}</div>
        <div><h4>Dependencies on other teams</h4>${li(DB.raid.filter(r => r.ws === w.name && r.type === "Dependency"), r => `<li><span class="id">${r.id}</span> ${esc(r.desc)}</li>`)}</div>
        <div><h4>KPIs</h4>${li(DB.kpis.filter(k => k.ws === w.name), k => `<li>${esc(k.name)}: <b>${esc(k.actual)}</b> vs target ${esc(k.target)} ${esc(k.unit)}</li>`)}</div>
      </div>`;
    const sev = { Critical: 0, "At Risk": 0, "Under Review": 0, "On Track": 0 }; DB.workstreams.forEach(x => sev[x.status]++);
    chart($("#ws-chart"), { type: "bar", data: { labels: Object.keys(sev), datasets: [{ data: Object.values(sev), backgroundColor: [C.red, C.yellow, C.blue, C.green], borderRadius: 6 }] }, options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: "#EEF1F6" } }, x: { grid: { display: false } } } } });
  },

  roadmap() {
    const c = el("div"); c.innerHTML = pageHead("Roadmap & Milestones", "High-level implementation plan for resolving the reporting problem. Dates and completion percentages are illustrative until the team confirms the schedule.",
      `<div class="seg" id="rm-seg">${["all", "Now", "Next", "Later"].map(h => `<button data-h="${h}" class="${state.horizon === h ? "is-on" : ""}">${h === "all" ? "All" : h}</button>`).join("")}</div>`) + `
      <div class="card card--flush"><div class="card__head"><h2><span class="material-symbols-rounded">view_timeline</span>Timeline</h2><div class="spacer"></div>${prov("illustrative")}</div><div style="padding:8px 20px 20px;overflow-x:auto"><div class="gantt" id="gantt"></div></div></div>
      <div id="rm-table"></div>`;
    $("#content").appendChild(c);
    c.querySelectorAll("#rm-seg button").forEach(b => b.onclick = () => { state.horizon = b.dataset.h; render(); });
    const rows = () => DB.milestones.filter(m => state.horizon === "all" || m.horizon === state.horizon);
    function drawGantt() {
      const ms = rows(); const g = $("#gantt"); g.innerHTML = ""; if (!ms.length) { g.innerHTML = `<div class="empty">No milestones for this horizon.</div>`; return; }
      const min = new Date(Math.min(...ms.map(m => new Date(m.start)))); min.setDate(1);
      const max = new Date(Math.max(...ms.map(m => new Date(m.end)))); const months = (max.getFullYear() - min.getFullYear()) * 12 + max.getMonth() - min.getMonth() + 1;
      const span = new Date(min.getFullYear(), min.getMonth() + months, 1) - min; const pct = (d) => (new Date(d) - min) / span * 100;
      g.style.setProperty("--months", months);
      g.innerHTML = `<div class="gantt__label"><b>Phase</b><small>Owner · dependencies</small></div><div class="gantt__months">${Array.from({ length: months }, (_, i) => { const d = new Date(min.getFullYear(), min.getMonth() + i, 1); return `<div>${d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" })}</div>`; }).join("")}</div>`;
      ms.forEach((m, idx) => {
        const cls = m.status === "Completed" ? "done" : (m.end < today() && m.status !== "Completed") || m.status === "Delayed" ? "risk" : "";
        g.insertAdjacentHTML("beforeend", `<div class="gantt__label"><b>${esc(m.phase)}</b><small>${esc(m.owner)} · deps ${esc(m.deps)}</small></div><div class="gantt__track" style="--months:${months}"><div class="gantt__bar ${cls}" title="${esc(m.activity)} → ${esc(m.output)} · ${fmtDate(m.start)} – ${fmtDate(m.end)} · ${m.pct}%" style="left:${pct(m.start)}%;width:${Math.max(3, pct(m.end) - pct(m.start))}%"><i style="width:${m.pct}%"></i><span style="position:relative">${esc(m.output)} · ${m.pct}%</span></div>${pct(today()) >= 0 && pct(today()) <= 100 ? `<div class="today ${idx ? "today--nolabel" : ""}" style="left:${pct(today())}%"></div>` : ""}</div>`);
      });
    }
    $("#rm-table", c).appendChild(dataTable({ coll: "milestones", title: "Milestones", icon: "flag", rowFilter: m => state.horizon === "all" || m.horizon === state.horizon, filters: [{ k: "status", l: "Status" }, { k: "owner", l: "Owner" }],
      cols: [{ k: "id", l: "ID", render: r => `<span class="id">${r.id}</span>` }, { k: "phase", l: "Phase", render: r => `<b>${esc(r.phase)}</b><div class="muted sm">${esc(r.activity)}</div>` }, { k: "output", l: "Output" },
        { k: "start", l: "Start", num: true, render: r => fmtDate(r.start) }, { k: "end", l: "End", num: true, render: r => fmtDate(r.end) }, { k: "owner", l: "Owner" },
        { k: "pct", l: "Completion", render: r => `<div class="progress progress--thin" style="width:110px"><span style="width:${r.pct}%"></span></div><span class="sm">${r.pct}%</span>` },
        { k: "status", l: "Status", render: r => status(r.status) }, { k: "deps", l: "Dependencies" }, { k: "horizon", l: "Horizon", render: r => `<span class="status status--blue">${r.horizon}</span>` }, { k: "prov", l: "Provenance", render: r => prov(r.prov) }],
      onRefresh: drawGantt }));
    drawGantt();
  },

  budget() {
    const c = el("div"); c.innerHTML = pageHead("Budget Management", "How much the PMO plans to spend and whether expenditure is within approved limits. All figures are editable; estimates and approved amounts are labelled.") + `
      <div class="grid g6" id="bg-cards"></div>
      <div class="grid g21"><div class="card"><div class="card__head"><h2><span class="material-symbols-rounded">bar_chart</span>Planned vs actual expenditure by category</h2><div class="spacer"></div>${prov("illustrative")}</div><div class="chart"><canvas id="bg-chart"></canvas></div></div>
      <div class="card"><div class="card__head"><h2><span class="material-symbols-rounded">donut_small</span>Budget consumption</h2></div><div class="chart chart--sm"><canvas id="bg-donut"></canvas></div><div class="note"><span class="material-symbols-rounded">info</span>The approved program budget was not provided in the scenario; these are PMO-office estimates for demonstration.</div></div></div>
      <div id="bg-table"></div>`;
    $("#content").appendChild(c);
    let ch1, ch2;
    function draw() {
      const sum = (k) => DB.budget.reduce((a, r) => a + Number(r[k] || 0), 0); const A = sum("approved"), P = sum("planned"), X = sum("actual"); const varn = P - X;
      $("#bg-cards").innerHTML = [["Approved budget", money(A), "ic-blue", "account_balance"], ["Planned expenditure", money(P), "ic-blue", "event_note"], ["Actual expenditure", money(X), "ic-green", "receipt_long"], ["Remaining budget", money(A - X), "ic-green", "savings"], ["Budget variance (plan − actual)", (varn >= 0 ? "+" : "−") + money(Math.abs(varn)), varn >= 0 ? "ic-green" : "ic-red", "difference"], ["Consumed", `${A ? Math.round(X / A * 100) : 0}%`, "ic-yellow", "percent"]]
        .map(([l, v, ic, i]) => `<div class="kpi"><div class="kpi__icon ${ic}"><span class="material-symbols-rounded">${i}</span></div><div class="kpi__label">${l}</div><div class="kpi__value" style="font-size:22px">${v}</div><div class="kpi__sub">${prov("illustrative")}</div></div>`).join("");
      const d1 = { labels: DB.budget.map(b => b.category), datasets: [{ label: "Approved", data: DB.budget.map(b => b.approved), backgroundColor: C.grey, borderRadius: 6 }, { label: "Planned", data: DB.budget.map(b => b.planned), backgroundColor: C.blue, borderRadius: 6 }, { label: "Actual", data: DB.budget.map(b => b.actual), backgroundColor: C.green, borderRadius: 6 }] };
      const d2 = { labels: ["Actual spent", "Remaining"], datasets: [{ data: [X, Math.max(0, A - X)], backgroundColor: [C.green, C.grey], borderWidth: 2 }] };
      if (ch1) { ch1.data = d1; ch1.update(); ch2.data = d2; ch2.update(); return; }
      ch1 = chart($("#bg-chart"), { type: "bar", data: d1, options: { plugins: { tooltip: { callbacks: { label: (x) => `${x.dataset.label}: ${money(x.raw)}` } } }, scales: { y: { beginAtZero: true, ticks: { callback: (v) => "$" + v / 1000 + "k" }, grid: { color: "#EEF1F6" } }, x: { grid: { display: false } } } } });
      ch2 = chart($("#bg-donut"), { type: "doughnut", data: d2, options: { cutout: "68%", plugins: { legend: { position: "right" }, tooltip: { callbacks: { label: (x) => `${x.label}: ${money(x.raw)}` } } } } });
    }
    $("#bg-table", c).appendChild(dataTable({ coll: "budget", title: "Budget lines", icon: "payments", filters: [{ k: "kind", l: "Amount type" }, { k: "owner", l: "Owner" }],
      cols: [{ k: "id", l: "ID", render: r => `<span class="id">${r.id}</span>` }, { k: "category", l: "Category", render: r => `<b>${esc(r.category)}</b>` }, { k: "kind", l: "Type", render: r => `<span class="status status--${r.kind === "Approved" ? "green" : "grey"}">${r.kind}</span>` },
        { k: "approved", l: "Approved", num: true, render: r => money(r.approved) }, { k: "planned", l: "Planned", num: true, render: r => money(r.planned) }, { k: "actual", l: "Actual", num: true, render: r => money(r.actual) },
        { k: "v", l: "Variance", num: true, render: r => { const v = r.planned - r.actual; return `<span style="color:${v >= 0 ? C.green : C.red}">${v >= 0 ? "+" : "−"}${money(Math.abs(v))}</span>`; } },
        { k: "u", l: "Used", render: r => `<div class="progress progress--thin" style="width:100px"><span style="width:${r.approved ? Math.min(100, r.actual / r.approved * 100) : 0}%"></span></div>` }, { k: "owner", l: "Owner" }, { k: "prov", l: "Provenance", render: r => prov(r.prov) }],
      onRefresh: draw }));
    draw();
  },

  raid() {
    const types = { all: "All", Risk: "Risks", Assumption: "Assumptions", Issue: "Issues", Dependency: "Dependencies" };
    const c = el("div"); c.innerHTML = pageHead("RAID Management", "Risks, assumptions, issues and dependencies across all workstreams. Filter by status (Open, In Progress, Resolved, Escalated), workstream and priority.") + `
      <div class="raid-letters" id="raid-letters">${[["R", "Risks", "Potential future problems", "Risk", C.red], ["A", "Assumptions", "Things believed to be true", "Assumption", C.blue], ["I", "Issues", "Problems already happening", "Issue", C.yellow], ["D", "Dependencies", "Things relying on other activities", "Dependency", C.green]]
        .map(([L, n, d, t, col]) => `<div class="letter ${state.raidTab === t ? "is-on" : ""}" data-t="${t}"><div class="letter__l" style="color:${col}">${L}</div><div><b>${n} <span class="muted">(${DB.raid.filter(r => r.type === t).length})</span></b><small>${d}</small></div></div>`).join("")}</div>
      <div class="grid g21"><div id="raid-table"></div>
      <div class="card"><div class="card__head"><h2><span class="material-symbols-rounded">grid_on</span>Risk severity matrix</h2></div><div class="matrix" id="raid-matrix"></div><div class="note"><span class="material-symbols-rounded">info</span>Risks only (probability × impact). Issues are already occurring and are tracked by priority.</div></div></div>`;
    $("#content").appendChild(c);
    c.querySelectorAll(".letter").forEach(l => l.onclick = () => { state.raidTab = state.raidTab === l.dataset.t ? "all" : l.dataset.t; render(); });
    const tabs = el("div", "tabs"); Object.entries(types).forEach(([k, v]) => { const b = el("button", state.raidTab === k ? "is-on" : "", `${v} <span class="cnt">${k === "all" ? DB.raid.length : DB.raid.filter(r => r.type === k).length}</span>`); b.onclick = () => { state.raidTab = k; render(); }; tabs.appendChild(b); });
    function drawMatrix() {
      const lv = ["Low", "Medium", "High"]; const m = $("#raid-matrix"); if (!m) return;
      m.innerHTML = `<div class="matrix__axis">Prob. ↓ Impact →</div>${lv.map(i => `<div class="matrix__axis">${i}</div>`).join("")}`;
      [...lv].reverse().forEach((p, pi) => { m.insertAdjacentHTML("beforeend", `<div class="matrix__axis">${p}</div>`); lv.forEach((i, ii) => { const score = (2 - pi) + ii; const cls = score >= 3 ? "m-h" : score >= 2 ? "m-m" : "m-l";
        const tags = DB.raid.filter(r => r.type === "Risk" && r.probability === p && r.impact === i && r.status !== "Resolved").map(r => `<span class="matrix__tag" title="${esc(r.desc)}">${r.id}</span>`).join("");
        m.insertAdjacentHTML("beforeend", `<div class="matrix__cell ${cls}">${tags}</div>`); }); });
    }
    const table = dataTable({ coll: "raid", title: `RAID register — ${types[state.raidTab]}`, icon: "warning", rowFilter: r => state.raidTab === "all" || r.type === state.raidTab,
      filters: [{ k: "status", l: "Status" }, { k: "ws", l: "Workstream" }, { k: "priority", l: "Priority" }, { k: "owner", l: "Owner" }],
      cols: [{ k: "id", l: "ID", render: r => `<span class="id">${r.id}</span><div class="muted sm">${r.type}</div>` }, { k: "desc", l: "Description", render: r => `${esc(r.desc)}<div class="muted sm">${esc(r.ws)}</div>` },
        { k: "impact", l: "Impact" }, { k: "probability", l: "Probability" }, { k: "priority", l: "Priority", render: r => `<span class="status status--${{ Critical: "red", High: "yellow", Medium: "blue", Low: "grey" }[r.priority] || "grey"}">${esc(r.priority)}</span>` },
        { k: "owner", l: "Owner" }, { k: "action", l: "Mitigation / resolution", render: r => `<span class="sm">${esc(r.action)}</span>` },
        { k: "due", l: "Due", num: true, render: r => r.due ? `<span style="${r.due < today() && r.status !== "Resolved" ? `color:${C.red};font-weight:600` : ""}">${fmtDate(r.due)}</span>` : "—" }, { k: "status", l: "Status", render: r => status(r.status) }, { k: "prov", l: "Provenance", render: r => prov(r.prov) }],
      onRefresh: () => { drawMatrix(); refreshBadges(); } });
    table.insertBefore(tabs, table.children[1]);
    $("#raid-table", c).appendChild(table); drawMatrix();
  },

  governance() {
    const c = el("div"); c.innerHTML = pageHead("Governance & Decisions", "How the program is controlled: accountability hierarchy, meeting calendar and the decision log — particularly useful when workstreams disagree about the correct reported figures.") + `
      <div class="grid g3">
        <div class="card"><div class="card__head"><h2><span class="material-symbols-rounded">account_tree</span>Governance hierarchy</h2></div><div class="hier">
          ${[["Vice President", "Executive sponsor"], ["Steering Committee", "Approves consolidated figures and escalations"], ["Program Manager", "Program delivery accountability"], ["PMO Lead", "Varun Varma · Group 15"], ["Workstream Leads", "Five workstreams"], ["Data Owners", "Own definitions and source data"]].map(([n, s], i, a) => `<div class="hier__node">${n}<small>${s}</small></div>${i < a.length - 1 ? '<div class="hier__link"></div>' : ""}`).join("")}
        </div></div>
        <div class="card"><div class="card__head"><h2><span class="material-symbols-rounded">calendar_month</span>Meeting calendar</h2></div><div class="cal">${DB.meetings.map(m => `<div class="cal__row"><div><b>${m.meeting}</b><small>${m.purpose}</small></div><span class="status status--blue">${m.frequency}</span></div>`).join("")}</div></div>
        <div class="card"><div class="card__head"><h2><span class="material-symbols-rounded">donut_small</span>Decision status</h2></div><div class="chart chart--sm"><canvas id="dec-chart"></canvas></div><div class="rule"><span class="material-symbols-rounded">lightbulb</span><div>Decisions are recorded with owner, reason and impact so that disagreements about figures are settled on the log — not in hallway conversations.</div></div></div>
      </div>
      <div id="dec-table"></div>`;
    $("#content").appendChild(c);
    let ch;
    function draw() { const st = ["Pending", "Approved", "Rejected"]; const d = { labels: st, datasets: [{ data: st.map(s => DB.decisions.filter(x => x.status === s).length), backgroundColor: [C.yellow, C.green, C.red], borderWidth: 2 }] }; if (ch) { ch.data = d; ch.update(); return; } ch = chart($("#dec-chart"), { type: "doughnut", data: d, options: { cutout: "65%", plugins: { legend: { position: "right" } } } }); }
    $("#dec-table", c).appendChild(dataTable({ coll: "decisions", title: "Decision log", icon: "gavel", filters: [{ k: "status", l: "Status" }, { k: "owner", l: "Decision owner" }],
      cols: [{ k: "id", l: "Decision ID", render: r => `<span class="id">${r.id}</span>` }, { k: "decision", l: "Decision", render: r => `<b>${esc(r.decision)}</b>` }, { k: "owner", l: "Decision owner" }, { k: "date", l: "Date", num: true, render: r => fmtDate(r.date) },
        { k: "reason", l: "Reason", render: r => `<span class="sm">${esc(r.reason)}</span>` }, { k: "impact", l: "Impact", render: r => `<span class="sm">${esc(r.impact)}</span>` }, { k: "status", l: "Status", render: r => status(r.status) }, { k: "prov", l: "Provenance", render: r => prov(r.prov) }],
      onRefresh: () => { draw(); refreshBadges(); } }));
    draw();
  },

  benefits() {
    const c = el("div"); c.innerHTML = pageHead("Benefits Realization", "Beyond displaying KPIs: is the program actually delivering its expected business value? Each benefit carries a baseline, target, actual, data source and validation status.") + `
      <div class="grid g21"><div class="card"><div class="card__head"><h2><span class="material-symbols-rounded">bar_chart</span>Expected vs achieved — by category</h2></div><div class="chart"><canvas id="ben-chart"></canvas></div><div class="note"><span class="material-symbols-rounded">info</span>Charted as realization progress: Not started 0% · In progress / Behind plan shown by status · Realized 100%. Numeric achievement is only shown where the scenario provides values (e.g. adoption 12% of a 40% target).</div></div>
      <div class="card"><div class="card__head"><h2><span class="material-symbols-rounded">donut_small</span>Validation status</h2></div><div class="chart chart--sm"><canvas id="ben-val"></canvas></div></div></div>
      <div id="ben-table"></div>`;
    $("#content").appendChild(c);
    let ch1, ch2;
    function draw() {
      const prog = (b) => { const t = parseFloat(b.target), a = parseFloat(b.actual); if (!Number.isNaN(t) && !Number.isNaN(a) && t) return Math.min(100, Math.round(a / t * 100)); return { "Not started": 0, "In progress": 50, "Behind plan": 25, "Realized": 100 }[b.realization] ?? 0; };
      const d1 = { labels: DB.benefits.map(b => b.category), datasets: [{ label: "Expected (100%)", data: DB.benefits.map(() => 100), backgroundColor: C.grey, borderRadius: 6 }, { label: "Achieved (%)", data: DB.benefits.map(prog), backgroundColor: DB.benefits.map(b => ({ Realized: C.green, "In progress": C.blue, "Behind plan": C.yellow, "Not started": C.grey }[b.realization])), borderRadius: 6 }] };
      const st = ["Pending validation", "Under investigation", "Validated", "Disputed / Escalated"]; const d2 = { labels: st, datasets: [{ data: st.map(s => DB.benefits.filter(b => b.validation === s).length), backgroundColor: [C.yellow, C.blue, C.green, C.red], borderWidth: 2 }] };
      if (ch1) { ch1.data = d1; ch1.update(); ch2.data = d2; ch2.update(); return; }
      ch1 = chart($("#ben-chart"), { type: "bar", data: d1, options: { indexAxis: "y", scales: { x: { min: 0, max: 100, ticks: { callback: (v) => v + "%" }, grid: { color: "#EEF1F6" } }, y: { grid: { display: false } } } } });
      ch2 = chart($("#ben-val"), { type: "doughnut", data: d2, options: { cutout: "65%", plugins: { legend: { position: "right" } } } });
    }
    $("#ben-table", c).appendChild(dataTable({ coll: "benefits", title: "Benefits register", icon: "verified", filters: [{ k: "category", l: "Category" }, { k: "validation", l: "Validation" }, { k: "realization", l: "Realization" }],
      cols: [{ k: "id", l: "Benefit ID", render: r => `<span class="id">${r.id}</span>` }, { k: "category", l: "Category", render: r => `<b>${esc(r.category)}</b><div class="muted sm">${esc(r.desc)}</div>` }, { k: "owner", l: "Business owner" },
        { k: "baseline", l: "Baseline" }, { k: "target", l: "Expected target" }, { k: "actual", l: "Actual result", render: r => `<b>${esc(r.actual)}</b>` }, { k: "frequency", l: "Frequency" }, { k: "source", l: "Data source" },
        { k: "validation", l: "Validation", render: r => status(r.validation) }, { k: "realization", l: "Realization", render: r => status(r.realization) }, { k: "prov", l: "Provenance", render: r => prov(r.prov) }],
      onRefresh: draw }));
    draw();
  },

  team() {
    const c = el("div"); c.innerHTML = pageHead("Group 15 — Team Directory", "Seven members, proposed responsibilities (can be changed by the team), assigned deliverables, current tasks and pending actions.") + `<div class="team" id="team"></div>`;
    $("#content").appendChild(c);
    const t = $("#team", c);
    DB.team.forEach(m => {
      const mine = (coll, k) => DB[coll].filter(r => (r[k] || "").startsWith(m.name.split(" ")[0]));
      t.appendChild(el("div", "member", `<div class="member__top"><div class="avatar" style="background:${m.color}">${m.name.split(" ").map(p => p[0]).slice(0, 2).join("")}</div><div><div class="member__name">${esc(m.name)}</div><div class="member__role">${esc(m.role)}</div></div></div>
        <div><h4>Assigned deliverables</h4><ul>${m.deliverables.map(d => `<li>${esc(d)}</li>`).join("")}</ul></div>
        <div><h4>Current tasks</h4><ul>${m.tasks.map(d => `<li>${esc(d)}</li>`).join("")}</ul></div>
        <div><h4>Pending actions</h4><ul>${m.pending.map(d => `<li>${esc(d)}</li>`).join("")}</ul></div>
        <div class="sm muted">Owns ${mine("raid", "owner").length} RAID items · ${mine("kpis", "owner").length} KPIs · ${mine("milestones", "owner").length} milestones</div>
        <div>${prov("proposed")}</div>`));
    });
  },
};

const TITLES = { overview: "Executive Overview", reconciliation: "Benefits Reconciliation", kpis: "KPI Management", workstreams: "Workstream Monitoring", roadmap: "Roadmap & Milestones", budget: "Budget Management", raid: "RAID Management", governance: "Governance & Decisions", benefits: "Benefits Realization", team: "Team Directory" };

function render() {
  destroyCharts(); const content = $("#content"); content.innerHTML = "";
  $("#page-title").textContent = TITLES[state.view];
  document.querySelectorAll(".nav__item").forEach(n => n.classList.toggle("is-active", n.dataset.view === state.view));
  VIEWS[state.view](); refreshBadges(); window.scrollTo({ top: 0 });
}
function go(view) { state.view = view; location.hash = view; render(); closeSidebar(); }
function closeSidebar() { $("#sidebar").classList.remove("open"); $("#scrim").classList.remove("show"); }

document.addEventListener("DOMContentLoaded", () => {
  load();
  document.querySelectorAll(".nav__item").forEach(n => n.onclick = () => go(n.dataset.view));
  $("#btn-menu").onclick = () => { $("#sidebar").classList.add("open"); $("#scrim").classList.add("show"); };
  $("#scrim").onclick = closeSidebar;
  $("#btn-notify").onclick = () => $("#drawer").classList.toggle("open");
  $("#btn-drawer-close").onclick = closeDrawer;
  $("#modal-close").onclick = closeModal; $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); closeDrawer(); } });
  $("#btn-reset").onclick = () => confirmDialog("Reset all records to the scenario defaults? Your local changes will be lost.", () => { DB = deep(SEED); save(); render(); toast("Data reset to scenario defaults."); });
  $("#global-search").oninput = (e) => { state.query = e.target.value; render(); const gs = $("#global-search"); gs.focus(); gs.setSelectionRange(gs.value.length, gs.value.length); };
  const h = location.hash.replace("#", ""); if (VIEWS[h]) state.view = h;
  window.addEventListener("hashchange", () => { const v = location.hash.replace("#", ""); if (VIEWS[v] && v !== state.view) { state.view = v; render(); } });
  render();
});
