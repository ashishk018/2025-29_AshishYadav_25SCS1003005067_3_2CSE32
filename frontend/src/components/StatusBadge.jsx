import React from "react";

const COLOR_MAP = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-yellow-100 text-yellow-700",
  Qualified: "bg-purple-100 text-purple-700",
  Unqualified: "bg-gray-100 text-gray-600",
  Converted: "bg-green-100 text-green-700",
  Prospecting: "bg-blue-100 text-blue-700",
  Qualification: "bg-purple-100 text-purple-700",
  Proposal: "bg-yellow-100 text-yellow-700",
  Negotiation: "bg-orange-100 text-orange-700",
  Won: "bg-green-100 text-green-700",
  Lost: "bg-red-100 text-red-700",
  admin: "bg-primary-100 text-primary-700",
  sales: "bg-gray-100 text-gray-600",
};

const StatusBadge = ({ value }) => {
  return <span className={`badge ${COLOR_MAP[value] || "bg-gray-100 text-gray-600"}`}>{value}</span>;
};

export default StatusBadge;
