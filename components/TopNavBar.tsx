'use client';

import { useState } from 'react';
import { FileSystemItem } from '@/lib/fileSystemUtils';

interface TopNavBarProps {
  onSearch: (query: string) => void;
  onCreateFile: () => void;
  onCreateFolder: () => void;
  onShowRecycleBin: () => void;
  onShowActivityLog: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  fileCount: number;
}

export default function TopNavBar({
  onSearch,
  onCreateFile,
  onCreateFolder,
  onShowRecycleBin,
  onShowActivityLog,
  darkMode,
  onToggleDarkMode,
  fileCount,
}: TopNavBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40`}>
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          {/* Top Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                📁 File Manager
              </h1>
              <span className={`text-sm px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                {fileCount} items
              </span>
            </div>
            <button
              onClick={onToggleDarkMode}
              className={`px-3 py-2 rounded-lg transition-colors ${
                darkMode
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Bottom Row - Actions and Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={onCreateFile}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                + File
              </button>
              <button
                onClick={onCreateFolder}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                + Folder
              </button>
              <button
                onClick={onShowRecycleBin}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  darkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🗑️ Recycle Bin
              </button>
              <button
                onClick={onShowActivityLog}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  darkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📋 Activity
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search files and folders..."
                value={searchQuery}
                onChange={handleSearch}
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
