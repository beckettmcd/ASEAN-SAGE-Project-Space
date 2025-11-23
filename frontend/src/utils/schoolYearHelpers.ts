/**
 * School Year Helper Functions
 * 
 * Utilities for calculating and checking school year periods
 */

import { GeographyTag } from '../data/events';
import { SCHOOL_YEAR_PERIODS, SchoolYearPeriod } from '../data/schoolYearConfig';

/**
 * Check if a date falls within any school year period for a given country
 */
export function isDateInSchoolYear(date: Date, country: GeographyTag): boolean {
  const dateStr = date.toISOString().split('T')[0];
  
  return SCHOOL_YEAR_PERIODS.some(period => 
    period.country === country &&
    dateStr >= period.inSessionStart &&
    dateStr <= period.inSessionEnd
  );
}

/**
 * Get all school year periods for a country within a date range
 */
export function getSchoolYearPeriodsForRange(
  country: GeographyTag,
  startDate: Date,
  endDate: Date
): SchoolYearPeriod[] {
  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];

  return SCHOOL_YEAR_PERIODS.filter(period => 
    period.country === country &&
    // Period overlaps with the range if:
    // - period starts before range ends AND
    // - period ends after range starts
    period.inSessionStart <= endStr &&
    period.inSessionEnd >= startStr
  );
}

/**
 * Get school year periods for all focus countries
 */
export const FOCUS_COUNTRIES: GeographyTag[] = ['CAMBODIA', 'LAO_PDR', 'TIMOR_LESTE', 'PHILIPPINES'];

/**
 * Check if a country is a focus country (has school year data)
 */
export function isFocusCountry(country: GeographyTag): boolean {
  return FOCUS_COUNTRIES.includes(country);
}

