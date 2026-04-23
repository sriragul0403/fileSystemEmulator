'use client';

import { FileSystemItem } from '@/lib/fileSystemUtils';

interface RecycleBinPanelProps {
  isOpen: boolean;
  recycleBin: FileSystemItem[];
  onRestore: (itemId: string) => void;
  onPermanentlyDelete: (itemId: string) => void;
  onEmptyBin: () => void;
  onClose: () => void;
  darkMode: boolean;
}

export default function RecycleBinPanel({
  isOpen,
  recycleBin,
  onRestore,
  onPermanentlyDelete,
  onEmptyBin,
  onClose,
  darkMode,
}: RecycleBinPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`p-6 rounded-lg shadow-lg w-2/3 max-h-96 overflow-y-auto ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">🗑️ Recycle Bin</h2>
          <button
            onClick={onClose}
            className={`text-2xl hover:opacity-70 transition-opacity`}
          >
            ×
          </button>
        </div>

        {recycleBin.length === 0 ? (
          <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Recycle bin is empty
          </p>
        ) : (
          <>
            <div className="space-y-2 mb-6">
              {recycleBin.map(item => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                  } transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {item.type === 'folder' ? '📁' : '📄'}
                    </span>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.createdDate}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onRestore(item.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => onPermanentlyDelete(item.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-end border-t pt-4">
              <button
                onClick={onEmptyBin}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Empty Bin
              </button>
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
