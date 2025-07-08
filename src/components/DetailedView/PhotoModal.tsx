import { ExternalLink } from 'lucide-react';
import LoadingSpinner from '../../_common/LoadingSpinner';
import { PhotoModalProps } from './types';

export default function PhotoModal({ isOpen, photoUrl, isLoading, error, onClose }: PhotoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]" onClick={onClose}>
      <div className="bg-white rounded-2xl p-4 w-[36rem] h-[52vh] shadow-2xl relative z-[10000]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Patient Detection Photo
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        <div className="w-full h-80 flex items-center justify-center">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="md" message="Loading image..." />
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-600 mb-2">Failed to load image</p>
              <p className="text-gray-600 text-sm">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          ) : photoUrl ? (
            <div className="w-full h-full flex flex-col">
              <img
                src={photoUrl}
                alt="Patient detection"
                className="w-full h-full rounded-xl shadow-lg"
                onError={() => {
                  // Handle image load error if needed
                }}
              />
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">Click outside to close</p>
                <a
                  href={photoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <ExternalLink size={16} />
                  Open in new tab
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600">No photo available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 