function AdminDashboard() {
  return (
    <div className="w-64 min-h-screen bg-gray-800 text-white p-5">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <nav className="space-y-3">
        <NavLink
          to="/hod"
          className={({ isActive }) =>
            isActive ? "block p-2 bg-gray-600 rounded" : "block p-2"
          }
        >
          Head of Department
        </NavLink>
        <NavLink
          to="/teachers"
          className={({ isActive }) =>
            isActive ? "block p-2 bg-gray-600 rounded" : "block p-2"
          }
        >
          Teachers
        </NavLink>
        <NavLink
          to="/students"
          className={({ isActive }) =>
            isActive ? "block p-2 bg-gray-600 rounded" : "block p-2"
          }
        >
          Students
        </NavLink>
      </nav>
    </div>
  );
}

export default AdminDashboard;
