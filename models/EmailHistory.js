const mongoose = require("mongoose");

const emailHistorySchema = new mongoose.Schema(
  {
    subject: String,
    msg: String,
    recipients: [String],
    status: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmailHistory", emailHistorySchema);
