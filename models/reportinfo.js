const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reportNo: String,
  date: Date,
  customerName: String,
  jobscope: String,
  countermeasure: String,
});

module.exports = mongoose.model("Report", reportSchema);
