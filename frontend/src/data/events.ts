/**
 * SAGE Master Calendar - Event Data Model
 * 
 * This file contains the TypeScript interfaces and seeded event data for the SAGE Master Calendar.
 * 
 * TO REPLACE WITH API DATA LATER:
 * 1. Keep the type definitions (SAGEEventType, GeographyTag, DateStatus, SAGEEvent)
 * 2. Replace the `events` array with an API call:
 *    - Create an API service function in src/services/api.js
 *    - Call it from CalendarPage.tsx using React Query or similar
 *    - Transform the API response to match the SAGEEvent interface
 * 3. Example API structure:
 *    ```typescript
 *    const { data: events } = useQuery({
 *      queryKey: ['calendar', 'events'],
 *      queryFn: () => api.get('/calendar/events').then(res => res.data)
 *    });
 *    ```
 */

export type SAGEEventType =
  | "ASEAN_MINISTERIAL"
  | "ASEAN_SENIOR_OFFICIALS"
  | "ASEAN_WORKING_GROUP"
  | "ASEAN_SUMMIT"
  | "REGIONAL_CONFERENCE"
  | "AMS_TA_ACTIVITY"
  | "INTERNAL_PLANNING"
  | "OTHER";

export type GeographyTag =
  | "REGIONAL"
  | "CAMBODIA"
  | "LAO_PDR"
  | "TIMOR_LESTE"
  | "PHILIPPINES"
  | "OTHER";

export type DateStatus = "CONFIRMED" | "ESTIMATED";

export interface SAGEEvent {
  id: string;
  name: string;
  eventType: SAGEEventType;
  geography: GeographyTag[];
  startDate: string;   // ISO date string (YYYY-MM-DD)
  endDate: string;     // ISO date string (YYYY-MM-DD)
  dateStatus: DateStatus;
  description?: string;
  workstream?: string; // e.g. "Foundational learning", "SEA-PLM", "Advocacy"
  relatedTo?: string[]; // optional list of event ids this builds toward or depends on
}

/**
 * Seeded events for SAGE Phase 2 (April 2026 - March 2029)
 * Events are realistic and internally consistent
 */
