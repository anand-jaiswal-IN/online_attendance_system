import React, { useState, useEffect, use } from "react";
import api from "../../apis/axiosInstance";
import convertTo12Hour from "../../helpers/func";
import { useNavigate } from "react-router-dom";

function Subjects() {
  const navigate = useNavigate();

  const isWithinTimeRange = (startTime, endTime) => {
    const currentTime = new Date();
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const start = new Date();
    start.setHours(startHours, startMinutes, 0);

    const end = new Date();
    end.setHours(endHours, endMinutes, 0);

    return currentTime >= start && currentTime <= end;
  };

  const [assignedSubjects, setAssignedSubjects] = useState([]);

  useEffect(() => {
    async function fetchTeacherAssignedSubjects() {
      await api
        .get("/teacher/assigned-subjects", {
          params: {
            teacherId: JSON.parse(localStorage.getItem("user")).id,
          },
        })
        .then((response) => {
          setAssignedSubjects(response.data.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    fetchTeacherAssignedSubjects();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* {stats.map(function (stat, index) {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })} */}
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Today's Schedule
        </h2>
        <div className="space-y-4">
          {assignedSubjects.map((i) => {
            return (
              <div
                key={i.id}
                className="flex items justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg"
              >
                <div className="">
                  <p className="text-sm font-medium text-gray-900">
                    {convertTo12Hour(i.startTime)} -{" "}
                    {convertTo12Hour(i.endTime)}
                  </p>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    {i.subject.name}{" "}
                    <span className="text-gray-500">
                      {" "}
                      ({i.subject.subjectCode}){" "}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {i.subject.department.name}
                  </p>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    Semester : {i.semester}
                  </p>
                </div>
                <div>
                  <button
                    className={
                      "bg-green-600  text-white font-bold py-2 px-4 rounded " +
                      (!isWithinTimeRange(i.startTime, i.endTime)
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-green-700 cursor-pointer")
                    }
                    onClick={() => {
                      if (isWithinTimeRange(i.startTime, i.endTime)) {
                        navigate("/dashboard-teacher/attendance", {
                          state: {
                            response: i,
                          }, // Pass subject data
                        });
                      }
                    }}
                    // disabled={!isWithinTimeRange(i.startTime, i.endTime)}
                  >
                    Take Attendance
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Subjects;
