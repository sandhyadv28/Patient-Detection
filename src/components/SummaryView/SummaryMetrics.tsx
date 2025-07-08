import SummaryCard from '../../_common/SummaryCard';

interface SummaryMetricsProps {
  dailyBreakdown: any[];
  overallSummary: any;
}

export default function SummaryMetrics({ dailyBreakdown, overallSummary }: SummaryMetricsProps) {
  return (
    <div className="grid grid-cols-4 gap-6">
      <SummaryCard
        title="Total Days"
        value={dailyBreakdown.length}
        variant="primary"
      />
      <SummaryCard
        title="Total Detections"
        value={overallSummary.total_entries}
        variant="success"
      />
      <SummaryCard
        title="Patients Detected"
        value={overallSummary.total_detections}
        variant="info"
      />
      <SummaryCard
        title="Not Detected"
        value={overallSummary.total_undetected}
        variant="warning"
      />
    </div>
  );
} 