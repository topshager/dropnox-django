import React, { useState } from "react";

const Uploader = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("document");
  const [status, setStatus] = useState("initial");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setStatus("initial");
      setFile(e.target.files[0]);
    }
  };

  const fileTypeMapping = {
    "application/pdf": "pdf",
    "image/png": "image",
    "image/jpeg": "image",
    "video/mp4": "video",
  };

  const fileType = file && file.type ? fileTypeMapping[file.type]: "document";


  const handleUpload = async () => {
    if (file && file.name && file.type) {
      const fileTypeMismatch = fileType !== type;

      if (fileTypeMismatch) {
        alert(`The selected folder type (${type}) does not match the file type (${fileType}).`);
        return;
    }
      setStatus("upload");
      const formData = new FormData();
      formData.append("file", file);

      formData.append("name", name);
      formData.append("type", fileType );


      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No token found in localStorage");
        setStatus("fail");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/upload_file/<id:None>", {
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
    } else {
      alert("Please fill in all required fields!");
    }
  };

  return (
    <div className="file-uploader">
      <div className="input-group">
        <label htmlFor="name">Folder Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter folder name"
        />
      </div>

      <div className="input-group">
        <label htmlFor="type">Folder Type</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="document">Document</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="pdf">pdf</option>
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="file">Upload File</label>
        <input type="file" id="file" onChange={handleFileChange} />
      </div>

      {file && (
        <section>
          <h3>File Details:</h3>
          <ul>
            <li>
              <strong>Name:</strong> {file.name}
            </li>
            <li>
              <strong>Type:</strong> {file.type}

            </li>
            <li>
              <strong>Size:</strong> {file.size} bytes
            </li>
          </ul>
        </section>
      )}

      <button onClick={handleUpload} className="submit" disabled={!file || !name}>
        Upload File
      </button>

      <Result status={status} />
    </div>
  );
};

const Result = ({ status }) => {
  if (status === "success") {
    return <p>✅ File uploaded successfully!</p>;
  } else if (status === "fail") {
    return <p>❌ File upload failed. Please try again.</p>;
  } else if (status === "upload") {
    return <p>⏳ Uploading the file, please wait...</p>;
  } else {
    return null;
  }
};

export default Uploader;
