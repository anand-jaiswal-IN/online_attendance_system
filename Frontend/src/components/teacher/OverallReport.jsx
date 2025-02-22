import React, { useState } from 'react';
import { BarChart, Calendar } from 'lucide-react';

export function OverallReport() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const attendanceData = [
    { date: '2024-03-01', present: 45, absent: 5 },
    { date: '2024-03-02', present: 48, absent: 2 },
    { date: '2024-03-03', present: 43, absent: 7 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
          >
            <option value="">Select Subject</option>
            <option value="math">Mathematics</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
          >
            <option value="">Select Month</option>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Overall Statistics</h3>
            <BarChart className="w-5 h-5 text-pink-500" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Classes</span>
              <span className="font-semibold">15</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Attendance</span>
              <span className="font-semibold">92%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Highest Attendance</span>
              <span className="font-semibold">98%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Lowest Attendance</span>
              <span className="font-semibold">86%</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Daily Breakdown</h3>
            <Calendar className="w-5 h-5 text-pink-500" />
          </div>
          <div className="space-y-4">
            {attendanceData.map((day, index) => (
              <div key={index} className="border-b pb-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">{day.date}</span>
                  <span className="font-semibold">
                    {Math.round((day.present / (day.present + day.absent)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-pink-400 to-purple-600 rounded-full h-2"
                    style={{
                      width: `${(day.present / (day.present + day.absent)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default OverallReport;