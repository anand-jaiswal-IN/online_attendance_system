import React from 'react';
import { Bell, AlertTriangle, Info } from 'lucide-react';
import { format } from 'date-fns';

export function NotificationPanel({ notifications }) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {notifications.length} new
        </span>
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            {notification.type === 'warning' ? (
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            ) : (
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {format(new Date(notification.date), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default NotificationPanel;