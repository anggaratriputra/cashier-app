import React, { useState } from "react";
import { Icon, Flex, Text, Image, CloseButton, Box, useColorModeValue } from "@chakra-ui/react";
import { FiHome, FiTrendingUp, FiSettings, FiMenu } from "react-icons/fi";

import Home from "../pages/Home";
import Reports from "./Reports";
import Settings from "./Settings";

const SidebarContent = ({ onClose, ...rest }) => {
  const [activeItem, setActiveItem] = useState("home"); // Initialize with the default active item

  const setActivePage = (itemName) => {
    setActiveItem(itemName);
  };

  return (
    <Box transition="3s ease" bg={useColorModeValue("white", "gray.900")} borderRight="1px" borderRightColor={useColorModeValue("gray.200", "gray.700")} w={{ base: "full", md: 60 }} pos="fixed" h="100vh" {...rest}>
      {/* Sidebar Header */}
      <Flex h="20" alignItems="center" mx="8" mt={4} mb={10} justifyContent="space-between">
        <Flex gap={2} alignItems="center" justifyContent="center">
          <Image src="https://i.ibb.co/LzsMhD0/mekdilogo2.png" w={"90%"} />
        </Flex>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>

      {/* Sidebar Navigation */}
      <Flex direction="column">
        <NavItem icon={FiHome} name="Cashier" isActive={activeItem === "home"} onClick={() => setActivePage("home")} />
        <NavItem icon={FiTrendingUp} name="Reports" isActive={activeItem === "reports"} onClick={() => setActivePage("reports")} />
        <NavItem icon={FiSettings} name="Settings" isActive={activeItem === "settings"} onClick={() => setActivePage("settings")} />
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
      onClick={onClick}
    >
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

export default SidebarContent;
