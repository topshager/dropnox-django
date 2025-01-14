import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login";
import Register from "./pages/register/register";

function App() {
  return (
    <Router>
            <div>
              <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
          </ul>
        </nav>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />}/>
    </Routes>
    </div>
  </Router>
  );
};

export default App
