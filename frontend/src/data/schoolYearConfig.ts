/**
 * School Year Calendar Configuration
 * 
 * Defines school year periods for focus countries to provide context
 * for timing education policy and technical assistance activities.
 * 
 * Note: These are generalized periods representing typical academic calendars.
 * Actual dates may vary by region or institution within each country.
 */

import { GeographyTag } from './events';

export interface SchoolYearPeriod {
  country: GeographyTag;
  year: number; // Academic year (e.g., 2026)
  inSessionStart: string; // ISO date string (YYYY-MM-DD)
  inSessionEnd: string; // ISO date string (YYYY-MM-DD)
  description?: string;
}

/**
 * School Year Periods for Focus Countries
 * 
 * Approximate academic calendars:
 * - Cambodia: October - June/July (with mid-year break around Khmer New Year)
 * - Lao PDR: September - June (with breaks)
 * - Timor-Leste: February - December (Southern Hemisphere pattern)
 * - Philippines: June - March (ASEAN pattern, with breaks)
 */
export const SCHOOL_YEAR_PERIODS: SchoolYearPeriod[] = [
  // Cambodia - 2026/27 Academic Year
  {
    country: 'CAMBODIA',
    year: 2026,
    inSessionStart: '2026-10-01',
    inSessionEnd: '2027-04-13', // Break for Khmer New Year
    description: 'Academic Year 2026/27 - Term 1'
  },
  {
    country: 'CAMBODIA',
    year: 2026,
    inSessionStart: '2027-05-01',
    inSessionEnd: '2027-06-30',
    description: 'Academic Year 2026/27 - Term 2'
  },
  // Cambodia - 2027/28 Academic Year
  {
    country: 'CAMBODIA',
    year: 2027,
    inSessionStart: '2027-10-01',
    inSessionEnd: '2028-04-13',
    description: 'Academic Year 2027/28 - Term 1'
  },
  {
    country: 'CAMBODIA',
    year: 2027,
    inSessionStart: '2028-05-01',
    inSessionEnd: '2028-06-30',
    description: 'Academic Year 2027/28 - Term 2'
  },
  // Cambodia - 2028/29 Academic Year
  {
    country: 'CAMBODIA',
    year: 2028,
    inSessionStart: '2028-10-01',
    inSessionEnd: '2029-04-13',
    description: 'Academic Year 2028/29 - Term 1'
  },
  {
    country: 'CAMBODIA',
    year: 2028,
    inSessionStart: '2029-05-01',
    inSessionEnd: '2029-06-30',
    description: 'Academic Year 2028/29 - Term 2'
  },

  // Lao PDR - 2026/27 Academic Year
  {
    country: 'LAO_PDR',
    year: 2026,
    inSessionStart: '2026-09-01',
    inSessionEnd: '2026-12-15', // Mid-year break
    description: 'Academic Year 2026/27 - First Semester'
  },
  {
    country: 'LAO_PDR',
    year: 2026,
    inSessionStart: '2027-01-05',
    inSessionEnd: '2027-06-30',
    description: 'Academic Year 2026/27 - Second Semester'
  },
  // Lao PDR - 2027/28 Academic Year
  {
    country: 'LAO_PDR',
    year: 2027,
    inSessionStart: '2027-09-01',
    inSessionEnd: '2027-12-15',
    description: 'Academic Year 2027/28 - First Semester'
  },
  {
    country: 'LAO_PDR',
    year: 2027,
    inSessionStart: '2028-01-05',
    inSessionEnd: '2028-06-30',
    description: 'Academic Year 2027/28 - Second Semester'
  },
  // Lao PDR - 2028/29 Academic Year
  {
    country: 'LAO_PDR',
    year: 2028,
    inSessionStart: '2028-09-01',
    inSessionEnd: '2028-12-15',
    description: 'Academic Year 2028/29 - First Semester'
  },
  {
    country: 'LAO_PDR',
    year: 2028,
    inSessionStart: '2029-01-05',
    inSessionEnd: '2029-06-30',
    description: 'Academic Year 2028/29 - Second Semester'
  },

  // Timor-Leste - 2026 Academic Year (February start)
  {
    country: 'TIMOR_LESTE',
    year: 2026,
    inSessionStart: '2026-02-01',
    inSessionEnd: '2026-06-30', // Mid-year break
    description: 'Academic Year 2026 - First Semester'
  },
  {
    country: 'TIMOR_LESTE',
    year: 2026,
    inSessionStart: '2026-07-15',
    inSessionEnd: '2026-12-15',
    description: 'Academic Year 2026 - Second Semester'
  },
  // Timor-Leste - 2027 Academic Year
  {
    country: 'TIMOR_LESTE',
    year: 2027,
    inSessionStart: '2027-02-01',
    inSessionEnd: '2027-06-30',
    description: 'Academic Year 2027 - First Semester'
  },
  {
    country: 'TIMOR_LESTE',
    year: 2027,
    inSessionStart: '2027-07-15',
    inSessionEnd: '2027-12-15',
    description: 'Academic Year 2027 - Second Semester'
  },
  // Timor-Leste - 2028 Academic Year
  {
    country: 'TIMOR_LESTE',
    year: 2028,
    inSessionStart: '2028-02-01',
    inSessionEnd: '2028-06-30',
    description: 'Academic Year 2028 - First Semester'
  },
  {
    country: 'TIMOR_LESTE',
    year: 2028,
    inSessionStart: '2028-07-15',
    inSessionEnd: '2028-12-15',
    description: 'Academic Year 2028 - Second Semester'
  },
  // Timor-Leste - 2029 Academic Year
  {
    country: 'TIMOR_LESTE',
    year: 2029,
    inSessionStart: '2029-02-01',
    inSessionEnd: '2029-03-31', // End of programme period
    description: 'Academic Year 2029 - First Semester (partial)'
  },

  // Philippines - 2026/27 Academic Year (June start)
  {
    country: 'PHILIPPINES',
    year: 2026,
    inSessionStart: '2026-06-01',
    inSessionEnd: '2026-10-31', // First semester
    description: 'Academic Year 2026/27 - First Semester'
  },
  {
    country: 'PHILIPPINES',
    year: 2026,
    inSessionStart: '2026-11-15',
    inSessionEnd: '2027-03-31',
    description: 'Academic Year 2026/27 - Second Semester'
  },
  // Philippines - 2027/28 Academic Year
  {
    country: 'PHILIPPINES',
    year: 2027,
    inSessionStart: '2027-06-01',
    inSessionEnd: '2027-10-31',
    description: 'Academic Year 2027/28 - First Semester'
  },
  {
    country: 'PHILIPPINES',
    year: 2027,
    inSessionStart: '2027-11-15',
    inSessionEnd: '2028-03-31',
    description: 'Academic Year 2027/28 - Second Semester'
  },
  // Philippines - 2028/29 Academic Year
  {
    country: 'PHILIPPINES',
    year: 2028,
    inSessionStart: '2028-06-01',
    inSessionEnd: '2028-10-31',
    description: 'Academic Year 2028/29 - First Semester'
  },
  {
    country: 'PHILIPPINES',
    year: 2028,
    inSessionStart: '2028-11-15',
    inSessionEnd: '2029-03-31',
    description: 'Academic Year 2028/29 - Second Semester (partial)'
  }
];

