import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Assesment from './components/Assesment';
import AdminHome from "./pages/AdminHome";
import UploadTest from "./components/UploadTest";
import PreviousTests from "./components/PreviousTests";
import EditTest from "./components/EditTest";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminHome/>} />
      <Route path="/Assesment" element={<Assesment />} />
      <Route path="/upload" element={<UploadTest />} />
      <Route path="/previous-tests" element={<PreviousTests />} />x
      <Route path="/edit-test" element={<EditTest />} />
    </Routes>
  );
}

export default App;
