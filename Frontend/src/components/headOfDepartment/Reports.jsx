import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MOCK_DATA = {
  teacherAttendance: [
    { name: "Dr. John Doe", attended: 45, total: 50 },
    { name: "Prof. Jane Smith", attended: 48, total: 50 },
    { name: "Dr. Mike Johnson", attended: 47, total: 50 },
    { name: "Prof. Sarah Wilson", attended: 49, total: 50 },
  ],
  studentAttendance: [
    { semester: "1st Sem", attendance: 85 },
    { semester: "2nd Sem", attendance: 78 },
    { semester: "3rd Sem", attendance: 92 },
    { semester: "4th Sem", attendance: 88 },
    { semester: "5th Sem", attendance: 95 },
    { semester: "6th Sem", attendance: 82 },
    { semester: "7th Sem", attendance: 90 },
    { semester: "8th Sem", attendance: 87 },
  ],
};

function Reports() {
  const [selectedBranch, setSelectedBranch] = useState("CSE");

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-[anzo2] text-[#2D62BD]">
          Attendance Reports
        </h2>
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="bg-white/20 text-[#008C96] border border-black/20 rounded-md px-3 py-2"
        >
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="ME">ME</option>
          <option value="CE">CE</option>
        </select>
      </div>

      <div className="bg-white/20 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-black/70 mb-4">
          Teacher Attendance
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_DATA.teacherAttendance}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis dataKey="name" stroke="black" />
              <YAxis stroke="black" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="attended" name="Classes Attended" fill="#8B5CF6" />
              <Bar dataKey="total" name="Total Classes" fill="#EC4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/20 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-black/70 mb-4">
          Student Attendance by Semester
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_DATA.studentAttendance}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis dataKey="semester" stroke="black" />
              <YAxis stroke="black" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="attendance" name="Attendance %" fill="#EC4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
export default Reports;
