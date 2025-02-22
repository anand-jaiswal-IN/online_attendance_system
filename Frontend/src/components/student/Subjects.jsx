import { useEffect, useId, useState } from "react";
import api from "../../apis/axiosInstance";

function Subjects() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const subjects = await api.get(
          "/student/know-attendance-of-your-subjects",
          {
            params: {
              semester: JSON.parse(localStorage.getItem("user"))
                .presentSemester,
              departmentId: JSON.parse(localStorage.getItem("user"))
                .departmentId,
              studentId: JSON.parse(localStorage.getItem("user")).id,
            },
          }
        );
        setSubjects(subjects.data.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    }
    fetchSubjects();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
        Your Subjects
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects &&
          subjects.map((subject) => (
            <div
              key={subject.id}
              className="group bg-white rounded-xl shadow-lg p-6 border-t-4 border-pink-500 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              <h2 className="text-xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent group-hover:from-fuchsia-500 group-hover:to-purple-500 transition-all duration-300">
                {subject.name}
              </h2>
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent group-hover:from-fuchsia-500 group-hover:to-purple-500 transition-all duration-300">
                {subject.subjectCode}
              </h3>
              <p>Total Classes : {subject.attendance.length}</p>
              <p>
                Present Classes :{" "}
                {
                  subject.attendance.filter(
                    (attendance) => attendance.isPresent
                  ).length
                }
              </p>
              <p>
                Percentage :{" "}
                {(
                  (subject.attendance.filter(
                    (attendance) => attendance.isPresent
                  ).length /
                    subject.attendance.length) *
                  100
                ).toFixed(2)}
                %
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
export default Subjects;
