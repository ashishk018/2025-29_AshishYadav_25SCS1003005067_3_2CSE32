const asyncHandler = require("express-async-handler");
const Lead = require("../models/Lead");
const Customer = require("../models/Customer");
const Deal = require("../models/Deal");
const Activity = require("../models/Activity");

// @desc    Get dashboard summary stats
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const scopeFilter = req.user.role === "admin" ? {} : { owner: req.user._id };
  const leadScopeFilter = req.user.role === "admin" ? {} : { assignedTo: req.user._id };
  const customerScopeFilter = req.user.role === "admin" ? {} : { accountOwner: req.user._id };

  const [totalLeads, totalCustomers, totalDeals, wonDeals, lostDeals, openDeals] = await Promise.all([
    Lead.countDocuments(leadScopeFilter),
    Customer.countDocuments(customerScopeFilter),
    Deal.countDocuments(scopeFilter),
    Deal.countDocuments({ ...scopeFilter, stage: "Won" }),
    Deal.countDocuments({ ...scopeFilter, stage: "Lost" }),
    Deal.countDocuments({ ...scopeFilter, stage: { $nin: ["Won", "Lost"] } }),
  ]);

  const dealsByStage = await Deal.aggregate([
    { $match: scopeFilter },
    { $group: { _id: "$stage", count: { $sum: 1 }, totalValue: { $sum: "$value" } } },
  ]);

  const revenueWon = await Deal.aggregate([
    { $match: { ...scopeFilter, stage: "Won" } },
    { $group: { _id: null, total: { $sum: "$value" } } },
  ]);

  const pipelineValue = await Deal.aggregate([
    { $match: { ...scopeFilter, stage: { $nin: ["Won", "Lost"] } } },
    { $group: { _id: null, total: { $sum: "$value" } } },
  ]);

  const leadsByStatus = await Lead.aggregate([
    { $match: leadScopeFilter },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const recentActivities = await Activity.find(
    req.user.role === "admin" ? {} : { performedBy: req.user._id }
  )
    .populate("performedBy", "name")
    .sort({ createdAt: -1 })
    .limit(10);

  res.json({
    totals: { totalLeads, totalCustomers, totalDeals, wonDeals, lostDeals, openDeals },
    dealsByStage,
    leadsByStatus,
    revenueWon: revenueWon[0]?.total || 0,
    pipelineValue: pipelineValue[0]?.total || 0,
    recentActivities,
  });
});

module.exports = { getDashboardStats };
