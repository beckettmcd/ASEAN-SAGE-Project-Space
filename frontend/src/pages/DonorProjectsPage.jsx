import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { donorApi } from '../services/api';
import { DonorMap } from '../components/DonorMap';
import { DonorProjectList } from '../components/DonorProjectList';
import { CountryDonorDetail } from '../components/CountryDonorDetail';
import { Building2, Globe, DollarSign, Calendar } from 'lucide-react';

export const DonorProjectsPage = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCountryDetail, setShowCountryDetail] = useState(false);

  const { data: donors, isLoading: isDonorsLoading } = useQuery({
    queryKey: ['donors'],
    queryFn: () => donorApi.getAllDonors().then(res => res.data)
  });

  const { data: projects, isLoading: isProjectsLoading } = useQuery({
    queryKey: ['donor-projects'],
    queryFn: () => donorApi.getProjects().then(res => res.data)
  });

  const isLoading = isDonorsLoading || isProjectsLoading;

  const handleCountryClick = (countryCode) => {
    setSelectedCountry(countryCode);
    setShowCountryDetail(true);
    setSelectedProject(null);
  };

  const handleCloseCountryDetail = () => {
    setShowCountryDetail(false);
    setSelectedCountry(null);
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowCountryDetail(false);
  };

  // Calculate summary metrics
  const totalBudget = projects?.reduce((sum, project) => sum + parseFloat(project.totalBudget || 0), 0) || 0;
  const activeProjects = projects?.filter(p => p.status === 'Active').length || 0;
  const activeCountries = new Set(projects?.filter(p => !p.isRegional && p.country).map(p => p.country.code)).size;
  const totalDonors = donors?.length || 0;

  // Filter projects for selected country
  const filteredProjects = selectedCountry
    ? projects?.filter(project => 
        project.country?.code === selectedCountry || project.isRegional
      ) || []
    : projects || [];

  if (isLoading) {
    return (
      <div className="space-y-3 animate-fade-in">
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-3 animate-pulse shadow-soft">
              <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-soft p-4 animate-pulse" style={{ height: 'calc(100vh - 280px)' }}>
          <div className="h-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Summary Metrics */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 shadow-soft border border-blue-200">
          <div className="flex items-center justify-between mb-1">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">Total Donors</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{totalDonors}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 shadow-soft border border-green-200">
          <div className="flex items-center justify-between mb-1">
            <Globe className="w-5 h-5 text-green-600" />
            <span className="text-xs font-medium text-green-700">Active Projects</span>
          </div>
          <p className="text-2xl font-bold text-green-900">{activeProjects}</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-3 shadow-soft border border-amber-200">
          <div className="flex items-center justify-between mb-1">
            <DollarSign className="w-5 h-5 text-amber-600" />
            <span className="text-xs font-medium text-amber-700">Total Budget</span>
          </div>
          <p className="text-2xl font-bold text-amber-900">
            ${(totalBudget / 1000000).toFixed(1)}M
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 shadow-soft border border-purple-200">
          <div className="flex items-center justify-between mb-1">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-medium text-purple-700">Countries</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">{activeCountries}</p>
        </div>
      </div>

      {/* Main Content: Map and Projects */}
      <div className="grid grid-cols-5 gap-4">
        {/* Map - Left (40%) */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl shadow-soft p-4 border border-gray-100 hover:shadow-lg transition-all duration-300" style={{ height: 'calc(100vh - 280px)' }}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="section-header flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-primary-500 to-primary-700 rounded-full"></div>
                ASEAN Donor Activity Map
              </h3>
              {selectedCountry && (
                <button
                  onClick={handleCloseCountryDetail}
                  className="text-xs px-2.5 py-1.5 bg-gradient-to-r from-primary-100 to-primary-200 hover:from-primary-200 hover:to-primary-300 rounded-lg transition-all duration-200 font-medium text-primary-800 shadow-sm hover:shadow"
                >
                  Clear Filter
                </button>
              )}
            </div>
            <div style={{ height: 'calc(100% - 50px)' }}>
              <DonorMap
                projects={projects || []}
                donors={donors || []}
                selectedCountry={selectedCountry}
                onCountryClick={handleCountryClick}
              />
            </div>
          </div>
        </div>

        {/* Project List - Right (60%) */}
        <div className="col-span-3">
          <div className="bg-white rounded-xl shadow-soft p-4 border border-gray-100 hover:shadow-lg transition-all duration-300" style={{ height: 'calc(100vh - 280px)' }}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="section-header flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-primary-500 to-primary-700 rounded-full"></div>
                Donor Projects
                {selectedCountry && (
                  <span className="text-xs px-3 py-1 bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg">
                    {selectedCountry}
                  </span>
                )}
              </h3>
            </div>
            <div className="overflow-y-auto" style={{ height: 'calc(100% - 50px)' }}>
              <DonorProjectList
                projects={filteredProjects}
                onProjectClick={handleProjectClick}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Country Detail Modal */}
      {showCountryDetail && selectedCountry && (
        <CountryDonorDetail
          countryCode={selectedCountry}
          onClose={handleCloseCountryDetail}
        />
      )}
    </div>
  );
};
