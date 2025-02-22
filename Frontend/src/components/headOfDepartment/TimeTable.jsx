import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Users, MapPin } from 'lucide-react';

const INITIAL_SCHEDULE = [
  {
    day: 'Monday',
    slots: [
      { time: '9:00 AM - 10:00 AM', subject: 'Data Structures', teacher: 'Dr. John Doe', room: '101' },
      { time: '10:00 AM - 11:00 AM', subject: 'Database Systems', teacher: 'Prof. Jane Smith', room: '102' },
      { time: '11:15 AM - 12:15 PM', subject: 'Computer Networks', teacher: 'Dr. Mike Johnson', room: '103' },
    ]
  },
  {
    day: 'Tuesday',
    slots: [
      { time: '9:00 AM - 10:00 AM', subject: 'Computer Networks', teacher: 'Dr. Mike Johnson', room: '103' },
      { time: '10:00 AM - 11:00 AM', subject: 'Operating Systems', teacher: 'Prof. Sarah Wilson', room: '104' },
      { time: '11:15 AM - 12:15 PM', subject: 'Software Engineering', teacher: 'Dr. Alice Brown', room: '105' },
    ]
  },
  {
    day: 'Wednesday',
    slots: [
      { time: '9:00 AM - 10:00 AM', subject: 'Artificial Intelligence', teacher: 'Dr. Robert Clark', room: '201' },
      { time: '10:00 AM - 11:00 AM', subject: 'Web Development', teacher: 'Prof. Emma Davis', room: '202' },
      { time: '11:15 AM - 12:15 PM', subject: 'Cybersecurity', teacher: 'Dr. James Wilson', room: '203' },
    ]
  },
  {
    day: 'Thursday',
    slots: [
      { time: '9:00 AM - 10:00 AM', subject: 'Machine Learning', teacher: 'Dr. Lisa Anderson', room: '204' },
      { time: '10:00 AM - 11:00 AM', subject: 'Cloud Computing', teacher: 'Prof. David Miller', room: '205' },
      { time: '11:15 AM - 12:15 PM', subject: 'Mobile Development', teacher: 'Dr. Susan White', room: '206' },
    ]
  },
  {
    day: 'Friday',
    slots: [
      { time: '9:00 AM - 10:00 AM', subject: 'Data Science', teacher: 'Dr. Michael Brown', room: '207' },
      { time: '10:00 AM - 11:00 AM', subject: 'Software Testing', teacher: 'Prof. Karen Taylor', room: '208' },
      { time: '11:15 AM - 12:15 PM', subject: 'Project Management', teacher: 'Dr. Thomas Green', room: '209' },
    ]
  }
];

export  function TimeTable() {
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [expandedDay, setExpandedDay] = useState('Monday');
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [selectedSemester, setSelectedSemester] = useState(3);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-semibold text-[#2D62BD] font-[anzo2]">Time Table</h2>
        <div className="flex space-x-4">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-white/20 text-[#008C96] border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400/50"
          >
            <option   value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="ME">ME</option>
            <option value="CE">CE</option>
          </select>

          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
            className="bg-white/20 text-[#008C96] border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400/50"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {schedule.map((day) => (
          <div key={day.day} className="bg-white/10 rounded-lg overflow-hidden border border-black/20 hover:border-white/30 transition-colors">
            <button
              className="w-full px-6 py-4 flex justify-between items-center text-black hover:bg-white/5 transition-colors"
              onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold">{day.day}</span>
                <span className="text-sm text-[#008C96]">({day.slots.length} classes)</span>
              </div>
              {expandedDay === day.day ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {expandedDay === day.day && (
              <div className="px-6 pb-4">
                <div className="grid gap-4">
                  {day.slots.map((slot, index) => (
                    <div 
                      key={index}
                      className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors border border-white/10"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-3 text-black/52">
                          <Clock size={18} />
                          <span>{slot.time}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-black/52">{slot.subject}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-[#008C96]">
                          <Users size={18} />
                          <span>{slot.teacher}</span>
                        </div>
                        
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
export default TimeTable;