import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";

function Bin(){
  const { fileId } = useParams();
  console.log(`this is ${fileId}`)
  return(
    <p>DELETE {fileId}</p>
  );
};


export default Bin;
