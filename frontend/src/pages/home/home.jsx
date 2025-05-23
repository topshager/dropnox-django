import React, { useEffect, useState, useRef } from "react";
import "./home.css";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import Button from "react-bootstrap/Button";
import { DndContext } from '@dnd-kit/core';
import { Draggable } from "../Drag_and_drop/Draggable.jsx";
import { Droppable } from "../Drag_and_drop/Droppable.jsx";

function Home() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileUrls, setFileUrls] = useState({});
  const fileUrlsRef = useRef({});
  const [isDropped, setIsDropped] = useState(false);


  const fetchData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://127.0.0.1:8000/api/home/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      const foldersData = data?.data?.folders || [];
      const filesData = data?.data?.files || [];

      setFolders(foldersData);
      setFiles(filesData);

      const fileBlobs = {};
      filesData.forEach((file) => {
        if (file.content) {
          try {
            const byteCharacters = atob(file.content);
            const byteNumbers = new Uint8Array(byteCharacters.length).map((_, i) =>
              byteCharacters.charCodeAt(i)
            );
            const blob = new Blob([byteNumbers], { type: file.type });
            const fileUrl = URL.createObjectURL(blob);
            fileBlobs[file.file_id] = fileUrl;
            fileUrlsRef.current[file.file_id] = fileUrl;
          } catch (error) {
            console.error(`Error decoding file ${file.file_id}:`, error);
          }
        }
      });

      setFileUrls(fileBlobs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message || "Failed to fetch data");
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("id", 0);
    fetchData();

    return () => {
      Object.values(fileUrlsRef.current).forEach(URL.revokeObjectURL);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(); 
    }, 100);

    return () => clearInterval(interval);
  }, []);

  async function moveFileToFolder(fileId, folderId) {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://127.0.0.1:8000/api/move-file/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ file_id: fileId, folder_id: folderId }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      console.log(`File ${fileId} moved to folder ${folderId}`);
      setFiles((prevFiles) => prevFiles.filter((file) => file.file_id !== fileId));
      setIsDropped(true);
    } catch (error) {
      console.error("Error moving file:", error);
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (over && over.id.startsWith('drop-folder-')) {
      const draggedFileId = active.id.replace("file-", "");
      const targetFolderId = over.id.replace("drop-folder-", "");

      moveFileToFolder(draggedFileId, targetFolderId);
    }
  }

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="container">
      <DndContext onDragEnd={handleDragEnd}>
        <h2>Folders</h2>
        {folders.length === 0 ? <p>No folders found.</p> : (
          <ul>
            {folders.map((folder) => (
              <li key={folder.folder_id}>
                <Droppable id={`drop-folder-${folder.folder_id}`}>
                  <div className="drop-area" onDragOver={(e) => e.preventDefault()}>
                    {isDropped ? 'Dropped!' : 'Drop Here'}
                  </div>
                </Droppable>
                <div className="file-Menu">
                  <ThreeDotMenu key={folder.folder_id} ID={folder.folder_id} type="folder" />
                </div>
                <Link to={`/folder/${folder.folder_id}`}>{folder.name}</Link>
              </li>
            ))}
          </ul>
        )}
        <h2>Files</h2>
        <div className="file-list">
          {files.length === 0 ? <p>No files found.</p> : (
            <ul>
              {files.map((file) => (
                <li key={file.file_id}>
                  <Draggable id={`file-${file.file_id}`}>
                    <div
                      draggable
                      onDragStart={(e) =>
                        e.dataTransfer.setData("application/json", JSON.stringify(file))
                      }
                    >
                      <div className="file-Menu"></div>
                      <div className="File">
                        <p>{file.name}</p>
                        <a href={fileUrls[file.file_id]} target="_blank" rel="noopener noreferrer">
                          Open File
                        </a>
                      </div>
                    </div>
                  </Draggable>
                  <ThreeDotMenu key={file.file_id} ID={file.file_id} type="file" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </DndContext>
    </div>
  );
}

function ThreeDotMenu({ ID, type }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [query, setQuery] = useState("");

  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleEditClose = (close) => {
    setPopupOpen(false);
    close(); // Close popup after editing
    setIsOpen(false); // Close menu after editing
  };

  const handleDelete = async () => {
    await deleteItem(ID, type);
    setIsOpen(false); // Close menu after delete
  };
  return (
    <div className={`menu-container ${isOpen ? "active" : ""}`} ref={menuRef}>
      <button className="menu-icon" onClick={toggleMenu}></button>
      {isOpen && (
        <div className="dropdown-menu">
          <Button onClick={() => setPopupOpen(true)}>Edit</Button>
          <Popup open={isPopupOpen} onClose={() => setPopupOpen(false)} modal nested>
            {(close) => (
              <div className="popup-content">
                <input name="query" value={query} onChange={(e) => setQuery(e.target.value)} />
                <button type="submit">Submit</button>
                <Button onClick={close}>Close</Button>
              </div>
            )}
          </Popup>
          <button onClick={() => deleteItem(ID, type)}>Delete</button>
          <Link to={`/share/${ID}/${type}`}>Share</Link>
        </div>
      )}
    </div>
  );
}

ThreeDotMenu.propTypes = {
  ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.string.isRequired,
};

const deleteItem = async (ID, type) => {
  const token = localStorage.getItem("access_token");
  const data = { type: type };

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/bin_Api/${ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Success:", result);
  } catch (err) {
    console.error("Error moving to bin:", err.message);
  }
};

export default Home;
