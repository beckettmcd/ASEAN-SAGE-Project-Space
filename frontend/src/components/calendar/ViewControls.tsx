import React from 'react';
import { format, addMonths, addDays } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import { VIEW_PRESETS } from '../../utils/calendarConfig';

export type TimeRange = '6MO' | '12MO' | 'FULL';

interface ViewControlsProps {
  timeRange: TimeRange;
  referenceDate: Date;
  selectedPreset: string | null;
  onTimeRangeChange: (range: TimeRange) => void;
  onReferenceDateChange: (date: Date) => void;
  onPresetSelect: (presetId: string | null) => void;
}

export const ViewControls: React.FC<ViewControlsProps> = ({
  timeRange,
  referenceDate,
  selectedPreset,
  onTimeRangeChange,
  onReferenceDateChange,
  onPresetSelect
}) => {
  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      onReferenceDateChange(newDate);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-4 border border-gray-100 mb-4">
      <div className="space-y-4">
        {/* Time Range Selector */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-primary-600" />
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Time Range
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onTimeRangeChange('6MO')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                timeRange === '6MO'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Next 6 months
            </button>
            <button
              onClick={() => onTimeRangeChange('12MO')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                timeRange === '12MO'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Next 12 months
            </button>
            <button
              onClick={() => onTimeRangeChange('FULL')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                timeRange === 'FULL'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Whole programme
            </button>
          </div>
        </div>

        {/* Reference Date Picker */}
        {(timeRange === '6MO' || timeRange === '12MO') && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className="text-primary-600" />
              <label htmlFor="reference-date" className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Reference Date
              </label>
            </div>
            <input
              id="reference-date"
              type="date"
              value={format(referenceDate, 'yyyy-MM-dd')}
              onChange={handleDateInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              {timeRange === '6MO' 
                ? `Showing events from ${format(referenceDate, 'MMM d, yyyy')} to ${format(addMonths(referenceDate, 6), 'MMM d, yyyy')}`
                : `Showing events from ${format(referenceDate, 'MMM d, yyyy')} to ${format(addMonths(referenceDate, 12), 'MMM d, yyyy')}`
              }
            </p>
          </div>
        )}

        {/* View Presets */}
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
            View Presets
          </p>
          <div className="space-y-2">
            <button
              onClick={() => onPresetSelect(null)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                selectedPreset === null
                  ? 'bg-primary-100 text-primary-800 border-2 border-primary-300'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              Show All
            </button>
            {VIEW_PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => onPresetSelect(preset.id)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                  selectedPreset === preset.id
                    ? 'bg-primary-100 text-primary-800 border-2 border-primary-300'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent'
                }`}
                title={preset.description}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

