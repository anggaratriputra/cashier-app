import { Box, Flex, HStack, Text } from "@chakra-ui/react";


function Reports() {
  return (
    <>
      <Flex direction={"row"} ml={{ base: 0, md: 60 }}>
        <Box bgColor={"#f7f7f7"} h={"100vh"} w={"100vw"}>
          <Text mt="38px" ml="40px" fontSize="2xl">
           INI REPORTS
           </Text>
        </Box>
      </Flex>
    </>
  );
}

export default Reports;
