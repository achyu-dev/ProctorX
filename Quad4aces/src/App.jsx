import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Assesment from "./components/Assesment";
import AdminHome from "./pages/AdminHome";
import UploadTest from "./components/UploadTest";
import PreviousTests from "./components/PreviousTests";
import EditTest from "./components/EditTest";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminHome /></ProtectedRoute>} />
      <Route path="/upload" element={<ProtectedRoute requiredRole="admin"><UploadTest /></ProtectedRoute>} />
      <Route path="/previous-tests" element={<ProtectedRoute requiredRole="admin"><PreviousTests /></ProtectedRoute>} />
      <Route path="/edit-test" element={<ProtectedRoute requiredRole="admin"><EditTest /></ProtectedRoute>} />

      {/* Student Protected Route */}
      <Route path="/assessment" element={<ProtectedRoute requiredRole="student"><Assesment /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
