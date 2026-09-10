const asyncHandler = require("express-async-handler");
const Customer = require("../models/Customer");
const Lead = require("../models/Lead");

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
const getCustomers = asyncHandler(async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { accountOwner: req.user._id };

  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
      { company: { $regex: req.query.search, $options: "i" } },
    ];
  }

  const customers = await Customer.find(filter)
    .populate("accountOwner", "name email")
    .sort({ createdAt: -1 });

  res.json(customers);
});

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id).populate("accountOwner", "name email");
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }
  res.json(customer);
});

// @desc    Create new customer (optionally converting a lead)
// @route   POST /api/customers
// @access  Private
const createCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.create({
    ...req.body,
    createdBy: req.user._id,
    accountOwner: req.body.accountOwner || req.user._id,
  });

  // If converting from a lead, mark the lead as Converted
  if (req.body.convertedFromLead) {
    await Lead.findByIdAndUpdate(req.body.convertedFromLead, { status: "Converted" });
  }

  res.status(201).json(customer);
});

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  if (req.user.role !== "admin" && customer.accountOwner?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this customer");
  }

  const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json(updatedCustomer);
});

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private/Admin
const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }
  await customer.deleteOne();
  res.json({ message: "Customer removed" });
});

module.exports = { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer };
