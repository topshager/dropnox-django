import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";  // Import useParams

const LinkView = () => {
  const { token } = useParams();  // Use useParams to get the token from the URL
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/shared/${token}/`);

          if (!response.ok) {
            throw new Error("Failed to fetch link data");
          }

          const data = await response.json();
          console.log("Fetched data:", data);  // Log the data for debugging
          setData(data);
        } catch (err) {
          setError("Error fetching the data");
          console.error(err);
        }
      };

      fetchData();
    }
  }, [token]);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!data) {
    return <div className="p-4">Loading...</div>;
  }

  if (data.type === "file") {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">File: {data.file_name}</h2>
        

        {data.file_content ? (
          <img 
  src={`data:image/png;base64,${data.file_content}`} 
  alt={data.file_name} 
  style={{ width: '300px', height: 'auto' }}  
  className="mb-4"
/>
        ) : (
          <p>Unable to display image content.</p>
        )}


        <a
          href={data.file_url}
          className="text-blue-500 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download File
        </a>
      </div>
    );
  }


  if (data.type === "folder") {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Folder: {data.folder_name}</h2>
        <a
          href={data.folder_url}
          className="text-blue-500 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Folder
        </a>
      </div>
    );
  }

  return <p>Unknown content type.</p>;
};

export default LinkView;
