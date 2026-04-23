export interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  permissions: 'view' | 'edit' | 'admin';
  createdDate: string;
  children?: FileSystemItem[];
  parentId?: string;
}

export interface FileSystemState {
  items: FileSystemItem[];
}

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Create a new file
export const createFile = (name: string, parentId: string | null, items: FileSystemItem[]): FileSystemItem[] => {
  const newFile: FileSystemItem = {
    id: generateId(),
    name,
    type: 'file',
    permissions: 'edit',
    createdDate: new Date().toLocaleDateString(),
    parentId: parentId || undefined,
  };

  if (!parentId) {
    return [...items, newFile];
  }

  return items.map(item => {
    if (item.id === parentId && item.type === 'folder') {
      return {
        ...item,
        children: [...(item.children || []), newFile],
      };
    }
    if (item.children) {
      return {
        ...item,
        children: createFile(name, parentId, item.children),
      };
    }
    return item;
  });
};

// Create a new folder
export const createFolder = (name: string, parentId: string | null, items: FileSystemItem[]): FileSystemItem[] => {
  const newFolder: FileSystemItem = {
    id: generateId(),
    name,
    type: 'folder',
    permissions: 'admin',
    createdDate: new Date().toLocaleDateString(),
    children: [],
    parentId: parentId || undefined,
  };

  if (!parentId) {
    return [...items, newFolder];
  }

  return items.map(item => {
    if (item.id === parentId && item.type === 'folder') {
      return {
        ...item,
        children: [...(item.children || []), newFolder],
      };
    }
    if (item.children) {
      return {
        ...item,
        children: createFolder(name, parentId, item.children),
      };
    }
    return item;
  });
};

// Delete an item (move to recycle bin)
export const deleteItem = (itemId: string, items: FileSystemItem[]): FileSystemItem[] => {
  return items
    .filter(item => item.id !== itemId)
    .map(item => {
      if (item.children) {
        return {
          ...item,
          children: deleteItem(itemId, item.children),
        };
      }
      return item;
    });
};

// Rename an item
export const renameItem = (itemId: string, newName: string, items: FileSystemItem[]): FileSystemItem[] => {
  return items.map(item => {
    if (item.id === itemId) {
      return { ...item, name: newName };
    }
    if (item.children) {
      return {
        ...item,
        children: renameItem(itemId, newName, item.children),
      };
    }
    return item;
  });
};

// Find item by ID
export const findItemById = (itemId: string, items: FileSystemItem[]): FileSystemItem | null => {
  for (const item of items) {
    if (item.id === itemId) return item;
    if (item.children) {
      const found = findItemById(itemId, item.children);
      if (found) return found;
    }
  }
  return null;
};

// Get breadcrumb path
export const getBreadcrumbPath = (itemId: string, items: FileSystemItem[], path: FileSystemItem[] = []): FileSystemItem[] => {
  const item = findItemById(itemId, items);
  if (!item) return path;

  const newPath = [item, ...path];

  if (item.parentId) {
    return getBreadcrumbPath(item.parentId, items, newPath);
  }

  return newPath;
};

// Search items
export const searchItems = (query: string, items: FileSystemItem[]): FileSystemItem[] => {
  const results: FileSystemItem[] = [];

  const search = (itemList: FileSystemItem[]) => {
    for (const item of itemList) {
      if (item.name.toLowerCase().includes(query.toLowerCase())) {
        results.push(item);
      }
      if (item.children) {
        search(item.children);
      }
    }
  };

  search(items);
  return results;
};

// Update permissions
export const updatePermissions = (
  itemId: string,
  newPermission: 'view' | 'edit' | 'admin',
  items: FileSystemItem[]
): FileSystemItem[] => {
  return items.map(item => {
    if (item.id === itemId) {
      return { ...item, permissions: newPermission };
    }
    if (item.children) {
      return {
        ...item,
        children: updatePermissions(itemId, newPermission, item.children),
      };
    }
    return item;
  });
};
