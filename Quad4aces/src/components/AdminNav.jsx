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
                        <a href="/upload">Upload Tests</a>
                    </li>
                    <li>
                        <a href="/reports">Reports</a>
                    </li>
                    <li>
                        <a href="/register-student">Register Student</a>
                    </li>
                    <li>
                        <a href="/settings">Settings</a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default AdminNav;
