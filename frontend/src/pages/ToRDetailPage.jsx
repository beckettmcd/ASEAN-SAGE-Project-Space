import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { torApi } from '../services/api';
import { formatDate, formatCurrency, getStatusBadgeClass } from '../utils/helpers';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export const ToRDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const queryClient = useQueryClient();
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['tor', id],
    queryFn: () => torApi.getById(id).then(res => res.data)
  });

  const approveMutation = useMutation({
    mutationFn: () => torApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['tor', id]);
      alert('ToR approved successfully');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (reason) => torApi.reject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['tor', id]);
      setShowRejectModal(false);
      alert('ToR rejected');
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const tor = data?.tor;
  const canApprove = hasRole(['Admin', 'FCDO SRO']) && tor?.status === 'Pending Approval';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/tors')} className="btn btn-secondary">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{tor?.title}</h1>
          <p className="text-gray-600 mt-1">{tor?.referenceNumber}</p>
        </div>
        <span className={`badge ${getStatusBadgeClass(tor?.status)}`}>
          {tor?.status}
        </span>
      </div>

      {canApprove && (
        <div className="card bg-amber-50 border border-amber-200">
          <p className="font-medium text-amber-900 mb-4">This ToR requires your approval</p>
          <div className="flex gap-4">
            <button
              onClick={() => approveMutation.mutate()}
              className="btn btn-primary flex items-center gap-2"
            >
              <CheckCircle size={20} />
              Approve
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              className="btn btn-danger flex items-center gap-2"
            >
              <XCircle size={20} />
              Reject
            </button>
          </div>
        </div>
      )}

      {/* Basic Information */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Workstream</label>
            <p className="mt-1 text-gray-900">{tor?.workstream?.name || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Country</label>
            <p className="mt-1 text-gray-900">{tor?.country?.name || 'Regional'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Start Date</label>
            <p className="mt-1 text-gray-900">{formatDate(tor?.startDate)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">End Date</label>
            <p className="mt-1 text-gray-900">{formatDate(tor?.endDate)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Estimated LoE</label>
            <p className="mt-1 text-gray-900">{tor?.estimatedLoE} days</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Daily Rate</label>
            <p className="mt-1 text-gray-900">{formatCurrency(tor?.dailyRate)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Estimated Budget</label>
            <p className="mt-1 text-gray-900 font-semibold">{formatCurrency(tor?.estimatedBudget)}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Description</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{tor?.description}</p>
      </div>

      {/* Objectives */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Objectives</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{tor?.objectives}</p>
      </div>

      {/* Deliverables */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Deliverables</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{tor?.deliverables}</p>
      </div>

      {/* Qualifications */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Qualifications</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{tor?.qualifications}</p>
      </div>

      {/* Assignments */}
      {tor?.assignments && tor.assignments.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Related Assignments</h2>
          <div className="space-y-2">
            {tor.assignments.map((assignment) => (
              <div key={assignment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">{assignment.referenceNumber}</span>
                <span className={`badge ${getStatusBadgeClass(assignment.status)}`}>
                  {assignment.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Reject ToR</h3>
            <div className="mb-4">
              <label className="label">Rejection Reason</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="input"
                rows={4}
                placeholder="Please provide a reason for rejection..."
              />
            </div>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowRejectModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => rejectMutation.mutate(rejectionReason)}
                disabled={!rejectionReason}
                className="btn btn-danger"
              >
                Reject ToR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

