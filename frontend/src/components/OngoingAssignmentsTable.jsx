import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CountryFlag } from './CountryFlag';
import AssignmentFinancials from './AssignmentFinancials';
import { formatDate, formatCurrency, getStatusBadgeClass } from '../utils/helpers';
import { Eye, Download, ArrowUpDown, ChevronDown, ChevronRight } from 'lucide-react';

export const OngoingAssignmentsTable = ({ assignments = [], selectedCountry }) => {
  const [sortField, setSortField] = useState('startDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRowExpansion = (assignmentId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(assignmentId)) {
      newExpandedRows.delete(assignmentId);
    } else {
      newExpandedRows.add(assignmentId);
    }
    setExpandedRows(newExpandedRows);
  };

  const filteredAssignments = useMemo(() => {
    let filtered = [...assignments];

    if (selectedCountry) {
      if (selectedCountry === 'ASEAN') {
        // Show only regional assignments (no country)
        filtered = filtered.filter(a => !a.countryId);
      } else {
        // Show country-specific assignments
        filtered = filtered.filter(a => a.country?.code === selectedCountry);
      }
    }

    if (statusFilter) {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortField) {
        case 'country':
          aVal = a.country?.name || '';
          bVal = b.country?.name || '';
          break;
        case 'burnRate':
          aVal = a.burnRate || 0;
          bVal = b.burnRate || 0;
          break;
        case 'startDate':
        case 'endDate':
          aVal = new Date(a[sortField]);
          bVal = new Date(b[sortField]);
          break;
        default:
          aVal = a[sortField] || '';
          bVal = b[sortField] || '';
      }

      return sortDirection === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

    return filtered;
  }, [assignments, selectedCountry, statusFilter, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Country', 'Assignment', 'Consultant', 'Counterpart', 'Status', 'Progress', 'Start', 'End', 'Budget'];
    const rows = filteredAssignments.map(a => [
      a.country?.name || '',
      a.title,
      a.consultant ? `${a.consultant.firstName} ${a.consultant.lastName}` : '',
      a.counterpartOrganisation || '',
      a.status,
      a.burnRate || 0,
      formatDate(a.startDate, 'yyyy-MM-dd'),
      formatDate(a.endDate, 'yyyy-MM-dd'),
      a.totalValue || 0
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sage-assignments-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getBurnRateColor = (burnRate) => {
    if (burnRate >= 90) return 'from-red-500 to-rose-600';
    if (burnRate >= 70) return 'from-amber-500 to-orange-500';
    return 'from-green-500 to-emerald-600';
  };

  const SortableHeader = ({ field, children }) => (
    <th
      className="px-2 py-1.5 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150 group"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-0.5">
        {children}
        <ArrowUpDown size={10} className={`transition-colors duration-150 ${sortField === field ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
      </div>
    </th>
  );

  return (
    <div className="space-y-2">
      {/* Compact Filters */}
      <div className="flex justify-between items-center">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-[11px] px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Mobilising">Mobilising</option>
          <option value="Planned">Planned</option>
        </select>
        <button
          onClick={handleExportCSV}
          className="text-[11px] px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded flex items-center gap-1 transition-all duration-200 shadow-sm hover:shadow font-medium text-gray-700"
        >
          <Download size={11} />
          Export
        </button>
      </div>

      {/* Compact Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-2 py-1.5 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Flag</th>
              <SortableHeader field="country">Country</SortableHeader>
              <th className="px-2 py-1.5 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Assignment</th>
              <th className="px-2 py-1.5 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Consultant</th>
              <th className="px-2 py-1.5 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Counterpart</th>
              <SortableHeader field="status">Status</SortableHeader>
              <SortableHeader field="burnRate">Progress</SortableHeader>
              <SortableHeader field="endDate">End Date</SortableHeader>
              <th className="px-2 py-1.5 text-right text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredAssignments.length === 0 ? (
              <tr>
                <td colSpan="10" className="px-3 py-8 text-center text-gray-500 text-sm">
                  No assignments found
                </td>
              </tr>
            ) : (
              filteredAssignments.map((assignment, index) => (
                <React.Fragment key={assignment.id}>
                  <tr 
                    className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent cursor-pointer transition-all duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} group`}
                    onClick={() => toggleRowExpansion(assignment.id)}
                  >
                    <td className="px-2 py-1">
                      <div className="flex items-center gap-1">
                        {expandedRows.has(assignment.id) ? (
                          <ChevronDown size={12} className="text-primary-500 transition-transform duration-200" />
                        ) : (
                          <ChevronRight size={12} className="text-gray-400 group-hover:text-primary-500 transition-colors duration-200" />
                        )}
                        <div className="transform group-hover:scale-110 transition-transform duration-200">
                          <CountryFlag countryCode={assignment.country?.code || 'ASEAN'} size={18} />
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-1 text-[11px] font-semibold leading-tight">
                      {assignment.country?.name || (
                        <span className="bg-gradient-to-r from-blue-700 to-blue-800 bg-clip-text text-transparent font-bold">ASEAN Secretariat</span>
                      )}
                    </td>
                    <td className="px-2 py-1">
                      <div className="text-[11px] font-semibold text-gray-900 leading-tight">{assignment.title}</div>
                      <div className="text-[9px] text-gray-500 mt-0.5 leading-tight">{assignment.workstream?.pillar}</div>
                    </td>
                    <td className="px-2 py-1 text-[11px]">
                      {assignment.consultant ? (
                        <div>
                          <div className="font-semibold text-gray-900 leading-tight">{assignment.consultant.firstName} {assignment.consultant.lastName}</div>
                          {assignment.consultant.expertise && assignment.consultant.expertise.length > 0 && (
                            <div className="text-[9px] text-gray-500 truncate mt-0.5 leading-tight" style={{ maxWidth: '140px' }}>
                              {assignment.consultant.expertise[0]}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-[10px]">TBD</span>
                      )}
                    </td>
                    <td className="px-2 py-1 text-[11px]">
                      {assignment.counterpartOrganisation ? (
                        <div>
                          <div className="font-semibold text-gray-900 truncate leading-tight" style={{ maxWidth: '160px' }}>
                            {assignment.counterpartOrganisation}
                          </div>
                          <div className="text-[9px] text-gray-500 truncate mt-0.5 leading-tight">
                            {assignment.counterpartContact}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-[10px]">N/A</span>
                      )}
                    </td>
                    <td className="px-2 py-1">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${getStatusBadgeClass(assignment.status)}`}>
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-2 py-1">
                      <div className="flex items-center gap-1">
                        <div className="w-14 bg-gray-200 rounded-full h-1 shadow-inner overflow-hidden">
                          <div
                            className={`h-1 rounded-full bg-gradient-to-r ${getBurnRateColor(assignment.burnRate || 0)} shadow-sm transition-all duration-500`}
                            style={{ width: `${Math.min(assignment.burnRate || 0, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-[9px] font-bold text-gray-700 w-6 tabular-nums">
                          {Math.round(assignment.burnRate || 0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-1 text-[10px] font-medium text-gray-600">
                      {formatDate(assignment.endDate, 'MMM dd')}
                    </td>
                    <td className="px-2 py-1 text-right">
                      <Link
                        to={`/assignments/${assignment.id}`}
                        className="text-primary-600 hover:text-primary-900 inline-flex items-center gap-1 text-xs p-0.5 rounded hover:bg-primary-50 transition-all duration-150"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye size={11} />
                      </Link>
                    </td>
                  </tr>
                  {expandedRows.has(assignment.id) && (
                    <tr>
                      <td colSpan="10" className="px-0 py-0 bg-gradient-to-r from-blue-50 to-gray-50 border-l-4 border-primary-500">
                        <div className="p-2 animate-slide-up">
                          <AssignmentFinancials assignmentId={assignment.id} />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-[11px] text-gray-600 font-medium px-1">
        Showing <span className="text-primary-600 font-bold">{filteredAssignments.length}</span> of <span className="font-bold">{assignments.length}</span> assignments
      </div>
    </div>
  );
};
