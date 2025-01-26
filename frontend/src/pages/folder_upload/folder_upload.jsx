import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from "../auth/auth";

const upload_folder = ()=>{

  const[folder,setFolder] = useState(null);
  const[name,setName] = useState("");
  const[type,setType] = useState("document");
  const[ status,setStatus] = useState("initial");

  const handleFolderChange = (e) =>{
    if (e.target.folders && e.target.folders[0]){
      setStatus("initial");
      setFolder(e.target.folders[0]);
    }
  };
  const handleUpload = async () =>{
    setStatus("upload");
    const formData = new FormData();
    formData.append("folder",folder);
    formData.append("name",name);
    const token = localStorage.getItem("access_token");
    if (!token){
      console.error("No token found in localStorage");
      setStatus("fail");
      return;
    }
    try{
      const response = await fetch("http://127.0.0.1:8000/api/upload_folder/",{
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setStatus("success");
      } else {
        const errorData = await response.json();
        console.error("Upload failed:", errorData);
        setStatus("fail");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setStatus("fail");
    }
   }else {
    alert("Please fill in all required fields!");
  }
};

export default upload_folder;
