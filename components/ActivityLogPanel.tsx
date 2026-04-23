'use client';

import { Activity } from '@/lib/activityLogger';

interface ActivityLogPanelProps {
  isOpen: boolean;
  activities: Activity[];
  onClearLog: () => void;
  onClose: () => void;
  darkMode: boolean;
}

export default function ActivityLogPanel({
  isOpen,
  activities,
  onClearLog,
  onClose,
  darkMode,
}: ActivityLogPanelProps) {
  const getActionEmoji = (action: string): string => {
    switch (action.toLowerCase()) {
      case 'created file':
        return '📄';
      case 'created folder':
        return '📁';
      case 'deleted':
        return '🗑️';
      case 'renamed':
        return '✏️';
      case 'updated permissions':
        return '🔒';
      case 'restored':
        return '↩️';
      default:
        return '📋';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`p-6 rounded-lg shadow-lg w-2/3 max-h-96 overflow-y-auto ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">📋 Activity Log</h2>
          <button
            onClick={onClose}
            className={`text-2xl hover:opacity-70 transition-opacity`}
          >
            ×
          </button>
        </div>

        {activities.length === 0 ? (
          <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No activities recorded
          </p>
        ) : (
          <>
            <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
              {activities.map(activity => (
                <div
                  key={activity.id}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                  } transition-colors`}
                >
                  <span className="text-xl flex-shrink-0">
                    {getActionEmoji(activity.action)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">
                      {activity.action}: <span className="font-semibold">{activity.itemName}</span>
                    </div>
                    {activity.details && (
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {activity.details}
                      </div>
                    )}
                    <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {activity.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-end border-t pt-4">
              <button
                onClick={onClearLog}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear Log
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
