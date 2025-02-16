import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./bin.css";

// Menu imports
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function Recycling_Bin() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/bin/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setFolders(data?.folders || []);
        setFiles(data?.files || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="container">
      <h1>Recycling Bin</h1>

      <h2>Folders</h2>
      {folders.length === 0 ? (
        <p>No folders found.</p>
      ) : (
        <ul>
          {folders.map((folder) => (
            <li key={folder.folder_id}>
              <Link to={`/folder/${folder.folder_id}`}>{folder.name}</Link>
              <PositionedMenu />
            </li>
          ))}
        </ul>
      )}

      <h2>Files</h2>
      <div className="file-list">
        {files.length === 0 ? (
          <p>No files found.</p>
        ) : (
          <ul>
            {files.map((file) => (
              <li key={file.file_id}>
                <div className="File">
                  <p>{file.name}</p>
                  {file.file_url ? (
                    <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                      Open File
                    </a>
                  ) : (
                    <p>No preview available</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function PositionedMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleRestore = () => {
    setAnchorEl(null);
  };
  const handleDelete = () =>{

  };

  return (
    <div>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Dashboard
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleDelete}>Delete [X]</MenuItem>
        <MenuItem onClick={handleRestore }>My account</MenuItem>

      </Menu>
    </div>
  );
}

export default Recycling_Bin;
