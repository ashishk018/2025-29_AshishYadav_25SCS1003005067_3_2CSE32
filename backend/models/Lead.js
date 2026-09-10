const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    source: {
      type: String,
      enum: ["Website", "Referral", "Cold Call", "Social Media", "Advertisement", "Other"],
      default: "Other",
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Unqualified", "Converted"],
      default: "New",
    },
    notes: { type: String, trim: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
