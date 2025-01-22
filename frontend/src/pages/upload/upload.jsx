import React ,{useState} from "react";


const Uploader = () =>{
  const [file,setFile] = useState(null);
  const [status,setStatus] = useState("initial")


const handleFileChange = (e) =>{
  if (e.target.files && e.target.files[0]){
    setStatus("initial");
    setFile(e.target.files[0]);
  }
};
const handleUpload = async () =>{
  if (file){
    setStatus("upload");
    const formData = new FormData();
    formData.append("file",file);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/home_upload/', {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setStatus("success");
      } else {
        throw new Error("Upload failed");
      }
    }
    catch (error) {
      console.error("Error uploading file:", error);
      setStatus("fail");
    }
  }
};
  return (
    <div className="file-uploader">
      <div className="input-group">
        <input type="file" onChange={handleFileChange} />
      </div>

      {file && (
        <section>
          <h3>File Details:</h3>
          <ul>
            <li><strong>Name:</strong> {file.name}</li>
            <li><strong>Type:</strong> {file.type}</li>
            <li><strong>Size:</strong> {file.size} bytes</li>
          </ul>
        </section>
      )}

      {file && (
        <button onClick={handleUpload} className="submit">
          Upload File
        </button>
      )}

      <Result status={status} />
    </div>
  );
};


const Result = ({ status }) => {
  if (status === "success") {
    return <p>✅ File uploaded successfully!</p>;
  } else if (status === "fail") {
    return <p>❌ File upload failed. Please try again.</p>;
  } else if (status === "uploading") {
    return <p>⏳ Uploading the file, please wait...</p>;
  } else {
    return null;
  }
};

export default Uploader;
