import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import './folder.css';
/*convert to useing api from auth avoid use of authentication header */
function  Folder(){
  const {id} = useParams();
  const [folders,setFolders] = useState([]);
  const [files,setFiles] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(()=> {

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


},[]);
  return (
    <div>
      <h1>Folder ID: {id}</h1>
    </div>
  );
};

export default  Folder;
