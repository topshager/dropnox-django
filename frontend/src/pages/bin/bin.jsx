import { useEffect, useState } from "react"
import './bin.css';
import { Link } from "react-router-dom";

function bin(){
  const [folder,setFolders] = useState([]);
  const [files,setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('access_token');

  const fetchData = async () => {
    try{
      const response = await fetch('http://127.0.0.1:8000/api/bin/',{
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
    }catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Failed to fetch data');
      setLoading(false);
    }
  }

};


export default bin;
