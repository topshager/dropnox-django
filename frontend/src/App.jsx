import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Home from "./pages/home/home";
import Uploader from "./pages/upload/upload";
import upload_folder from "./pages/folder_upload/folder_upload/"
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <Router>
            <div>
            <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Dropdown Button
        </Dropdown.Toggle>
    <Dropdown.Menu>
      <Dropdown.Item href="/uploader">file upload</Dropdown.Item>
      <Dropdown.Item href="/upload_folder"> folder upload</Dropdown.Item>
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
            <li>
            <a href="/home">home</a>
            </li>
          </ul>
        </nav>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/uploader" element={<Uploader/>}/>
      <Route path="/upload_folder" element={<upload_folder/>}/>
    </Routes>
    </div>
  </Router>
  );
};

export default App
