import { useEffect, useState } from 'react';
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
import { useAppDispatch, useAppSelector } from './store/hook';
import { fetchDetailedData, fetchPatientSummary, fetchPerSlotDetailedData } from './store/slice/patientSlice';
import { getDatePresetRange } from './utils/dataGenerator';
import moment from 'moment';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('summary');
  const { user, showAuthModal, handleLogin, handleLogout, setShowAuthModal, isLoading } = useAuth();
  const dispatch = useAppDispatch();
  
  // Get current data from Redux to check if we need to fetch
  const { summaryData, detailedDayData, perSlotDetailedData } = useAppSelector((state) => state.patient);
  
  const {
    dayData,
    summaryData: convertedSummaryData,
    startDate,
    endDate,
    preset,
    handleDateRangeChange,
    handlePresetChange,
  } = usePatientData();

  useStorageListener();

  // Call summary API only when preset changes and we don't have summary data
  useEffect(() => {
    if (!user) return; // Don't call APIs if user is not authenticated

    let summaryStartDate: string;
    let summaryEndDate: string;

    // Determine dates based on preset
    if (preset && preset !== 'custom') {
      const { start, end } = getDatePresetRange(preset);
      summaryStartDate = start.format('YYYY-MM-DD');
      summaryEndDate = end.format('YYYY-MM-DD');
    } else if (preset === 'custom' && startDate && endDate) {
      summaryStartDate = startDate;
      summaryEndDate = endDate;
    } else {
      // Default to last 7 days
      const { start, end } = getDatePresetRange('last7');
      summaryStartDate = start.format('YYYY-MM-DD');
      summaryEndDate = end.format('YYYY-MM-DD');
    }

    // Only call summary API if we don't have summary data or if preset changed
    if (!summaryData) {
      dispatch(fetchPatientSummary({ 
        startDate: summaryStartDate, 
        endDate: summaryEndDate 
      }));
    }

  }, [dispatch, user, preset, startDate, endDate, summaryData]);

  // Lazy load detailed data only when switching to detailed view
  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    
    // Only fetch detailed data if switching to detailed view and we don't have it
    if (view === 'detailed' && !detailedDayData) {
      let detailedDate: string;

      // Determine the date for detailed data
      if (preset && preset !== 'custom') {
        const { start } = getDatePresetRange(preset);
        detailedDate = start.format('YYYY-MM-DD');
      } else if (preset === 'custom' && startDate && endDate) {
        detailedDate = startDate;
      } else {
        // Default to last 7 days
        const { start } = getDatePresetRange('last7');
        detailedDate = start.format('YYYY-MM-DD');
      }

      // Call detailed APIs only if we don't have the data
      dispatch(fetchDetailedData(detailedDate));
      
      // Only call per-slot API if we don't have that data either
      if (!perSlotDetailedData) {
        dispatch(fetchPerSlotDetailedData({ 
          date: detailedDate, 
          slotKey: 'all_slots' 
        }));
      }
    }
  };

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
        summaryData={convertedSummaryData}
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
          onViewChange={handleViewChange}
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