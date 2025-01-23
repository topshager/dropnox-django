import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from ".pages/auth/auth";

function Home(){


  const [folders,setFolders] = useState([]);
  const [files,setFiles] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);
  const [message,setMessage] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response  = await api.get('api/protected/');
        const {folders:foldersData,files:filesData } =  response.data;
        setFolders(foldersData);
        setFiles(filesData);
        setLoading(false);
      }catch(error){
        console.error('Error fetching data',error);
        setError(error.response?.data?.details || 'failed to fetch data');
        setLoading(false);
      }
    };
    fetchData();
  },[]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Home</h1>
      <div>
        <h2>Folders</h2>
        {folders.length > 0 ? (
          <ul>
            {folders.map((folder) => (
              <li key={folder.id}>{folder.name}</li>
            ))}
          </ul>
        ) : (
          <p>No folders available.</p>
        )}
      </div>
      <div>
        <h2>Files</h2>
        {files.length > 0 ? (
          <ul>
            {files.map((file) => (
              <li key={file.id}>{file.name}</li>
            ))}
          </ul>
        ) : (
          <p>No files available.</p>
        )}
      </div>
    </div>
  );
}
export default Home;
