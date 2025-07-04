import React from 'react';
import { User, LandingPageProps } from '../modals';
import AuthModal from '../AuthModal';

export default function LandingPage({ onLogin, showAuthModal, onShowAuthModal }: LandingPageProps) {
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
          onClick={() => onShowAuthModal(true)}
          className="px-8 py-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Access Dashboard
        </button>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => onShowAuthModal(false)}
        onLogin={onLogin}
      />
    </div>
  );
} 