import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Edit({}){
  const {ID} =useParams()
  console.log(`Edit ID ${ID}`)
  return (
    <p>Edit page</p>
  )

}
export default  Edit
