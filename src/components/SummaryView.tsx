import React from 'react';
import { Activity, Users, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';
import { SummaryData, formatDate } from '../utils/dataGenerator';

interface SummaryViewProps {
  summaryData: SummaryData[];
}

export default function SummaryView({ summaryData }: SummaryViewProps) {
  const totalDays = summaryData.length;
  const avgDetectionRate = summaryData.length > 0 
    ? Math.round(summaryData.reduce((sum, day) => sum + day.detectedPercentage, 0) / summaryData.length)
    : 0;
  const totalPatientDetections = summaryData.reduce((sum, day) => sum + day.detected, 0);
  const totalAmbiguous = summaryData.reduce((sum, day) => sum + day.ambiguous, 0);

  return (
    <div className="space-y-8">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Days</p>
              <p className="text-3xl font-bold text-gray-900">
                {totalDays}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Activity className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Avg Detection Rate</p>
              <p className="text-3xl font-bold text-green-600">
                {avgDetectionRate}%
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Detections</p>
              <p className="text-3xl font-bold text-blue-600">
                {totalPatientDetections}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Ambiguous Cases</p>
              <p className="text-3xl font-bold text-orange-600">
                {totalAmbiguous}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <AlertTriangle className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Daily Summary
              </h3>
              <p className="text-sm text-gray-600">Patient detection analysis by day</p>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Active Beds
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Patients Detected
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Detection Rate
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Not Detected
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ambiguous
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {summaryData.map((day, index) => (
                <tr key={day.date} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {formatDate(day.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {day.totalBeds}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {day.detected}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        day.detectedPercentage >= 80 ? 'bg-green-100 text-green-800' :
                        day.detectedPercentage >= 60 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {day.detectedPercentage}%
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-gray-600 font-medium">
                      {day.notDetected} ({day.notDetectedPercentage}%)
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-orange-600 font-medium">
                      {day.ambiguous} ({day.ambiguousPercentage}%)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}