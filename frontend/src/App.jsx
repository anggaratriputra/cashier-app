import "./App.css";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import AddProduct from "./components/AddProduct";
import ListProduct from "./components/ListProduct";
import Cashier from "./components/Cashier";
import Settings from "./components/Settings";
import Reports from "./components/Reports";
import UpdateProfile from "./components/UpdateProfile";
import ListCategory from "./components/ListCategory";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/admin/addproduct" element={<AddProduct />} />
      <Route path="/admin/category" element={<ListCategory />} />
      <Route path="/admin/listproduct" element={<ListProduct />} />
      <Route path="/admin/cashier" element={<Cashier />} />
      <Route path="/admin/settings" element={<Settings />} />
      <Route path="/admin/reports" element={<Reports />} />
      <Route path="/login/update/:username" element={<UpdateProfile />} />
    </Routes>
  );
}

export default App;
