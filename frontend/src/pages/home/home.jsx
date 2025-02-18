import React, { useEffect, useState, useRef } from "react";
import "./home.css";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import Button from "react-bootstrap/Button";
import {DndContext} from  '@dnd-kit/core';
import {Draggable  } from './Draggable';
import {Droppable} from './Droppable';



function Home() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileUrls, setFileUrls] = useState({});
  const fileUrlsRef = useRef({});
  const [parent ,setParent] = useState(null);
  
  const draggable = (
    <Draggable id="draggable">
      Go ahead, drag me.
    </Draggable>
  );

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
      <h1>Home</h1>

      <h2>Folders</h2>
      {folders.length === 0 ? (
        <p>No folders found.</p>
      ) : (
        <ul>
          {folders.map((folder) => (
            <li key={folder.folder_id}>
            <div className="file-Menu">
                  <ThreeDotMenu ID={folder.folder_id} type={"folder"} name={folder.name}/>
                </div>
              <Link to={`/folder/${folder.folder_id}`}>{folder.name}</Link>
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

                <div className="file-Menu">

                  <ThreeDotMenu ID={file.file_id} type={"file"} name={file.name}/>
                </div>
                <div className="File">
                  <p>{file.name}</p>

                  <a href={fileUrls[file.file_id]} target="_blank" rel="noopener noreferrer">
                    Open File
                  </a>
                </div>
              </li>
            ))}

          </ul>
        )}
      </div>
    </div>
  );
}
function ThreeDotMenu({ ID,type }) {


  if (type == "file"){
    console.log(`This is my file ${ID}`)
    localStorage.setItem('Type',"file")


  }
  else{
    console.log(`This is my folder ${ID}`)
    localStorage.setItem('Type',"folder")
  }


  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  },
   []);
   const [isPopupOpen,setPopupOpen] = useState(false);




      const [query,setQuery] = useState("");

      const handleSubmit = (event) =>{
        event.preventDefault();
        const formData = new FormData(event.target);
        setSubmit(formData)
      }

      function setSubmit (formData) {
        const fetchData = async () =>{

          try{
            const response = await fetch(`http://127.0.0.1:8000/api/edit/${ID}`,{
              method: "POST",
              body: formData,
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok)throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            console.log(data);
          }catch (error){
            console.error("Error fetching data:", error);
          }
        }
        const query = formData.get("query");

        type = localStorage.getItem("Type")
        const token = localStorage.getItem("access_token");

        formData.append("type",type);
        formData.append("changed_Name",query)

        fetchData()


      }


  return (
    <div className={`menu-container ${isOpen ? "active" : ""}`} ref={menuRef}>
      <button className="menu-icon" onClick={toggleMenu}>
        ⋮
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <Link to={`/edit/${ID}`}>Edit</Link>
          <div>
          <Button onClick={() => setPopupOpen(true)}>Edit</Button>

<Popup open={isPopupOpen} onClose={() => setPopupOpen(false)} modal nested>
  {close => (
    <div className="popup-content">
      <p>This is a popup!</p>
      <form onSubmit={handleSubmit}>
      <input
        name="query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Submit</button>
      </form>

      <Button onClick={close}>Close</Button>
      <Button type="submit" >Submit</Button>
    </div>
  )}
</Popup>

    </div>
          <Link to={`/bin_Api/${ID}`}>Delete</Link>
          <a href="#">Share</a>
        </div>
      )}
    </div>

  );

};
ThreeDotMenu.propTypes = {

    ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
};




export default Home;
