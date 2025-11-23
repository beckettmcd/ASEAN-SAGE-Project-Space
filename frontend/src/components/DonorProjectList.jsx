import { useState } from 'react';
import { MapPin, DollarSign, Calendar, ExternalLink } from 'lucide-react';

export const DonorProjectList = ({ projects = [], onProjectClick }) => {
  const [expandedProject, setExpandedProject] = useState(null);

  const handleProjectClick = (project) => {
    setExpandedProject(expandedProject === project.id ? null : project.id);
    if (onProjectClick) {
      onProjectClick(project);
    }
  };

  const formatBudget = (budget) => {
    if (!budget) return 'N/A';
    if (budget >= 1000000) {
      return `$${(budget / 1000000).toFixed(1)}M`;
    }
    if (budget >= 1000) {
      return `$${(budget / 1000).toFixed(0)}K`;
    }
    return `$${budget}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
    if (years >= 1) {
      return `${years.toFixed(1)} years`;
    }
    const months = (end - start) / (1000 * 60 * 60 * 24 * 30);
    return `${months.toFixed(0)} months`;
  };

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No donor projects found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 cursor-pointer"
          onClick={() => handleProjectClick(project)}
        >
          {/* Project Header */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  {project.title}
                </h4>
                {project.donorOrganisation && (
                  <div className="flex items-center gap-2 mb-2">
                    {project.donorOrganisation.logoUrl && (
                      <img
                        src={project.donorOrganisation.logoUrl}
                        alt={project.donorOrganisation.name}
                        className="h-5 w-auto"
                      />
                    )}
                    <span className="text-xs text-gray-600">
                      {project.donorOrganisation.name}
                    </span>
                  </div>
                )}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                project.status === 'Active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {project.status}
              </span>
            </div>

            {/* Project Metadata */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-gray-600">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate">
                  {project.isRegional ? 'Regional (ASEAN)' : project.country?.name || 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <DollarSign className="w-3.5 h-3.5" />
                <span>{formatBudget(project.totalBudget)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDuration(project.startDate, project.endDate)}</span>
              </div>
            </div>

            {/* Project Description */}
            {project.description && (
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                {project.description}
              </p>
            )}
          </div>

          {/* Expanded Details */}
          {expandedProject === project.id && (
            <div className="px-4 pb-4 pt-0 border-t border-gray-200 bg-gray-50 animate-slide-up">
              <div className="mt-3 space-y-3">
                {/* Focus Areas */}
                {project.focusAreas && project.focusAreas.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Focus Areas:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.focusAreas.map((area, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-600 mb-0.5">Start Date</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(project.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-0.5">End Date</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(project.endDate)}
                    </p>
                  </div>
                </div>

                {/* Key Contacts */}
                {project.keyContacts && project.keyContacts.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Key Contacts:</p>
                    <div className="space-y-1">
                      {project.keyContacts.map((contact, index) => (
                        <div key={index} className="text-xs">
                          <p className="font-medium text-gray-900">{contact.name}</p>
                          {contact.role && (
                            <p className="text-gray-600 text-xs">{contact.role}</p>
                          )}
                          {contact.email && (
                            <p className="text-primary-600">{contact.email}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Donor Info */}
                {project.donorOrganisation && project.donorOrganisation.website && (
                  <div>
                    <a
                      href={project.donorOrganisation.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Visit donor website
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
