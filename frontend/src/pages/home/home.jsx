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
  const [parent, setParent] = useState(null);
  const[isDropped,setIsDropped] = useState(false)





  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const fetchData = async () => {
      try {
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

    fetchData();

    return () => {
      Object.values(fileUrlsRef.current).forEach(URL.revokeObjectURL);
    };
  }, []);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="container">
      <DndContext onDragEnd={handleDragEnd}>
      <h1>Home</h1>

      <h2>Folders</h2>
      {folders.length === 0 ? (
        <p>No folders found.</p>

      ) :(
        <ul>
          {folders.map((folder) => (
            <li key={folder.folder_id}>


               <Droppable id="drop-area">
               {!isDropped ? 'Dropped' : null}

              <div className="file-Menu">
                <ThreeDotMenu ID={folder.folder_id} type={"folder"} name={folder.name} />
              </div>
              <Link to={`/folder/${folder.folder_id}`}>{folder.name}</Link>
              {isDropped ? 'Dropped!' : 'Drop Here'}
              </Droppable>

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
                <Draggable id={`file-${file.file_id}`}>
                <div className="file-Menu">

                  <ThreeDotMenu ID={file.file_id} type={"file"} name={file.name} />
                </div>

                <div className="File">
                  <p>{file.name}</p>
                  <a href={fileUrls[file.file_id]} target="_blank" rel="noopener noreferrer">
                    Open File
                  </a>
                </div>
                </Draggable>

              </li>

            )

          )

            }
          </ul>

        )}
      </div>
      </DndContext>
    </div>

  );
  function handleDragEnd(event) {
    const { active, over } = event;
    if (over && over.id.startWith('drop-area')) {
      const draggedFileId = active.id.replace("file-","");
      console.log(`File ${draggedFileId} dropped in folder ${over.id}`);

      setIsDropped(true);
    }
}
}

function ThreeDotMenu({ ID, type }) {
  console.log(`This is my ${type} ${ID}`);
  localStorage.setItem('Type', type);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("type", localStorage.getItem("Type"));
    formData.append("changed_Name", formData.get("query"));

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://127.0.0.1:8000/api/edit/${ID}`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className={`menu-container ${isOpen ? "active" : ""}`} ref={menuRef}>
      <button className="menu-icon" onClick={toggleMenu}></button>
      {isOpen && (
        <div className="dropdown-menu">
          <Link to={`/edit/${ID}`}>Edit</Link>
          <Button onClick={() => setPopupOpen(true)}>Edit</Button>
          <Popup open={isPopupOpen} onClose={() => setPopupOpen(false)} modal nested>
            {(close) => (
              <div className="popup-content">
                <form onSubmit={handleSubmit}>
                  <input name="query" value={query} onChange={(e) => setQuery(e.target.value)} />
                  <button type="submit">Submit</button>
                </form>
                <Button onClick={close}>Close</Button>
              </div>
            )}
          </Popup>
          <Link to={`/bin_Api/${ID}`}>Delete</Link>
          <a href="#">Share</a>
        </div>
      )}
    </div>
  );
}

ThreeDotMenu.propTypes = {
  ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.string.isRequired,
};

export default Home;
