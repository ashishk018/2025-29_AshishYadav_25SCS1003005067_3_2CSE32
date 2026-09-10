const asyncHandler = require("express-async-handler");
const Deal = require("../models/Deal");

// @desc    Get all deals
// @route   GET /api/deals
// @access  Private
const getDeals = asyncHandler(async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { owner: req.user._id };
  if (req.query.stage) filter.stage = req.query.stage;

  const deals = await Deal.find(filter)
    .populate("customer", "name company email")
    .populate("owner", "name email")
    .sort({ createdAt: -1 });

  res.json(deals);
});

// @desc    Get single deal
// @route   GET /api/deals/:id
// @access  Private
const getDealById = asyncHandler(async (req, res) => {
  const deal = await Deal.findById(req.params.id)
    .populate("customer", "name company email")
    .populate("owner", "name email");
  if (!deal) {
    res.status(404);
    throw new Error("Deal not found");
  }
  res.json(deal);
});

// @desc    Create new deal
// @route   POST /api/deals
// @access  Private
const createDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.create({
    ...req.body,
    owner: req.body.owner || req.user._id,
  });
  res.status(201).json(deal);
});

// @desc    Update deal (including stage changes for pipeline drag-drop)
// @route   PUT /api/deals/:id
// @access  Private
const updateDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findById(req.params.id);
  if (!deal) {
    res.status(404);
    throw new Error("Deal not found");
  }

  if (req.user.role !== "admin" && deal.owner?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this deal");
  }

  const updatedDeal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json(updatedDeal);
});

// @desc    Delete deal
// @route   DELETE /api/deals/:id
// @access  Private/Admin
const deleteDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findById(req.params.id);
  if (!deal) {
    res.status(404);
    throw new Error("Deal not found");
  }
  await deal.deleteOne();
  res.json({ message: "Deal removed" });
});

module.exports = { getDeals, getDealById, createDeal, updateDeal, deleteDeal };
