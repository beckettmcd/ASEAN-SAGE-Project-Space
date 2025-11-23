import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { torApi } from '../services/api';
import { formatDate, formatCurrency, getStatusBadgeClass } from '../utils/helpers';
import { Plus, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const ToRListPage = () => {
  const [filters, setFilters] = useState({
    status: '',
    page: 1
  });

  const { hasRole } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['tors', filters],
    queryFn: () => torApi.getAll(filters).then(res => res.data)
  });

  const canCreate = hasRole(['Admin', 'FCDO SRO', 'Implementer']);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Terms of Reference</h1>
          <p className="text-gray-600 mt-1">Manage ToRs and approval workflow</p>
        </div>
        {canCreate && (
          <Link to="/tors/new" className="btn btn-primary flex items-center gap-2">
            <Plus size={20} />
            New ToR
          </Link>
        )}
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
              <option value="Draft">Draft</option>
              <option value="QA">QA</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* ToR List */}
      <div className="card">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Workstream
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estimated Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.data?.map((tor) => (
                  <tr key={tor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {tor.referenceNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {tor.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tor.workstream?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(tor.estimatedBudget)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${getStatusBadgeClass(tor.status)}`}>
                        {tor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(tor.startDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/tors/${tor.id}`}
                        className="text-primary-600 hover:text-primary-900 inline-flex items-center gap-1"
                      >
                        <Eye size={16} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data?.pagination && (
          <div className="mt-4 flex justify-between items-center">
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
    </div>
  );
};

