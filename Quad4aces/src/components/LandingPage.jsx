import React from 'react';
import '../styles/landingpage.css'; // Importing the updated CSS file

function LandingPage() {
    const handle = () => {
        // Redirect to the login page
        window.location.href = '/login';
    };
  return (
    <div className="container">
      <header className="header">
        <h1 className="logo">ProctorX</h1>
        <nav className="nav">
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Features</li>
            <li>Contact</li>
          </ul>
        </nav>
      </header>

      <main className="main">
        <div className="content">
          <h2 className="title">Online Proctoring System</h2>
          <p className="description">
            Ensure academic integrity with behavior analysis, real-time risk
            scoring, and seamless monitoring.
          </p>

          <button className="btn" onClick={handle}>Login</button>
 
        </div>

        <div className="image-container">
          <img src="/exam_image.png" alt="Exam Illustration" className="image" />
        </div>
      </main>

      <footer className="footer">
        &copy; 2025 ProctorX - All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;