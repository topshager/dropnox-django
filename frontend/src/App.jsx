import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Home from "./pages/home/home";


function App() {
  return (
    <Router>
            <div>
            <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Dropdown Button
        </Dropdown.Toggle>
    <Dropdown.Menu>
      <Dropdown.Item href="#/action">file upload</Dropdown.Item>
      <Dropdown.Item href="#/action"> folder upload</Dropdown.Item>
      <Dropdown.Item href="#/action">New folder</Dropdown.Item>
      </Dropdown.Menu>
      </Dropdown>
              <nav>
          <ul>
            <li>
              <a href="/">login</a>
            </li>
            <li>
              <a href="/register">register</a>
            </li>
          </ul>
        </nav>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />}/>
      <Route path="/home" element={<Home/>}/>
    </Routes>
    </div>
  </Router>
  );
};

export default App
