import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import './folder.css';
import { Link } from "react-router-dom";
/*convert to useing api from auth avoid use of authentication header */
function  Folder(){
  const {id} = useParams();
  const [folders,setFolders] = useState([]);
  const [files,setFiles] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(()=> {
  if (!id){
    let  id = 0;

  }



  const token = localStorage.getItem('access_token');
  const  fetchData =async () =>{
    try{
      const response = await fetch(`http://127.0.0.1:8000/api/subfolder/${id}`,{
        method:'GET',
        headers:{
          Authorization:`Bearer ${token}`,
        },
      });
      if (!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`);
      }



      const data = await response.json();
      const foldersData = data?.data?.folders || [];
      const filesData = data?.data?.files || [];

      setFolders(foldersData);
      setFiles(filesData);
      setLoading(false);
    }catch(error){
      console.error('Error fetching data:', error);
      setError(error.message || 'Failed to fetch data');
      setLoading(false);
    }
  };
   fetchData();

if (loading) {
  return <p>Loading...</p>
}
if (error){
  return <p>Error</p>
}

},[]);
  return (
    <div>
      <h1>Folder ID: {id}</h1>
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
     <ul>
      <h2>Files</h2>
      {files.map((file) =>(
        <li key={file.file_id}>{file.name}</li>
      ))}
     </ul>
    </div>
  );
};

export default  Folder;
