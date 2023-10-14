import React, { useState } from "react";
import { Icon, Flex, Image, CloseButton, Box, useColorModeValue, Avatar, Menu, MenuButton, Portal, MenuList, MenuItem, Text } from "@chakra-ui/react";
import { FiHome, FiTrendingUp, FiSettings } from "react-icons/fi";
import { useFormikContext } from "formik";
import { useNavigate } from "react-router-dom";
import { logout } from "../slices/accountSlices";
import { useDispatch, useSelector } from "react-redux";

const SidebarContent = ({ onClose, ...rest }) => {
  const username = useSelector((state) => state?.account?.profile?.data?.profile?.username);
  const photo = useSelector((state) => state?.account?.profile?.data?.profile?.photoProfile);
  const [activeItem, setActiveItem] = useState("menu"); // Initialize with the default active item
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const setActivePage = (itemName) => {
    setActiveItem(itemName);
  };


  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Box transition="3s ease" bg={useColorModeValue("white", "gray.900")} borderRight="1px" borderRightColor={useColorModeValue("gray.200", "gray.700")} w={{ base: "full", md: 64 }} pos="fixed" h="100vh" {...rest}>
      {/* Sidebar Header */}
      <Flex h="20" alignItems="center" mx="8" mt={4} mb={10} justifyContent="space-between">
        <Flex gap={2} alignItems="center" justifyContent="center">
          <Image src="https://i.ibb.co/LzsMhD0/mekdilogo2.png" w={"90%"} />
        </Flex>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>

      {/* Sidebar Navigation */}
      <Flex direction="column">
        <NavItem icon={FiHome} name="Menu" isActive={activeItem === "menu"} onClick={() => setActivePage("menu")} />
        <NavItem icon={FiTrendingUp} name="Bills" isActive={activeItem === "reports"} onClick={() => setActivePage("reports")} />
      </Flex>
      <Box position="fixed" bottom={10} left={3}>
        <Menu>
        <Flex direction={"row"} gap={2}>
            <MenuButton>
              <Avatar src={`http://localhost:8000/public/${photo}`}  bg="red.500" />
            </MenuButton>
            <Box>
              <Text>{username} </Text>
              <Text fontWeight={"bold"}>CASHIER</Text>
            </Box>
          </Flex>
          <Portal>
            <MenuList>
              <MenuItem>Your Profile</MenuItem>
              <MenuItem name="Update Profile" isActive={activeItem === "UpdateProfile"} onClick={() => navigate("/editprofile")}>
                Edit Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </Box>
    </Box>
  );
};

const NavItem = ({ icon, name, isActive, onClick }) => {
  const activeColor = useColorModeValue("white", "gray.900");
  const activeBgColor = "red";
  const fontWeight = isActive ? "bold" : "normal"; // Set the font-weight conditionally

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
      fontWeight={fontWeight} // Apply font-weight conditionally
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
