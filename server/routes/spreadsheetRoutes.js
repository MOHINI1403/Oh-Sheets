const express = require("express");
const {
  getSpreadsheet,
  getAllSpreadsheetsForUser,
  createSpreadsheet,
  updateCell,
  addFormula,
  sortData,
  filterData,
  saveVersion,
  loadLargeDataset,
  deleteSheets,
  getSpreadsheetById,
} = require("../controllers/spreadsheetController");
// const { authenticate } = require('../middlewares/auth');
const router = express.Router();

router.get("/owner", getSpreadsheet);

router.get("/", getAllSpreadsheetsForUser);

router.post("/", createSpreadsheet);

router.delete("/delete", deleteSheets);
router.get("/id/:id", getSpreadsheetById);
// router.put('/cell', updateCell);
router.put("/cell/:id", updateCell);

router.put("/:id/formula", addFormula);

router.put("/:id/sort", sortData);

router.put("/:id/filter", filterData);

router.post("/:id/version", saveVersion);

router.get("/:id/large-dataset", loadLargeDataset);

module.exports = router;
