const express = require("express");
const reportAppRouter = express.Router();

const {
  getAllReports,
  createReport,
  getReport,
  updateReport,
  deleteReport,
} = require("../controller/tasks");

reportAppRouter
  .get("/", getAllReports)
  .post("/", createReport)
  .get("/:id", getReport)
  .patch("/:id", updateReport)
  .delete("/:id", deleteReport);

module.exports = reportAppRouter;
