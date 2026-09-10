const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Call", "Email", "Meeting", "Note", "Task"],
      required: true,
    },
    subject: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    relatedTo: {
      type: { type: String, enum: ["Lead", "Customer", "Deal"], required: true },
      id: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "relatedTo.type" },
    },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dueDate: { type: Date },
    completed: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
