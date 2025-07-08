# Component Structure

This directory contains the modularized components for the patient detection application. Components have been broken down into smaller, more manageable pieces for better maintainability and understanding.

## Directory Structure

```
src/components/
├── DetailedView/           # Detailed view components
│   ├── index.tsx          # Main DetailedView component
│   ├── types.ts           # Type definitions
│   ├── utils.ts           # Utility functions
│   ├── DayHeader.tsx      # Day selection header
│   ├── TimeSlotCard.tsx   # Individual time slot cards
│   ├── BedDetailsTable.tsx # Bed details table
│   └── PhotoModal.tsx     # Photo viewing modal
├── SummaryView/           # Summary view components
│   ├── index.tsx          # Main SummaryView component
│   ├── SummaryMetrics.tsx # Summary metrics cards
│   └── SummaryTable.tsx   # Summary data table
├── modals/               # Modal and type definitions
│   ├── index.tsx         # Type exports
│   └── types.ts          # All type definitions
├── Layout/               # Layout components
├── DetailedView.tsx      # Legacy export (redirects to DetailedView/index.tsx)
├── SummaryView.tsx       # Legacy export (redirects to SummaryView/index.tsx)
├── ExportButton.tsx      # Export functionality
├── DateRangePicker.tsx   # Date range selection
├── UserProfile.tsx       # User profile component
└── AuthModal.tsx         # Authentication modal
```

## Benefits of This Structure

1. **Maintainability**: Each component has a single responsibility
2. **Readability**: Smaller files are easier to understand
3. **Reusability**: Components can be reused in different contexts
4. **Testing**: Smaller components are easier to test
5. **Collaboration**: Multiple developers can work on different components simultaneously
6. **Performance**: Better tree-shaking and code splitting opportunities

## Usage

Import components as before - the legacy files redirect to the new structure:

```typescript
// These still work as before
import DetailedView from './components/DetailedView';
import SummaryView from './components/SummaryView';

// Or import specific sub-components if needed
import DayHeader from './components/DetailedView/DayHeader';
import SummaryMetrics from './components/SummaryView/SummaryMetrics';
``` 