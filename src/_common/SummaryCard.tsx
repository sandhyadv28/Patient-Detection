import React from 'react';
import { Activity, Users, TrendingUp, AlertTriangle, LucideIcon } from 'lucide-react';
import { SUMMARY_TITLES, SUMMARY_DATA } from '../utils/constants';

type CardVariant = 'primary' | 'success' | 'warning' | 'info';

interface SummaryCardProps {
  readonly title: string;
  readonly value: number | string;
  readonly variant: CardVariant;
  readonly suffix?: string;
  readonly icon?: LucideIcon;
}

interface SummaryCardsProps {
  readonly summaryValues: Record<string, number>;
}

// Color theme configuration
const colorThemes = {
  blue: { text: 'text-blue-600', bg: 'bg-blue-100' },
  green: { text: 'text-green-600', bg: 'bg-green-100' },
  orange: { text: 'text-orange-600', bg: 'bg-orange-100' },
  gray: { text: 'text-gray-900', bg: 'bg-gray-100' },
} as const;

// Variant configuration with semantic naming
const variants = {
  primary: {
    ...colorThemes.blue,
    icon: Activity,
    valueColor: colorThemes.gray.text,
  },
  success: {
    ...colorThemes.green,
    icon: TrendingUp,
  },
  warning: {
    ...colorThemes.orange,
    icon: AlertTriangle,
  },
  info: {
    ...colorThemes.blue,
    icon: Users,
  },
} as const;

function SummaryCard({
  title,
  value,
  variant,
  suffix = '',
  icon: CustomIcon,
}: Readonly<SummaryCardProps>) {
  const theme = variants[variant];
  const IconComponent = CustomIcon || theme.icon;
  const valueColor = 'valueColor' in theme ? theme.valueColor : theme.text;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className={`text-3xl font-bold ${valueColor}`}>
            {value}{suffix}
          </p>
        </div>
        <div className={`p-3 ${theme.bg} rounded-xl`}>
          <IconComponent className={theme.text} size={24} />
        </div>
      </div>
    </div>
  );
}

export default function SummaryCards({ summaryValues }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-4 gap-6">
      {SUMMARY_TITLES.map((title, index) => {
        const data = SUMMARY_DATA[index];
        return (
          <SummaryCard
            key={data.key}
            title={title}
            value={summaryValues[data.key]}
            variant={data.variant}
            {...(data.suffix && { suffix: data.suffix })}
          />
        );
      })}
    </div>
  );
} 