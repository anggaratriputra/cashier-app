// Admin.js

import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AddProduct from "../components/AddProduct";
import Reports from "../components/Reports";
import Settings from "../components/Settings";
import Cashier from "../components/Cashier";
import ListProduct from "../components/ListProduct";

function Admin() {
  const [activeItem, setActiveItem] = useState("addProduct");
  const setActivePage = (itemName) => {
    setActiveItem(itemName);
  };

  return (
    <>
      <AdminSidebar setActivePage={setActivePage} activeItem={activeItem} />
      {activeItem === "addProduct" && <AddProduct />}
      {activeItem === "listProduct" && <ListProduct />}
      {activeItem === "cashier" && <Cashier />}
      {activeItem === "reports" && <Reports />}
      {activeItem === "settings" && <Settings />}
    </>
  );
}

export default Admin;