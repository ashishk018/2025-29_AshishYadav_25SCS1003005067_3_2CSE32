const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    address: { type: String, trim: true },
    industry: { type: String, trim: true },
    convertedFromLead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
    accountOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
