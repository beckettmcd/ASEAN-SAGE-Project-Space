import React, { useState } from 'react';
import { EVENT_TYPE_COLORS } from '../../utils/calendarConfig';
import { Info, X } from 'lucide-react';

export const CompactLegend: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const legendItems = [
    { color: EVENT_TYPE_COLORS.ASEAN_MINISTERIAL, label: 'ASEAN Ministerial & Summit' },
    { color: EVENT_TYPE_COLORS.ASEAN_SENIOR_OFFICIALS, label: 'ASEAN Senior Officials' },
    { color: EVENT_TYPE_COLORS.ASEAN_WORKING_GROUP, label: 'ASEAN Working Groups' },
    { color: EVENT_TYPE_COLORS.REGIONAL_CONFERENCE, label: 'International Conferences' },
    { color: EVENT_TYPE_COLORS.AMS_TA_ACTIVITY, label: 'Country TA Activities' },
    { color: EVENT_TYPE_COLORS.INTERNAL_PLANNING, label: 'Internal Planning' }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        title="Show color legend"
      >
        <Info size={14} />
        <span>Legend</span>
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Popover */}
          <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4 min-w-[220px]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-900">Color Legend</h4>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <X size={14} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-2">
              {legendItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

