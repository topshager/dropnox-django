import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";

function Bin(){
  const { id } = useParams();
  <p>{id}</p>
  console.log(id);
  return (
  <p>{id}</p>

  );
};


export default Bin;
