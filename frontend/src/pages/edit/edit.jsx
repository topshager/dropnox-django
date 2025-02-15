import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Popup from 'reactjs-popup';


const MyPopup = () => (
  <Popup trigger={<button>Open Popup</button>} position="right center">
    <div>Popup content here!</div>
  </Popup>
);


export default MyPopup;
