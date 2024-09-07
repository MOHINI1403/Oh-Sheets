// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExcelSheet from "./components/ExcelSheet"; // Ensure this is the correct path to your ExcelSheet component
import LandingPage from "./components/LandingPage";
import "./App.css";
import Nav from "./components/Nav";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/excel-sheet/:id"
          element={
            <ExcelSheet>
              <Nav />
            </ExcelSheet>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
