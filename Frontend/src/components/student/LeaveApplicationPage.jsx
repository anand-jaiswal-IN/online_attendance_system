import React from 'react';
import { LeaveApplicationForm } from './LeaveApplicationForm';

export function LeaveApplicationPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
          Submit Leave Application
        </h2>
        <LeaveApplicationForm />
      </div>
    </div>
  );
}
export default LeaveApplicationPage;