import React from 'react';
import {
  GraduationCap,
  BarChart3,
  FileText,
  Bell,
  Menu,
  Sun,
  Moon,
} from 'lucide-react';

export function Sidebar({ isOpen, onToggle, theme, onNavigate, currentPage }) {
  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', id: 'dashboard' },
    { icon: FileText, label: 'Leave Application', id: 'leave-application' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 lg:hidden z-20"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white dark:bg-gray-900 shadow-lg z-30 transition-all duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'
        } overflow-hidden`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <GraduationCap className="h-8 w-8 flex-shrink-0 text-indigo-600 dark:text-pink-500" />
              <span className={`text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent transition-opacity duration-200 ${
                isOpen ? 'opacity-100' : 'opacity-0'
              }`}>
                Student Panel
              </span>
            </div>
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

    
          <nav className="flex-1 px-2 py-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg mb-1 transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-indigo-50 to-pink-50 dark:from-indigo-900/30 dark:to-pink-900/30 text-indigo-600 dark:text-pink-500'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className={`ml-3 transition-opacity duration-200 ${
                  isOpen ? 'opacity-100' : 'opacity-0'
                }`}>
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

       
          <div className="p-4 border-t dark:border-gray-800">
            <button
              onClick={theme.toggleTheme}
              className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
            >
              {theme.isDark ? (
                <Sun className="h-5 w-5 flex-shrink-0" />
              ) : (
                <Moon className="h-5 w-5 flex-shrink-0" />
              )}
              <span className={`ml-3 transition-opacity duration-200 ${
                isOpen ? 'opacity-100' : 'opacity-0'
              }`}>
                {theme.isDark ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
export default Sidebar;