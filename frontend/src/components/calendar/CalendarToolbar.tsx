import React, { useState, useRef, useEffect } from 'react';
import { SAGEEventType, GeographyTag } from '../../data/events';
import { TimeRange } from './ViewControls';
import { VIEW_PRESETS } from '../../utils/calendarConfig';
import { format, addMonths } from 'date-fns';
import { Clock, Calendar, Filter, ChevronDown, X, Info } from 'lucide-react';

interface CalendarToolbarProps {
  timeRange: TimeRange;
  referenceDate: Date;
  selectedPreset: string | null;
  selectedEventTypes: Set<SAGEEventType>;
  selectedGeographies: Set<string>;
  showEstimated: boolean;
  onTimeRangeChange: (range: TimeRange) => void;
  onReferenceDateChange: (date: Date) => void;
  onPresetSelect: (presetId: string | null) => void;
  onEventTypeToggle: (type: SAGEEventType) => void;
  onGeographyToggle: (geo: GeographyTag) => void;
  onShowEstimatedToggle: () => void;
  onFiltersOpen: () => void;
  activeFilterCount: number;
}

export const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  timeRange,
  referenceDate,
  selectedPreset,
  selectedEventTypes,
  selectedGeographies,
  showEstimated,
  onTimeRangeChange,
  onReferenceDateChange,
  onPresetSelect,
  onEventTypeToggle,
  onGeographyToggle,
  onShowEstimatedToggle,
  onFiltersOpen,
  activeFilterCount
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);
  const presetRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (presetRef.current && !presetRef.current.contains(event.target as Node)) {
        setShowPresetDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      onReferenceDateChange(newDate);
      setShowDatePicker(false);
    }
  };

  const selectedPresetLabel = selectedPreset 
    ? VIEW_PRESETS.find(p => p.id === selectedPreset)?.label || 'Custom'
    : 'All Events';

  return (
    <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-3 mb-3">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Time Range Controls */}
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-500 flex-shrink-0" />
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onTimeRangeChange('6MO')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                timeRange === '6MO'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              6M
            </button>
            <button
              onClick={() => onTimeRangeChange('12MO')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                timeRange === '12MO'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              12M
            </button>
            <button
              onClick={() => onTimeRangeChange('FULL')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                timeRange === 'FULL'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Reference Date (conditional) */}
        {(timeRange === '6MO' || timeRange === '12MO') && (
          <div className="relative flex items-center gap-2">
            <Calendar size={16} className="text-gray-500 flex-shrink-0" />
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-md text-xs font-medium text-gray-700 border border-gray-200 transition-colors"
              >
                {format(referenceDate, 'MMM d, yyyy')}
              </button>
              {showDatePicker && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2">
                  <input
                    type="date"
                    value={format(referenceDate, 'yyyy-MM-dd')}
                    onChange={handleDateInputChange}
                    className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="h-6 w-px bg-gray-300" />

        {/* View Presets */}
        <div className="relative" ref={presetRef}>
          <button
            onClick={() => setShowPresetDropdown(!showPresetDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-md text-xs font-medium text-gray-700 border border-gray-200 transition-colors"
          >
            <span>{selectedPresetLabel}</span>
            <ChevronDown size={14} className={showPresetDropdown ? 'rotate-180 transition-transform' : 'transition-transform'} />
          </button>
          {showPresetDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px] py-1">
              <button
                onClick={() => {
                  onPresetSelect(null);
                  setShowPresetDropdown(false);
                }}
                className={`w-full px-4 py-2 text-left text-xs font-medium transition-colors ${
                  selectedPreset === null
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                All Events
              </button>
              {VIEW_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => {
                    onPresetSelect(preset.id);
                    setShowPresetDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-xs font-medium transition-colors ${
                    selectedPreset === preset.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title={preset.description}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-300" />

        {/* Filters Button */}
        <button
          onClick={onFiltersOpen}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-md text-xs font-medium text-gray-700 border border-gray-200 transition-colors relative"
        >
          <Filter size={14} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-primary-600 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Show estimated toggle */}
          <button
            onClick={onShowEstimatedToggle}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
              showEstimated
                ? 'bg-primary-100 text-primary-700 border-primary-300'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
          >
            {showEstimated ? '✓' : ''} Estimated
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Info/Help (can be used for legend toggle or other info) */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Info size={14} />
          <span>Click events for details</span>
        </div>
      </div>
    </div>
  );
};

