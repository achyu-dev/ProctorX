import { Link } from "react-router-dom";
import "../styles/styles.css";

const AdminNav = () => {
  return (
    <nav className="admin-nav">
      <h2>Admin Dashboard</h2>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li>
          <Link to="/tests">Tests</Link>
          <ul className="dropdown">
            <li><Link to="/upload">Upload Test</Link></li>
            <li><Link to="/previous-tests">Previous Tests</Link></li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNav;
