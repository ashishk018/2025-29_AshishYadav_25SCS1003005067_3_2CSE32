import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/leads", label: "Leads", icon: "🎯" },
  { to: "/customers", label: "Customers", icon: "👤" },
  { to: "/deals", label: "Deals Pipeline", icon: "💼" },
  { to: "/activities", label: "Activity Logs", icon: "📧" },
];

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="text-lg font-bold text-primary-700">Enterprise CRM</h1>
        <p className="text-xs text-gray-400 mt-0.5">Sales & Customer Management</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        {user?.role === "admin" && (
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <span>⚙️</span>
            Team Members
          </NavLink>
        )}
      </nav>

      <div className="px-4 py-4 border-t border-gray-200 text-xs text-gray-400">
        Logged in as <span className="font-semibold text-gray-600">{user?.role}</span>
      </div>
    </aside>
  );
};

export default Sidebar;
