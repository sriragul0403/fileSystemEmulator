'use client';

import { FileSystemItem } from '@/lib/fileSystemUtils';

interface MainContentProps {
  items: FileSystemItem[];
  selectedFolderId: string | null;
  searchResults: FileSystemItem[] | null;
  onSelectItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onRenameItem: (itemId: string) => void;
  onPermissionsItem: (itemId: string) => void;
  darkMode: boolean;
}

export default function MainContent({
  items,
  selectedFolderId,
  searchResults,
  onSelectItem,
  onDeleteItem,
  onRenameItem,
  onPermissionsItem,
  darkMode,
}: MainContentProps) {
  const getItemsToDisplay = (): FileSystemItem[] => {
    if (searchResults !== null) {
      return searchResults;
    }

    if (selectedFolderId === null || selectedFolderId === '') {
      return items;
    }

    const findFolder = (id: string, itemList: FileSystemItem[]): FileSystemItem | undefined => {
      for (const item of itemList) {
        if (item.id === id) return item;
        if (item.children) {
          const found = findFolder(id, item.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    const folder = findFolder(selectedFolderId, items);
    return folder?.children || [];
  };

  const displayItems = getItemsToDisplay();

  const getPermissionColor = (permission: string): string => {
    switch (permission) {
      case 'admin':
        return darkMode ? 'text-orange-400' : 'text-orange-600';
      case 'edit':
        return darkMode ? 'text-blue-400' : 'text-blue-600';
      case 'view':
        return darkMode ? 'text-green-400' : 'text-green-600';
      default:
        return '';
    }
  };

  return (
    <main className={`flex-1 overflow-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto p-6">
        {displayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-5xl mb-4">📭</div>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {searchResults !== null ? 'No search results found' : 'This folder is empty'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayItems.map(item => (
              <div
                key={item.id}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer group ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 hover:border-blue-500'
                    : 'bg-gray-50 border-gray-200 hover:border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="text-3xl"
                    onClick={() => item.type === 'folder' && onSelectItem(item.id)}
                  >
                    {item.type === 'folder' ? '📁' : '📄'}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onRenameItem(item.id)}
                      className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      title="Rename"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onPermissionsItem(item.id)}
                      className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      title="Permissions"
                    >
                      🔒
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1 rounded hover:bg-red-300 dark:hover:bg-red-600 transition-colors"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <h3
                  className={`font-semibold mb-2 truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  {item.name}
                </h3>

                <div className="flex items-center justify-between text-xs">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {item.createdDate}
                  </span>
                  <span className={`font-medium ${getPermissionColor(item.permissions)}`}>
                    {item.permissions.charAt(0).toUpperCase() + item.permissions.slice(1)}
                  </span>
                </div>

                {item.children && item.children.length > 0 && (
                  <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'} text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.children.length} item{item.children.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
