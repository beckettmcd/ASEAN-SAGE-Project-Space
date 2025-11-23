import { SAGEEventType, GeographyTag, SAGEEvent } from '../data/events';

/**
 * Calendar Configuration
 * Contains color mappings, lane ordering, and view preset configurations
 */

// Color palette - accessible and colorblind-friendly
export const EVENT_TYPE_COLORS: Record<SAGEEventType, string> = {
  ASEAN_MINISTERIAL: "#2563eb",      // Blue - high-level governance
  ASEAN_SENIOR_OFFICIALS: "#3b82f6", // Lighter blue - senior officials
  ASEAN_WORKING_GROUP: "#60a5fa",    // Light blue - working groups
  ASEAN_SUMMIT: "#1e40af",           // Dark blue - summit level
  REGIONAL_CONFERENCE: "#10b981",    // Green - conferences
  AMS_TA_ACTIVITY: "#f59e0b",        // Amber - country TA
  INTERNAL_PLANNING: "#8b5cf6",      // Purple - internal
  OTHER: "#6b7280"                   // Gray - other
};

// Lane configuration - order and labels
export type LaneKey = 
  | "ASEAN_GOVERNANCE"
  | "CAMBODIA"
  | "LAO_PDR"
  | "TIMOR_LESTE"
  | "PHILIPPINES"
  | "INTERNATIONAL_CONFERENCES"
  | "INTERNAL";

export interface LaneConfig {
  key: LaneKey;
  label: string;
  order: number;
}

export const LANE_CONFIG: LaneConfig[] = [
  { key: "ASEAN_GOVERNANCE", label: "ASEAN Governance", order: 1 },
  { key: "CAMBODIA", label: "Country: Cambodia", order: 2 },
  { key: "LAO_PDR", label: "Country: Lao PDR", order: 3 },
  { key: "TIMOR_LESTE", label: "Country: Timor-Leste", order: 4 },
  { key: "PHILIPPINES", label: "Country: Philippines", order: 5 },
  { key: "INTERNATIONAL_CONFERENCES", label: "Global / International Conferences", order: 6 },
  { key: "INTERNAL", label: "SAGE Internal Milestones", order: 7 }
];

// Map events to lanes based on geography and event type
export function getEventLane(event: SAGEEvent): LaneKey {
  // Internal planning events go to internal lane
  if (event.eventType === "INTERNAL_PLANNING") {
    return "INTERNAL";
  }
  
  // International conferences
  if (event.eventType === "REGIONAL_CONFERENCE") {
    return "INTERNATIONAL_CONFERENCES";
  }
  
  // Country-specific events
  if (event.geography.includes("CAMBODIA") && !event.geography.includes("REGIONAL")) {
    return "CAMBODIA";
  }
  if (event.geography.includes("LAO_PDR") && !event.geography.includes("REGIONAL")) {
    return "LAO_PDR";
  }
  if (event.geography.includes("TIMOR_LESTE") && !event.geography.includes("REGIONAL")) {
    return "TIMOR_LESTE";
  }
  if (event.geography.includes("PHILIPPINES") && !event.geography.includes("REGIONAL")) {
    return "PHILIPPINES";
  }
  
  // Default to ASEAN Governance for regional events
  return "ASEAN_GOVERNANCE";
}

// Program dates
export const PROGRAMME_START_DATE = new Date("2026-04-01");
export const PROGRAMME_END_DATE = new Date("2029-03-31");

// View preset configurations
export interface ViewPreset {
  id: string;
  label: string;
  description: string;
  eventTypeFilters?: SAGEEventType[];
  geographyFilters?: GeographyTag[];
  lanes?: LaneKey[];
}

