const mongoose = require("mongoose");
// Cell Schema:
const CellSchema = new mongoose.Schema({
  address: String,
  value: String,
});

// Version Schema:
const VersionSchema = new mongoose.Schema({
  cells: [CellSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const spreadSheetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
      // ref:"User"
    },
    collborations: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["Viewer", "Editor"],
          default: "Viewer",
        },
      },
    ],
    cells: [CellSchema],
    versions: [VersionSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Spreadsheet = mongoose.model("Spreadsheet", spreadSheetSchema);

module.exports = Spreadsheet;
