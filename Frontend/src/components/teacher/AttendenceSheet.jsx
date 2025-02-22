import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../../apis/axiosInstance";
import { isAxiosError } from "axios";

function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function AttendanceSheet() {
  const navigate = useNavigate();
  const location = useLocation();

  if (!location.state) {
    return (
      <div>
        <h2 className="text-2xl font-bold">
          Select the subject to take attendance
        </h2>
        <br />
        <Link
          to="/dashboard-teacher/subjects"
          className="bg-blue-500 text-white py-2 px-4 rounded-xl "
        >
          Go to subjects
        </Link>
      </div>
    );
  }

  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState(null);
  const [attendances, setAttendances] = useState([]);

  useEffect(() => {
    if (!location.state) return;

    async function fetchStudents(presentSemester, departmentId) {
      try {
        const response = await api.get("/teacher/get-students", {
          params: { departmentId, presentSemester },
        });
        setStudents(response.data.data);

        const localAttendances = [];

        for (let i = 0; i < response.data.data.length; i++) {
          const attendance = {
            date: new Date(),
            isPresent: false,
            assignedTeacherId: location.state.response.id, // assignedTeacherId
            studentId: response.data.data[i].id, // studentId
          };

          localAttendances.push(attendance);
        }
        setAttendances(localAttendances);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStudents(
      location.state.response.semester,
      location.state.response.subject.departmentId
    );
  }, [location.state]);

  async function submitAttendances(attendances) {
    try {
      const response = await api.post("/teacher/submit-attendances", {
        date: new Date(),
        assignedTeacherId: location.state.response.id,
        attendances: attendances,
      });
      console.log(response);

      if (response.data.status === 200) {
        alert(response.data.message);
        navigate("/dashboard-teacher/subjects");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        alert(error.response.data.message);
      }
      console.error(error);
    }
  }

  return (
    <>
      <div className="flex justify-between">
        <div>
          <h2>Subject : </h2>
          <p className="border-2 border-indigo-200 py-1 pr-10 pl-1 rounded-xl">
            {location.state.response.subject.name},{" "}
            {location.state.response.subject.subjectCode}
          </p>
        </div>
        <div>
          <h2>Department : </h2>
          <p className="border-2 border-indigo-200 py-1 pr-10 pl-1 rounded-xl">
            {location.state.response.subject.department.name}
          </p>
        </div>
        <div>
          <h2>Semester : </h2>
          <p className="border-2 border-indigo-200 py-1 pr-10 pl-1 rounded-xl">
            {location.state.response.semester}
          </p>
        </div>
      </div>
      <br />
      <br />
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Student Attendance</h3>
        <h3 className="text-xl font-bold">
          Date : {new Date().toLocaleDateString()}
        </h3>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : students &&
        attendances &&
        students.length > 0 &&
        attendances.length > 0 ? (
        <div className="overflow-x-auto p-4">
          <p>Total Students : {students.length}</p>
          <table className="min-w-full border border-gray-300 shadow-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Roll Number</th>
                <th className="border px-4 py-2">First Name</th>
                <th className="border px-4 py-2">Last Name</th>
                <th className="border px-4 py-2">Gender</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index} className="text-center">
                  <td className="border px-4 py-2">{student.rollNumber}</td>
                  <td className="border px-4 py-2">
                    {capitalize(student.firstName)}
                  </td>
                  <td className="border px-4 py-2">
                    {capitalize(student.lastName)}
                  </td>
                  <td className="border px-4 py-2 capitalize">
                    {student.gender}
                  </td>
                  <td className="border px-4 py-2">{student.email}</td>
                  <td className="border px-4 py-2">
                    <button
                      className={`px-3 py-1 rounded-lg font-bold ${
                        attendances[index].isPresent
                          ? "bg-green-800 text-white"
                          : "bg-gray-400 text-black"
                      }`}
                      onClick={() => {
                        setAttendances((prevAttendances) =>
                          prevAttendances.map((att, i) =>
                            i === index ? { ...att, isPresent: true } : att
                          )
                        );
                      }}
                    >
                      Present
                    </button>
                    <button
                      className={`ml-2 px-3 py-1 rounded-lg font-bold ${
                        attendances[index].isPresent
                          ? "bg-gray-400 text-black"
                          : "bg-red-500 text-white"
                      }`}
                      onClick={() => {
                        setAttendances((prevAttendances) =>
                          prevAttendances.map((att, i) =>
                            i === index ? { ...att, isPresent: false } : att
                          )
                        );
                      }}
                    >
                      Absent
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No students found.</p>
      )}
      <br />
      <br />

      <button
        className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded cursor-pointer"
        onClick={() => {
          // submit attendances to database
          submitAttendances(attendances);
        }}
      >
        Submit Attendances
      </button>
    </>
  );
}

export default AttendanceSheet;
