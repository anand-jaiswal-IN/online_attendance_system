import React, { useState } from 'react';
import { Calendar, PaperclipIcon, Send } from 'lucide-react';

export function LeaveApplicationForm() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [files, setFiles] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
 
    const formData = {
      startDate,
      endDate,
      reason,
      files: files ? Array.from(files).map(f => f.name) : [],
    };
    console.log('Submitting leave application:', formData);
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-pink-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors"
              required
            />
          
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            End Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-pink-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors"
              required
            />
      
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Reason for Leave
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-pink-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors"
          rows={4}
          placeholder="Please provide a detailed reason for your leave request..."
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Supporting Documents
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg">
          <div className="space-y-1 text-center">
            <PaperclipIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600 dark:text-gray-400">
              <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-600 dark:text-pink-500 hover:text-indigo-500 dark:hover:text-pink-400 focus-within:outline-none">
                <span>Upload files</span>
                <input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PDF, DOC, DOCX, or images up to 10MB
            </p>
          </div>
        </div>
        {files && files.length > 0 && (
          <div className="mt-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Selected files:
            </h4>
            <ul className="space-y-2">
              {Array.from(files).map((file, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2"
                >
                  <PaperclipIcon className="h-4 w-4" />
                  <span>{file.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
      >
        <Send className="h-5 w-5" />
        <span>Submit Application</span>
      </button>
    </form>
  );
}
export default LeaveApplicationForm;