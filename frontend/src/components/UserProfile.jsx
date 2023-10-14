import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Center,
  Divider,
  Heading,
  Text,
  VStack,
  Button,
  Flex
} from "@chakra-ui/react";
import { useParams, Link } from "react-router-dom";
import api from "../api"; // Import your API functions
import Sidebar from "./Sidebar";

function UserProfile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);

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
  <Sidebar setActivePage={setActivePage} activeItem={activeItem} />

  <Flex direction={"column"} ml={{ base: 0, md: 60 }}>
      <Text fontWeight="bold" fontSize="2xl" mb="20px">
        Your Profile
      </Text>
  </Flex>

  <Center h="100vh">
      {user ? (
        <>
          <Avatar size="2xl" name={`${user.firstName} ${user.lastName}`} src={user.photoProfile} />
          <Heading>{`${user.firstName} ${user.lastName}`}</Heading>
          <Text>Email: {user.email}</Text>

          <Link to={`/editprofile/${username}`}>
            <Button colorScheme="red">Edit Profile</Button>
          </Link>
        </>
      ) : (
          <Text>Loading user data...</Text>
      )}

  </Center>
</>


  );
  };
export default UserProfile;
