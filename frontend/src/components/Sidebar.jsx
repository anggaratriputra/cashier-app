import React from "react";
import { Icon, Flex, Image, Box, useColorModeValue, MenuButton, Avatar, Portal, MenuList, MenuItem, Menu, Text } from "@chakra-ui/react";
import { FiSettings, FiHome, FiTrendingUp } from "react-icons/fi";
import { BiMessageSquareAdd } from "react-icons/bi";
import { FaCashRegister } from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { MdFastfood } from "react-icons/md";
import { logout } from "../slices/accountSlices";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import api from "../api";

const Sidebar = ({ activeItem }) => {
  const [userProfile, setUserProfile] = useState(null);
  const username = useSelector((state) => state?.account?.profile?.data?.profile?.username);
  const photo = useSelector((state) => state.account.userPhotoProfile);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    // Make an HTTP request to fetch the user's profile information
    api
      .get(`login/myprofile/${username}`)
      .then((response) => {
        setUserProfile(response.data.detail);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  }, []);

  return (
    <Box bg={useColorModeValue("white", "gray.900")} borderRight="1px" borderRightColor={useColorModeValue("gray.200", "gray.700")} w={{ base: "full", md: 64 }} pos="fixed" h="100vh">
      {/* Sidebar Header */}
      <Flex direction="column" h="20" alignItems="center" mx="8" mt={4} mb={10} justifyContent="space-between">
        <Flex alignItems="center" justifyContent="center">
          <Image src="https://i.ibb.co/LzsMhD0/mekdilogo2.png" w={"90%"} />
        </Flex>
      </Flex>

      {/* Sidebar Navigation */}
      <Flex direction="column">
        <NavItem icon={FiHome} name="Menu" isActive={activeItem === "menu"} onClick={() => navigate("/menu")} />
        <NavItem icon={FiTrendingUp} name="Bills" isActive={activeItem === "bills"} onClick={() => navigate("/bills")} />
      </Flex>
      <Box position="fixed" bottom={10} left={3}>
        <Menu>
          <Flex direction={"row"} gap={2}>
            <MenuButton>
              <Avatar src={`http://localhost:8000/public/${photo}`} bg="red.500" />
            </MenuButton>
            <Box>
              <Text>{username} </Text>
              <Text fontWeight={"bold"}>CASHIER</Text>
            </Box>
          </Flex>
          <Portal>
            <MenuList>
              <MenuItem name="Your Profile" isActive={activeItem === "UserProfile"} onClick={() => navigate("/profile")}>Your Profile</MenuItem>
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
export default Sidebar;
