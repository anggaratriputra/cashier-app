import { Box, Flex, Text } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import { useState } from "react";

function Menu() {
  const [activeItem, setActiveItem] = useState("menu");

  const setActivePage = (itemName) => {
    setActiveItem(itemName);
  };

  return (
    <>
      <Sidebar setActivePage={setActivePage} activeItem={activeItem} />
      <Flex direction={"row"} ml={{ base: 0, md: 64 }}>
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

export default Menu;
