import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";

function Home() {
  return (
    <>
      <Sidebar />
      <Flex direction={"row"} ml={{ base: 0, md: 60 }}>
        <Box bgColor={"#f7f7f7"} h={"100vh"} w={"60vw"}>
          <Text mt="38px" ml="40px" fontSize="2xl">
            INI PAGE KASIR!
          </Text>
        </Box>
      </Flex>
    </>
  );
}

export default Home;
