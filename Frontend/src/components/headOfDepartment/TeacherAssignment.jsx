import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import api from "../../apis/axiosInstance";

export function TeacherAssignment() {
  const [showForm, setShowForm] = useState(false);
  const [semester, setSemester] = useState(1);
  const [semesterSubjects, setSemesterSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [assignmentData, setAssignmentData] = useState({
    subjectId: null,
    teacherId: null,
    startTime: null,
    endTime: null,
    semester: null,
  });

  const fetchSubjectBySemester = async () => {
    try {
      const response = await api.get("/headOfDepartment/semesterSubjects", {
        params: {
          departmentId: JSON.parse(localStorage.getItem("user")).departmentId,
          semester: semester,
        },
      });
      setSemesterSubjects(response.data.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  useEffect(() => {
    fetchSubjectBySemester();
  }, [semester]);

  const fetchTeachers = async () => {
    try {
      const response = await api.get("/headOfDepartment/get-all-teachers");
      setTeachers(response.data.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const handleAssignTeacher = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/headOfDepartment/assign-teacher`, {
        subjectId: selectedSubject.id,
        teacherId: assignmentData.teacherId,
        startTime: assignmentData.startTime,
        endTime: assignmentData.endTime,
        semester: assignmentData.semester,
        departmentId: JSON.parse(localStorage.getItem("user")).departmentId,
      });
      alert("Teacher assigned successfully");
      setShowForm(false);
      setAssignmentData({ teacherId: "", startTime: "", endTime: "" });
      fetchSubjectBySemester();
    } catch (error) {
      alert(error.response.data.message);
      console.error("Error assigning teacher:", error);
    }
  };

  const deleteAssignedTeacher = async (id) => {
    await api
      .delete(`/headOfDepartment/assigned-subjects/${id}`, {
        data: {
          departmentId: JSON.parse(localStorage.getItem("user")).departmentId,
        },
      })
      .then((response) => {
        alert(response.data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="mb-6 p-4">
      <h2 className="text-2xl font-[anzo2] text-[#2D62BD]">
        Teacher Assignment
      </h2>
      <br />
      <label htmlFor="semester">Semester: </label>
      <select
        name="semester"
        onChange={(e) => {
          setSemester(e.target.value);
          fetchSubjectBySemester();
        }}
      >
        <option value="1">First</option>
        <option value="2">Second</option>
        <option value="3">Third</option>
        <option value="4">Fourth</option>
        <option value="5">Fifth</option>
        <option value="6">Sixth</option>
        <option value="7">Seventh</option>
        <option value="8">Eighth</option>
      </select>
      <br />
      <br />
      <div>
        {semesterSubjects && semesterSubjects.length > 0 ? (
          semesterSubjects.map((subject) => {
            return (
              <div
                key={subject.id}
                className="border-[1px] flex justify-between items-center p-4 mb-4 rounded-lg"
              >
                <div>
                  <p>Subject Name: {subject.name}</p>
                  <p>Subject Code: {subject.subjectCode}</p>
                  <p>Semester: {subject.semester}</p>
                </div>
                <div>
                  {subject.isAssigned ? (
                    <div>
                      <p>
                        Teacher Name:{" "}
                        {subject.assignedSubject.teacher.firstName}{" "}
                        {subject.assignedSubject.teacher.lastName}
                      </p>
                      <p>
                        Username: {subject.assignedSubject.teacher.username}
                      </p>
                      <p>
                        Department:{" "}
                        {subject.assignedSubject.teacher.department.name}
                      </p>
                      <p>
                        Timing: {subject.assignedSubject.startTime} to{" "}
                        {subject.assignedSubject.endTime}
                      </p>
                      <button
                        onClick={async () => {
                          if (
                            confirm(
                              "Are you sure you want to remove this teacher?"
                            )
                          ) {
                            await deleteAssignedTeacher(
                              subject.assignedSubject.id
                            );

                            window.location.reload();
                          }
                        }}
                        className="bg-red-400"
                      >
                        Remove Teacher
                      </button>
                    </div>
                  ) : (
                    <button
                      className="bg-green-400 px-4 py-2 rounded"
                      onClick={() => {
                        setSelectedSubject(subject);
                        setAssignmentData((prev) => {
                          prev.subjectId = subject.id;
                          prev.semester = subject.semester;
                          return prev;
                        });
                        setShowForm(true);
                        fetchTeachers();
                      }}
                    >
                      Assign this Subject
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p>No subjects found for the selected semester.</p>
        )}
      </div>

      {showForm && selectedSubject && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-10 flex justify-center items-center"
          key={selectedSubject.id}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl mb-4">Assign Teacher</h3>
            <p>Subject Name: {selectedSubject.name}</p>
            <p>Subject Code: {selectedSubject.subjectCode}</p>
            <form onSubmit={handleAssignTeacher}>
              <label htmlFor="teacher">Teacher: </label>
              <select
                name="teacher"
                required
                onChange={(e) =>
                  setAssignmentData((prev) => {
                    prev.teacherId = parseInt(e.target.value);
                    return prev;
                  })
                }
                className="block w-full mb-4 border-gray-300 rounded"
              >
                <option value="">Select Teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.firstName} {teacher.lastName} , @{teacher.username}
                    , {teacher.department.abbrev}
                  </option>
                ))}
              </select>

              <label htmlFor="startTime">Start Time: </label>
              <input
                type="time"
                name="startTime"
                required
                onChange={(e) =>
                  setAssignmentData((prev) => {
                    prev.startTime = e.target.value;
                    return prev;
                  })
                }
                className="block w-full mb-4 border-gray-300 rounded"
              />

              <label htmlFor="endTime">End Time: </label>
              <input
                type="time"
                name="endTime"
                required
                onChange={(e) =>
                  setAssignmentData((prev) => {
                    prev.endTime = e.target.value;
                    return prev;
                  })
                }
                className="block w-full mb-4 border-gray-300 rounded"
              />

              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Assign
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherAssignment;
