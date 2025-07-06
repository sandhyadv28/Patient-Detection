# Patient Detection Analytics Dashboard

A modern, AI-powered healthcare monitoring dashboard built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Real-time Patient Detection Analytics**: Monitor patient detection rates across multiple beds and time slots
- **Interactive Dashboard**: Switch between summary and detailed analysis views
- **Date Range Filtering**: Flexible date range selection with preset options
- **Data Export**: Export patient data to CSV format
- **Responsive Design**: Modern, mobile-friendly interface
- **Authentication System**: Secure user authentication and session management
- **Error Handling**: Comprehensive error handling and user feedback

## 🏗️ Architecture

The application has been refactored with a clean, maintainable architecture:

### Directory Structure

```
src/
├── components/
│   ├── Layout/           # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── LandingPage.tsx
│   │   └── AnalysisTabs.tsx
│   ├── UI/              # Reusable UI components
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   ├── AuthModal.tsx
│   ├── DateRangePicker.tsx
│   ├── DrilldownView.tsx
│   ├── ExportButton.tsx
│   ├── SummaryView.tsx
│   └── UserProfile.tsx
├── hooks/               # Custom React hooks
│   ├── useAuth.ts
│   └── usePatientData.ts
├── utils/              # Utility functions
│   ├── constants.ts
│   ├── dataGenerator.ts
│   ├── validation.ts
│   └── csvExport.ts
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

### Key Improvements

#### 1. **Custom Hooks**
- `usePatientData`: Manages patient data state, loading, and error handling
- `useAuth`: Handles authentication state and user management

#### 2. **Component Separation**
- **Layout Components**: Header, Footer, LandingPage, AnalysisTabs
- **UI Components**: LoadingSpinner, ErrorMessage for consistent user experience
- **Business Components**: SummaryView, DrilldownView for specific functionality

#### 3. **Utility Functions**
- **Constants**: Centralized configuration and constants
- **Validation**: Comprehensive data validation functions
- **Data Generation**: Enhanced data generation with realistic patterns
- **CSV Export**: Data export functionality

#### 4. **Type Safety**
- Comprehensive TypeScript interfaces
- Strict type checking throughout the application
- Better IntelliSense and development experience

#### 5. **Error Handling**
- Centralized error messages
- User-friendly error display
- Retry mechanisms for failed operations

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Hooks
- **Data Generation**: Custom utilities with realistic patterns

## 📊 Data Structure

### Patient Detection Records
```typescript
interface DetectionRecord {
  bedId: number;
  timeSlot: string;
  status: 'Yes' | 'No' | 'Ambiguous';
  photoUrl: string;
}
```

### Summary Data
```typescript
interface SummaryData {
  date: string;
  totalBeds: number;
  detected: number;
  notDetected: number;
  ambiguous: number;
  detectedPercentage: number;
  notDetectedPercentage: number;
  ambiguousPercentage: number;
}
```

## 🔧 Development

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## 🎯 Key Features Implementation

### 1. **Realistic Data Generation**
- Time-based detection patterns (higher rates during day hours)
- Bed-specific variations
- Configurable time slots and bed counts

### 2. **Responsive Design**
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions

### 3. **Performance Optimization**
- Efficient data processing
- Lazy loading of components
- Optimized re-renders

### 4. **User Experience**
- Loading states with spinners
- Error messages with retry options
- Smooth transitions and animations
- Intuitive navigation

## 🔒 Security Considerations

- Input validation on all user inputs
- Date range limitations to prevent performance issues
- Secure authentication flow
- Data sanitization before export

## 📈 Future Enhancements

- Real-time data integration
- Advanced analytics and charts
- User role-based access control
- API integration for live data
- Advanced filtering and search
- Real-time notifications
- Mobile app version

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This is a demo application with simulated data. In a production environment, replace the dummy data generation with real API calls and implement proper security measures. 