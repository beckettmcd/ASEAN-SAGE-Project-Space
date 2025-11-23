import React from 'react';
import { SAGEEvent, events } from '../../data/events';
import { format } from 'date-fns';
import { X, Calendar, MapPin, Tag, FileText, Link as LinkIcon } from 'lucide-react';

interface EventDetailsDrawerProps {
  event: SAGEEvent | null;
  onClose: () => void;
}

export const EventDetailsDrawer: React.FC<EventDetailsDrawerProps> = ({ event, onClose }) => {
  if (!event) return null;

  // Find related events
  const relatedEvents = event.relatedTo
    ? events.filter(e => event.relatedTo!.includes(e.id))
    : [];

  const getDateStatusBadge = (status: string) => {
    return status === 'CONFIRMED' 
      ? <span className="badge badge-green">Confirmed</span>
      : <span className="badge badge-amber">Estimated</span>;
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-gray-900">Event Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Event Name */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h3>
            {getDateStatusBadge(event.dateStatus)}
          </div>
          
          {/* Dates */}
          <div className="flex items-start gap-3">
            <Calendar className="text-primary-600 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-medium text-gray-700">Dates</p>
              <p className="text-sm text-gray-900">
                {format(new Date(event.startDate), 'MMMM d, yyyy')} - {format(new Date(event.endDate), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
          
          {/* Event Type */}
          <div className="flex items-start gap-3">
            <Tag className="text-primary-600 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-medium text-gray-700">Event Type</p>
              <p className="text-sm text-gray-900 capitalize">
                {event.eventType.toLowerCase().replace(/_/g, ' ')}
              </p>
            </div>
          </div>
          
          {/* Geography */}
          <div className="flex items-start gap-3">
            <MapPin className="text-primary-600 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-medium text-gray-700">Geography</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {event.geography.map(geo => (
                  <span
                    key={geo}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {geo.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Workstream */}
          {event.workstream && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Workstream</p>
              <p className="text-sm text-gray-900">{event.workstream}</p>
            </div>
          )}
          
          {/* Description */}
          {event.description && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
              <p className="text-sm text-gray-900 leading-relaxed">{event.description}</p>
            </div>
          )}
          
          {/* Related Events */}
          {relatedEvents.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <LinkIcon className="text-primary-600" size={18} />
                <p className="text-sm font-medium text-gray-700">Related Events</p>
              </div>
              <ul className="space-y-2">
                {relatedEvents.map(related => (
                  <li key={related.id} className="text-sm text-gray-900 pl-4 border-l-2 border-primary-200 py-1">
                    <span className="font-medium">{related.name}</span>
                    <span className="text-gray-500 ml-2">
                      ({format(new Date(related.startDate), 'MMM yyyy')})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Future Fields Placeholder */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 italic">
              Additional fields (responsible person, budget code, etc.) can be added here.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

