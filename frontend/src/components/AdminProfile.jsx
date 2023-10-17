import React, { useState, useEffect } from "react";
import {
  Avatar,
  Center,
  Heading,
  Text,
  Button,
  Flex,
  Box,
  VStack,
  Stack
} from "@chakra-ui/react";
import { useParams, Link } from "react-router-dom";
import api from "../api"; // Import your API functions
import AdminSidebar from "./AdminSidebar";
import { useSelector } from "react-redux";

function AdminProfile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const profileUsername = useSelector((state) => state?.account?.profile?.data?.profile?.username);
  const firstName = useSelector((state) => state?.account?.profile?.data?.profile?.firstName);
  const lastName = useSelector((state) => state?.account?.profile?.data?.profile?.lastName);
  const email = useSelector((state) => state?.account?.profile?.data?.profile?.email);
  const photo = useSelector((state) => state.account.userPhotoProfile);

  const [activeItem, setActiveItem] = useState("userProfile");
  const setActivePage = (newProfile) => {
    setActiveItem(newProfile);
  };

const fetchUser = async () => {
    try {
        const response = await api.get(`/login/profile/${username}`);
        const userData = response.data.profile;
        setUser(userData)
    } catch (error) {
        console.log("Error fetching profile details:", error);
    }
}

useEffect(() => {
    fetchUser();
  }, [username]);


  return (
<>
  <AdminSidebar setActivePage={setActivePage} activeItem={activeItem} />

  <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      padding="20px"
      backgroundColor="#f7f7f7"
    >
  <Flex
        justifyContent="center"
        width="33vw"
        borderRadius="14px"
        backgroundColor="white"
        color="black"
        boxShadow="lg"
        flexDirection="column"
        padding="4"
        align="center"
      >
        <Heading fontWeight="bold" fontSize="2xl" mb="4">
          Your Profile
        </Heading>
        <Avatar size="2xl" src={`http://localhost:8000/public/${photo}`} />
        <Heading as="h2" size="lg" mt="4">
          {`${firstName} ${lastName}`}
        </Heading>
        <Text as="b" size="lg">ADMIN</Text>
        <Text mt="2">Username: {profileUsername}</Text>
        <Text>Email: {email}</Text>
        <Link to={`/admin/editprofile`}>
          <Button colorScheme="red" mt="4">
            Edit Profile
          </Button>
        </Link>
        </Flex>
        </Flex>
</>


  );
  };
export default AdminProfile;
