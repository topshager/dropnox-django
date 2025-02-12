import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";

function Bin(){
  const { id } = useParams();
  <p>{id}</p>
  return(
    <p>DELETE</p>
  );
};


export default Bin;
