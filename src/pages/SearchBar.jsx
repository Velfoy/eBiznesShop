import { useState, useRef, useEffect } from "react";
import "../styles/searchBar.css";

function SearchBar(){
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const dropdownRef = useRef(null);

  const categories = ["Electronics", "Books", "Clothing"];

  const toggleDropdown = () => {
    console.log("Dropdown clicked!");
    setDropdownOpen((prev) => !prev);
  };
  
  const selectCategory = (category) => {
    setSelectedCategory(category);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="search_main">
        <div className="search-container">
            <div className="dropdown" ref={dropdownRef}>
                <div className="dropdown-toggle" onClick={toggleDropdown}>
                {selectedCategory} ▼
                </div>
            </div>
            <input type="text" className="search-input" placeholder="Search for items..." />
            <div className="search-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
        </div>
        {dropdownOpen && (
                <ul className="dropdown-menu">
                    {categories.map((category, index) => (
                    <li key={index} onClick={() => selectCategory(category)}>
                        {category}
                    </li>
                    ))}
                </ul>
                )}
    </div>
    
  );
};

export default SearchBar;
