'use client';

import { FileSystemItem } from '@/lib/fileSystemUtils';

interface SideBarProps {
  items: FileSystemItem[];
  selectedItemId: string | null;
  onSelectItem: (itemId: string) => void;
  darkMode: boolean;
}

export default function SideBar({ items, selectedItemId, onSelectItem, darkMode }: SideBarProps) {
  const handleSelectFolder = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      onSelectItem(item.id);
    }
  };

  const renderFolders = (folderList: FileSystemItem[], level: number = 0) => {
    return folderList
      .filter(item => item.type === 'folder')
      .map(item => (
        <div key={item.id}>
          <button
            onClick={() => handleSelectFolder(item)}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              selectedItemId === item.id
                ? darkMode
                  ? 'bg-blue-900 text-blue-100'
                  : 'bg-blue-100 text-blue-900'
                : darkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
            }`}
            style={{ paddingLeft: `${16 + level * 16}px` }}
          >
            <span>📁</span>
            <span className="truncate">{item.name}</span>
          </button>
          {item.children && item.children.length > 0 && renderFolders(item.children, level + 1)}
        </div>
      ));
  };

  return (
    <aside
      className={`w-64 border-r ${
        darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
      } hidden md:block overflow-y-auto max-h-[calc(100vh-5rem)]`}
    >
      <div className="p-4">
        <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Folders
        </h2>
        <div className="space-y-1">
          <button
            onClick={() => onSelectItem('')}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              selectedItemId === ''
                ? darkMode
                  ? 'bg-blue-900 text-blue-100'
                  : 'bg-blue-100 text-blue-900'
                : darkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>📂</span>
            <span>Root</span>
          </button>
          {items.length > 0 && renderFolders(items)}
        </div>
      </div>
    </aside>
  );
}
