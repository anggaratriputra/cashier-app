import React from "react";
import { Icon, Flex, Image, Box, useColorModeValue, MenuButton, Avatar, Portal, MenuList, MenuItem, Menu, Text } from "@chakra-ui/react";
import { FiSettings, FiHome, FiTrendingUp } from "react-icons/fi";
import { BiMessageSquareAdd, BiSolidFoodMenu } from "react-icons/bi";
import { FaFileInvoiceDollar} from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { MdFastfood } from "react-icons/md";
import { logout } from "../slices/accountSlices";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import api from "../api";
import { updatePhotoProfile } from "../slices/accountSlices";

const Sidebar = ({ activeItem }) => {
  const [userProfile, setUserProfile] = useState(null);
  const username = useSelector((state) => state?.account?.profile?.data?.profile?.username);
  const photo = useSelector((state) => state?.account?.userPhotoProfile);
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
        setUserProfile(response.data.detail)
        dispatch(updatePhotoProfile(response.data.detail.photoProfile))
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  }, []);

  return (

    <Box bg={useColorModeValue("white", "gray.900")} borderRight="1px" borderRightColor={useColorModeValue("gray.200", "gray.700")} w={{ base: "full", md: "18vw" }} pos="fixed" h="100vh">
      {/* Sidebar Header */}
      <Flex direction="column" h="14vh" alignItems="center" mx="8" mt={4} mb={10} justifyContent="space-between">
        <Flex alignItems="center" justifyContent="center">
          {/* <Image src="https://i.ibb.co/LzsMhD0/mekdilogo2.png" w={"90%"} /> */}
          <Image src="https://i.ibb.co/sQZDWss/mekdi-menucashier.png" w={"60%"} />
        </Flex>
      </Flex>
      {/* Sidebar Navigation */}
      <Flex direction="column">
        <NavItem icon={BiSolidFoodMenu} name="Menu" isActive={activeItem === "menu"} onClick={() => navigate("/menu")} />
        <NavItem icon={FaFileInvoiceDollar} name="Transaction" isActive={activeItem === "transaction"} onClick={() => navigate("/transaction")} />
      </Flex>
      <Box position="fixed" bottom={10} left={6}>
        <Menu>
          <Flex direction={"row"} gap={4}>
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
              <MenuItem name="Update Profile" isActive={activeItem === "UpdateProfile"} onClick={() => navigate("/editprofile")}>Edit Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </Box>
    </Box>
  );
};

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
export default Sidebar;
