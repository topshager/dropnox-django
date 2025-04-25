import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


function Sharable (){

  const [error, setError] = useState(null);
  const {ID,type} = useParams();

  const [share_tokens,setToken] = useState([]);

    useEffect(()=>{
        const token = localStorage.getItem("access_token");
        const fetchData = async () =>{
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/sharable/${ID}/${encodeURIComponent(type)}/`,{
                method: "GET",
                headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                
                const data = await response.json();
                console.log(data)
                /*const fetchedTokens   = data?.data?.token || [];*/
                /*setToken(fetchedTokens )*/
                console.log(data)
            }catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message || "Failed to fetch data");
            }
        }
        fetchData();

    },[ID ,type]);
    
    return(
        <div className="sharable-code">

        </div>
    );
}


export default Sharable;