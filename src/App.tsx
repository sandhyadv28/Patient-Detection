import { useState } from 'react';
import DateRangePicker from './components/DateRangePicker';
import DrilldownView from './components/DrilldownView';
import Footer from './components/Layout/Footer';
import Header from './components/Layout/Header';
import LandingPage from './components/Layout/LandingPage';
import ViewToggle from './components/Layout/ViewToggle';
import SummaryView from './components/SummaryView';
import { ViewType } from './components/modals';
import { useAuth } from './hooks/useAuth';
import { usePatientData } from './hooks/usePatientData';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('summary');
  const { user, showAuthModal, handleLogin, handleLogout, setShowAuthModal } = useAuth();
  const {
    dayData,
    summaryData,
    startDate,
    endDate,
    preset,
    isLoading,
    error,
    handleDateRangeChange,
    handlePresetChange,
  } = usePatientData();

  // Create dateRange string for API
  const dateRange = preset;

  // Show landing page if user is not authenticated
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
        onLogout={handleLogout}
        summaryData={summaryData}
        dayData={dayData}
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
            <DrilldownView />
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;