import React from "react";
import { Icon, Flex, Image, Box, useColorModeValue, MenuButton, Avatar, Portal, MenuList, MenuItem, Menu, Text } from "@chakra-ui/react";
import { FiSettings } from "react-icons/fi";
import { BiMessageSquareAdd } from "react-icons/bi";
import { FaCashRegister } from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { MdFastfood } from "react-icons/md";
import { logout, updatePhotoProfile } from "../slices/accountSlices";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import api from "../api";

function AdminSidebar({ setActivePage, activeItem }) {
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
        dispatch(updatePhotoProfile(response.data.detail.photoProfile))
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  }, []);

  return (
    <Box bg={useColorModeValue("white", "gray.900")} borderRight="1px" borderRightColor={useColorModeValue("gray.200", "gray.700")} w={{ base: "full", md: 64 }} pos="fixed" h="100vh">
      {/* Sidebar Header */}
      <Flex direction="column" h="20" alignItems="center" mx="8" mt={4} mb={24} justifyContent="space-between">
        <Flex alignItems="center" justifyContent="center">
          {/* <Image src="https://i.ibb.co/mvwdFP8/mekdilogo3.png" w={"90%"} /> */}
          <Image src="https://i.ibb.co/FXkZwwz/logo-menuadmin.png" w={"75%"} />
        </Flex>
      </Flex>

      {/* Sidebar Navigation */}
      <Flex direction="column">
        <NavItem icon={BiMessageSquareAdd} name="Add Product" isActive={activeItem === "addProduct"} onClick={() => navigate("/admin/addproduct")} />
        <NavItem icon={BiMessageSquareAdd} name="Category Product" isActive={activeItem === "category"} onClick={() => navigate("/admin/category")} />
        <NavItem icon={MdFastfood} name="Product List" isActive={activeItem === "listProduct"} onClick={() => navigate("/admin/listproduct")} />
        <NavItem icon={FaCashRegister} name="Cashier List" isActive={activeItem === "cashier"} onClick={() => navigate("/admin/cashier")} />
        <NavItem icon={TbReportSearch} name="Reports" isActive={activeItem === "reports"} onClick={() => navigate("/admin/reports")} />
      </Flex>
      <Box position="fixed" bottom={10} left={6}>
        <Menu>
          <Flex direction={"row"} gap={4}>
            <MenuButton>
              <Avatar src={`http://localhost:8000/public/${photo}`} bg="red.500" />
            </MenuButton>
            <Box>
              <Text>{username} </Text>
              <Text fontWeight={"bold"}>ADMIN</Text>
            </Box>
          </Flex>
          <Portal>
            <MenuList>
            <MenuItem name="Your Profile" isActive={activeItem === "AdminProfile"} onClick={() => navigate("/admin/profile")}>Your Profile</MenuItem>
              <MenuItem name="Update Profile" isActive={activeItem === "UpdateProfile"} onClick={() => navigate("/admin/editprofile")}>
                Edit Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </Box>
    </Box>
  );
}

const NavItem = ({ icon, name, isActive, onClick }) => {
  const activeColor = useColorModeValue("yellow.300");
  const activeBgColor = "red.700";
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
        bg: "red.700",
        color: "yellow.300",
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
            color: "yellow.300",
          }}
          as={icon}
        />
      )}
      {name}
    </Flex>
  );
};
export default AdminSidebar;
