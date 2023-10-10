import React, { useState } from "react";
import { Icon, Flex, Text, Image, CloseButton, Box, useColorModeValue } from "@chakra-ui/react";
import { FiHome, FiTrendingUp, FiSettings, FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";


const SidebarContent = ({ onClose, ...rest }) => {
  const [activeItem, setActiveItem] = useState("addProduct"); // Initialize with the default active item
  const navigate = useNavigate()

  const setActivePage = (itemName) => {
    setActiveItem(itemName);
  };

  return (
    <Box transition="3s ease" bg={useColorModeValue("white", "gray.900")} borderRight="1px" borderRightColor={useColorModeValue("gray.200", "gray.700")} w={{ base: "full", md: 60 }} pos="fixed" h="100vh">
      {/* Sidebar Header */}
      <Flex h="20" alignItems="center" mx="8" mt={4} mb={10} justifyContent="space-between">
        <Flex gap={2} alignItems="center" justifyContent="center">
          <Image src="https://i.ibb.co/LzsMhD0/mekdilogo2.png" w={"90%"} />
        </Flex>
      </Flex>

      {/* Sidebar Navigation */}
      <Flex direction="column">
        <NavItem icon={FiHome} name="Add Product" isActive={activeItem === "addProduct"} onClick={() => navigate("/admin/addProduct")} />
        <NavItem icon={FiTrendingUp} name="Product List" isActive={activeItem === "listProduct"} onClick={() => navigate("/admin/listProduct")} />
        <NavItem icon={FiSettings} name="Cashier List" isActive={activeItem === "cashier"}  onClick={() => navigate("/admin/cashier")} />
        <NavItem icon={FiSettings} name="Reports" isActive={activeItem === "reports"} onClick={() => navigate("/admin/reports")} />
        <NavItem icon={FiSettings} name="Settings" isActive={activeItem === "settings"}  onClick={() => navigate("/admin/settings")} />
      </Flex>
    </Box>
  );
};

const NavItem = ({ icon, name, isActive, onClick }) => {
  const activeColor = useColorModeValue("white", "gray.900");
  const activeBgColor = "red";

  return (
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: "red",
        color: "white",
      }}
      backgroundColor={isActive ? activeBgColor : ""}
      color={isActive ? activeColor : ""}
      onClick={onClick}>
      {icon && (
        <Icon
          mr="4"
          fontSize="30"
          _groupHover={{
            color: "white",
          }}
          as={icon}
        />
      )}
      {name}
    </Flex>
  );
};

export default AdminSidebar;