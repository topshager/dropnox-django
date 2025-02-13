import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Bin() {
  const { fileId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("No access token found.");
      return;
    }

    const fetchData = async () => {
      const formData = new FormData();
      formData.append("fileId", fileId);

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/bin_Api/${fileId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [fileId]);

  return (
    <div>
      <h2>Bin Data</h2>
      {error ? <p style={{ color: "red" }}>{error}</p> : <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

export default Bin;
