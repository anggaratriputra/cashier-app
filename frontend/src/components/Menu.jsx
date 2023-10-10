import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import Sidebar from "./Sidebar";

function Menu() {
  return (
    <>
      <Flex direction={"row"} ml={{ base: 0, md: 60 }}>
        <Box bgColor={"#f7f7f7"} h={"100vh"} w={"60vw"}>
          <Text mt="38px" ml="40px" fontSize="2xl">
            {" "}
            <b>Menu </b>
            Category
          </Text>
        </Box>
        <Box bg={"white"}>
        <Text mt="38px" ml="40px" fontSize="2xl">
            {" "}
            <b>Order </b>
            Menu
          </Text>
        </Box>
      </Flex>
    </>
  );
}

export default Home;
