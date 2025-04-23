import React, { useEffect, useState } from "react";


const Sharable = (id,type) =>{

  const [error, setError] = useState(null);

    useEffect(()=>{
        const token = localStorage.getItem("access_token");

        const fetchData = async () =>{
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/sharable/${id,type}`,{
                method: "GET",
                headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                
                const data = await response.json();
                console.log(data)
            }catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message || "Failed to fetch data");
            }
        }
        fetchData();

    },[id,type]);
    
    return(
        <div className="sharable-code">
            <form>

            </form>
        </div>
    );
}


export default Sharable;