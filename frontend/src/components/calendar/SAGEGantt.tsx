import React, { useMemo, useState } from 'react';
import { SAGEEvent, SAGEEventType, DateStatus } from '../../data/events';
import {
  EVENT_TYPE_COLORS,
  LANE_CONFIG,
  getEventLane,
  URGENCY_DAYS,
  PROGRAMME_START_DATE,
  PROGRAMME_END_DATE,
  UK_FY_MARKER_COLOR,
  UK_FY_MARKER_WIDTH,
  UK_FY_MARKER_STROKE_DASHARRAY,
  UK_FY_MARKER_OPACITY,
  CALENDAR_YEAR_MARKER_COLOR,
  CALENDAR_YEAR_MARKER_WIDTH,
  CALENDAR_YEAR_MARKER_STROKE_DASHARRAY,
  CALENDAR_YEAR_MARKER_OPACITY,
  ASEAN_YEAR_MARKER_COLOR,
  ASEAN_YEAR_MARKER_WIDTH,
  ASEAN_YEAR_MARKER_STROKE_DASHARRAY,
  ASEAN_YEAR_MARKER_OPACITY,
  SCHOOL_YEAR_IN_SESSION_COLOR,
  SCHOOL_YEAR_IN_SESSION_OPACITY,
  SCHOOL_YEAR_BORDER_COLOR,
  SCHOOL_YEAR_BORDER_WIDTH
} from '../../utils/calendarConfig';
import { getSchoolYearPeriodsForRange, isFocusCountry, FOCUS_COUNTRIES } from '../../utils/schoolYearHelpers';
import { GeographyTag } from '../../data/events';
import { format, differenceInDays, addDays, isAfter, isBefore, eachMonthOfInterval, startOfMonth, endOfMonth, startOfYear } from 'date-fns';
import { AlertCircle } from 'lucide-react';

interface SAGEGanttProps {
  events: SAGEEvent[];
  startDate: Date;
  endDate: Date;
  selectedEventTypes: Set<SAGEEventType>;
  selectedGeographies: Set<string>;
  showEstimated: boolean;
  referenceDate: Date;
  onEventClick: (event: SAGEEvent) => void;
}

const LANE_HEIGHT = 60;
const TIMELINE_HEIGHT = 50;
const MONTH_LABEL_HEIGHT = 30;
const LANE_LABEL_WIDTH = 180;
const MONTH_MARKER_HEIGHT = 15;

