import React, { useState } from 'react';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { User as UserType, UserProfileProps } from './modals';

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-lg" />
          ) : (
            <User className="text-blue-600" size={20} />
          )}
        </div>
        <div className="text-left hidden md:block">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>
        <ChevronDown className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={16} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-20">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-lg" />
                  ) : (
                    <User className="text-blue-600" size={24} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400">{user.role}</p>
                </div>
              </div>
            </div>
            
            <div className="p-2">
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors text-gray-700">
                <Settings size={18} className="text-gray-400" />
                Settings
              </button>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-red-50 rounded-lg transition-colors text-gray-700 hover:text-red-600"
              >
                <LogOut size={18} className="text-red-500" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}