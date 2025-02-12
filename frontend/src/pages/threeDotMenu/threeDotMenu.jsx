import { useState, useEffect, useRef } from "react";
import "../threeDotMenu/threedot.css";


import { Link } from "react-router-dom";
function ThreeDotMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className={`menu-container ${isOpen ? "active" : ""}`} ref={menuRef}>
      <button className="menu-icon" onClick={toggleMenu}>
        ⋮
      </button>
      <div className="dropdown-menu">
        <a href="#">Edit</a>
        <Link to={`/bin_Api/${file.file_id}`}>Delete</Link>
        <a href="#">Share</a>
      </div>
    </div>
  );
}

export default ThreeDotMenu;
