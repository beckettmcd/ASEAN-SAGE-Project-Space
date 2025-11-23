import { Users, MapPin, DollarSign, TrendingUp, Calendar, UserCheck } from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/helpers';

export const MetricsGrid = ({ metrics = {} }) => {
  const cards = [
    {
      title: 'Active',
      value: metrics.totalActive || 0,
      icon: Users,
      gradient: 'from-slate-600 to-slate-700',
      bgGradient: 'from-white to-gray-50',
      textColor: 'text-gray-900',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Countries',
      value: metrics.countriesEngaged || 0,
      icon: MapPin,
      gradient: 'from-slate-600 to-slate-700',
      bgGradient: 'from-white to-gray-50',
      textColor: 'text-gray-900',
      iconColor: 'text-green-600'
    },
    {
      title: 'Total Value',
      value: (() => {
        const totalFees = metrics.totalFees ?? 0;
        const totalExpenses = metrics.totalExpenses ?? 0;
        const aggregated = totalFees + totalExpenses;
        const fallback = metrics.totalTAValue ?? 0;
        return formatCurrency(aggregated || fallback);
      })(),
      icon: DollarSign,
      gradient: 'from-slate-600 to-slate-700',
      bgGradient: 'from-white to-gray-50',
      textColor: 'text-gray-900',
      iconColor: 'text-purple-600',
      tooltip: `Fees: ${formatCurrency(metrics.totalFees || 0)} | Expenses: ${formatCurrency(metrics.totalExpenses || 0)}`
    },
    {
      title: 'Burn Rate',
      value: `${metrics.avgBurnRate || 0}%`,
      icon: TrendingUp,
      gradient: 'from-slate-600 to-slate-700',
      bgGradient: 'from-white to-gray-50',
      textColor: 'text-gray-900',
      iconColor: 'text-amber-600'
    },
    {
      title: 'Upcoming',
      value: metrics.upcomingCompletions || 0,
      icon: Calendar,
      gradient: 'from-slate-600 to-slate-700',
      bgGradient: 'from-white to-gray-50',
      textColor: 'text-gray-900',
      iconColor: 'text-red-600'
    },
    {
      title: 'Consultants',
      value: metrics.consultantsDeployed || 0,
      icon: UserCheck,
      gradient: 'from-slate-600 to-slate-700',
      bgGradient: 'from-white to-gray-50',
      textColor: 'text-gray-900',
      iconColor: 'text-indigo-600'
    }
  ];

  return (
    <>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div 
            key={card.title} 
            className={`relative overflow-hidden bg-white rounded-lg shadow-sm p-2 border border-gray-200 transition-all duration-200 hover:shadow hover:border-gray-300 group`}
            style={{ animationDelay: `${index * 50}ms` }}
            title={card.tooltip || card.title}
          >
            <div className="relative flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide truncate mb-0.5">{card.title}</p>
                <p className={`text-lg font-bold ${card.textColor} truncate leading-tight`}>
                  {card.value}
                </p>
              </div>
              <div className={`p-1.5 rounded bg-gray-50 flex-shrink-0 transition-all duration-200`}>
                <Icon className={`h-4 w-4 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
