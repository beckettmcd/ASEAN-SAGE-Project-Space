import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { budgetApi } from '../services/api';
import { formatCurrency, formatNumber } from '../utils/helpers';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

export const BudgetListPage = () => {
  const [filters, setFilters] = useState({
    fiscalYear: '2024',
    page: 1
  });

  const { data, isLoading } = useQuery({
    queryKey: ['budgets', filters],
    queryFn: () => budgetApi.getAll(filters).then(res => res.data)
  });

  const { data: summary } = useQuery({
    queryKey: ['budget-summary', filters.fiscalYear],
    queryFn: () => budgetApi.getSummary({ fiscalYear: filters.fiscalYear }).then(res => res.data)
  });

  const summaryData = summary?.summary?.[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Budgets & Financials</h1>
        <p className="text-gray-600 mt-1">Track budget allocation and spend</p>
      </div>

      {/* Summary Cards */}
      {summaryData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Allocated</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(summaryData.totalAllocated)}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spend</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(summaryData.totalSpend)}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Committed</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(summaryData.totalCommitted)}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Forecast</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(summaryData.totalForecast)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="flex gap-4">
          <div>
            <label className="label">Fiscal Year</label>
            <select
              value={filters.fiscalYear}
              onChange={(e) => setFilters({ ...filters, fiscalYear: e.target.value, page: 1 })}
              className="input"
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* Budget List */}
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
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Workstream
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allocated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Committed
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actual Spend
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variance
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Burn Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.data?.map((budget) => {
                  const variance = parseFloat(budget.allocatedAmount) - parseFloat(budget.actualSpend);
                  const burnRate = (parseFloat(budget.actualSpend) / parseFloat(budget.allocatedAmount)) * 100;
                  
                  return (
                    <tr key={budget.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {budget.code}
                        {budget.isPBRFlagged && (
                          <span className="ml-2 badge badge-red">PBR</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {budget.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {budget.workstream?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatCurrency(budget.allocatedAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatCurrency(budget.committedAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatCurrency(budget.actualSpend)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                        variance >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(variance)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`badge ${
                          burnRate > 90 ? 'badge-red' : 
                          burnRate > 70 ? 'badge-amber' : 
                          'badge-green'
                        }`}>
                          {burnRate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
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