export const SAGEGantt: React.FC<SAGEGanttProps> = ({
  events,
  startDate,
  endDate,
  selectedEventTypes,
  selectedGeographies,
  showEstimated,
  referenceDate,
  onEventClick
}) => {
  const [hoveredEvent, setHoveredEvent] = useState<SAGEEvent | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  // Filter events based on filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Event type filter
      if (!selectedEventTypes.has(event.eventType)) {
        return false;
      }

      // Geography filter
      const hasSelectedGeography = event.geography.some(geo => selectedGeographies.has(geo));
      if (!hasSelectedGeography) {
        return false;
      }

      // Date status filter
      if (!showEstimated && event.dateStatus === 'ESTIMATED') {
        return false;
      }

      // Date range filter - show events that overlap with visible range
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      return eventStart <= endDate && eventEnd >= startDate;
    });
  }, [events, selectedEventTypes, selectedGeographies, showEstimated, startDate, endDate]);

  // Group events by lane
  const eventsByLane = useMemo(() => {
    const grouped: Record<string, SAGEEvent[]> = {};
    
    // Initialize all lanes
    LANE_CONFIG.forEach(lane => {
      grouped[lane.key] = [];
    });

    // Group events
    filteredEvents.forEach(event => {
      const lane = getEventLane(event);
      if (!grouped[lane]) {
        grouped[lane] = [];
      }
      grouped[lane].push(event);
    });

    return grouped;
  }, [filteredEvents]);

  // Calculate timeline width
  const totalDays = differenceInDays(endDate, startDate);
  const timelineWidth = Math.max(800, totalDays * 2); // 2 pixels per day minimum

  // Get months in range for markers
  const months = useMemo(() => {
    return eachMonthOfInterval({ start: startDate, end: endDate });
  }, [startDate, endDate]);

  // Calculate UK Financial Year boundaries (April 1) in range
  const ukFYBoundaries = useMemo(() => {
    const boundaries: { date: Date; label: string }[] = [];
    let currentYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    
    // Start from April before or at start date
    let fyStart = new Date(currentYear, 3, 1); // April 1 (month 3 = April)
    if (fyStart < startDate) {
      fyStart = new Date(currentYear + 1, 3, 1);
    }
    
    while (fyStart <= endDate) {
      if (fyStart >= startDate) {
        const fyYear = fyStart.getFullYear();
        boundaries.push({
          date: fyStart,
          label: `FY ${fyYear}/${String(fyYear + 1).slice(-2)}`
        });
      }
      fyStart = new Date(fyStart.getFullYear() + 1, 3, 1);
    }
    
    return boundaries;
  }, [startDate, endDate]);

  // Calculate Calendar Year boundaries (January 1) in range
  const calendarYearBoundaries = useMemo(() => {
    const boundaries: { date: Date; label: string }[] = [];
    let currentYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    
    // Start from January 1 of current or next year
    let yearStart = startOfYear(new Date(currentYear, 0, 1));
    if (yearStart < startDate) {
      yearStart = startOfYear(new Date(currentYear + 1, 0, 1));
    }
    
    while (yearStart <= endDate) {
      if (yearStart >= startDate) {
        boundaries.push({
          date: yearStart,
          label: String(yearStart.getFullYear())
        });
      }
      yearStart = startOfYear(new Date(yearStart.getFullYear() + 1, 0, 1));
    }
    
    return boundaries;
  }, [startDate, endDate]);

  // Calculate ASEAN Working Year boundaries (January 1 to December 31) - same dates as calendar year but distinct styling
  const aseanYearBoundaries = useMemo(() => {
    const boundaries: { date: Date; label: string }[] = [];
    let currentYear = startDate.getFullYear();
    
    // Start from January 1 of current or next year
    let yearStart = startOfYear(new Date(currentYear, 0, 1));
    if (yearStart < startDate) {
      yearStart = startOfYear(new Date(currentYear + 1, 0, 1));
    }
    
    while (yearStart <= endDate) {
      if (yearStart >= startDate) {
        const year = yearStart.getFullYear();
        boundaries.push({
          date: yearStart,
          label: `ASEAN ${year}`
        });
      }
      yearStart = startOfYear(new Date(yearStart.getFullYear() + 1, 0, 1));
    }
    
    return boundaries;
  }, [startDate, endDate]);

  // Calculate position of a date on the timeline
  const getDatePosition = (date: Date): number => {
    const daysFromStart = differenceInDays(date, startDate);
    return (daysFromStart / totalDays) * timelineWidth;
  };

  // Check if event is in urgency window (next 90 days)
  const isUrgent = (event: SAGEEvent): boolean => {
    const eventStart = new Date(event.startDate);
    const urgencyThreshold = addDays(referenceDate, URGENCY_DAYS);
    return isAfter(eventStart, referenceDate) && isBefore(eventStart, urgencyThreshold);
  };

  // Handle mouse events for tooltip
  const handleEventMouseEnter = (event: SAGEEvent, e: React.MouseEvent) => {
    setHoveredEvent(event);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const handleEventMouseLeave = () => {
    setHoveredEvent(null);
    setTooltipPosition(null);
  };

  // Calculate total height
  const visibleLanes = LANE_CONFIG.filter(lane => 
    eventsByLane[lane.key]?.length > 0 || lane.key === 'ASEAN_GOVERNANCE' // Always show ASEAN Governance lane
  );
  const totalHeight = TIMELINE_HEIGHT + MONTH_LABEL_HEIGHT + (visibleLanes.length * LANE_HEIGHT);

  return (
    <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <svg width={LANE_LABEL_WIDTH + timelineWidth} height={totalHeight} className="block">
          {/* Month markers */}
          <g>
            {months.map((month, index) => {
              const monthStart = startOfMonth(month);
              const monthEnd = endOfMonth(month);
              const x = getDatePosition(monthStart > startDate ? monthStart : startDate);
              const monthDays = differenceInDays(
                monthEnd > endDate ? endDate : monthEnd,
                monthStart < startDate ? startDate : monthStart
              );
              const width = (monthDays / totalDays) * timelineWidth;

              return (
                <g key={index}>
                  <rect
                    x={LANE_LABEL_WIDTH + x}
                    y={TIMELINE_HEIGHT}
                    width={width}
                    height={MONTH_LABEL_HEIGHT}
                    fill={index % 2 === 0 ? '#f9fafb' : '#ffffff'}
                  />
                  <text
                    x={LANE_LABEL_WIDTH + x + width / 2}
                    y={TIMELINE_HEIGHT + MONTH_LABEL_HEIGHT / 2 + 4}
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-600"
                  >
                    {format(month, 'MMM yyyy')}
                  </text>
                  {/* Month boundary line */}
                  <line
                    x1={LANE_LABEL_WIDTH + x}
                    y1={TIMELINE_HEIGHT}
                    x2={LANE_LABEL_WIDTH + x}
                    y2={totalHeight}
                    stroke="#e5e7eb"
                    strokeWidth={1}
                  />
                </g>
              );
            })}
          </g>

          {/* Timeline header */}
          <line
            x1={LANE_LABEL_WIDTH}
            y1={TIMELINE_HEIGHT}
            x2={LANE_LABEL_WIDTH + timelineWidth}
            y2={TIMELINE_HEIGHT}
            stroke="#374151"
            strokeWidth={2}
          />

          {/* Calendar Year Boundaries */}
          {calendarYearBoundaries.map((boundary, index) => {
            const x = LANE_LABEL_WIDTH + getDatePosition(boundary.date);
            return (
              <g key={`cal-year-${index}`}>
                <line
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={totalHeight}
                  stroke={CALENDAR_YEAR_MARKER_COLOR}
                  strokeWidth={CALENDAR_YEAR_MARKER_WIDTH}
                  strokeDasharray={CALENDAR_YEAR_MARKER_STROKE_DASHARRAY}
                  opacity={CALENDAR_YEAR_MARKER_OPACITY}
                />
              </g>
            );
          })}

          {/* ASEAN Working Year Boundaries (January 1) */}
          {aseanYearBoundaries.map((boundary, index) => {
            const x = LANE_LABEL_WIDTH + getDatePosition(boundary.date);
            return (
              <g key={`asean-year-${index}`}>
                <line
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={totalHeight}
                  stroke={ASEAN_YEAR_MARKER_COLOR}
                  strokeWidth={ASEAN_YEAR_MARKER_WIDTH}
                  strokeDasharray={ASEAN_YEAR_MARKER_STROKE_DASHARRAY}
                  opacity={ASEAN_YEAR_MARKER_OPACITY}
                />
                {/* ASEAN Year Label */}
                <text
                  x={x}
                  y={TIMELINE_HEIGHT / 2 + 12}
                  textAnchor="middle"
                  className="text-[10px] font-medium fill-slate-600"
                  style={{ pointerEvents: 'none' }}
                >
                  {boundary.label}
                </text>
              </g>
            );
          })}

          {/* UK Financial Year Boundaries */}
          {ukFYBoundaries.map((boundary, index) => {
            const x = LANE_LABEL_WIDTH + getDatePosition(boundary.date);
            return (
              <g key={`uk-fy-${index}`}>
                <line
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={totalHeight}
                  stroke={UK_FY_MARKER_COLOR}
                  strokeWidth={UK_FY_MARKER_WIDTH}
                  strokeDasharray={UK_FY_MARKER_STROKE_DASHARRAY}
                  opacity={UK_FY_MARKER_OPACITY}
                />
                {/* FY Label */}
                <text
                  x={x}
                  y={TIMELINE_HEIGHT / 2 - 5}
                  textAnchor="middle"
                  className="text-[10px] font-medium fill-gray-500"
                  style={{ pointerEvents: 'none' }}
                >
                  {boundary.label}
                </text>
              </g>
            );
          })}

          {/* Today marker */}
          {isAfter(referenceDate, startDate) && isBefore(referenceDate, endDate) && (
            <g>
              <line
                x1={LANE_LABEL_WIDTH + getDatePosition(referenceDate)}
                y1={0}
                x2={LANE_LABEL_WIDTH + getDatePosition(referenceDate)}
                y2={totalHeight}
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
              <text
                x={LANE_LABEL_WIDTH + getDatePosition(referenceDate)}
                y={TIMELINE_HEIGHT / 2}
                textAnchor="middle"
                className="text-xs font-semibold fill-red-600"
                dy="4"
              >
                Today
              </text>
            </g>
          )}

          {/* Lanes and events */}
          {visibleLanes.map((lane, laneIndex) => {
            const y = TIMELINE_HEIGHT + MONTH_LABEL_HEIGHT + (laneIndex * LANE_HEIGHT);
            const laneEvents = eventsByLane[lane.key] || [];

            return (
              <g key={lane.key}>
                {/* Lane label */}
                <rect
                  x={0}
                  y={y}
                  width={LANE_LABEL_WIDTH}
                  height={LANE_HEIGHT}
                  fill="#f3f4f6"
                  className="border-r border-gray-200"
                />
                <text
                  x={LANE_LABEL_WIDTH - 10}
                  y={y + LANE_HEIGHT / 2 + 4}
                  textAnchor="end"
                  className="text-sm font-medium fill-gray-700"
                >
                  {lane.label}
                </text>

                {/* Lane separator */}
                <line
                  x1={0}
                  y1={y + LANE_HEIGHT}
                  x2={LANE_LABEL_WIDTH + timelineWidth}
                  y2={y + LANE_HEIGHT}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                />

                {/* School Year Background Bands (only for country lanes) */}
                {isFocusCountry(lane.key as GeographyTag) && (() => {
                  const schoolYearPeriods = getSchoolYearPeriodsForRange(
                    lane.key as GeographyTag,
                    startDate,
                    endDate
                  );
                  
                  return schoolYearPeriods.map((period, periodIndex) => {
                    const periodStart = new Date(period.inSessionStart);
                    const periodEnd = new Date(period.inSessionEnd);
                    const clampedPeriodStart = periodStart < startDate ? startDate : periodStart;
                    const clampedPeriodEnd = periodEnd > endDate ? endDate : periodEnd;
                    
                    const periodX = LANE_LABEL_WIDTH + getDatePosition(clampedPeriodStart);
                    const periodDays = Math.max(1, differenceInDays(clampedPeriodEnd, clampedPeriodStart) + 1);
                    const periodWidth = (periodDays / totalDays) * timelineWidth;
                    
                    return (
                      <rect
                        key={`school-year-${lane.key}-${periodIndex}`}
                        x={periodX}
                        y={y}
                        width={Math.max(2, periodWidth)}
                        height={LANE_HEIGHT}
                        fill={SCHOOL_YEAR_IN_SESSION_COLOR}
                        opacity={SCHOOL_YEAR_IN_SESSION_OPACITY}
                        stroke={SCHOOL_YEAR_BORDER_COLOR}
                        strokeWidth={SCHOOL_YEAR_BORDER_WIDTH}
                        style={{ pointerEvents: 'none' }}
                      />
                    );
                  });
                })()}

                {/* Events in this lane */}
                {laneEvents.map((event, eventIndex) => {
                  const eventStart = new Date(event.startDate);
                  const eventEnd = new Date(event.endDate);
                  const clampedStart = eventStart < startDate ? startDate : eventStart;
                  const clampedEnd = eventEnd > endDate ? endDate : eventEnd;
                  
                  const x = LANE_LABEL_WIDTH + getDatePosition(clampedStart);
                  const clampedDays = Math.max(1, differenceInDays(clampedEnd, clampedStart) + 1);
                  const width = (clampedDays / totalDays) * timelineWidth;

                  const eventY = y + 8;
                  const eventHeight = LANE_HEIGHT - 16;
                  const isUrgentEvent = isUrgent(event);
                  const color = EVENT_TYPE_COLORS[event.eventType];

                  return (
                    <g
                      key={event.id}
                      onMouseEnter={(e) => handleEventMouseEnter(event, e)}
                      onMouseLeave={handleEventMouseLeave}
                      onClick={() => onEventClick(event)}
                      className="cursor-pointer"
                    >
                      {/* Event bar */}
                      <rect
                        x={x}
                        y={eventY}
                        width={Math.max(4, width)}
                        height={eventHeight}
                        fill={color}
                        opacity={hoveredEvent?.id === event.id ? 0.9 : 0.7}
                        rx={4}
                        className="transition-all duration-200"
                      />
                      
                      {/* Urgency indicator */}
                      {isUrgentEvent && (
                        <circle
                          cx={x + Math.max(4, width) - 8}
                          cy={eventY + 8}
                          r={4}
                          fill="#ef4444"
                        />
                      )}

                      {/* Event name (if space allows) */}
                      {width > 100 && (
                        <text
                          x={x + 6}
                          y={eventY + eventHeight / 2 + 4}
                          className="text-xs font-medium fill-white"
                          style={{ pointerEvents: 'none' }}
                        >
                          {event.name.length > Math.floor(width / 8) 
                            ? event.name.substring(0, Math.floor(width / 8) - 3) + '...'
                            : event.name
                          }
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tooltip */}
      {hoveredEvent && tooltipPosition && (
        <div
          className="fixed z-50 bg-white px-4 py-3 rounded-lg shadow-xl border border-gray-200 pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
            marginTop: '-8px'
          }}
        >
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-900">{hoveredEvent.name}</p>
            <p className="text-xs text-gray-600">
              {format(new Date(hoveredEvent.startDate), 'MMM d, yyyy')} - {format(new Date(hoveredEvent.endDate), 'MMM d, yyyy')}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {hoveredEvent.eventType.toLowerCase().replace(/_/g, ' ')}
            </p>
            {hoveredEvent.description && (
              <p className="text-xs text-gray-600 max-w-xs mt-2">
                {hoveredEvent.description.length > 100
                  ? hoveredEvent.description.substring(0, 100) + '...'
                  : hoveredEvent.description
                }
              </p>
            )}
            {isUrgent(hoveredEvent) && (
              <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                <AlertCircle size={12} />
                <span>Within next 90 days</span>
              </div>
            )}
          </div>
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"
          />
        </div>
      )}
    </div>
  );
};

