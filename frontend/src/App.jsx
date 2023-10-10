import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Admin from "./pages/Admin"
import Login from "./pages/Login";



function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;