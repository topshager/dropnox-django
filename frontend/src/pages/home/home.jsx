import React, { useEffect, useState } from 'react';
import './home.css';
import { Link } from "react-router-dom";
import FileViewer from 'react-file-viewer';

function Home() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileUrls,setFileUrls] = useState({});

  useEffect(() => {
    const id = localStorage.setItem("id",0)
    const token = localStorage.getItem('access_token');



    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/home/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });


        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const foldersData = data?.data?.folders || [];
        const filesData = data?.data?.files || [];
        setFolders(foldersData);
        setFiles(filesData);
        const fileBlobs = {};
        for (const file of filesData) {
          if (file.content) {
            const byteCharacters = atob(file.content); // Decode base64
            const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: file.type });
            fileBlobs[file.file_id] = URL.createObjectURL(blob);
          }
        }
        setFileUrls(fileBlobs);




        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to fetch data');
        setLoading(false);
      }
    };
    console.log("Folders:", folders);
    console.log("Files:", files);

    fetchData();
    return () => {
      Object.values(fileUrls).forEach(URL.revokeObjectURL);
    };
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className='container'>
      <h1>Home</h1>
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
      <div className='border'>
      <ul>


        <div className='frame'>
      {files.map((file) => (
          <li key={file.file_id}>
                 <FileViewer
                    fileType={file.type.split("/")[1]} // Extract type (e.g., pdf, png)
                    filePath={fileUrls[file.file_id]}
                  />

            {file.name}</li>
        ))}
        </div>

      </ul>
      </div>
      </div>

  );
}

export default Home;
