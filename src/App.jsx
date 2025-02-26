import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import UpadateUser from "./pages/UpadateUser";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/create" element={<CreateUser />} />
          <Route path="/update/:id" element={<UpadateUser />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
