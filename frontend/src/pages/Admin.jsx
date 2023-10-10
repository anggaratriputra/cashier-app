import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import AdminSidebar from "../components/AdminSidebar";

function Admin() {
  return (
    <>
    <AdminSidebar />
      <Flex direction={"row"} ml={{ base: 0, md: 60 }}>
        <Box bgColor={"#f7f7f7"} h={"100vh"} w={"100vw"}>
          <Text mt="38px" ml="40px" fontSize="2xl">
           INI PAGE ADMIN!
          </Text>
        </Box>
      </Flex>
    </>
  );
}

export default Admin;
