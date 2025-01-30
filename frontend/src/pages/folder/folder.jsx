import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import './folder';

function  Folder(){
  const {id} = useParams();
  return (
    <div>
      <h1>Folder ID: {id}</h1>
    </div>
  );
};

export default  Folder;
