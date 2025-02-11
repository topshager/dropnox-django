import { useEffect,useRef } from "react";
import './threedot.css'

function ThreeDotMenu(){
  const menuRef = useRef(null);

  useEffect(()=>{
    const handleClickOutside = (event) =>{
      if (menuRef.current && !menuRef.current.contains(event.target)){
        menuRef.current.style.display = "none";
      }
    };
    document.addEventListener("click",handleClickOutside);
    return () =>{
      document.removeEventListener("click",handleClickOutside)
    }
  },[]);
  return (
    <div className="menu-container" ref={menuRef}>
      <button className="menu-icon" onClick={() => menuRef.current.style.display = "block"}>
        ⋮
      </button>
      <div className="dropdown-menu" style={{ display: "none" }}>
        <a href="#">Edit</a>
        <a href="#">Delete</a>
        <a href="#">Share</a>
      </div>
    </div>
  );
}
export default ThreeDotMenu;
