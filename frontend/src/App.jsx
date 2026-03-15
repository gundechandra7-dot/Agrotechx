import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { LanguageProvider } from "./context/LanguageContext";

import Home from "./pages/Home";
import AskQuestion from "./pages/AskQuestion";
import Disease from "./pages/Disease";
import Crop from "./pages/Crop";
import Weather from "./pages/Weather";
import WhatToGrow from "./pages/WhatToGrow";

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ask" element={<AskQuestion />} />
          <Route path="/disease" element={<Disease />} />
          <Route path="/crop" element={<Crop />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/grow" element={<WhatToGrow />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}