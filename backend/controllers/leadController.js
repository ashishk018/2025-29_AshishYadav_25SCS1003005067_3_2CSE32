const asyncHandler = require("express-async-handler");
const Lead = require("../models/Lead");

// @desc    Get all leads (sales users see only their own, admin sees all)
// @route   GET /api/leads
// @access  Private
const getLeads = asyncHandler(async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { assignedTo: req.user._id };

  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
      { company: { $regex: req.query.search, $options: "i" } },
    ];
  }

  const leads = await Lead.find(filter)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.json(leads);
});

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
const getLeadById = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }
  res.json(lead);
});

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
const createLead = asyncHandler(async (req, res) => {
  const lead = await Lead.create({
    ...req.body,
    createdBy: req.user._id,
    assignedTo: req.body.assignedTo || req.user._id,
  });
  res.status(201).json(lead);
});

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }

  if (req.user.role !== "admin" && lead.assignedTo?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this lead");
  }

  const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json(updatedLead);
});

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private/Admin
const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }
  await lead.deleteOne();
  res.json({ message: "Lead removed" });
});

module.exports = { getLeads, getLeadById, createLead, updateLead, deleteLead };
