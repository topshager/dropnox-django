import React, { useEffect, useState } from 'react';
import './home.css';
import { Link } from "react-router-dom";
import { pdfjs, Document, Page } from "react-pdf";

// Set the worker source properly
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

function Home() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileUrls, setFileUrls] = useState({});

  // Helper function to extract file extension
  const getFileExtension = (fileName) => fileName.split(".").pop().toLowerCase();

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/home/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const foldersData = data?.data?.folders || [];
        const filesData = data?.data?.files || [];

        setFolders(foldersData);
        setFiles(filesData);

        // Convert Base64 content to Blob URLs
        const fileBlobs = {};
        filesData.forEach(file => {
          if (file.content) {
            try {
              const byteCharacters = atob(file.content); // Decode Base64
              const byteNumbers = new Uint8Array(byteCharacters.length).map((_, i) =>
                byteCharacters.charCodeAt(i)
              );
              const blob = new Blob([byteNumbers], { type: file.type });
              fileBlobs[file.file_id] = URL.createObjectURL(blob);
            } catch (error) {
              console.error(`Error decoding file ${file.file_id}:`, error);
            }
          }
        });

        setFileUrls(fileBlobs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      Object.values(fileUrls).forEach(URL.revokeObjectURL);
    };
  }, []);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className='container'>
      <h1>Home</h1>

      <h2>Folders</h2>
      {folders.length === 0 ? <p>No folders found.</p> : (
        <ul>
          {folders.map((folder) => (
            <li key={folder.folder_id}>
              <Link to={`/folder/${folder.folder_id}`}>{folder.name}</Link>
            </li>
          ))}
        </ul>
      )}

      <h2>Files</h2>
      <div className='border'>
        {files.length === 0 ? <p>No files found.</p> : (
          <ul>
            {files.map((file) => {
              const fileType = getFileExtension(file.name);
              return (
                <li key={file.file_id}>
                  <p>{file.name}</p>
                  {fileUrls[file.file_id] ? (
                    fileType === "pdf" ? (
                      <Document file={fileUrls[file.file_id]}>
                        <Page pageNumber={1} />
                      </Document>
                    ) : (
                      <a href={fileUrls[file.file_id]} target="_blank" rel="noopener noreferrer">
                        Open File
                      </a>
                    )
                  ) : (
                    <p className="loading">Loading file...</p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Home;
