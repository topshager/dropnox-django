import React, { useState } from 'react';

const UploadFolder = () => {
  const [folder, setFolder] = useState(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("initial");



  const handleFolderChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setStatus("initial");
      setFolder(e.target.files);
    }
  };

  const handleUpload = async () => {
    if (!folder || !name) {
      alert("Please fill in all required fields!");
      return;
    }

    setStatus("upload");
    const formData = new FormData();


    Array.from(folder).forEach((file) => {
      formData.append("files", file);
    });
    formData.append("name", name);
    formData.append("type","folder");


    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No token found in localStorage");
      setStatus("fail");
      return;
    }


    try {
      const response = await fetch(`http://127.0.0.1:8000/api/upload_folder/${id}`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Upload successful:", data);
        setStatus("success");
      } else {
        const errorData = await response.json();
        console.error("Upload failed:", errorData);
        setStatus("fail");
      }
    } catch (error) {
      console.error("Error uploading folder:", error);
      setStatus("fail");
    }
  };

  return (
    <div>
      <h1>Upload Folder</h1>
      <input
        type="file"
        webkitdirectory="true"
        multiple
        onChange={handleFolderChange}
      />
      <input
        type="text"
        placeholder="Enter folder name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleUpload} disabled={status === "upload"}>
        {status === "upload" ? "Uploading..." : "Upload Folder"}
      </button>
      {status === "success" && <p>Folder uploaded successfully!</p>}
      {status === "fail" && <p>Failed to upload folder. Try again.</p>}
    </div>
  );
};

export default UploadFolder;
