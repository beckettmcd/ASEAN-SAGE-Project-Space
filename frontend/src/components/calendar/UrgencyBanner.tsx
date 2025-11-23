import React from 'react';
import { SAGEEvent } from '../../data/events';
import { format, differenceInDays, addDays, isAfter, isBefore } from 'date-fns';
import { AlertCircle, Calendar } from 'lucide-react';

interface UrgencyBannerProps {
  events: SAGEEvent[];
  referenceDate: Date;
}

export const UrgencyBanner: React.FC<UrgencyBannerProps> = ({ events, referenceDate }) => {
  const urgencyThreshold = addDays(referenceDate, 90);
  
  // Find events in next 90 days
  const upcomingEvents = events.filter(event => {
    const eventStart = new Date(event.startDate);
    return isAfter(eventStart, referenceDate) && isBefore(eventStart, urgencyThreshold);
  });
  
  // Find next ASEAN governance milestone
  const nextGovernanceEvent = events
    .filter(event => 
      ['ASEAN_MINISTERIAL', 'ASEAN_SENIOR_OFFICIALS', 'ASEAN_SUMMIT'].includes(event.eventType) &&
      isAfter(new Date(event.startDate), referenceDate)
    )
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];
  
  const daysUntilGovernance = nextGovernanceEvent 
    ? differenceInDays(new Date(nextGovernanceEvent.startDate), referenceDate)
    : null;

  if (upcomingEvents.length === 0 && !nextGovernanceEvent) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-md px-3 py-1.5 mb-3">
      <div className="flex items-center gap-3 text-xs">
        <AlertCircle className="text-amber-600 flex-shrink-0" size={14} />
        
        {upcomingEvents.length > 0 && (
          <span className="text-amber-800">
            <span className="font-bold">{upcomingEvents.length}</span> event{upcomingEvents.length !== 1 ? 's' : ''} in next 90 days
          </span>
        )}
        
        {nextGovernanceEvent && (
          <>
            {upcomingEvents.length > 0 && <span className="text-amber-300">•</span>}
            <Calendar className="text-amber-600 flex-shrink-0" size={12} />
            <span className="text-amber-800 truncate">
              Next: <span className="font-semibold">{nextGovernanceEvent.name}</span>
              {' '}
              <span className="text-amber-700">
                ({daysUntilGovernance}d - {format(new Date(nextGovernanceEvent.startDate), 'MMM d')})
              </span>
            </span>
          </>
        )}
      </div>
    </div>
  );
};

