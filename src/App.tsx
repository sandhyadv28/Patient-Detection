import { useState } from 'react';
import AuthInitializer from './components/AuthInitializer';
import DateRangePicker from './components/DateRangePicker';
import DrilldownView from './components/DrilldownView';
import ViewToggle from './components/Layout/AnalysisTabs';
import Footer from './components/Layout/Footer';
import Header from './components/Layout/Header';
import LandingPage from './components/Layout/LandingPage';
import { ViewType } from './components/modals';
import SummaryView from './components/SummaryView';
import { useAuth } from './hooks/useAuth';
import { useStorageListener } from './hooks/useStorageListener';

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

  // Listen for logout events from other tabs
  useStorageListener();

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
    <AuthInitializer>
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
              <DrilldownView preset={preset} startDate={startDate} endDate={endDate} />
            )}
          </main>

          <Footer />
        </div>
      </div>
    </AuthInitializer>
  );
}

export default App;