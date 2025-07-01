import React, { useState } from 'react';
import { usePatientData } from './hooks/usePatientData';
import { useAuth } from './hooks/useAuth';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import LandingPage from './components/Layout/LandingPage';
import ViewToggle from './components/Layout/ViewToggle';
import DateRangePicker from './components/DateRangePicker';
import SummaryView from './components/SummaryView';
import DrilldownView from './components/DrilldownView';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ErrorMessage from './components/UI/ErrorMessage';

function App() {
  const [currentView, setCurrentView] = useState<'summary' | 'drilldown'>('summary');
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
        <ViewToggle
          currentView={currentView}
          onViewChange={setCurrentView}
        />

        {/* Main Content */}
        <main>
          {isLoading ? (
            <LoadingSpinner message="Loading patient data..." />
          ) : error ? (
            <ErrorMessage 
              message={error} 
              onRetry={() => {
                // Trigger data reload by updating date range
                handleDateRangeChange(startDate, endDate);
              }}
            />
          ) : currentView === 'summary' ? (
            <SummaryView summaryData={summaryData} />
          ) : (
            <DrilldownView dayData={dayData} />
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;