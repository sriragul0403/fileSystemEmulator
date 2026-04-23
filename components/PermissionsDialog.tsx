'use client';

import { useState, useEffect } from 'react';

interface PermissionsDialogProps {
  isOpen: boolean;
  currentPermission: 'view' | 'edit' | 'admin';
  onUpdatePermissions: (permission: 'view' | 'edit' | 'admin') => void;
  onClose: () => void;
  darkMode: boolean;
}

export default function PermissionsDialog({
  isOpen,
  currentPermission,
  onUpdatePermissions,
  onClose,
  darkMode,
}: PermissionsDialogProps) {
  const [permission, setPermission] = useState<'view' | 'edit' | 'admin'>(currentPermission);

  useEffect(() => {
    setPermission(currentPermission);
  }, [currentPermission, isOpen]);

  const handleUpdatePermissions = () => {
    if (permission !== currentPermission) {
      onUpdatePermissions(permission);
      onClose();
    }
  };

  const permissions = [
    {
      value: 'view' as const,
      label: '👁️ View Only',
      description: 'Can only view the item',
    },
    {
      value: 'edit' as const,
      label: '✏️ Edit',
      description: 'Can view and edit the item',
    },
    {
      value: 'admin' as const,
      label: '🔑 Admin',
      description: 'Full access and can manage permissions',
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`p-6 rounded-lg shadow-lg w-96 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
      >
        <h2 className="text-xl font-bold mb-4">Update Permissions</h2>

        <div className="space-y-3 mb-6">
          {permissions.map(perm => (
            <label
              key={perm.value}
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                permission === perm.value
                  ? darkMode
                    ? 'bg-blue-900 border-2 border-blue-600'
                    : 'bg-blue-100 border-2 border-blue-600'
                  : darkMode
                    ? 'bg-gray-700 border-2 border-gray-600 hover:border-gray-500'
                    : 'bg-gray-50 border-2 border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="permission"
                value={perm.value}
                checked={permission === perm.value}
                onChange={() => setPermission(perm.value)}
                className="mt-1"
              />
              <div>
                <div className="font-semibold">{perm.label}</div>
                <div
                  className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  {perm.description}
                </div>
              </div>
            </label>
          ))}
        </div>

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
            onClick={handleUpdatePermissions}
            disabled={permission === currentPermission}
            className={`px-4 py-2 rounded-lg text-white transition-colors font-medium ${
              permission !== currentPermission
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
