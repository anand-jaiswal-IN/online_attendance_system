import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AttendanceChart({ subjects }) {
  const data = subjects.map(subject => ({
    name: subject.name,
    percentage: Math.round((subject.attendance / subject.totalClasses) * 100)
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="percentage" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
export default AttendanceChart;