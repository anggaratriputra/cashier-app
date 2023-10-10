import React, { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import AdminSidebar from "../components/AdminSidebar";
import AddProduct from "../components/AddProduct"; // Import the AddProduct component
import Reports from "../components/Reports"; // Import the Reports component
import Settings from "../components/Settings"; // Import the Settings component
import Cashier from "../components/Cashier"; // Import the Settings component
import ListProduct from "../components/ListProduct";

function Admin() {
  const [activeItem, setActiveItem] = useState("addProduct");

  const setActivePage = (itemName) => {
    setActiveItem(itemName);
  };

  // Define a mapping of activeItem values to corresponding components
  const pageComponents = {
    addProduct: <AddProduct />, // Render the AddProduct component for "Add Product"
    listProduct: <ListProduct/>, // Render the Reports component for "Product List"
    cashier: <Cashier />, // Render the Settings component for "Cashier List"
    reports: <Reports />, // Render the Settings component for "Reports"
    settings: <Settings />, // Render the Settings component for "Settings"
  };

  return (
    <>
      <AdminSidebar setActivePage={setActivePage} activeItem={activeItem} />
          {pageComponents[activeItem]}
    </>
  );
}

export default Admin;