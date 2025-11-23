import React, { useState, useMemo } from 'react';
import { events } from '../data/events';
import { SAGEEvent, SAGEEventType, GeographyTag } from '../data/events';
import { PROGRAMME_START_DATE, PROGRAMME_END_DATE, VIEW_PRESETS } from '../utils/calendarConfig';
import { SAGEGantt } from '../components/calendar/SAGEGantt';
import { FiltersPanel } from '../components/calendar/FiltersPanel';
import { CalendarToolbar } from '../components/calendar/CalendarToolbar';
import { FilterPills } from '../components/calendar/FilterPills';
import { CompactLegend } from '../components/calendar/CompactLegend';
import { EventDetailsDrawer } from '../components/calendar/EventDetailsDrawer';
import { UrgencyBanner } from '../components/calendar/UrgencyBanner';
import { TimeRange } from '../components/calendar/ViewControls';
import { addMonths, format } from 'date-fns';

export const CalendarPage: React.FC = () => {
  // State for time range view
  const [timeRange, setTimeRange] = useState<TimeRange>('FULL');
  const [referenceDate, setReferenceDate] = useState<Date>(new Date());

  // State for filters
  const [selectedEventTypes, setSelectedEventTypes] = useState<Set<SAGEEventType>>(
    new Set([
      'ASEAN_MINISTERIAL',
      'ASEAN_SENIOR_OFFICIALS',
      'ASEAN_WORKING_GROUP',
      'ASEAN_SUMMIT',
      'REGIONAL_CONFERENCE',
      'AMS_TA_ACTIVITY',
      'INTERNAL_PLANNING',
      'OTHER'
    ])
  );
  const [selectedGeographies, setSelectedGeographies] = useState<Set<string>>(
    new Set(['REGIONAL', 'CAMBODIA', 'LAO_PDR', 'TIMOR_LESTE', 'PHILIPPINES', 'OTHER'])
  );
  const [showEstimated, setShowEstimated] = useState<boolean>(true);

  // State for view presets
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  // State for event details drawer
  const [selectedEvent, setSelectedEvent] = useState<SAGEEvent | null>(null);

  // State for filters panel popover
  const [filtersPanelOpen, setFiltersPanelOpen] = useState(false);

  // Calculate visible date range based on time range selection
  const visibleDateRange = useMemo(() => {
    let start: Date;
    let end: Date;

    if (timeRange === 'FULL') {
      start = PROGRAMME_START_DATE;
      end = PROGRAMME_END_DATE;
    } else if (timeRange === '6MO') {
      start = referenceDate;
      end = addMonths(referenceDate, 6);
    } else {
      // 12MO
      start = referenceDate;
      end = addMonths(referenceDate, 12);
    }

    // Clamp to programme dates
    if (start < PROGRAMME_START_DATE) start = PROGRAMME_START_DATE;
    if (end > PROGRAMME_END_DATE) end = PROGRAMME_END_DATE;

    return { start, end };
  }, [timeRange, referenceDate]);

  // Apply view preset filters
  const appliedFilters = useMemo(() => {
    if (!selectedPreset) {
      return {
        eventTypes: selectedEventTypes,
        geographies: selectedGeographies,
        showEstimated
      };
    }

    const preset = VIEW_PRESETS.find(p => p.id === selectedPreset);
    if (!preset) {
      return {
        eventTypes: selectedEventTypes,
        geographies: selectedGeographies,
        showEstimated
      };
    }

    // Apply preset filters
    const presetEventTypes = preset.eventTypeFilters
      ? new Set(preset.eventTypeFilters)
      : selectedEventTypes;

    const presetGeographies = preset.geographyFilters
      ? new Set(preset.geographyFilters)
      : selectedGeographies;

    return {
      eventTypes: presetEventTypes,
      geographies: presetGeographies,
      showEstimated
    };
  }, [selectedPreset, selectedEventTypes, selectedGeographies, showEstimated]);

  // Event handlers
  const handleEventTypeToggle = (type: SAGEEventType) => {
    setSelectedPreset(null); // Clear preset when manually changing filters
    const newSet = new Set(selectedEventTypes);
    if (newSet.has(type)) {
      newSet.delete(type);
    } else {
      newSet.add(type);
    }
    setSelectedEventTypes(newSet);
  };

  const handleGeographyToggle = (geo: GeographyTag) => {
    setSelectedPreset(null); // Clear preset when manually changing filters
    const newSet = new Set(selectedGeographies);
    if (newSet.has(geo)) {
      newSet.delete(geo);
    } else {
      newSet.add(geo);
    }
    setSelectedGeographies(newSet);
  };

  const handleShowEstimatedToggle = () => {
    setShowEstimated(!showEstimated);
  };

  const handlePresetSelect = (presetId: string | null) => {
    setSelectedPreset(presetId);
    if (presetId) {
      const preset = VIEW_PRESETS.find(p => p.id === presetId);
      if (preset) {
        if (preset.eventTypeFilters) {
          setSelectedEventTypes(new Set(preset.eventTypeFilters));
        }
        if (preset.geographyFilters) {
          setSelectedGeographies(new Set(preset.geographyFilters));
        }
      }
    }
  };

  const handleEventClick = (event: SAGEEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseDrawer = () => {
    setSelectedEvent(null);
  };

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    // Count non-default event types (if not all selected)
    const allEventTypes = new Set([
      'ASEAN_MINISTERIAL',
      'ASEAN_SENIOR_OFFICIALS',
      'ASEAN_WORKING_GROUP',
      'ASEAN_SUMMIT',
      'REGIONAL_CONFERENCE',
      'AMS_TA_ACTIVITY',
      'INTERNAL_PLANNING',
      'OTHER'
    ]);
    if (selectedEventTypes.size < allEventTypes.size) {
      count += allEventTypes.size - selectedEventTypes.size;
    }
    // Count non-default geographies (if not all selected)
    const allGeographies = new Set(['REGIONAL', 'CAMBODIA', 'LAO_PDR', 'TIMOR_LESTE', 'PHILIPPINES', 'OTHER']);
    if (selectedGeographies.size < allGeographies.size) {
      count += allGeographies.size - selectedGeographies.size;
    }
    // Count if estimated dates are hidden
    if (!showEstimated) {
      count += 1;
    }
    return count;
  }, [selectedEventTypes, selectedGeographies, showEstimated]);

  // Handlers for filter pills
  const handleEventTypeRemove = (type: SAGEEventType) => {
    handleEventTypeToggle(type);
  };

  const handleGeographyRemove = (geo: GeographyTag) => {
    handleGeographyToggle(geo);
  };

  const handleClearAllFilters = () => {
    setSelectedEventTypes(new Set([
      'ASEAN_MINISTERIAL',
      'ASEAN_SENIOR_OFFICIALS',
      'ASEAN_WORKING_GROUP',
      'ASEAN_SUMMIT',
      'REGIONAL_CONFERENCE',
      'AMS_TA_ACTIVITY',
      'INTERNAL_PLANNING',
      'OTHER'
    ]));
    setSelectedGeographies(new Set(['REGIONAL', 'CAMBODIA', 'LAO_PDR', 'TIMOR_LESTE', 'PHILIPPINES', 'OTHER']));
    setShowEstimated(true);
    setSelectedPreset(null);
  };

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-700 rounded-full"></div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            SAGE Master Calendar
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Three-year programme workplan: {format(PROGRAMME_START_DATE, 'MMM yyyy')} - {format(PROGRAMME_END_DATE, 'MMM yyyy')}
          </p>
        </div>
      </div>

      {/* Urgency Banner */}
      <UrgencyBanner events={events} referenceDate={referenceDate} />

      {/* Calendar Toolbar with Filters Panel */}
      <div className="relative">
        <CalendarToolbar
          timeRange={timeRange}
          referenceDate={referenceDate}
          selectedPreset={selectedPreset}
          selectedEventTypes={appliedFilters.eventTypes}
          selectedGeographies={appliedFilters.geographies}
          showEstimated={appliedFilters.showEstimated}
          onTimeRangeChange={setTimeRange}
          onReferenceDateChange={setReferenceDate}
          onPresetSelect={handlePresetSelect}
          onEventTypeToggle={handleEventTypeToggle}
          onGeographyToggle={handleGeographyToggle}
          onShowEstimatedToggle={handleShowEstimatedToggle}
          onFiltersOpen={() => setFiltersPanelOpen(!filtersPanelOpen)}
          activeFilterCount={activeFilterCount}
        />
        
        {/* Filters Panel Popover - positioned relative to toolbar, aligned to right */}
        {filtersPanelOpen && (
          <div className="absolute top-full right-0 z-50 mt-2">
            <FiltersPanel
              isOpen={filtersPanelOpen}
              onClose={() => setFiltersPanelOpen(false)}
              selectedEventTypes={appliedFilters.eventTypes}
              selectedGeographies={appliedFilters.geographies}
              showEstimated={appliedFilters.showEstimated}
              onEventTypeToggle={handleEventTypeToggle}
              onGeographyToggle={handleGeographyToggle}
              onShowEstimatedToggle={handleShowEstimatedToggle}
            />
          </div>
        )}
      </div>

      {/* Filter Pills */}
      <FilterPills
        selectedEventTypes={appliedFilters.eventTypes}
        selectedGeographies={appliedFilters.geographies}
        onEventTypeRemove={handleEventTypeRemove}
        onGeographyRemove={handleGeographyRemove}
        onClearAll={handleClearAllFilters}
      />

      {/* Main Gantt Chart - Full Width */}
      <div className="w-full">
        <SAGEGantt
          events={events}
          startDate={visibleDateRange.start}
          endDate={visibleDateRange.end}
          selectedEventTypes={appliedFilters.eventTypes}
          selectedGeographies={appliedFilters.geographies}
          showEstimated={appliedFilters.showEstimated}
          referenceDate={referenceDate}
          onEventClick={handleEventClick}
        />
      </div>

      {/* Event Details Drawer */}
      <EventDetailsDrawer event={selectedEvent} onClose={handleCloseDrawer} />
    </div>
  );
};

