import { useState } from "react";
import api from "../../apis/axiosInstance";
import AttendanceTable from "./AttendanceTable";

function Attendance() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [subjects, setSubjects] = useState([]);

  async function fetchDateWiseAttendance(e) {
    try {
      e.preventDefault();

      if (new Date(startDate) > new Date(endDate)) {
        alert("Start date should be less than end date");
        return;
      }

      const subjects = await api.get(
        "/student/know-attendance-of-your-subjects",
        {
          params: {
            semester: JSON.parse(localStorage.getItem("user")).presentSemester,
            departmentId: JSON.parse(localStorage.getItem("user")).departmentId,
            studentId: JSON.parse(localStorage.getItem("user")).id,
            startDate: new Date(startDate).toISOString(), // Convert to ISO format
            endDate: new Date(endDate).toISOString(),
          },
        }
      );
      setSubjects(subjects.data.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  }
  return (
    <div className="p-6">
      <form method="get" onSubmit={(e) => fetchDateWiseAttendance(e)}>
        <label htmlFor="startDate">Start Date : </label>
        <input
          type="date"
          name="startDate"
          onChange={(e) => setStartDate(e.target.value)}
        />
        <br />
        <label htmlFor="startDate">End Date : </label>
        <input
          type="date"
          name="endDate"
          onChange={(e) => setEndDate(e.target.value)}
        />
        <br />
        <button
          type="submit"
          className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
      <br />
      <br />
      <AttendanceTable
        data={subjects}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}

export default Attendance;
