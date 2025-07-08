import moment from 'moment';

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Yes': return 'bg-green-100 text-green-800';
    case 'No': return 'bg-red-100 text-red-800';
    case 'Ambiguous': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const createDefaultDayData = (date: string) => ({
  date,
  hospital: '',
  hospital_unit: '',
  total_entries: 0,
  total_detections: 0,
  total_undetected: 0,
  detection_rate: 0,
  undetected_rate: 0,
});

export const getDateRange = (preset: string, startDate?: string, endDate?: string) => {
  if (preset === 'previousMonth') {
    const prevMonth = moment().subtract(1, 'month');
    return {
      start: prevMonth.clone().startOf('month'),
      end: prevMonth.clone().endOf('month'),
      firstDay: prevMonth.clone().startOf('month').format('YYYY-MM-DD')
    };
  } else if (preset === 'custom' && startDate && endDate) {
    const start = moment(startDate);
    const end = moment(endDate);
    return {
      start,
      end,
      firstDay: startDate
    };
  } else if (preset === 'last30') {
    const start = moment().subtract(29, 'days');
    const end = moment();
    return {
      start,
      end,
      firstDay: start.format('YYYY-MM-DD')
    };
  } else {
    // Default to last 7 days
    const start = moment().subtract(6, 'days');
    const end = moment();
    return {
      start,
      end,
      firstDay: start.format('YYYY-MM-DD')
    };
  }
}; 