import React from 'react';
import { SAGEEventType, GeographyTag } from '../../data/events';
import { EVENT_TYPE_COLORS } from '../../utils/calendarConfig';
import { X } from 'lucide-react';

interface FilterPillsProps {
  selectedEventTypes: Set<SAGEEventType>;
  selectedGeographies: Set<GeographyTag>;
  onEventTypeRemove: (type: SAGEEventType) => void;
  onGeographyRemove: (geo: GeographyTag) => void;
  onClearAll: () => void;
}

const formatLabel = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

export const FilterPills: React.FC<FilterPillsProps> = ({
  selectedEventTypes,
  selectedGeographies,
  onEventTypeRemove,
  onGeographyRemove,
  onClearAll
}) => {
  const hasActiveFilters = selectedEventTypes.size > 0 || selectedGeographies.size > 0;
  
  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {Array.from(selectedEventTypes).map(type => (
        <button
          key={type}
          onClick={() => onEventTypeRemove(type)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary-700 border border-primary-200 hover:bg-primary-200 transition-colors group"
        >
          <div
            className="w-2.5 h-2.5 rounded"
            style={{ backgroundColor: EVENT_TYPE_COLORS[type] }}
          />
          <span>{formatLabel(type)}</span>
          <X size={12} className="opacity-60 group-hover:opacity-100" />
        </button>
      ))}
      
      {Array.from(selectedGeographies).map(geo => (
        <button
          key={geo}
          onClick={() => onGeographyRemove(geo)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 transition-colors group"
        >
          <span>{formatLabel(geo)}</span>
          <X size={12} className="opacity-60 group-hover:opacity-100" />
        </button>
      ))}

      <button
        onClick={onClearAll}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
      >
        Clear all
      </button>
    </div>
  );
};