export const VIEW_PRESETS: ViewPreset[] = [
  {
    id: "regional-governance",
    label: "Regional Governance Focus",
    description: "ASEAN ministerials, SOM-ED, TWGs, SEA-PLM, and major conferences",
    eventTypeFilters: [
      "ASEAN_MINISTERIAL",
      "ASEAN_SENIOR_OFFICIALS",
      "ASEAN_WORKING_GROUP",
      "ASEAN_SUMMIT",
      "REGIONAL_CONFERENCE"
    ],
    geographyFilters: ["REGIONAL"],
    lanes: ["ASEAN_GOVERNANCE", "INTERNATIONAL_CONFERENCES"]
  },
  {
    id: "cambodia-track",
    label: "Country Track – Cambodia",
    description: "Cambodia events plus relevant ASEAN governance events",
    geographyFilters: ["CAMBODIA", "REGIONAL"],
    lanes: ["ASEAN_GOVERNANCE", "CAMBODIA"]
  },
  {
    id: "lao-pdr-track",
    label: "Country Track – Lao PDR",
    description: "Lao PDR events plus relevant ASEAN governance events",
    geographyFilters: ["LAO_PDR", "REGIONAL"],
    lanes: ["ASEAN_GOVERNANCE", "LAO_PDR"]
  },
  {
    id: "timor-leste-track",
    label: "Country Track – Timor-Leste",
    description: "Timor-Leste events plus relevant ASEAN governance events",
    geographyFilters: ["TIMOR_LESTE", "REGIONAL"],
    lanes: ["ASEAN_GOVERNANCE", "TIMOR_LESTE"]
  },
  {
    id: "philippines-track",
    label: "Country Track – Philippines",
    description: "Philippines events plus relevant ASEAN governance events",
    geographyFilters: ["PHILIPPINES", "REGIONAL"],
    lanes: ["ASEAN_GOVERNANCE", "PHILIPPINES"]
  },
  {
    id: "internal-delivery",
    label: "Internal Delivery View",
    description: "Internal milestones and their relationship to ASEAN events",
    eventTypeFilters: ["INTERNAL_PLANNING"],
    lanes: ["INTERNAL", "ASEAN_GOVERNANCE"]
  }
];

// Default settings
export const DEFAULT_TIME_RANGE = "FULL"; // "6MO" | "12MO" | "FULL"
export const DEFAULT_LANE_HEIGHT = 60; // pixels
export const DEFAULT_MONTH_WIDTH = 80; // pixels per month (will be calculated dynamically)
export const TIMELINE_HEIGHT = 50; // pixels for the header timeline
export const URGENCY_DAYS = 90; // highlight events within next 90 days

// School Year Configuration
export const SCHOOL_YEAR_IN_SESSION_COLOR = "#e0f2fe"; // Very light blue
export const SCHOOL_YEAR_IN_SESSION_OPACITY = 0.35; // More visible background
export const SCHOOL_YEAR_OUT_OF_SESSION_COLOR = "#f8fafc"; // Very light gray (for breaks)
export const SCHOOL_YEAR_OUT_OF_SESSION_OPACITY = 0.1;
export const SCHOOL_YEAR_BORDER_COLOR = "#bfdbfe"; // Slightly darker blue for borders
export const SCHOOL_YEAR_BORDER_WIDTH = 1;

// Year Boundary Markers
export const UK_FY_MARKER_COLOR = "#cbd5e1"; // Light gray
export const UK_FY_MARKER_WIDTH = 1.5;
export const UK_FY_MARKER_STROKE_DASHARRAY = "4 4"; // Dashed line
export const UK_FY_MARKER_OPACITY = 0.6;

export const CALENDAR_YEAR_MARKER_COLOR = "#e2e8f0"; // Lighter gray
export const CALENDAR_YEAR_MARKER_WIDTH = 1;
export const CALENDAR_YEAR_MARKER_STROKE_DASHARRAY = "2 2"; // Dotted line
export const CALENDAR_YEAR_MARKER_OPACITY = 0.4;

// ASEAN Working Year Markers (January 1 - December 31)
export const ASEAN_YEAR_MARKER_COLOR = "#94a3b8"; // Medium gray-blue
export const ASEAN_YEAR_MARKER_WIDTH = 1.5;
export const ASEAN_YEAR_MARKER_STROKE_DASHARRAY = "6 3"; // Longer dashes
export const ASEAN_YEAR_MARKER_OPACITY = 0.5;

