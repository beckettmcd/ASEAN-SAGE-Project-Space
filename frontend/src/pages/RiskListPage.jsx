import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { riskApi } from '../services/api';
import { AlertTriangle } from 'lucide-react';

export const RiskListPage = () => {
  const [filters, setFilters] = useState({
    status: 'Open',
    page: 1
  });

  const { data, isLoading } = useQuery({
    queryKey: ['risks', filters],
    queryFn: () => riskApi.getAll(filters).then(res => res.data)
  });

  const getRiskColor = (score) => {
    if (score >= 15) return 'bg-red-100 text-red-800 border-red-300';
    if (score >= 9) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Risks & Issues</h1>
        <p className="text-gray-600 mt-1">Track and manage programme risks</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex gap-4">
          <div>
            <label className="label">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="input"
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Mitigated">Mitigated</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Risk List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          data?.data?.map((risk) => (
            <div key={risk.id} className="card">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg border-2 ${getRiskColor(risk.riskScore)}`}>
                  <AlertTriangle className="h-6 w-6" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{risk.title}</h3>
                      <p className="text-sm text-gray-600">{risk.referenceNumber}</p>
                    </div>
                    <div className="text-right">
                      <span className={`badge ${getRiskColor(risk.riskScore)}`}>
                        Score: {risk.riskScore}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        L: {risk.likelihood} × I: {risk.impact}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{risk.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Category</p>
                      <span className="badge badge-blue">{risk.category}</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
                      <span className="badge badge-gray">{risk.status}</span>
                    </div>
                  </div>

                  {risk.mitigation && (
                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Mitigation</p>
                      <p className="text-sm text-gray-600">{risk.mitigation}</p>
                      {risk.owner && (
                        <p className="text-xs text-gray-500 mt-2">
                          Owner: {risk.owner.firstName} {risk.owner.lastName}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
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

