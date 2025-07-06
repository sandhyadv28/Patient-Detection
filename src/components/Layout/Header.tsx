import { Activity, Database } from 'lucide-react';
import ExportButton from '../ExportButton';
import { HeaderProps } from '../modals';
import UserProfile from '../UserProfile';

export default function Header({ user, summaryData, dayData, onLogout }: HeaderProps & { onLogout: () => void }) {
  return (
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
            <UserProfile user={user} onLogout={onLogout} />
          </div>
        </div>
      </div>
    </header>
  );
} 