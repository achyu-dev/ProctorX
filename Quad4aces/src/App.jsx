import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Assesment from './components/Assesment';
import AdminHome from "./pages/AdminHome";
import UploadTest from "./components/UploadTest";
import PreviousTests from "./components/PreviousTests";
import EditTest from "./components/EditTest";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/Assesment" element={<Assesment />} />
      <Route path="/" element={<AdminHome />} />
        <Route path="/upload" element={<UploadTest />} />
        <Route path="/previous-tests" element={<PreviousTests />} />
        <Route path="/edit-test" element={<EditTest />} />
    </Routes>
  );
}

export default App;
