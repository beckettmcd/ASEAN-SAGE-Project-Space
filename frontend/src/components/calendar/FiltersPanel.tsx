import React, { useRef, useEffect } from 'react';
import { SAGEEventType, GeographyTag } from '../../data/events';
import { EVENT_TYPE_COLORS } from '../../utils/calendarConfig';
import { X } from 'lucide-react';

interface FiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEventTypes: Set<SAGEEventType>;
  selectedGeographies: Set<GeographyTag>;
  showEstimated: boolean;
  onEventTypeToggle: (type: SAGEEventType) => void;
  onGeographyToggle: (geo: GeographyTag) => void;
  onShowEstimatedToggle: () => void;
}

const ALL_EVENT_TYPES: SAGEEventType[] = [
  'ASEAN_MINISTERIAL',
  'ASEAN_SENIOR_OFFICIALS',
  'ASEAN_WORKING_GROUP',
  'ASEAN_SUMMIT',
  'REGIONAL_CONFERENCE',
  'AMS_TA_ACTIVITY',
  'INTERNAL_PLANNING',
  'OTHER'
];

const ALL_GEOGRAPHIES: GeographyTag[] = [
  'REGIONAL',
  'CAMBODIA',
  'LAO_PDR',
  'TIMOR_LESTE',
  'PHILIPPINES',
  'OTHER'
];

const formatLabel = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  isOpen,
  onClose,
  selectedEventTypes,
  selectedGeographies,
  showEstimated,
  onEventTypeToggle,
  onGeographyToggle,
  onShowEstimatedToggle
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-[320px] max-h-[80vh] overflow-y-auto"
    >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Event Type Filters */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
              Event Types
            </p>
            <div className="space-y-2">
              {ALL_EVENT_TYPES.map(type => {
                const isSelected = selectedEventTypes.has(type);
                return (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onEventTypeToggle(type)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: EVENT_TYPE_COLORS[type] }}
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {formatLabel(type)}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Geography Filters */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
              Geography
            </p>
            <div className="space-y-2">
              {ALL_GEOGRAPHIES.map(geo => {
                const isSelected = selectedGeographies.has(geo);
                return (
                  <label
                    key={geo}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onGeographyToggle(geo)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {formatLabel(geo)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Date Status Filter */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
              Date Status
            </p>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={showEstimated}
                onChange={onShowEstimatedToggle}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                Show estimated dates
              </span>
            </label>
          </div>

          {/* Color Legend */}
          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">
              Color Legend
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: EVENT_TYPE_COLORS.ASEAN_MINISTERIAL }} />
                <span className="text-gray-600">ASEAN Ministerial & Summit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: EVENT_TYPE_COLORS.ASEAN_SENIOR_OFFICIALS }} />
                <span className="text-gray-600">ASEAN Senior Officials</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: EVENT_TYPE_COLORS.ASEAN_WORKING_GROUP }} />
                <span className="text-gray-600">ASEAN Working Groups</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: EVENT_TYPE_COLORS.REGIONAL_CONFERENCE }} />
                <span className="text-gray-600">International Conferences</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: EVENT_TYPE_COLORS.AMS_TA_ACTIVITY }} />
                <span className="text-gray-600">Country TA Activities</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: EVENT_TYPE_COLORS.INTERNAL_PLANNING }} />
                <span className="text-gray-600">Internal Planning</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

