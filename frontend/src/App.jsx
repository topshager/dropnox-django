import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Home from "./pages/home/home";
import Uploader from "./pages/upload/upload";
import Upload_folder from "./pages/folder_upload/folder_upload";
import Folder from "./pages/folder/folder";
import  New_folder from "./pages/new_folder/new_folder";
import './App.css';
import TestComponent from "./pages/home/test";
import Bin from "./pages/bin/bin_Api";
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  const id = localStorage.getItem("id")
  console.log(id)


  return (
    <Router>
            <div>
            <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Dropdown Button
        </Dropdown.Toggle>
    <Dropdown.Menu>
      <Dropdown.Item href="/uploader/<int:id>">file upload</Dropdown.Item>
      <Dropdown.Item href="/upload_folder/<int:id>"> folder upload</Dropdown.Item>
      <Dropdown.Item href="/new_folder">New folder</Dropdown.Item>
      </Dropdown.Menu>
      </Dropdown>
              <nav>
          <ul>
            <li>
              <a id="btn" href="/">login</a>
            </li>
            <li>
              <a id="btn" href="/register">register</a>
            </li>
            <li>
            <a id="btn" href="/home">home</a>
            <a id="btn" href="/bin_Api">   DEL</a>
            </li>
          </ul>
        </nav>
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/register" element={<Register />}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/uploader/<int:id>" element={<Uploader/>}/>
      <Route path="/upload_folder/<int:id>" element={<Upload_folder/>}/>
      <Route path="/folder/:folder_id" element={<Folder/>}/>
      <Route path="/new_folder" element={<New_folder/>}/>
      <Route path="/test" element={<TestComponent/>}/>
      <Route path="/bin_Api/:ID" element={<Bin/>}/>
    </Routes>
    </div>
  </Router>
  );
};

export default App
