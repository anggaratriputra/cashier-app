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
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";

function UserProfile() {
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
  <Sidebar setActivePage={setActivePage} activeItem={activeItem} />

  <Flex direction="row" ml={{ base: 0, md: 64 }} width="60vw" h="100vh" bgColor="#f7f7f7">
    <Box mt="38px" p={6} w="100%">

      {/* "Your Profile" section */}
      <VStack
      spacing={2}
      align='stretch'>
        <Box>
        <Text ml="40px" fontSize="2xl" fontWeight="bold">
          Your Profile
        </Text>
        </Box>
        <Stack direction={['column', 'row']} spacing='24px'>
        <Box>
        <Avatar size="2xl" src={`http://localhost:8000/public/${photo}`} />
        <Heading>{`${firstName} ${lastName}`}</Heading>
        </Box>
        </Stack>
        <Box>
        <Text>Username: {profileUsername}</Text>
        </Box>
        <Box>
        <Text>Email: {email}</Text>
        </Box>

        <Box>
        <Link to={`/editprofile`}>
          <Button colorScheme="red">Edit Profile</Button>
        </Link>
        </Box>
      </VStack>
    </Box>
  </Flex>
</>


  );
  };
export default UserProfile;
