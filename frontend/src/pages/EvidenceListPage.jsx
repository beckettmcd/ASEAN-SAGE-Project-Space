import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { evidenceApi } from '../services/api';
import { formatDate } from '../utils/helpers';
import { FileText, Link as LinkIcon } from 'lucide-react';

export const EvidenceListPage = () => {
  const [filters, setFilters] = useState({
    type: '',
    page: 1
  });

  const { data, isLoading } = useQuery({
    queryKey: ['evidence', filters],
    queryFn: () => evidenceApi.getAll(filters).then(res => res.data)
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Evidence Locker</h1>
        <p className="text-gray-600 mt-1">Document and link evidence to indicators</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex gap-4">
          <div>
            <label className="label">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
              className="input"
            >
              <option value="">All Types</option>
              <option value="Document">Document</option>
              <option value="Report">Report</option>
              <option value="Photo">Photo</option>
              <option value="Data">Data</option>
            </select>
          </div>
        </div>
      </div>

      {/* Evidence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          data?.data?.map((evidence) => (
            <div key={evidence.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{evidence.title}</h3>
                  <span className="text-xs badge badge-gray">{evidence.type}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {evidence.description}
              </p>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Collection Date</span>
                  <span className="text-gray-900">{formatDate(evidence.collectionDate)}</span>
                </div>
                {evidence.source && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Source</span>
                    <span className="text-gray-900">{evidence.source}</span>
                  </div>
                )}
                {evidence.country && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Country</span>
                    <span className="text-gray-900">{evidence.country.name}</span>
                  </div>
                )}
              </div>

              {evidence.indicators && evidence.indicators.length > 0 && (
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                    <LinkIcon size={12} />
                    <span>Linked to {evidence.indicators.length} indicator(s)</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {evidence.indicators.slice(0, 3).map((indicator) => (
                      <span key={indicator.id} className="text-xs badge badge-blue">
                        {indicator.code}
                      </span>
                    ))}
                    {evidence.indicators.length > 3 && (
                      <span className="text-xs badge badge-gray">
                        +{evidence.indicators.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {evidence.tags && evidence.tags.length > 0 && (
                <div className="pt-3 border-t border-gray-200 mt-3">
                  <div className="flex flex-wrap gap-1">
                    {evidence.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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

