import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/auth/users");
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <DashboardLayout title="Team Members">
      <div className="card p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={4} className="text-center py-8 text-gray-400">Loading team...</td></tr>
            )}
            {!loading && users.map((u) => (
              <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-800">{u.name}</td>
                <td className="px-5 py-3 text-gray-600">{u.email}</td>
                <td className="px-5 py-3"><StatusBadge value={u.role} /></td>
                <td className="px-5 py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Users;
