import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Admin from './components/Admin';
import Assesment from './components/Assesment';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/Assesment" element={<Assesment />} />
    </Routes>
  );
}

export default App;
