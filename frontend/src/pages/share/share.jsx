import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ShareableLink({ url }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="share-link-box">
      <input type="text" value={url} readOnly style={{ width: "80%" }} />
      <button onClick={handleCopy}>
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

function Sharable() {
  const [error, setError] = useState(null);
  const { ID, type } = useParams();
  const [share_tokens, setToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/sharable/${ID}/${encodeURIComponent(type)}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        const fetchedUrl = data?.shareable_url || "";
        setToken(fetchedUrl);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to fetch data");
      }
    };

    fetchData();
  }, [ID, type]);

  return (
    <div className="sharable-code">
      {share_tokens ? (
        <ShareableLink url={share_tokens} />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Sharable;
