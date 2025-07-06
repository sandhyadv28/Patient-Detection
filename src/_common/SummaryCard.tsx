import React from 'react';
import { Activity, Users, TrendingUp, AlertTriangle } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: number | string;
  variant: 'primary' | 'success' | 'warning' | 'info';
  suffix?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, variant, suffix = '' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          icon: Activity,
          textColor: 'text-blue-600',
          bgColor: 'bg-blue-100',
          valueColor: 'text-gray-900'
        };
      case 'success':
        return {
          icon: TrendingUp,
          textColor: 'text-green-600',
          bgColor: 'bg-green-100',
          valueColor: 'text-green-600'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          textColor: 'text-orange-600',
          bgColor: 'bg-orange-100',
          valueColor: 'text-orange-600'
        };
      case 'info':
        return {
          icon: Users,
          textColor: 'text-blue-600',
          bgColor: 'bg-blue-100',
          valueColor: 'text-blue-600'
        };
    }
  };

  const styles = getVariantStyles();
  const IconComponent = styles.icon;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className={`text-3xl font-bold ${styles.valueColor}`}>
            {value}{suffix}
          </p>
        </div>
        <div className={`p-3 ${styles.bgColor} rounded-xl`}>
          <IconComponent className={styles.textColor} size={24} />
        </div>
      </div>
    </div>
  );
};

export default SummaryCard; 