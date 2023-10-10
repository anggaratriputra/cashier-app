import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import AdminSidebar from "./AdminSidebar";
import { useState } from "react";

function Reports() {
  const [activeItem, setActiveItem] = useState("reports");
  const setActivePage = (itemName) => {
    setActiveItem(itemName);
  };
  return (
    <>
    <AdminSidebar setActivePage={setActivePage} activeItem={activeItem} />
      <Flex direction={"row"} ml={{ base: 0, md: 60 }}>
        <Box bgColor={"#f7f7f7"} h={"100vh"} w={"100vw"}>
          <Text fontWeight="bold" mt="38px" ml="40px" fontSize="2xl">
          Reports
           </Text>
        </Box>
      </Flex>
    </>
  );
}

export default Reports;
