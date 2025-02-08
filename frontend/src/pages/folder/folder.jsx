import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import './folder.css';
import { Link } from "react-router-dom";


function Folder() {
  const { folder_id } = useParams();
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem("id", folder_id);
  }, [folder_id]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/subfolder/${folder_id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const foldersData = data?.data?.folders || [];
        const filesData = data?.data?.files || [];

        setFolders(foldersData);
        setFiles(filesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, [folder_id]);

  useEffect(() => {
    if (sessionStorage.getItem("last_folder") !== folder_id) {
      sessionStorage.setItem("last_folder", folder_id);
      window.location.reload();
    }
  }, [folder_id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div>
      <h1>Folder ID: {folder_id}</h1>
      <h2>Folders</h2>
      <ul>
        {folders.map((folder) => (
          <li key={folder.folder_id}>
            <Link to={`/folder/${folder.folder_id}`}>
              {folder.name}
            </Link>
          </li>
        ))}
      </ul>

      <h2>Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file.file_id}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Folder;
