import { Box, Flex, Image, SimpleGrid, Text, Button, Divider } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { incrementCount, decrementCount } from "../slices/orderSlices"; // Import the appropriate actions

function Order() {
  const selectedProducts = useSelector((state) => state.order.selectedProducts);
  const dispatch = useDispatch();

  const formatToRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };
  const total = selectedProducts.reduce((acc, product) => acc + product.price * product.count, 0);

  return (
    <Flex direction="column" width="33vw" h="100vh" bgColor="red.700">
      <style>
        {`
          .scroll-container::-webkit-scrollbar {
            width: 0;
            height: 0;
          }
        `}
      </style>
      <Box mt="38px" mx={{ base: 0, md: 8 }}>
        <Flex alignItems="center">
          <Text color="yellow.300" fontSize="2xl">
            <b>Order</b> Menu
          </Text>
        </Flex>
        <Box display="flex" justifyContent="center" maxHeight="600px" overflowY={"scroll"} className="scroll-container">
          <Box mt={4} h={"550px"} className="scroll-container">
            <SimpleGrid columns={1} spacing={2} className="scroll-container">
              {selectedProducts?.map((selectedProduct) => (
                <Box px={6} display={"flex"} justifyContent={"space-between"} alignItems={"center"} gap={2} h="80px" borderRadius={"10px"} w="420px" boxShadow={"lg"} bg="white" key={selectedProduct.id}>
                  <Image w="20%" src={`http://localhost:8000/public/${selectedProduct.image}`} />
                  <Flex direction="column">
                    <Text color="black" fontWeight={"bold"}>
                      {selectedProduct.name}
                    </Text>
                    <Text color="black" fontWeight={"medium"}>
                      {formatToRupiah(selectedProduct.price)}
                    </Text>
                  </Flex>
                  <Flex align="center" gap={2}>
                    <Button bgColor={"yellow.300"} onClick={() => dispatch(decrementCount(selectedProduct))}>
                      {" "}
                      <b>-</b>
                    </Button>
                    <Text color="black" fontWeight={"bold"}>
                      {selectedProduct.count}
                    </Text>
                    <Button bgColor={"yellow.300"} onClick={() => dispatch(incrementCount(selectedProduct))}>
                      <b>+</b>
                    </Button>
                  </Flex>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </Box>
      </Box>
      {total > 0 && (
        <Box my={2}>
          <Divider />
        </Box>
      )}
      {total > 0 && (
        <Flex alignItems="center" justifyContent="space-between" mx={8}>
          <Text color="yellow.300" fontSize="xl" mt="10px">
            Sub Total
          </Text>
          <Text color="yellow.300" fontWeight="bold" fontSize="xl">
            {formatToRupiah(total)}
          </Text>
        </Flex>
      )}
    </Flex>
  );
}

export default Order;
