'use client';

import { useEffect, useState } from 'react';
import TopNavBar from '@/components/TopNavBar';
import SideBar from '@/components/SideBar';
import MainContent from '@/components/MainContent';
import CreateDialog from '@/components/CreateDialog';
import RenameDialog from '@/components/RenameDialog';
import PermissionsDialog from '@/components/PermissionsDialog';
import RecycleBinPanel from '@/components/RecycleBinPanel';
import ActivityLogPanel from '@/components/ActivityLogPanel';
import {
  FileSystemItem,
  createFile,
  createFolder,
  deleteItem,
  renameItem,
  searchItems,
  updatePermissions,
  findItemById,
} from '@/lib/fileSystemUtils';
import { loadState, saveState } from '@/lib/storageUtils';
import { addActivity, loadActivityLog, clearActivityLog } from '@/lib/activityLogger';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [items, setItems] = useState<FileSystemItem[]>([]);
  const [recycleBin, setRecycleBin] = useState<FileSystemItem[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<FileSystemItem[] | null>(null);
  const [activities, setActivities] = useState<any[]>([]);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createType, setCreateType] = useState<'file' | 'folder' | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameItemId, setRenameItemId] = useState<string | null>(null);
  const [renameItemName, setRenameItemName] = useState('');
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [permissionsItemId, setPermissionsItemId] = useState<string | null>(null);
  const [permissionsValue, setPermissionsValue] = useState<'view' | 'edit' | 'admin'>('edit');
  const [recycleBinOpen, setRecycleBinOpen] = useState(false);
  const [activityLogOpen, setActivityLogOpen] = useState(false);

  // Initialize state from localStorage
  useEffect(() => {
    const savedState = loadState();
    if (savedState) {
      setItems(savedState.items);
      setRecycleBin(savedState.recycleBin);
    } else {
      // Initialize with sample data
      const sampleItems: FileSystemItem[] = [
        {
          id: '1',
          name: 'Documents',
          type: 'folder',
          permissions: 'admin',
          createdDate: '2024-01-15',
          children: [
            {
              id: '1-1',
              name: 'Resume.pdf',
              type: 'file',
              permissions: 'edit',
              createdDate: '2024-01-15',
              parentId: '1',
            },
            {
              id: '1-2',
              name: 'Cover Letter.docx',
              type: 'file',
              permissions: 'edit',
              createdDate: '2024-01-14',
              parentId: '1',
            },
          ],
        },
        {
          id: '2',
          name: 'Photos',
          type: 'folder',
          permissions: 'admin',
          createdDate: '2024-01-10',
          children: [],
        },
        {
          id: '3',
          name: 'Projects',
          type: 'folder',
          permissions: 'admin',
          createdDate: '2024-01-08',
          children: [
            {
              id: '3-1',
              name: 'Website Design',
              type: 'folder',
              permissions: 'admin',
              createdDate: '2024-01-08',
              parentId: '3',
              children: [],
            },
          ],
        },
      ];
      setItems(sampleItems);
    }
    setActivities(loadActivityLog());
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveState(items, recycleBin);
  }, [items, recycleBin]);

  const handleCreateFile = () => {
    setCreateType('file');
    setCreateDialogOpen(true);
  };

  const handleCreateFolder = () => {
    setCreateType('folder');
    setCreateDialogOpen(true);
  };

  const handleCreate = (name: string) => {
    if (createType === 'file') {
      const newItems = createFile(name, selectedFolderId, items);
      setItems(newItems);
      addActivity('Created File', name, `in ${selectedFolderId ? 'folder' : 'root'}`);
    } else if (createType === 'folder') {
      const newItems = createFolder(name, selectedFolderId, items);
      setItems(newItems);
      addActivity('Created Folder', name, `in ${selectedFolderId ? 'folder' : 'root'}`);
    }
    setActivities(loadActivityLog());
  };

  const handleDeleteItem = (itemId: string) => {
    const item = findItemById(itemId, items);
    if (item) {
      setRecycleBin([...recycleBin, item]);
      const newItems = deleteItem(itemId, items);
      setItems(newItems);
      addActivity('Deleted', item.name, `moved to recycle bin`);
      setActivities(loadActivityLog());
    }
  };

  const handleRenameItem = (itemId: string) => {
    const item = findItemById(itemId, items);
    if (item) {
      setRenameItemId(itemId);
      setRenameItemName(item.name);
      setRenameDialogOpen(true);
    }
  };

  const handleRename = (newName: string) => {
    if (renameItemId) {
      const oldItem = findItemById(renameItemId, items);
      const newItems = renameItem(renameItemId, newName, items);
      setItems(newItems);
      addActivity('Renamed', `${oldItem?.name} → ${newName}`);
      setActivities(loadActivityLog());
    }
  };

  const handlePermissionsItem = (itemId: string) => {
    const item = findItemById(itemId, items);
    if (item) {
      setPermissionsItemId(itemId);
      setPermissionsValue(item.permissions);
      setPermissionsDialogOpen(true);
    }
  };

  const handleUpdatePermissions = (permission: 'view' | 'edit' | 'admin') => {
    if (permissionsItemId) {
      const item = findItemById(permissionsItemId, items);
      const newItems = updatePermissions(permissionsItemId, permission, items);
      setItems(newItems);
      addActivity('Updated Permissions', item?.name || '', `to ${permission}`);
      setActivities(loadActivityLog());
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      const results = searchItems(query, items);
      setSearchResults(results);
    } else {
      setSearchResults(null);
    }
  };

  const handleRestoreItem = (itemId: string) => {
    const item = recycleBin.find(i => i.id === itemId);
    if (item) {
      setItems([...items, { ...item, parentId: undefined }]);
      setRecycleBin(recycleBin.filter(i => i.id !== itemId));
      addActivity('Restored', item.name, 'from recycle bin');
      setActivities(loadActivityLog());
    }
  };

  const handlePermanentlyDelete = (itemId: string) => {
    setRecycleBin(recycleBin.filter(i => i.id !== itemId));
  };

  const handleEmptyBin = () => {
    setRecycleBin([]);
  };

  const handleShowRecycleBin = () => {
    setRecycleBinOpen(true);
  };

  const handleShowActivityLog = () => {
    setActivityLogOpen(true);
  };

  const handleClearActivityLog = () => {
    clearActivityLog();
    setActivities([]);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const countAllItems = (itemList: FileSystemItem[]): number => {
    let count = itemList.length;
    itemList.forEach(item => {
      if (item.children) {
        count += countAllItems(item.children);
      }
    });
    return count;
  };

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <TopNavBar
        onSearch={handleSearch}
        onCreateFile={handleCreateFile}
        onCreateFolder={handleCreateFolder}
        onShowRecycleBin={handleShowRecycleBin}
        onShowActivityLog={handleShowActivityLog}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        fileCount={countAllItems(items)}
      />

      <div className="flex flex-1 overflow-hidden">
        <SideBar
          items={items}
          selectedItemId={selectedFolderId}
          onSelectItem={setSelectedFolderId}
          darkMode={darkMode}
        />

        <MainContent
          items={items}
          selectedFolderId={selectedFolderId}
          searchResults={searchResults}
          onSelectItem={setSelectedFolderId}
          onDeleteItem={handleDeleteItem}
          onRenameItem={handleRenameItem}
          onPermissionsItem={handlePermissionsItem}
          darkMode={darkMode}
        />
      </div>

      {/* Dialogs and Panels */}
      <CreateDialog
        isOpen={createDialogOpen}
        type={createType}
        onCreate={handleCreate}
        onClose={() => {
          setCreateDialogOpen(false);
          setCreateType(null);
        }}
        darkMode={darkMode}
      />

      <RenameDialog
        isOpen={renameDialogOpen}
        currentName={renameItemName}
        onRename={handleRename}
        onClose={() => setRenameDialogOpen(false)}
        darkMode={darkMode}
      />

      <PermissionsDialog
        isOpen={permissionsDialogOpen}
        currentPermission={permissionsValue}
        onUpdatePermissions={handleUpdatePermissions}
        onClose={() => setPermissionsDialogOpen(false)}
        darkMode={darkMode}
      />

      <RecycleBinPanel
        isOpen={recycleBinOpen}
        recycleBin={recycleBin}
        onRestore={handleRestoreItem}
        onPermanentlyDelete={handlePermanentlyDelete}
        onEmptyBin={handleEmptyBin}
        onClose={() => setRecycleBinOpen(false)}
        darkMode={darkMode}
      />

      <ActivityLogPanel
        isOpen={activityLogOpen}
        activities={activities}
        onClearLog={handleClearActivityLog}
        onClose={() => setActivityLogOpen(false)}
        darkMode={darkMode}
      />
    </div>
  );
}
