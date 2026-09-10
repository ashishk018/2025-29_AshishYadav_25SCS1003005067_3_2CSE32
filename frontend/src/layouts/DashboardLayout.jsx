import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = ({ title, children }) => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title={title} />
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
