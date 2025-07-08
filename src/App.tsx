import { useState } from 'react';
import DateRangePicker from './components/DateRangePicker';
import DetailedView from './components/DetailedView';
import ViewToggle from './components/Layout/AnalysisTabs';
import Footer from './components/Layout/Footer';
import Header from './components/Layout/Header';
import LandingPage from './components/Layout/LandingPage';
import { ViewType } from './components/modals';
import SummaryView from './components/SummaryView';
import { useAuth } from './hooks/useAuth';
import { usePatientData } from './hooks/usePatientData';
import { useStorageListener } from './hooks/useStorageListener';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('summary');
  const { user, showAuthModal, handleLogin, handleLogout, setShowAuthModal, isLoading } = useAuth();
  const {
    dayData,
    summaryData,
    startDate,
    endDate,
    preset,
    handleDateRangeChange,
    handlePresetChange,
  } = usePatientData();

  useStorageListener();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing application...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <LandingPage
        onLogin={handleLogin}
        showAuthModal={showAuthModal}
        onShowAuthModal={setShowAuthModal}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        summaryData={summaryData}
        dayData={dayData}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Date Range Picker */}
        <div className="mb-4">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onDateRangeChange={handleDateRangeChange}
            preset={preset}
            onPresetChange={handlePresetChange}
          />
        </div>

        {/* View Toggle */}
        <ViewToggle
          currentView={currentView}
          onViewChange={setCurrentView}
        />

        {/* Main Content */}
        <main>
          {currentView === 'summary' ? (
            <SummaryView startDate={startDate} endDate={endDate} preset={preset} />
          ) : (
            <DetailedView preset={preset} startDate={startDate} endDate={endDate} />
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;