import React, { useEffect, useState, useRef } from 'react';
import './home.css';
import { Link } from "react-router-dom";

function Home() {
  /*const [folders, setFolders] = useState([]);*/
  /*const [files, setFiles] = useState([]);*/
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetched = useRef(false);

  const [folders, setFolders] = useState([
    { folder_id: 1, name: "Test Folder", files: [{ file_id: 1, name: "File1", type: "txt" }] }
  ]);

  const [files, setFiles] = useState([
    { file_id: 2, name: "Standalone File", type: "jpg" }
  ]);
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const token = localStorage.getItem('access_token');
    if (!token) return;

    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/home/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        const filesData = data?.data?.files || [];
        const foldersData = data?.data?.folders || [];
        console.log("Extracted Folders:", foldersData);
        console.log("Extracted Files:", filesData);

        setFolders([...foldersData]);
        setFiles([...filesData]);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='container'>
      <h1>Home</h1>

      <h2>Folders</h2>
      {Array.isArray(folders) && folders.length > 0 ? (
        <ul>
          {folders.map((folder) => (
            <li key={folder.folder_id}>
              <Link to={`/folder/${folder.folder_id}`}>{folder.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No folders found</p>
      )}

      <h2>Files</h2>
      {Array.isArray(files) && files.length > 0 ? (
        <ul>
          {files.map((file) => (
            <li key={file.file_id}>{file.name} </li>
          ))}
        </ul>
      ) : (
        <p>No files found</p>
      )}
    </div>
  );
}

export default Home;
