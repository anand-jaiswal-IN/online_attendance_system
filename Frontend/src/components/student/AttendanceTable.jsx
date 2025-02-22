import React from "react";

const AttendanceTable = ({ data, startDate, endDate }) => {
  // Function to generate a date range from startDate to endDate
  const getDateRange = (start, end) => {
    const dates = [];
    let currentDate = new Date(start);
    const endDt = new Date(end);

    while (currentDate <= endDt) {
      dates.push(currentDate.toISOString().split("T")[0]); // Format: YYYY-MM-DD
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const dateRange = getDateRange(startDate, endDate);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Subjects</th>
            {dateRange.map((date) => (
              <th key={date} className="border p-2">
                {date}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((subject) => (
            <tr key={subject.id} className="border">
              <td className="border p-2 font-semibold">{subject.name}</td>
              {dateRange.map((date) => {
                const attendanceRecord = subject.attendance.find(
                  (att) => att.date.split("T")[0] === date
                );
                return (
                  <td
                    key={date}
                    className={`border p-2 text-center ${
                      attendanceRecord
                        ? attendanceRecord.isPresent
                          ? "bg-green-300 text-green-900"
                          : "bg-red-300 text-red-900"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {attendanceRecord
                      ? attendanceRecord.isPresent
                        ? "Present"
                        : "Absent"
                      : "Null"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
