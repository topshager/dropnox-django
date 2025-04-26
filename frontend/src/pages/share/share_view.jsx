import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function LinkView() {
  const { token } = useParams(); // Get the token from the URL
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/linkview/${token}/`); // Your API endpoint

          if (!response.ok) {
            throw new Error("Failed to fetch link data");
          }

          const data = await response.json();
          setData(data);
        } catch (err) {
          setError("Error fetching the data");
          console.error(err);
        }
      };

      fetchData();
    }
  }, [token]);

  // Show loading or error message
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!data) {
    return <div className="p-4">Loading...</div>;
  }

  // Render the actual content based on the type (folder or file)
  return (
    <div className="p-4">
      {data.type === "folder" ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Folder: {data.folder_name}</h2>
          <a
            href={data.folder_url}
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Folder
          </a>
        </>
      ) : data.type === "file" ? (
        <>
          <h2 className="text-2xl font-bold mb-4">File: {data.file_name}</h2>
          <a
            href={data.file_url}
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download File
          </a>
        </>
      ) : (
        <p>Unknown content type.</p>
      )}
    </div>
  );
}
