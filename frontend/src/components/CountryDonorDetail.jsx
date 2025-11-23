import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { donorApi } from '../services/api';
import { X, Building2, DollarSign, Calendar, Mail, Phone, ExternalLink } from 'lucide-react';
import { ASEAN_COUNTRIES } from '../utils/mapData';

export const CountryDonorDetail = ({ countryCode, onClose }) => {
  const { data: activityData, isLoading } = useQuery({
    queryKey: ['donor-activity', countryCode],
    queryFn: () => donorApi.getCountryActivity(countryCode).then(res => res.data),
    enabled: !!countryCode
  });

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

  const country = ASEAN_COUNTRIES[countryCode];
  const donors = activityData?.donors || [];
  const totalBudget = activityData?.totalBudget || 0;
  const totalProjects = activityData?.totalProjects || 0;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-4xl">{country?.flag}</span>
                {country?.name} - Donor Activity
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {totalProjects} project{totalProjects !== 1 ? 's' : ''} • {formatBudget(totalBudget)} total budget
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {donors.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No donor activity in this country</p>
            </div>
          ) : (
            <div className="space-y-6">
              {donors.map((group) => (
                <div
                  key={group.donor.id}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
                >
                  {/* Donor Header */}
                  <div className="flex items-start gap-4 mb-4">
                    {group.donor.logoUrl && (
                      <img
                        src={group.donor.logoUrl}
                        alt={group.donor.name}
                        className="h-12 w-auto rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {group.donor.name}
                      </h3>
                      {group.donor.description && (
                        <p className="text-sm text-gray-600">
                          {group.donor.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">
                        {formatBudget(group.totalBudget)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {group.projectCount} project{group.projectCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Donor Contact Info */}
                  {(group.donor.contactEmail || group.donor.contactPhone) && (
                    <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-600">
                      {group.donor.contactEmail && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-4 h-4" />
                          <a
                            href={`mailto:${group.donor.contactEmail}`}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            {group.donor.contactEmail}
                          </a>
                        </div>
                      )}
                      {group.donor.contactPhone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-4 h-4" />
                          <span>{group.donor.contactPhone}</span>
                        </div>
                      )}
                      {group.donor.website && (
                        <a
                          href={group.donor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-primary-600 hover:text-primary-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Website
                        </a>
                      )}
                    </div>
                  )}

                  {/* Projects */}
                  <div className="space-y-3 mt-4">
                    {group.projects.map((project) => (
                      <div
                        key={project.id}
                        className="bg-white rounded-lg border border-gray-200 p-4 hover:border-primary-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm text-gray-900 flex-1">
                            {project.title}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            project.status === 'Active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {project.status}
                          </span>
                        </div>

                        {project.description && (
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {project.description}
                          </p>
                        )}

                        <div className="grid grid-cols-3 gap-3 text-xs">
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-medium">{formatBudget(project.totalBudget)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(project.startDate).getFullYear()} - {new Date(project.endDate).getFullYear()}
                            </span>
                          </div>
                          {project.focusAreas && project.focusAreas.length > 0 && (
                            <div className="text-gray-600 truncate">
                              {project.focusAreas.slice(0, 2).join(', ')}
                              {project.focusAreas.length > 2 && '...'}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
