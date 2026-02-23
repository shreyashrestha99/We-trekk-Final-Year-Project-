import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./page/Register";
import Login from "./page/Login";
import MainHome from "./page/MainHome";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/mainhome" element={<MainHome />} />
    </Routes>
  );
}

export default App;