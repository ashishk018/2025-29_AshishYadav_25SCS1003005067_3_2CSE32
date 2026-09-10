const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    value: { type: Number, required: true, default: 0 },
    stage: {
      type: String,
      enum: ["Prospecting", "Qualification", "Proposal", "Negotiation", "Won", "Lost"],
      default: "Prospecting",
    },
    expectedCloseDate: { type: Date },
    probability: { type: Number, min: 0, max: 100, default: 10 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deal", dealSchema);
