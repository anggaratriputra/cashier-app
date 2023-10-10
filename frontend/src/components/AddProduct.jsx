import { Box, Flex, HStack, Text } from "@chakra-ui/react";


function AddProduct() {
  return (
    <>
      <Flex direction={"row"} ml={{ base: 0, md: 60 }}>
        <Box bgColor={"#f7f7f7"} h={"100vh"} w={"100vw"}>
          <Text fontWeight="bold" mt="38px" ml="40px" fontSize="2xl">
           ADD PRODUCT
           </Text>
        </Box>
      </Flex>
    </>
  );
}

export default AddProduct;
