import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from "../auth/auth";

const upload_folder = ()=>{

  const[folder,setFolder] = useState(null);
  const[name,setName] = useState("");
  const[type,setType] = useState("document");
  const[ status,setStatus] = useState("initial");

  const handleFileChange = (e) =>{
    if (e.target.files && e.target.files[0]){
      setStatus("initial");
      setFolder(e.target.fiels[0]);
    }
  };
  
  return(

  )
}

export default upload_folder;
