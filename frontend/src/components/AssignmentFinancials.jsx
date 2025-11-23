import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaDollarSign, FaReceipt, FaChartPie, FaDownload, FaCalendarAlt, FaBuilding, FaUtensils, FaPlane, FaCar, FaFileAlt, FaGift, FaQuestion } from 'react-icons/fa';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { formatCurrency, exportToCsv } from '../utils/helpers';
import { assignmentApi } from '../services/api';

const AssignmentFinancials = ({ assignmentId }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['assignmentFinancials', assignmentId],
    queryFn: () => assignmentApi.getFinancials(assignmentId),
    enabled: !!assignmentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const financials = response?.data;

  if (isLoading) return <div className="text-center py-4">Loading financial data...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error loading financial data</div>;
  if (!financials) return <div className="text-center py-4">No financial data available</div>;

  const { summary, fees, expenses, timeline } = financials;

  const getCategoryIcon = (category) => {
    const icons = {
      Airfare: FaPlane,
      Accommodation: FaBuilding,
      Meals: FaUtensils,
      LocalTransport: FaCar,
      Visa: FaFileAlt,
      PerDiem: FaGift,
      Other: FaQuestion
    };
    const Icon = icons[category] || FaQuestion;
    return <Icon className="w-4 h-4" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      Airfare: '#FF6B6B',
      Accommodation: '#4ECDC4',
      Meals: '#45B7D1',
      LocalTransport: '#96CEB4',
      Visa: '#FFEAA7',
      PerDiem: '#DDA0DD',
      Other: '#98D8C8'
    };
    return colors[category] || '#98D8C8';
  };

  const handleExport = () => {
    const headers = ['Type', 'Date', 'Description', 'Amount', 'Status', 'Reference'];
    const rows = [
      ...fees.list.map(fee => [
        'Fee',
        fee.periodStart,
        fee.description,
        fee.amount,
        fee.status,
        fee.invoiceReference || ''
      ]),
      ...expenses.list.map(expense => [
        'Expense',
        expense.date,
        expense.description,
        expense.amount,
        expense.status,
        expense.receiptReference || ''
      ])
    ];
    exportToCsv(headers, rows, `assignment_${financials.assignment.referenceNumber}_financials.csv`);
  };

  const pieData = Object.values(expenses.byCategory).map(cat => ({
    name: cat.category,
    value: cat.total,
    color: getCategoryColor(cat.category)
  }));

  const timelineData = timeline.map(item => ({
    month: item.month,
    fees: item.fees,
    expenses: item.expenses,
    total: item.total
  }));

  return (
    <div className="space-y-2">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="bg-white rounded-lg shadow-sm p-2 border border-gray-100">
          <div className="flex items-center">
            <FaDollarSign className="text-green-500 text-sm mr-1.5" />
            <div>
              <div className="text-[9px] text-gray-500">Total Fees</div>
              <div className="text-sm font-bold text-green-600">{formatCurrency(summary.totalFees)}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-2 border border-gray-100">
          <div className="flex items-center">
            <FaReceipt className="text-blue-500 text-sm mr-1.5" />
            <div>
              <div className="text-[9px] text-gray-500">Total Expenses</div>
              <div className="text-sm font-bold text-blue-600">{formatCurrency(summary.totalExpenses)}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-2 border border-gray-100">
          <div className="flex items-center">
            <FaChartPie className="text-purple-500 text-sm mr-1.5" />
            <div>
              <div className="text-[9px] text-gray-500">Grand Total</div>
              <div className="text-sm font-bold text-purple-600">{formatCurrency(summary.grandTotal)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4">
          {[
            { id: 'overview', label: 'Overview', icon: FaChartPie },
            { id: 'fees', label: 'Fees', icon: FaDollarSign },
            { id: 'expenses', label: 'Expenses', icon: FaReceipt },
            { id: 'timeline', label: 'Timeline', icon: FaCalendarAlt }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-1 px-1 border-b-2 font-medium text-[10px] flex items-center ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-2.5 h-2.5 mr-1" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-2">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {/* Expenses by Category Pie Chart */}
            <div className="bg-white rounded-lg shadow-sm p-2 border border-gray-100">
              <h3 className="text-[10px] font-semibold mb-2">Expenses by Category</h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Fees vs Expenses Bar Chart */}
            <div className="bg-white rounded-lg shadow-sm p-2 border border-gray-100">
              <h3 className="text-[10px] font-semibold mb-2">Fees vs Expenses</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={[{ name: 'Fees', value: summary.totalFees }, { name: 'Expenses', value: summary.totalExpenses }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'fees' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-semibold">Fees Breakdown</h3>
              <button
                onClick={handleExport}
                className="text-[9px] px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-1"
              >
                <FaDownload className="text-[8px]" /> Export
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-1 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-2 py-1 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wider">Period</th>
                      <th className="px-2 py-1 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wider">Days</th>
                      <th className="px-2 py-1 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                      <th className="px-2 py-1 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-2 py-1 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fees.list.map((fee, index) => (
                      <tr key={index}>
                        <td className="px-2 py-1 text-[10px]">
                          <span className={`px-1 py-0.5 text-[8px] rounded-full ${
                            fee.feeType === 'DailyRate' ? 'bg-blue-100 text-blue-800' :
                            fee.feeType === 'Milestone' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {fee.feeType}
                          </span>
                        </td>
                        <td className="px-2 py-1 text-[10px] text-gray-900">
                          {new Date(fee.periodStart).toLocaleDateString()} - {new Date(fee.periodEnd).toLocaleDateString()}
                        </td>
                        <td className="px-2 py-1 text-[10px] text-gray-900">{fee.days}</td>
                        <td className="px-2 py-1 text-[10px] text-gray-900">{formatCurrency(fee.rate)}</td>
                        <td className="px-2 py-1 text-[10px] font-medium text-gray-900">{formatCurrency(fee.amount)}</td>
                        <td className="px-2 py-1 text-[10px]">
                          <span className={`px-1 py-0.5 text-[8px] rounded-full ${
                            fee.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            fee.status === 'Paid' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {fee.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-semibold">Expenses Breakdown</h3>
              <button
                onClick={handleExport}
                className="text-[9px] px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-1"
              >
                <FaDownload className="text-[8px]" /> Export
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-1 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-2 py-1 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-2 py-1 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-2 py-1 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                      <th className="px-2 py-1 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-2 py-1 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expenses.list.map((expense, index) => (
                      <tr key={index}>
                        <td className="px-2 py-1 text-[10px]">
                          <div className="flex items-center">
                            {getCategoryIcon(expense.category)}
                            <span className="ml-1">{expense.category}</span>
                          </div>
                        </td>
                        <td className="px-2 py-1 text-[10px] text-gray-900">
                          {new Date(expense.date).toLocaleDateString()}
                        </td>
                        <td className="px-2 py-1 text-[10px] text-gray-900">{expense.description}</td>
                        <td className="px-2 py-1 text-[10px] text-gray-900">{expense.vendor}</td>
                        <td className="px-2 py-1 text-[10px] font-medium text-gray-900">{formatCurrency(expense.amount)}</td>
                        <td className="px-2 py-1 text-[10px]">
                          <span className={`px-1 py-0.5 text-[8px] rounded-full ${
                            expense.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            expense.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {expense.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="bg-white rounded-lg shadow-sm p-2 border border-gray-100">
            <h3 className="text-[10px] font-semibold mb-2">Spending Timeline</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="fees" stroke="#10B981" strokeWidth={1.5} name="Fees" />
                <Line type="monotone" dataKey="expenses" stroke="#3B82F6" strokeWidth={1.5} name="Expenses" />
                <Line type="monotone" dataKey="total" stroke="#8B5CF6" strokeWidth={1.5} name="Total" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentFinancials;
