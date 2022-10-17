import React from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import NavBar from "./components/NavBar";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/LoginPage";

const App: React.FC = () => {
  return (
    <div className="App">
      <NavBar />
      <div className="App_body">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
