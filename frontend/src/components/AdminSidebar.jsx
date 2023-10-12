import React from "react";
import { Icon, Flex, Image, Box, useColorModeValue, MenuButton, Avatar, Portal, MenuList, MenuItem } from "@chakra-ui/react";
import { FiSettings } from "react-icons/fi";
import { BiMessageSquareAdd } from "react-icons/bi";
import { FaCashRegister } from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { MdFastfood } from "react-icons/md";
import { logout } from "../slices/accountSlices";
import { useDispatch } from "react-redux";
import Menu from "./Menu";

const AdminSidebar = ({ activeItem }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };


  return (
    <Box bg={useColorModeValue("white", "gray.900")} borderRight="1px" borderRightColor={useColorModeValue("gray.200", "gray.700")} w={{ base: "full", md: 60 }} pos="fixed" h="100vh">
      {/* Sidebar Header */}
      <Flex direction="column" h="20" alignItems="center" mx="8" mt={4} mb={10} justifyContent="space-between">
        <Flex alignItems="center" justifyContent="center">
          <Image src="https://i.ibb.co/mvwdFP8/mekdilogo3.png" w={"90%"} />
        </Flex>
      </Flex>

      {/* Sidebar Navigation */}
      <Flex direction="column">
        <NavItem icon={BiMessageSquareAdd} name="Add Product" isActive={activeItem === "addProduct"} onClick={() => navigate("/admin/addproduct")} />
        <NavItem icon={BiMessageSquareAdd} name="Category Product" isActive={activeItem === "category"} onClick={() => navigate("/admin/category")} />
        <NavItem icon={MdFastfood} name="Product List" isActive={activeItem === "listProduct"} onClick={() => navigate("/admin/listproduct")} />
        <NavItem icon={FaCashRegister} name="Cashier List" isActive={activeItem === "cashier"} onClick={() => navigate("/admin/cashier")} />
        <NavItem icon={TbReportSearch} name="Reports" isActive={activeItem === "reports"} onClick={() => navigate("/admin/reports")} />
        <NavItem icon={FiSettings} name="Settings" isActive={activeItem === "settings"} onClick={() => navigate("/admin/settings")} />
      </Flex>
      <Box position="fixed" bottom={10} left={3}>

      <Menu>
          <MenuButton>
            <Avatar bg="red.500" />
          </MenuButton>
          <Portal>
            <MenuList>
              <MenuItem>Your Profile</MenuItem>
              <MenuItem name="Update Profile" isActive={activeItem === "UpdateProfile"} onClick={() => navigate("/login/update/:username")}>
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
