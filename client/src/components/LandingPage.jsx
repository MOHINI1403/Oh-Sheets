import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, FileSpreadsheetIcon } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const userEmail = user.primaryEmailAddress.emailAddress;

  const [spreadsheets, setSpreadsheets] = useState([]); // State to store spreadsheets
  const [spreadsheetName, setSpreadsheetName] = useState(""); // State to store the name of the spreadsheet

  useEffect(() => {
    // Fetch spreadsheets for the user on component mount
    const fetchSpreadsheets = async () => {
      try {
        const response = await axios.get(
          `https://socialcalc-internal.onrender.com/api/spreadsheet/owner?owner=${userEmail}`
        );
        setSpreadsheets(response.data);
      } catch (err) {
        console.error("Error fetching spreadsheets:", err);
      }
    };

    fetchSpreadsheets();
  }, [userEmail]);

  const handleCreateNewSpreadsheet = async () => {
    if (!spreadsheetName.trim()) {
      alert("Please enter a name for the spreadsheet");
      return;
    }

    try {
      const response = await axios.post(
        "https://socialcalc-internal.onrender.com/api/spreadsheet/",
        {
          name: spreadsheetName, // Use the inputted spreadsheet name
          owner: userEmail,
        }
      );
      const newSpreadsheet = response.data;

      // Update state to include the newly created spreadsheet
      setSpreadsheets([...spreadsheets, newSpreadsheet]);
      setSpreadsheetName(""); // Clear the input field after creation

      navigate(`/excel-sheet/${newSpreadsheet._id}`);
    } catch (err) {
      console.error("Error creating new spreadsheet:", err);
    }
  };

  const handleOpenSpreadsheet = (spreadsheetId) => {
    // Navigate to the specific spreadsheet by its ID
    navigate(`/excel-sheet/${spreadsheetId}`, {
      state: { sheetId: spreadsheetId },
    });
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <main className="flex-1 container mx-auto px-4 py-8">
          <section className="mb-12 px-2 flex">
            <input
              type="text"
              value={spreadsheetName}
              onChange={(e) => setSpreadsheetName(e.target.value)}
              placeholder="Enter Spreadsheet Name"
              className="px-4 py-2 rounded w-full sm:w-auto"
            />
            <Button
              size="lg"
              className="w-full mx-2 h-12 sm:w-auto text-lg"
              onClick={handleCreateNewSpreadsheet}
            >
              <PlusIcon className="h-5 w-5  top-10 mr-2" />
              <p>Create New Spreadsheet</p>
            </Button>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              My Spreadsheets
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {spreadsheets.map((sheet) => (
                <Card
                  key={sheet._id}
                  className="hover:shadow-lg border-cyan-800 dark:border-cyan-700 transition-shadow"
                  onClick={() => handleOpenSpreadsheet(sheet._id)}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {sheet.name}
                    </CardTitle>
                    <FileSpreadsheetIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Last edited:{" "}
                      {new Date(sheet.updatedAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </main>
        <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          © 2023 ExcelLike. All rights reserved.
        </footer>
      </div>
    </>
  );
}
