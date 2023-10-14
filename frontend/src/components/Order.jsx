import { Box, Flex, Text } from "@chakra-ui/react";

function Order() {
  return (
    <>
      <Flex direction={"column"} ml={{ base: 0, md: 8 }} h="100vh" bgColor="white">
        <Box mt="46px">
          <Flex alignItems={"center"}>
            <Text fontSize={"2xl"}>
              <b>Order</b> Menu
            </Text>
          </Flex>
        </Box>
      </Flex>
    </>
  );
}

export default Order;
