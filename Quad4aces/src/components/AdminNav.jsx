// This component is the navigation bar for the admin dashboard. It contains links to the home page, tests page, and settings page. The tests page has a dropdown menu with links to the upload test page and the previous tests page.
import React from "react";
import "../styles/adminnav.css"; // Assuming the CSS file is stored in 'styles/Admin.css'
import { Link } from "react-router-dom";

const AdminNav = () => {
  return (
    <div>
      {/* Admin Title - Top Left */}
      <div className="admin-header">Admin</div>

      {/* Navigation Bar */}
      <nav className="admin-nav">
        <ul>
          <li>
            <a href="/home">Home</a>
          </li>
          <li>
            <a href="#">Tests</a>
            <ul className="dropdown">
              <li>
                <a href="/upload-test">Upload Test</a>
              </li>
              <li>
                <a href="/previous-tests">Previous Tests</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="/reports">Reports</a>
          </li>
          <li>
            <a href="/settings">Settings</a>
          </li>
          <li><Link to="/chats">Chats</Link></li>
        </ul>
      </nav>

    
      <div className="content">
        <h1>Ongoing Tests</h1>
        <div>
          <h3>Math Test</h3>
          <p>Status: Active</p>
        </div>
        <div>
          <h3>Science Quiz</h3>
          <p>Status: Ongoing</p>
=======
import React, { useState } from 'react';
import '../styles/adminnav.css';  // Assuming the CSS file is stored in 'styles/adminnav.css'

const AdminNav = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="admin-container">
            {/* Admin Title - Top Left */}
            <div className="admin-header">Admin</div>

            {/* Navigation Bar */}
            <nav className="admin-nav">
                <ul>
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li
                        className="dropdown-container"
                        onMouseEnter={toggleDropdown}
                        onMouseLeave={toggleDropdown}
                    >
                        <a href="#">Tests</a>
                        {isDropdownOpen && (
                            <ul className="dropdown">
                                <li><a href="/upload">Upload Test</a></li>
                                <li><a href="/previous-tests">Previous Tests</a></li>
                            </ul>
                        )}
                    </li>
                    <li>
                        <a href="/reports">Reports</a>
                    </li>
                    <li>
                        <a href="/settings">Settings</a>
                    </li>
                </ul>
            </nav>
        </div>
      </div>
    </div>
  );
};

export default AdminNav;
