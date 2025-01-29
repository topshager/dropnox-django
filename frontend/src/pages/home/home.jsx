import React, { useEffect, useState } from 'react';
import './home.css';

function Home() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    const token = localStorage.getItem('token');



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
        const { folders: foldersData, files: filesData } = data;

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
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Home</h1>
      <h2>Folders</h2>
      <ul>
        {folders.map((folder, index) => (
          <li key={index}>{folder.name}</li>
        ))}
      </ul>
      <h2>Files</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
