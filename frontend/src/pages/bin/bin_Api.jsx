import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Bin() {
  const {ID} = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  console.log(`this is folder_id ${ID}`)

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("No access token found.");
      return;
    }


    const fetchData = async () => {
      let  delete_id = ID

      const formData = new FormData()
      const type = localStorage.getItem("Type");

      if (type == "file"){
        formData.append("type", "File");
        console.log(`This  is file that i must delete ${delete_id}`)

      }
      else{
        console.log(`This  is folder that i must delete ${delete_id}`)
        formData.append("type", "Folder");


      }





      try {
        const response = await fetch(`http://127.0.0.1:8000/api/bin_Api/${ delete_id}`, {
          method: "POST",
          body:formData,
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
  }, []);

  return (
    <div>
      <h2>Bin Data</h2>
      {error ? <p style={{ color: "red" }}>{error}</p> : <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

export default Bin;
