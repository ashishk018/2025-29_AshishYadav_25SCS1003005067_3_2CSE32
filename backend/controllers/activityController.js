const asyncHandler = require("express-async-handler");
const Activity = require("../models/Activity");

// @desc    Get activities (optionally filtered by related entity)
// @route   GET /api/activities?relatedType=Lead&relatedId=xxx
// @access  Private
const getActivities = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.relatedType && req.query.relatedId) {
    filter["relatedTo.type"] = req.query.relatedType;
    filter["relatedTo.id"] = req.query.relatedId;
  }

  if (req.user.role !== "admin") {
    filter.performedBy = req.user._id;
  }

  const activities = await Activity.find(filter)
    .populate("performedBy", "name email")
    .sort({ createdAt: -1 });

  res.json(activities);
});

// @desc    Create new activity log
// @route   POST /api/activities
// @access  Private
const createActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.create({
    ...req.body,
    performedBy: req.user._id,
  });
  res.status(201).json(activity);
});

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private
const updateActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);
  if (!activity) {
    res.status(404);
    throw new Error("Activity not found");
  }
  const updated = await Activity.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json(updated);
});

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private
const deleteActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);
  if (!activity) {
    res.status(404);
    throw new Error("Activity not found");
  }
  await activity.deleteOne();
  res.json({ message: "Activity removed" });
});

module.exports = { getActivities, createActivity, updateActivity, deleteActivity };
