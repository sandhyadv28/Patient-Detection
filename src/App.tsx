import React, { useState, useEffect } from 'react';
import { Activity, Database } from 'lucide-react';
import DateRangePicker from './components/DateRangePicker';
import SummaryView from './components/SummaryView';
import DrilldownView from './components/DrilldownView';
import ExportButton from './components/ExportButton';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import { DayData, SummaryData, DatePreset, User } from './types';
import { generateDummyData, calculateSummaryData, getDatePresetRange } from './utils/dataGenerator';

function App() {
  const [currentView, setCurrentView] = useState<'summary' | 'drilldown'>('summary');
  const [preset, setPreset] = useState<DatePreset>('last7');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dayData, setDayData] = useState<DayData[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Initialize with default date range
  useEffect(() => {
    const { start, end } = getDatePresetRange('last7');
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }, []);

  // Generate data when date range changes
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const generatedDayData = generateDummyData(start, end);
      const generatedSummaryData = calculateSummaryData(generatedDayData);
      
      setDayData(generatedDayData);
      setSummaryData(generatedSummaryData);
    }
  }, [startDate, endDate]);

  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handlePresetChange = (newPreset: DatePreset) => {
    setPreset(newPreset);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-8">
            <div className="flex items-center justify-center gap-8 mb-8">
              <img 
                src="/public/1661340002652.jpeg" 
                alt="NephroPlus" 
                className="h-12 object-contain"
              />
              <div className="w-px h-12 bg-gray-300"></div>
              <img 
                src="/public/images (2).png" 
                alt="Cloudphysician" 
                className="h-12 object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Patient Detection Analytics
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              AI-powered healthcare monitoring dashboard
            </p>
          </div>
          
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-8 py-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Access Dashboard
          </button>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Company Logos */}
              <div className="flex items-center gap-6">
                <img 
                  src="/public/1661340002652.jpeg" 
                  alt="NephroPlus" 
                  className="h-10 object-contain"
                />
                <div className="w-px h-8 bg-gray-300"></div>
                <img 
                  src="/public/images (2).png" 
                  alt="Cloudphysician" 
                  className="h-10 object-contain"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Activity className="text-blue-600" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Patient Detection Analytics
                  </h1>
                  <p className="text-sm text-gray-600">AI-powered healthcare monitoring dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <ExportButton summaryData={summaryData} dayData={dayData} />
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl border border-green-200">
                <Database size={16} />
                <span className="text-sm font-medium">Live Data</span>
              </div>
              <UserProfile user={user} onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Date Range Picker */}
        <div className="mb-8">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onDateRangeChange={handleDateRangeChange}
            preset={preset}
            onPresetChange={handlePresetChange}
          />
        </div>

        {/* View Toggle */}
        <div className="mb-8">
          <nav className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setCurrentView('summary')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200 ${
                currentView === 'summary'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Summary View
            </button>
            <button
              onClick={() => setCurrentView('drilldown')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200 ${
                currentView === 'drilldown'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Detailed Analysis
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <main>
          {currentView === 'summary' ? (
            <SummaryView summaryData={summaryData} />
          ) : (
            <DrilldownView dayData={dayData} />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>Patient Detection Analytics Dashboard • Healthcare AI Monitoring System</p>
            <p className="mt-1">Data refreshed in real-time • Secure HIPAA compliant platform</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;