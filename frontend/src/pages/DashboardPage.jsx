import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MetricsGrid } from '../components/MetricsGrid';
import { ASEANMap } from '../components/ASEANMap';
import { OngoingAssignmentsTable } from '../components/OngoingAssignmentsTable';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { ASEAN_COUNTRIES } from '../utils/mapData';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

// Custom tooltip styling
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
        <p className="text-xs font-semibold text-gray-900">{label}</p>
        <p className="text-sm font-bold text-primary-600">{payload[0].value} days</p>
      </div>
    );
  }
  return null;
};

export const DashboardPage = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const { data: comprehensiveData, isLoading: isCompLoading } = useQuery({
    queryKey: ['dashboard', 'comprehensive'],
    queryFn: () => dashboardApi.getComprehensive().then(res => res.data),
    refetchInterval: 120000
  });

  const { data: regionalData, isLoading: isRegLoading } = useQuery({
    queryKey: ['dashboard', 'regional'],
    queryFn: () => dashboardApi.getRegional().then(res => res.data)
  });

  const isLoading = isCompLoading || isRegLoading;

  if (isLoading) {
    return (
      <div className="space-y-3 animate-fade-in">
        <div className="grid grid-cols-6 gap-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-3 animate-pulse shadow-soft" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4 animate-pulse" style={{ height: 'calc(100vh - 280px)' }}>
            <div className="h-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
          </div>
          <div className="col-span-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4 animate-pulse" style={{ height: 'calc(100vh - 280px)' }}>
            <div className="h-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const { assignments, countryAssignmentCounts, metrics, recentActivities } = comprehensiveData || {};

  const assignmentCountsForMap = {};
  (countryAssignmentCounts || []).forEach(item => {
    if (item.country) {
      assignmentCountsForMap[item.country.code] = parseInt(item.count);
    }
  });

  // Count regional assignments (no country specified)
  const regionalAssignments = (assignments || []).filter(a => !a.countryId);
  assignmentCountsForMap['ASEAN'] = regionalAssignments.length;

  const engagedCountryCodes = (assignments || [])
    .filter(a => a.country)
    .map(a => a.country.code)
    .filter((code, index, self) => self.indexOf(code) === index);

  const handleCountryClick = (countryCode) => {
    setSelectedCountry(selectedCountry === countryCode ? null : countryCode);
  };

  const countryLoEData = (assignments || [])
    .filter(a => a.country)
    .reduce((acc, a) => {
      const country = a.country.code;
      if (!acc[country]) {
        acc[country] = { country, usedLoE: 0 };
      }
      acc[country].usedLoE += parseFloat(a.actualLoE || 0);
      return acc;
    }, {});

  const countryLoEChartData = Object.values(countryLoEData)
    .map(item => ({
      country: item.country,
      LoE: Math.round(item.usedLoE)
    }))
    .sort((a, b) => b.LoE - a.LoE)
    .slice(0, 5);

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Compact Metrics - Single Row */}
      <div className="grid grid-cols-6 gap-2">
        <MetricsGrid metrics={metrics} />
      </div>

      {/* MAIN SECTION: Map and Assignments Side by Side */}
      <div className="grid grid-cols-5 gap-4">
        {/* ASEAN Map - Left (35%) */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl shadow-soft p-4 border border-gray-100 hover:shadow-lg transition-all duration-300" style={{ height: 'calc(100vh - 280px)' }}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="section-header flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-primary-500 to-primary-700 rounded-full"></div>
                ASEAN Interactive Map
              </h3>
              {selectedCountry && (
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="text-xs px-2.5 py-1.5 bg-gradient-to-r from-primary-100 to-primary-200 hover:from-primary-200 hover:to-primary-300 rounded-lg flex items-center gap-1.5 transition-all duration-200 font-medium text-primary-800 shadow-sm hover:shadow hover:-translate-y-0.5"
                >
                  <X size={12} />
                  Clear Filter
                </button>
              )}
            </div>
            <div style={{ height: 'calc(100% - 50px)' }}>
              <ASEANMap
                assignmentCounts={assignmentCountsForMap}
                selectedCountry={selectedCountry}
                onCountryClick={handleCountryClick}
              />
            </div>
          </div>
        </div>

        {/* Ongoing Assignments Table - Right (65%) */}
        <div className="col-span-3">
          <div className="bg-white rounded-xl shadow-soft p-4 border border-gray-100 hover:shadow-lg transition-all duration-300" style={{ height: 'calc(100vh - 280px)' }}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="section-header flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-primary-500 to-primary-700 rounded-full"></div>
                Ongoing Assignments
              </h3>
              {selectedCountry && (
                <div className="text-xs px-3 py-1.5 bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg shadow-sm">
                  <span className="font-bold bg-gradient-to-r from-primary-700 to-primary-900 bg-clip-text text-transparent">
                    {ASEAN_COUNTRIES[selectedCountry]?.name || 'ASEAN Secretariat'}
                  </span>
                </div>
              )}
            </div>
            <div className="overflow-y-auto" style={{ height: 'calc(100% - 50px)' }}>
              <OngoingAssignmentsTable 
                assignments={assignments || []} 
                selectedCountry={selectedCountry}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SUPPLEMENTARY: Charts and Activity - Collapsible */}
      <div className="bg-white rounded-xl shadow-soft p-3 border border-gray-100 hover:shadow-lg transition-all duration-300">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 hover:text-primary-700 transition-colors duration-200 group py-1"
        >
          <span className="flex items-center gap-2">
            <div className="w-1 h-4 bg-gradient-to-b from-primary-500 to-primary-700 rounded-full group-hover:h-5 transition-all duration-200"></div>
            Additional Analytics & Activity
          </span>
          <div className="p-1 rounded-lg group-hover:bg-primary-50 transition-colors duration-200">
            {showDetails ? <ChevronUp size={18} className="text-primary-600" /> : <ChevronDown size={18} className="text-gray-400 group-hover:text-primary-600" />}
          </div>
        </button>
        
        {showDetails && (
          <div className="grid grid-cols-3 gap-4 mt-4 animate-slide-up">
            {/* LoE Chart */}
            <div className="col-span-2 bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow-soft border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-gradient-to-b from-primary-500 to-primary-700 rounded-full"></div>
                <h3 className="text-sm font-bold text-gray-800">LoE Utilisation by Country</h3>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={countryLoEChartData} layout="vertical">
                  <defs>
                    {COLORS.map((color, index) => (
                      <linearGradient key={`gradient-${index}`} id={`colorGradient${index}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
                        <stop offset="100%" stopColor={color} stopOpacity={1}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} stroke="#e5e7eb" />
                  <YAxis dataKey="country" type="category" width={40} tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 600 }} stroke="#e5e7eb" />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(14, 165, 233, 0.1)' }} />
                  <Bar dataKey="LoE" radius={[0, 8, 8, 0]} animationDuration={800}>
                    {countryLoEChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#colorGradient${index % COLORS.length})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Activity Timeline */}
            <div className="col-span-1 bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow-soft border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-gradient-to-b from-primary-500 to-primary-700 rounded-full"></div>
                <h3 className="text-sm font-bold text-gray-800">Recent Activity</h3>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: '180px' }}>
                <ActivityTimeline activities={(recentActivities || []).slice(0, 8)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
