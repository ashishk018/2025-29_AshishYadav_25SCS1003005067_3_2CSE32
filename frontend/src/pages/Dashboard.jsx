import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const StatCard = ({ label, value, icon, accent }) => (
  <div className="card flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
    <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl ${accent}`}>{icon}</div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/dashboard");
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <p className="text-gray-400">Loading dashboard...</p>
      </DashboardLayout>
    );
  }

  const chartData = (stats?.dealsByStage || []).map((d) => ({ stage: d._id, count: d.count }));

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Leads" value={stats.totals.totalLeads} icon="🎯" accent="bg-blue-50" />
        <StatCard label="Total Customers" value={stats.totals.totalCustomers} icon="👤" accent="bg-purple-50" />
        <StatCard label="Open Deals" value={stats.totals.openDeals} icon="💼" accent="bg-yellow-50" />
        <StatCard label="Won Deals" value={stats.totals.wonDeals} icon="🏆" accent="bg-green-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Revenue Won</p>
          <p className="text-3xl font-bold text-green-600">₹{stats.revenueWon.toLocaleString("en-IN")}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Pipeline Value (Open Deals)</p>
          <p className="text-3xl font-bold text-primary-600">₹{stats.pipelineValue.toLocaleString("en-IN")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <p className="font-semibold text-gray-700 mb-4">Deals by Stage</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <p className="font-semibold text-gray-700 mb-4">Recent Activity</p>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {stats.recentActivities.length === 0 && (
              <p className="text-sm text-gray-400">No activity logged yet.</p>
            )}
            {stats.recentActivities.map((a) => (
              <div key={a._id} className="flex items-start gap-3 text-sm border-b border-gray-100 pb-2">
                <span className="mt-0.5">
                  {a.type === "Email" ? "📧" : a.type === "Call" ? "📞" : a.type === "Meeting" ? "🤝" : "📝"}
                </span>
                <div>
                  <p className="text-gray-700 font-medium">{a.subject}</p>
                  <p className="text-gray-400 text-xs">
                    {a.performedBy?.name} • {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
