'use client';

import { useState } from 'react';

interface CreateDialogProps {
  isOpen: boolean;
  type: 'file' | 'folder' | null;
  onCreate: (name: string) => void;
  onClose: () => void;
  darkMode: boolean;
}

export default function CreateDialog({ isOpen, type, onCreate, onClose, darkMode }: CreateDialogProps) {
  const [name, setName] = useState('');

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name);
      setName('');
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreate();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`p-6 rounded-lg shadow-lg w-96 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
      >
        <h2 className="text-xl font-bold mb-4">
          Create New {type === 'file' ? 'File' : 'Folder'}
        </h2>

        <input
          type="text"
          placeholder={`${type === 'file' ? 'File' : 'Folder'} name...`}
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          autoFocus
          className={`w-full px-4 py-2 border rounded-lg mb-4 transition-colors ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors ${
              darkMode
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className={`px-4 py-2 rounded-lg text-white transition-colors font-medium ${
              name.trim()
                ? type === 'file'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
