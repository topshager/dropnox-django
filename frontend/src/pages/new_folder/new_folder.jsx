import React,{useEffect,useState} from 'react';
import { useParams } from "react-router-dom";



function New_folder(){
  const {folder_id} = useParams();
  const [folder_name,setfolder] = useState([]);
  const [loading,setloafding] = useState(true);
  const [error,setError] = useState(null);
  const [status,setStatus] = useState("initial");

  useEffect(() =>{
    localStorage.setItem("id",folder_id);
  },[folder_id]);

  useEffect(()=>{
    const token = localStorage.getItem('access_token');
  })
  const handleNewFolder = async () =>{
    try{

      const response = await fetch (`http://127.0.0.1:8000/api/new_folder/${id}`,{
        method: "POST",
        body: FormData,
        headers:{
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok){
        const data = await response.json();
        console.log("new folder created",data);
        setStatus("success");
      }else{
        const errorData = await response.json();
        console.error("failed to creat new folder" ,errorData);
        setStatus("fail");
      }
    }catch(error){
      console.error("Error uploading folder:", error);
      setStatus("fail");
    }
  };
  return (
    <div>
      <input
        type="text"
        placeholder="Enter folder name"
        value={folder_name}
        onChange={(e) =>setfolder(e.target.value)}
      />
      <button onClick={handleNewFolder} disabled={status === "upload"}>
        {status === "upload" ? "Uploading..." : "Upload Folder"}
      </button>
      {status === "success" && <p>Folder uploaded successfully!</p>}
      {status === "fail" && <p>Failed to upload folder. Try again.</p>}
    </div>
  );
};

export default New_folder;
