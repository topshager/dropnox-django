import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Home from "./pages/home/home";
import Uploader from "./pages/upload/upload";
import Upload_folder from "./pages/folder_upload/folder_upload";
import Folder from "./pages/folder/folder";
import New_folder from "./pages/new_folder/new_folder";
import Logins from "./pages/login/loginTest";
import Edit from "./pages/edit/edit";
import "./App.css";
import TestComponent from "./pages/home/test";
import Bin from "./pages/bin/bin_Api";
import Recycling_Bin from "./pages/bin/bin";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Layout({ children }) {
  const location = useLocation();
  const excludedPaths = ["/"];
  const id = localStorage.getItem("id");

  return (
    <div className="moor">
      {!excludedPaths.includes(location.pathname) && (
        <>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Dropdown Button
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href={`/uploader/${id}`}>File Upload</Dropdown.Item>
            <Dropdown.Item href={`/upload_folder/${id}`}>Folder Upload</Dropdown.Item>
            <Dropdown.Item href="/new_folder">New Folder</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

      <nav>
        <ul>
          <li>
            <a id="btn" href="/">Login</a>
          </li>
          <li>
            <a id="btn" href="/register">Register</a>
          </li>
          <li>
            <a id="btn" href="/home">Home</a>
            <a id="btn" href="/bin">DEL</a>
            <a id="btn" href="/edit">Edit</a>
          </li>
        </ul>
      </nav>
      </>
      )}
      {children}
    </div>
  );
}

function App() {
  return (
    <Router>
  <Layout>
        <Routes>

          <Route path="/" element={<Login />} />

          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/uploader/:id" element={<Uploader />} />
          <Route path="/upload_folder/:id" element={<Upload_folder />} />
          <Route path="/folder/:folder_id" element={<Folder />} />
          <Route path="/new_folder" element={<New_folder />} />
          <Route path="/test" element={<TestComponent />} />
          <Route path="/bin_Api/:ID" element={<Bin />} />
          <Route path="/edit" element={<Edit />} />
          <Route path="/bin" element={<Recycling_Bin />} />
          <Route path="/loginTest" element={<Logins />} />
        </Routes>
        </Layout>

    </Router>
  );
}

export default App;
