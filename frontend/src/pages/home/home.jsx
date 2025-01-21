import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home(){
  const [folders,setFolders] = useState([]);
  const [files,setFiles] = useState([]);
  const [loading,setloading] = useState(true);
  const [error,setError] = useState(null);
  const [message,setMessage] = useState('');



  useEffect(() => {
    const token = localStorage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/protected/',{
      method:'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    .then((response)=>{
      console.log(response)
      if(!response.ok){
        throw new Error('Failed to fetch data');


      }
      return response.json();
    })
    .then((data) =>{
      const [foldersData,filesData] = data.data;
      setFolders(foldersData);
      setFiles(filesData);
      setloading(false);
    })
    .catch((error) =>{
      console.error('error',error);
      setError(error.message);
      setloading(false);
    });
  },[]);
  if (loading)return <p>Loading...</p>;
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
