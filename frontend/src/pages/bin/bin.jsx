import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./bin.css";


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
              <PositionedMenu ID = {folder.folder_id} type={"folder"} name={folder.name}  />
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
                  <PositionedMenu ID = {file.file_id} type={"file"} name={file.name}  />
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

function PositionedMenu({ ID, type, name }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const token = localStorage.getItem("access_token");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRestore = async () => {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("name", name);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/restore/${ID}`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      alert(`${name} has been restored successfully!`);
      setAnchorEl(null);
    } catch (error) {
      alert(`Failed to restore: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      const formData = new FormData();
      formData.append("type",type)
      const response = await fetch(`http://127.0.0.1:8000/api/delete/${ID}`, {
        method: "DELETE",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      alert(`${name} has been permanently deleted.`);
      setAnchorEl(null);
    } catch (error) {
      alert(`Failed to delete: ${error.message}`);
    }
  };

  return (
    <div>
      <Button
        id="options-button"
        aria-controls={open ? "options-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Options
      </Button>
      <Menu
        id="options-menu"
        aria-labelledby="options-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <MenuItem onClick={handleRestore}>Restore {name}</MenuItem>
        <MenuItem onClick={handleDelete}>Delete {name}</MenuItem>
      </Menu>
    </div>
  );
}

export default Recycling_Bin;
