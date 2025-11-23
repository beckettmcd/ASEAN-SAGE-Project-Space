import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { indicatorApi } from '../services/api';
import { formatNumber, calculateProgress } from '../utils/helpers';
import { Target, Eye } from 'lucide-react';

export const IndicatorListPage = () => {
  const [filters, setFilters] = useState({
    type: '',
    pillar: '',
    page: 1
  });

  const { data, isLoading } = useQuery({
    queryKey: ['indicators', filters],
    queryFn: () => indicatorApi.getAll(filters).then(res => res.data)
  });

  const pillars = [
    'Learning Assessment',
    'Education Management Information Systems',
    'Out-of-School Children and Youth',
    'Teacher Professional Development',
    'Inclusive Education'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Indicators & Results</h1>
          <p className="text-gray-600 mt-1">Track programme indicators and progress</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
              className="input"
            >
              <option value="">All Types</option>
              <option value="Outcome">Outcome</option>
              <option value="Output">Output</option>
              <option value="Activity">Activity</option>
            </select>
          </div>
          <div>
            <label className="label">Pillar</label>
            <select
              value={filters.pillar}
              onChange={(e) => setFilters({ ...filters, pillar: e.target.value, page: 1 })}
              className="input"
            >
              <option value="">All Pillars</option>
              {pillars.map(pillar => (
                <option key={pillar} value={pillar}>{pillar}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Indicator List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-2 flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          data?.data?.map((indicator) => {
            const progress = calculateProgress(indicator.actual, indicator.target);
            return (
              <div key={indicator.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Target className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{indicator.code}</h3>
                      <span className="text-xs badge badge-blue">{indicator.type}</span>
                    </div>
                  </div>
                  <Link
                    to={`/indicators/${indicator.id}`}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    <Eye size={20} />
                  </Link>
                </div>

                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  {indicator.name}
                </h4>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">
                      {formatNumber(indicator.actual)} / {formatNumber(indicator.target)} {indicator.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        progress >= 80 ? 'bg-green-600' : 
                        progress >= 50 ? 'bg-amber-500' : 
                        'bg-red-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{progress.toFixed(1)}% complete</p>
                </div>

                <div className="flex gap-2">
                  {indicator.pillar && (
                    <span className="text-xs badge badge-gray">{indicator.pillar}</span>
                  )}
                  {indicator.isOOSCYRelated && (
                    <span className="text-xs badge badge-blue">OOSCY</span>
                  )}
                  {indicator.isGenderDisaggregated && (
                    <span className="text-xs badge badge-blue">Gender</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {data?.pagination && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-700">
            Showing {((data.pagination.page - 1) * data.pagination.limit) + 1} to{' '}
            {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of{' '}
            {data.pagination.total} results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              disabled={!data.pagination.hasPreviousPage}
              className="btn btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              disabled={!data.pagination.hasNextPage}
              className="btn btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

