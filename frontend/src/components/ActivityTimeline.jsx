import { CheckCircle, Users, FileText, AlertTriangle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const activityIcons = {
  tor_approved: CheckCircle,
  assignment_mobilised: Users,
  deliverable_submitted: FileText,
  risk_raised: AlertTriangle
};

const activityColors = {
  tor_approved: 'bg-gradient-to-br from-green-500 to-emerald-600',
  assignment_mobilised: 'bg-gradient-to-br from-blue-500 to-blue-600',
  deliverable_submitted: 'bg-gradient-to-br from-purple-500 to-violet-600',
  risk_raised: 'bg-gradient-to-br from-red-500 to-rose-600'
};

export const ActivityTimeline = ({ activities = [] }) => {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Clock className="h-10 w-10 mx-auto mb-2 animate-pulse" />
        <p className="text-xs font-medium">No recent activities</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {activities.map((activity, idx) => {
        const Icon = activityIcons[activity.type] || FileText;
        const colorClass = activityColors[activity.type] || 'bg-gradient-to-br from-gray-500 to-gray-600';

        return (
          <div 
            key={idx} 
            className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group animate-fade-in"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className={`p-2 rounded-full ${colorClass} text-white flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-200`}>
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate leading-tight">{activity.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {activity.actor} • {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
