const Spreadsheet = require("../models/Spreadsheet");

exports.getSpreadsheet = async (req, res) => {
  try {
    const { owner } = req.query; // Fetch owner from query parameters
    const spreadsheet = await Spreadsheet.find({ owner: owner });

    if (!spreadsheet || spreadsheet.length === 0) {
      return res.status(404).json({ msg: "Spreadsheet not found" });
    }

    res.json(spreadsheet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.createSpreadsheet = async (req, res) => {
  try {
    const { name, owner, collaborators, cells } = req.body; // Assuming the frontend sends these fields
    console.log(req.body);

    // Create a new spreadsheet document
    const newSpreadsheet = new Spreadsheet({
      name: name || "NewSpreadSheet", // Default name if none is provided
      owner: owner, // The authenticated user's ID (assumes user is authenticated)
      collaborators: collaborators || [], // Optional collaborators
      cells: cells || [], // Optional initial cells
      versions: [], // Initialize with an empty array for versions
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Save the new spreadsheet to the database
    await newSpreadsheet.save();

    // Respond with the newly created spreadsheet
    res.status(201).json(newSpreadsheet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getAllSpreadsheetsForUser = async (req, resp) => {
  try {
    // const userId = req.user.id;
    const spreadsheets = await Spreadsheet.find({});
    resp.send(spreadsheets);
  } catch (err) {
    console.error(err.message);
    resp.status(500).send("Server Error");
  }
};

//get spreadsheet by id
exports.getSpreadsheetById = async (req, res) => {
  try {
    const spreadsheet = await Spreadsheet.findById(req.params.id);

    if (!spreadsheet) {
      return res.status(404).json({ msg: "Spreadsheet not found" });
    }

    res.json(spreadsheet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
// exports.updateCell = async (req, res) => {
//   try {
//     const { name, address, value } = req.body;
//     const spreadsheet = await Spreadsheet.findOne({ name: name });
//     console.log(req.body);
//     console.log("hello");
//     if (!spreadsheet) {
//       const { name, owner, collaborators, cells } = req.body; // Assuming the frontend sends these fields

//       // Create a new spreadsheet document
//       const newSpreadsheet = new Spreadsheet({
//         name: name || "Untitled Spreadsheet", // Default name if none is provided
//         owner: owner, // The authenticated user's ID (assumes user is authenticated)
//         collaborators: collaborators || [], // Optional collaborators
//         cells: cells || [], // Optional initial cells
//         versions: [], // Initialize with an empty array for versions
//         createdAt: Date.now(),
//         updatedAt: Date.now(),
//       });

//       // Save the new spreadsheet to the database
//       await newSpreadsheet.save();
//     }

//     const cell = spreadsheet.cells.find((cell) => cell.address === address);

//     if (cell) {
//       cell.value = value;
//     } else {
//       spreadsheet.cells.push({ address, value });
//     }

//     spreadsheet.updatedAt = Date.now();
//     await spreadsheet.save();

//     res.json(spreadsheet);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// };

//update by id
exports.updateCell = async (req, res) => {
  try {
    const { id } = req.params.id; // Get the spreadsheet ID from the URL
    const { address, value } = req.body; // Get cell address and new value from the request body

    console.log(id);
    console.log(address);
    console.log(value);

    // Find the spreadsheet by its MongoDB ID
    const spreadsheet = await Spreadsheet.findById(req.params.id);

    if (!spreadsheet) {
      return res.status(404).json({ msg: "Spreadsheet not found" });
    }

    // Find the cell by its address
    const cell = spreadsheet.cells.find((cell) => cell.address === address);

    if (cell) {
      // Update the cell value if it exists
      cell.value = value;
    } else {
      // If the cell does not exist, add a new cell with the given address and value
      spreadsheet.cells.push({ address: address, value: value });
    }

    // Update the timestamp
    spreadsheet.updatedAt = Date.now();

    // Save the updated spreadsheet to the database
    await spreadsheet.save();

    // Respond with the updated spreadsheet
    res.json(spreadsheet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Helper function to convert column letters to index (e.g., A -> 0, B -> 1, Z -> 25, AA -> 26)
const colToIndex = (col) => {
  let index = 0;
  for (let i = 0; i < col.length; i++) {
    index = index * 26 + (col.charCodeAt(i) - "A".charCodeAt(0) + 1);
  }
  return index - 1;
};

const calculateFormula = (formula, spreadsheet) => {
  const rangeRegex = /([A-Z]+)(\d+):([A-Z]+)(\d+)/; // Matches something like A1:A10
  const match = formula.match(rangeRegex);

  if (!match) {
    throw new Error("Invalid formula format");
  }

  const [, startCol, startRow, endCol, endRow] = match;

  const startRowIndex = parseInt(startRow, 10) - 1;
  const endRowIndex = parseInt(endRow, 10) - 1;
  const startColIndex = colToIndex(startCol);
  const endColIndex = colToIndex(endCol);

  let values = [];

  for (let row = startRowIndex; row <= endRowIndex; row++) {
    for (let col = startColIndex; col <= endColIndex; col++) {
      const cell = spreadsheet.cells.find(
        (cell) => cell.row === row && cell.col === col
      );
      if (cell && !isNaN(cell.value)) {
        values.push(parseFloat(cell.value));
      }
    }
  }

  if (formula.startsWith("=SUM")) {
    return values.reduce((acc, val) => acc + val, 0);
  } else if (formula.startsWith("=AVERAGE")) {
    return values.reduce((acc, val) => acc + val, 0) / values.length;
  } else {
    throw new Error("Unsupported formula");
  }
};

exports.addFormula = async (req, res) => {
  const { spreadsheetId, row, col, formula } = req.body;

  try {
    const spreadsheet = await Spreadsheet.findById(spreadsheetId);
    const value = calculateFormula(formula, spreadsheet);

    // Save the calculated value to the spreadsheet
    const cell = spreadsheet.cells.find(
      (cell) => cell.row === row && cell.col === col
    );
    if (cell) {
      cell.value = value;
    } else {
      spreadsheet.cells.push({ row, col, value });
    }

    await spreadsheet.save();
    res.status(200).json({ success: true, value });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error processing formula" });
  }
};

exports.sortData = async (req, res) => {
  const { column, order } = req.body;
  const spreadsheet = await Spreadsheet.findById(req.params.id);

  if (!spreadsheet) {
    return res.status(404).json({ msg: "Spreadsheet not found" });
  }

  // Sorting logic based on the column and order (asc/desc)
  // Sort the `spreadsheet.cells` array

  res.json(spreadsheet);
};

exports.filterData = async (req, res) => {
  const { column, criteria } = req.body;
  const spreadsheet = await Spreadsheet.findById(req.params.id);

  if (!spreadsheet) {
    return res.status(404).json({ msg: "Spreadsheet not found" });
  }

  // Filtering logic based on the column and criteria
  // Filter the `spreadsheet.cells` array

  res.json(spreadsheet);
};

exports.saveVersion = async (req, res) => {
  try {
    const spreadsheet = await Spreadsheet.findById(req.params.id);

    if (!spreadsheet) {
      return res.status(404).json({ msg: "Spreadsheet not found" });
    }

    const version = {
      cells: spreadsheet.cells,
    };

    spreadsheet.versions.push(version);
    await spreadsheet.save();

    res.json(spreadsheet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.loadLargeDataset = async (req, res) => {
  // Implement large dataset loading logic
};

exports.deleteSheets = async (req, res) => {
  const result = await Spreadsheet.deleteMany({});
  res.json({
    message: "All spreadsheets have been deleted",
    deletedCount: result.deletedCount,
  });
};