export const events: SAGEEvent[] = [
  // FY 2026/27 - April 2026 to March 2027
  
  // ASEAN Governance Events
  {
    id: "ased-2026",
    name: "ASEAN Education Ministers Meeting (ASED) 2026",
    eventType: "ASEAN_MINISTERIAL",
    geography: ["REGIONAL"],
    startDate: "2026-09-15",
    endDate: "2026-09-17",
    dateStatus: "ESTIMATED",
    description: "Annual meeting of ASEAN Education Ministers to discuss regional education priorities and policy directions.",
    workstream: "Regional Governance",
    relatedTo: ["som-ed-2026"]
  },
  {
    id: "som-ed-2026",
    name: "SOM-ED + SOM-ED+3 Meeting 2026",
    eventType: "ASEAN_SENIOR_OFFICIALS",
    geography: ["REGIONAL"],
    startDate: "2026-07-10",
    endDate: "2026-07-12",
    dateStatus: "ESTIMATED",
    description: "Senior Officials Meeting on Education and dialogue partners meeting to prepare for ASED.",
    workstream: "Regional Governance",
    relatedTo: ["som-ed-prep-2026", "ased-2026"]
  },
  {
    id: "som-ed-prep-2026",
    name: "Pre-SOM-ED Technical Preparation",
    eventType: "ASEAN_WORKING_GROUP",
    geography: ["REGIONAL"],
    startDate: "2026-05-20",
    endDate: "2026-05-22",
    dateStatus: "ESTIMATED",
    description: "Technical working group meeting to prepare papers and recommendations for SOM-ED.",
    workstream: "Regional Governance",
    relatedTo: ["som-ed-2026"]
  },
  {
    id: "twg-q1-2026",
    name: "ASEAN TWG on Education Q1 2026",
    eventType: "ASEAN_WORKING_GROUP",
    geography: ["REGIONAL"],
    startDate: "2026-04-15",
    endDate: "2026-04-16",
    dateStatus: "ESTIMATED",
    description: "Quarterly technical working group meeting on foundational learning and curriculum development.",
    workstream: "Foundational Learning"
  },
  {
    id: "twg-q2-2026",
    name: "ASEAN TWG on Education Q2 2026",
    eventType: "ASEAN_WORKING_GROUP",
    geography: ["REGIONAL"],
    startDate: "2026-06-18",
    endDate: "2026-06-19",
    dateStatus: "ESTIMATED",
    description: "Quarterly technical working group meeting on teacher professional development.",
    workstream: "Foundational Learning"
  },
  {
    id: "twg-q3-2026",
    name: "ASEAN TWG on Education Q3 2026",
    eventType: "ASEAN_WORKING_GROUP",
    geography: ["REGIONAL"],
    startDate: "2026-09-20",
    endDate: "2026-09-21",
    dateStatus: "ESTIMATED",
    description: "Quarterly technical working group meeting on learning assessment and SEA-PLM.",
    workstream: "SEA-PLM"
  },
  {
    id: "sea-plm-launch-2026",
    name: "SEA-PLM 2026 Regional Launch",
    eventType: "ASEAN_WORKING_GROUP",
    geography: ["REGIONAL"],
    startDate: "2026-11-10",
    endDate: "2026-11-12",
    dateStatus: "ESTIMATED",
    description: "Regional launch event for SEA-PLM 2026 results with country presentations and policy discussions.",
    workstream: "SEA-PLM",
    relatedTo: ["twg-q3-2026"]
  },
  {
    id: "twg-q4-2026",
    name: "ASEAN TWG on Education Q4 2026",
    eventType: "ASEAN_WORKING_GROUP",
    geography: ["REGIONAL"],
    startDate: "2026-12-15",
    endDate: "2026-12-16",
    dateStatus: "ESTIMATED",
    description: "Quarterly technical working group meeting to review annual progress and plan for 2027.",
    workstream: "Regional Governance"
  },
  
  // International Conferences
  {
    id: "ukfiet-2026",
    name: "UKFIET Conference 2026",
    eventType: "REGIONAL_CONFERENCE",
    geography: ["OTHER"],
    startDate: "2026-09-05",
    endDate: "2026-09-07",
    dateStatus: "ESTIMATED",
    description: "UK Forum for International Education and Training - major international education conference.",
    workstream: "Advocacy"
  },
  {
    id: "ewf-2027",
    name: "Education World Forum 2027",
    eventType: "REGIONAL_CONFERENCE",
    geography: ["OTHER"],
    startDate: "2027-01-21",
    endDate: "2027-01-24",
    dateStatus: "ESTIMATED",
    description: "Annual gathering of education ministers and leaders from around the world.",
    workstream: "Advocacy"
  },
  
  // Country-level TA Activities - FY 2026/27
  {
    id: "cambodia-ta-2026-q2",
    name: "Cambodia: Foundational Learning Policy Dialogue",
    eventType: "AMS_TA_ACTIVITY",
    geography: ["CAMBODIA"],
    startDate: "2026-05-08",
    endDate: "2026-05-10",
    dateStatus: "ESTIMATED",
    description: "Technical assistance to support Cambodia's foundational learning curriculum review.",
    workstream: "Foundational Learning"
  },
  {
    id: "lao-ta-2026-q2",
    name: "Lao PDR: Teacher Development Framework",
    eventType: "AMS_TA_ACTIVITY",
    geography: ["LAO_PDR"],
    startDate: "2026-06-12",
    endDate: "2026-06-14",
    dateStatus: "ESTIMATED",
    description: "Workshop on teacher professional development standards and frameworks.",
    workstream: "Foundational Learning"
  },
  {
    id: "timor-ta-2026-q3",
    name: "Timor-Leste: Assessment System Strengthening",
    eventType: "AMS_TA_ACTIVITY",
    geography: ["TIMOR_LESTE"],
    startDate: "2026-08-22",
    endDate: "2026-08-24",
    dateStatus: "ESTIMATED",
    description: "Support for national learning assessment system development and SEA-PLM participation.",
    workstream: "SEA-PLM"
  },
  {
    id: "philippines-ta-2026-q4",
    name: "Philippines: Inclusive Education Strategy",
    eventType: "AMS_TA_ACTIVITY",
    geography: ["PHILIPPINES"],
    startDate: "2026-11-28",
    endDate: "2026-11-30",
    dateStatus: "ESTIMATED",
    description: "Policy dialogue on inclusive education and learning recovery strategies.",
    workstream: "Advocacy"
  },
  
  // Internal SAGE Milestones - FY 2026/27
  {
    id: "logframe-review-2026",
    name: "SAGE Phase 2 Logframe Review",
    eventType: "INTERNAL_PLANNING",
    geography: ["REGIONAL"],
    startDate: "2026-04-20",
    endDate: "2026-04-21",
    dateStatus: "CONFIRMED",
    description: "Annual logframe review meeting to assess progress against indicators and adjust targets.",
    workstream: "Internal Delivery"
  },
  {
    id: "annual-review-2027",
    name: "SAGE Annual Review 2026/27",
    eventType: "INTERNAL_PLANNING",
    geography: ["REGIONAL"],
    startDate: "2027-03-15",
    endDate: "2027-03-17",
    dateStatus: "ESTIMATED",
    description: "Annual programme review with donor to assess year one progress and plan for year two.",
    workstream: "Internal Delivery"
  },
  {
    id: "synthesis-paper-2026",
    name: "SEA-PLM Policy Synthesis Paper Launch",
    eventType: "INTERNAL_PLANNING",
    geography: ["REGIONAL"],
    startDate: "2026-11-15",
    endDate: "2026-11-15",
    dateStatus: "ESTIMATED",
    description: "Launch of SAGE synthesis paper on SEA-PLM findings and policy recommendations.",
    workstream: "SEA-PLM",
    relatedTo: ["sea-plm-launch-2026"]
  },
  
  // FY 2027/28 - April 2027 to March 2028
  
  // ASEAN Governance Events
  {
    id: "som-ed-prep-2027",
    name: "Pre-SOM-ED Technical Preparation 2027",
    eventType: "ASEAN_WORKING_GROUP",
    geography: ["REGIONAL"],
    startDate: "2027-05-18",
    endDate: "2027-05-20",
    dateStatus: "ESTIMATED",
    description: "Technical working group meeting to prepare papers and recommendations for SOM-ED 2027.",
    workstream: "Regional Governance",
    relatedTo: ["som-ed-2027"]
  },
  {
    id: "som-ed-2027",
    name: "SOM-ED + SOM-ED+3 Meeting 2027",
    eventType: "ASEAN_SENIOR_OFFICIALS",
    geography: ["REGIONAL"],
    startDate: "2027-07-08",
    endDate: "2027-07-10",
    dateStatus: "ESTIMATED",
    description: "Senior Officials Meeting on Education and dialogue partners meeting to prepare for ASED.",
    workstream: "Regional Governance",
    relatedTo: ["som-ed-prep-2027", "ased-2027"]
  },
  {
    id: "ased-2027",
    name: "ASEAN Education Ministers Meeting (ASED) 2027",
    eventType: "ASEAN_MINISTERIAL",
    geography: ["REGIONAL"],
    startDate: "2027-09-13",
    endDate: "2027-09-15",
    dateStatus: "ESTIMATED",
    description: "Annual meeting of ASEAN Education Ministers to discuss regional education priorities and policy directions.",
    workstream: "Regional Governance",
    relatedTo: ["som-ed-2027"]
  },
  {
    id: "twg-q1-2027",
    name: "ASEAN TWG on Education Q1 2027",
    eventType: "ASEAN_WORKING_GROUP",
    geography: ["REGIONAL"],
    startDate: "2027-04-18",
    endDate: "2027-04-19",
    dateStatus: "ESTIMATED",
    description: "Quarterly technical working group meeting on digital learning and educational technology.",
    workstream: "Foundational Learning"
  },
  {
    id: "twg-q2-2027",
    name: "ASEAN TWG on Education Q2 2027",
    eventType: "ASEAN_WORKING_GROUP",
    geography: ["REGIONAL"],
    startDate: "2027-06-20",
    endDate: "2027-06-21",
    dateStatus: "ESTIMATED",
    description: "Quarterly technical working group meeting on early childhood education.",
    workstream: "Foundational Learning"
  },
  {
    id: "twg-q3-2027",
    name: "ASEAN TWG on Education Q3 2027",
    eventType: "ASEAN_WORKING_GROUP",
    geography: ["REGIONAL"],
    startDate: "2027-09-22",
    endDate: "2027-09-23",
    dateStatus: "ESTIMATED",
    description: "Quarterly technical working group meeting on inclusive education and gender equity.",
    workstream: "Advocacy"
  },
  {
    id: "twg-q4-2027",
    name: "ASEAN TWG on Education Q4 2027",
    eventType: "ASEAN_WORKING_GROUP",
    geography: ["REGIONAL"],
    startDate: "2027-12-18",
    endDate: "2027-12-19",
    dateStatus: "ESTIMATED",
    description: "Quarterly technical working group meeting to review annual progress and plan for 2028.",
    workstream: "Regional Governance"
  },
  
  // International Conferences
  {
    id: "ukfiet-2027",
    name: "UKFIET Conference 2027",
    eventType: "REGIONAL_CONFERENCE",
    geography: ["OTHER"],
    startDate: "2027-09-04",
    endDate: "2027-09-06",
    dateStatus: "ESTIMATED",
    description: "UK Forum for International Education and Training - major international education conference.",
    workstream: "Advocacy"
  },
  
  // Country-level TA Activities - FY 2027/28
  {
    id: "cambodia-ta-2027-q1",
    name: "Cambodia: SEA-PLM Data Use Workshop",
    eventType: "AMS_TA_ACTIVITY",
    geography: ["CAMBODIA"],
    startDate: "2027-05-15",
    endDate: "2027-05-17",
    dateStatus: "ESTIMATED",
    description: "Workshop on using SEA-PLM data for evidence-based policy making.",
    workstream: "SEA-PLM",
    relatedTo: ["sea-plm-launch-2026"]
  },
  {
    id: "lao-ta-2027-q2",
    name: "Lao PDR: Curriculum Alignment Technical Support",
    eventType: "AMS_TA_ACTIVITY",
    geography: ["LAO_PDR"],
    startDate: "2027-06-25",
    endDate: "2027-06-27",
    dateStatus: "ESTIMATED",
    description: "Technical assistance for curriculum alignment with foundational learning standards.",
    workstream: "Foundational Learning"
  },
  {
    id: "timor-ta-2027-q3",
    name: "Timor-Leste: Teacher Training System Review",
    eventType: "AMS_TA_ACTIVITY",
    geography: ["TIMOR_LESTE"],
    startDate: "2027-08-28",
    endDate: "2027-08-30",
    dateStatus: "ESTIMATED",
    description: "Review and strengthening of teacher training and professional development systems.",
    workstream: "Foundational Learning"
  },
  {
    id: "philippines-ta-2027-q4",
    name: "Philippines: Gender Equity in Education",
    eventType: "AMS_TA_ACTIVITY",
    geography: ["PHILIPPINES"],
    startDate: "2027-11-20",
    endDate: "2027-11-22",
    dateStatus: "ESTIMATED",
    description: "Policy dialogue and technical support on gender equity in education systems.",
    workstream: "Advocacy"
  },
  
  // Internal SAGE Milestones - FY 2027/28
  {
    id: "logframe-review-2027",
    name: "SAGE Phase 2 Logframe Review 2027",
    eventType: "INTERNAL_PLANNING",
    geography: ["REGIONAL"],
    startDate: "2027-04-25",
    endDate: "2027-04-26",
    dateStatus: "ESTIMATED",
    description: "Annual logframe review meeting to assess progress against indicators and adjust targets.",
    workstream: "Internal Delivery"
  },
  {
    id: "annual-review-2028",
    name: "SAGE Annual Review 2027/28",
    eventType: "INTERNAL_PLANNING",
    geography: ["REGIONAL"],
    startDate: "2028-03-12",
    endDate: "2028-03-14",
    dateStatus: "ESTIMATED",
    description: "Annual programme review with donor to assess year two progress and plan for final year.",
    workstream: "Internal Delivery"
  },
  
  // FY 2028/29 - April 2028 to March 2029
  
  // ASEAN Governance Events
  {
    id: "som-ed-prep-2028",
    name: "Pre-SOM-ED Technical Preparation 2028",
    eventType: "ASEAN_WORKING_GROUP",
    geography: ["REGIONAL"],
    startDate: "2028-05-16",
    endDate: "2028-05-18",
    dateStatus: "ESTIMATED",
    description: "Technical working group meeting to prepare papers and recommendations for SOM-ED 2028.",
    workstream: "Regional Governance",
    relatedTo: ["som-ed-2028"]
  },
  {
    id: "som-ed-2028",
    name: "SOM-ED + SOM-ED+3 Meeting 2028",
    eventType: "ASEAN_SENIOR_OFFICIALS",
    geography: ["REGIONAL"],
    startDate: "2028-07-06",
    endDate: "2028-07-08",
    dateStatus: "ESTIMATED",
    description: "Senior Officials Meeting on Education and dialogue partners meeting to prepare for ASED.",
    workstream: "Regional Governance",
    relatedTo: ["som-ed-prep-2028", "ased-2028"]
  },
  {
    id: "ased-2028",
    name: "ASEAN Education Ministers Meeting (ASED) 2028",
    eventType: "ASEAN_MINISTERIAL",
    geography: ["REGIONAL"],
    startDate: "2028-09-11",
    endDate: "2028-09-13",
    dateStatus: "ESTIMATED",
    description: "Annual meeting of ASEAN Education Ministers to discuss regional education priorities and policy directions.",
    workstream: "Regional Governance",
    relatedTo: ["som-ed-2028"]
  },
  {
    id: "twg-q1-2028",
    name: "ASEAN TWG on Education Q1 2028",
    eventType: "ASEAN_WORKING_GROUP",
    geography: ["REGIONAL"],
    startDate: "2028-04-16",
    endDate: "2028-04-17",
    dateStatus: "ESTIMATED",
    description: "Quarterly technical working group meeting on education financing and resource allocation.",
    workstream: "Regional Governance"
  },
  {
    id: "twg-q2-2028",
    name: "ASEAN TWG on Education Q2 2028",
    eventType: "ASEAN_WORKING_GROUP",
    geography: ["REGIONAL"],
    startDate: "2028-06-18",
    endDate: "2028-06-19",
    dateStatus: "ESTIMATED",
    description: "Quarterly technical working group meeting on education quality assurance.",
    workstream: "Foundational Learning"
  },
  {
    id: "twg-q3-2028",
    name: "ASEAN TWG on Education Q3 2028",
    eventType: "ASEAN_WORKING_GROUP",
    geography: ["REGIONAL"],
    startDate: "2028-09-20",
    endDate: "2028-09-21",
    dateStatus: "ESTIMATED",
    description: "Quarterly technical working group meeting on education system resilience.",
    workstream: "Regional Governance"
  },
  {
    id: "sea-plm-launch-2028",
    name: "SEA-PLM 2028 Regional Launch",
    eventType: "ASEAN_WORKING_GROUP",
    geography: ["REGIONAL"],
    startDate: "2028-11-08",
    endDate: "2028-11-10",
    dateStatus: "ESTIMATED",
    description: "Regional launch event for SEA-PLM 2028 results with country presentations and policy discussions.",
    workstream: "SEA-PLM",
    relatedTo: ["twg-q3-2028"]
  },
  {
    id: "twg-q4-2028",
    name: "ASEAN TWG on Education Q4 2028",
    eventType: "ASEAN_WORKING_GROUP",
    geography: ["REGIONAL"],
    startDate: "2028-12-17",
    endDate: "2028-12-18",
    dateStatus: "ESTIMATED",
    description: "Quarterly technical working group meeting to review annual progress and plan for 2029.",
    workstream: "Regional Governance"
  },
  {
    id: "asean-summit-2028",
    name: "ASEAN Summit 2028 - Education Side Event",
    eventType: "ASEAN_SUMMIT",
    geography: ["REGIONAL"],
    startDate: "2028-11-15",
    endDate: "2028-11-16",
    dateStatus: "ESTIMATED",
    description: "High-level education side event at ASEAN Summit to showcase regional education achievements.",
    workstream: "Regional Governance",
    relatedTo: ["ased-2028"]
  },
  
  // International Conferences
  {
    id: "ukfiet-2028",
    name: "UKFIET Conference 2028",
    eventType: "REGIONAL_CONFERENCE",
    geography: ["OTHER"],
    startDate: "2028-09-03",
    endDate: "2028-09-05",
    dateStatus: "ESTIMATED",
    description: "UK Forum for International Education and Training - major international education conference.",
    workstream: "Advocacy"
  },
  {
    id: "ewf-2029",
    name: "Education World Forum 2029",
    eventType: "REGIONAL_CONFERENCE",
    geography: ["OTHER"],
    startDate: "2029-01-22",
    endDate: "2029-01-25",
    dateStatus: "ESTIMATED",
    description: "Annual gathering of education ministers and leaders from around the world.",
    workstream: "Advocacy"
  },
  
  // Country-level TA Activities - FY 2028/29
  {
    id: "cambodia-ta-2028-q1",
    name: "Cambodia: Learning Recovery Strategy Finalization",
    eventType: "AMS_TA_ACTIVITY",
    geography: ["CAMBODIA"],
    startDate: "2028-05-10",
    endDate: "2028-05-12",
    dateStatus: "ESTIMATED",
    description: "Final technical support for learning recovery strategy implementation.",
    workstream: "Foundational Learning"
  },
  {
    id: "lao-ta-2028-q2",
    name: "Lao PDR: Education System Strengthening",
    eventType: "AMS_TA_ACTIVITY",
    geography: ["LAO_PDR"],
    startDate: "2028-06-22",
    endDate: "2028-06-24",
    dateStatus: "ESTIMATED",
    description: "Comprehensive review and strengthening of education system capacity.",
    workstream: "Regional Governance"
  },
  {
    id: "timor-ta-2028-q3",
    name: "Timor-Leste: Policy Advocacy Capacity Building",
    eventType: "AMS_TA_ACTIVITY",
    geography: ["TIMOR_LESTE"],
    startDate: "2028-08-26",
    endDate: "2028-08-28",
    dateStatus: "ESTIMATED",
    description: "Workshop on evidence-based policy advocacy and stakeholder engagement.",
    workstream: "Advocacy"
  },
  {
    id: "philippines-ta-2028-q4",
    name: "Philippines: Final Programme Synthesis",
    eventType: "AMS_TA_ACTIVITY",
    geography: ["PHILIPPINES"],
    startDate: "2028-11-18",
    endDate: "2028-11-20",
    dateStatus: "ESTIMATED",
    description: "Final technical assistance session to synthesize lessons learned and best practices.",
    workstream: "Regional Governance"
  },
  
  // Internal SAGE Milestones - FY 2028/29
  {
    id: "logframe-review-2028",
    name: "SAGE Phase 2 Logframe Review 2028",
    eventType: "INTERNAL_PLANNING",
    geography: ["REGIONAL"],
    startDate: "2028-04-30",
    endDate: "2028-05-01",
    dateStatus: "ESTIMATED",
    description: "Annual logframe review meeting to assess progress against indicators and adjust targets.",
    workstream: "Internal Delivery"
  },
  {
    id: "final-review-2029",
    name: "SAGE Phase 2 Final Programme Review",
    eventType: "INTERNAL_PLANNING",
    geography: ["REGIONAL"],
    startDate: "2029-03-10",
    endDate: "2029-03-12",
    dateStatus: "ESTIMATED",
    description: "Final programme review with donor to assess three-year achievements and lessons learned.",
    workstream: "Internal Delivery"
  },
  {
    id: "final-synthesis-2028",
    name: "SAGE Phase 2 Final Synthesis Paper",
    eventType: "INTERNAL_PLANNING",
    geography: ["REGIONAL"],
    startDate: "2028-12-10",
    endDate: "2028-12-10",
    dateStatus: "ESTIMATED",
    description: "Launch of final SAGE Phase 2 synthesis paper documenting programme achievements and policy recommendations.",
    workstream: "Advocacy"
  }
];

