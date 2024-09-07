/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from "react";
import { SpreadsheetComponent } from "@syncfusion/ej2-react-spreadsheet";
import io from "socket.io-client";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import Nav from "./Nav";

// const link = import.meta.env.REACT_APP_URI;
// const link = import.meta.env.VITE_REACT_APP_URI;
// console.log(link);

const socket = io("https://socialcalc-internal.onrender.com/");

export default function ExcelSheet() {
  const { user } = useUser();
  const userEmail = user.primaryEmailAddress.emailAddress;
  const spreadsheetRef = useRef(null);
  const { id: sheetId } = useParams(); // Get the sheetId from the URL

  const [spreadsheet, setSpreadsheet] = useState(null);
  const [activeCells, setActiveCells] = useState({});
  const [cellOverlays, setCellOverlays] = useState({});
  const [lockedCells, setLockedCells] = useState({});

  useEffect(() => {
    const fetchSpreadsheet = async () => {
      try {
        socket.on('connect', () => {
          console.log('Socket connected');
        });
        const response = await axios.get(
          `https://socialcalc-internal.onrender.com/api/spreadsheet/id/${sheetId}`
        );
        setSpreadsheet(response.data);
        console.log(response.data);

        response.data.cells.map((cell) => {
          console.log(cell);
          spreadsheetRef.current?.updateCell(
            { value: cell.value },
            cell.address
          );
        });
        socket.emit("joinSpreadsheet", sheetId);
      } catch (err) {
        console.error("Error fetching spreadsheet:", err);
      }
    };

    if (sheetId) {
      fetchSpreadsheet();
    }
    return () => {
      socket.off('connect');
    }
  }, [sheetId]);

  const handleCellSelected = (args) => {
    const { range } = args;
    const userInitial = userEmail.charAt(0).toUpperCase();

    console.log(range);

    if (lockedCells[range] && lockedCells[range] !== userEmail) {
      alert(`Cell ${range} is currently being edited by another user.`);
      return;
    }

    socket.emit("activeCellChange", {
      range: range,
      userEmail: userEmail,
      userInitial,
      room: sheetId
    });

    // Update the locked cells
    setLockedCells((prev) => ({ ...prev, [range]: userEmail }));
    setActiveCells((prev) => {
      const newActiveCells = { ...prev };
      if (newActiveCells[userEmail]) {
          // Notify the other users about the cell being deselected
          socket.emit("activeCellChange", {
              range: newActiveCells[userEmail],
              userEmail: userEmail,
              userInitial,
              room: sheetId,
              deselect: true
          });
      }
      return { ...newActiveCells, [userEmail]: range };
  });

  };

  const updateCellValue = async (cellAddress, newValue) => {
    try {
      const response = await axios.put(
        `https://socialcalc-internal.onrender.com/api/spreadsheet/cell/${sheetId}`,
        {
          address: cellAddress,
          value: newValue,
        }
      );

      console.log(`Cell ${cellAddress} updated to: ${newValue}`);
      console.log("Response:", response.data);
    } catch (err) {
      console.error("Error updating cell:", err);
    }
  };

  const handleActionComplete = (args) => {
    if (args.action === "cellSave") {
      const { address, value } = args.eventArgs;
      updateCellValue(address, value);
      socket.emit("spreadsheetChange", {
        type: "cellSave",
        address,
        value,
        userEmail: userEmail,
        room: sheetId
      });

      setLockedCells((prev) => {
        const updatedLocks = { ...prev };
        delete updatedLocks[address];
        return updatedLocks;
      });

      setCellOverlays((prev) => {
        const updatedOverlays = { ...prev };
        delete updatedOverlays[address];
        return updatedOverlays;
      });
    } else if (args.action === "insert") {
      console.log("Sheet inserted");
      socket.emit("spreadsheetChange", {
        type: "insert",
        sheetIndex: args.eventArgs.activeSheetIndex,
        room: sheetId
      });
    } else if (args.action === "removeSheet") {
      const index = args.eventArgs.index;
      console.log(`Sheet deleted at index ${index}`);
      socket.emit("spreadsheetChange", {
        type: "removeSheet",
        toBeDeletedIndex: index,
        room: sheetId
      });
    } else if (args.action === "format") {
      const { range, style } = args.eventArgs;
      console.log(`Cell ${range} format changed:`, style);
      socket.emit("spreadsheetChange", { type: "format", range, style, room: sheetId });
    } else if (args.action === "delete") {
      const { startIndex, endIndex, modelType } = args.eventArgs;
      console.log(
        `${modelType} number(s) ${startIndex} to ${endIndex} deleted`
      );
      socket.emit("spreadsheetChange", {
        type: "delete",
        args: args,
        room: sheetId
      });
    }
  };

  useEffect(() => {
    socket.on("activeCellChange", (data) => {
      const { range, userEmail: senderEmail, userInitial } = data;
      const spreadsheet = spreadsheetRef.current;

      if (spreadsheet) {
        Object.keys(activeCells).forEach((email) => {
          if (activeCells[email] && email === senderEmail) {
            spreadsheet.cellFormat({ border: "" }, activeCells[email]);
            setCellOverlays((prev) => {
              const updatedOverlays = { ...prev };
              delete updatedOverlays[activeCells[email]];
              return updatedOverlays;
            });
          }
        });

        spreadsheet.cellFormat({ border: "1px solid #000000" }, range);
        setActiveCells((prev) => ({ ...prev, [senderEmail]: range }));
        setCellOverlays((prev) => ({ ...prev, [range]: userInitial }));
      }
    });

    socket.on("spreadsheetChange", (data) => {
      const {
        userEmail: userEmail,
        type,
        address,
        value,
        range,
        style,
        args,
        sheetIndex,
        toBeDeletedIndex,
      } = data;
      const spreadsheet = spreadsheetRef.current;

      if (spreadsheet && type === "cellSave") {
        spreadsheet.updateCell({ value: value }, address);
        setLockedCells((prev) => {
          const updatedLocks = { ...prev };
          delete updatedLocks[address];
          return updatedLocks;
        });
        setCellOverlays((prev) => {
          const updatedOverlays = { ...prev };
          delete updatedOverlays[address];
          return updatedOverlays;
        });
      } else if (type === "format") {
        console.log(`Updating cell ${range} format with:`, style);
        spreadsheet.updateCell({ style: style }, range);
      } else if (type === "delete") {
        console.log(
          `Deleting column(s) ${args.eventArgs.startIndex} to ${args.eventArgs.endIndex}`
        );
        const { startIndex, endIndex } = args.eventArgs;
        spreadsheet.deleteEntireColumn(startIndex, endIndex);
      } else if (type === "insert") {
        console.log(`Inserting sheet at index ${sheetIndex}`);
        spreadsheet.insertSheet(sheetIndex);
      } else if (type === "removeSheet") {
        console.log(`Deleting sheet at index ${toBeDeletedIndex}`);
        spreadsheet.delete(toBeDeletedIndex);
      }
    });

    return () => {
      socket.off("spreadsheetChange");
      socket.off("activeCellChange");
    };
  }, [activeCells, cellOverlays, lockedCells, userEmail]);

  const getCellPosition = (range) => {
    const [cell] = range.split(":");
    const match = cell.match(/^([A-Z]+)(\d+)$/);
    if (!match) return { top: 0, left: 0 };

    const [, col, row] = match;
    const colIndex = col.charCodeAt(0) - 65;
    const rowIndex = parseInt(row, 10) - 1;

    const top = 110 + rowIndex * 20;
    const left = 110 + colIndex * 60;
    return { left, top };
  };

  return (
    <>
      <div id="HELLO" className="w-full h-screen relative">
        <SpreadsheetComponent
          ref={spreadsheetRef}
          actionComplete={handleActionComplete}
          beforeSelect={handleCellSelected}
          allowOpen={true}
          openUrl="https://services.syncfusion.com/react/production/api/spreadsheet/open"
          allowSave={true}
          saveUrl="https://services.syncfusion.com/react/production/api/spreadsheet/save"
        >
          {Object.entries(cellOverlays).map(([range, initial]) => {
            const position = getCellPosition(range);
            return (
              <div
                key={range}
                className="z-10 absolute bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                style={{ top: position.top, left: position.left }}
              >
                {initial}
              </div>
            );
          })}
        </SpreadsheetComponent>
      </div>
    </>
  );
}
