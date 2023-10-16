import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { incrementCount, decrementCount, removeSelectedProduct, clearSelectedProduct } from "../slices/orderSlices";
import { BiMinus, BiPlus } from "react-icons/bi";
import { motion } from "framer-motion";
import { Box, Flex, Image, SimpleGrid, Text, Button, Divider, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Select, Input, useToast } from "@chakra-ui/react";
import api from "../api";

function Order() {
  const selectedProducts = useSelector((state) => state.order.selectedProducts);
  const dispatch = useDispatch();
  const longPressDuration = 600; // Long press duration in milliseconds
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [paymentType, setPaymentType] = useState("cash");
  const [cashAmount, setCashAmount] = useState(0);
  const [changeAmount, setChangeAmount] = useState(0);

  const toast = useToast();

  const formatToRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  const total = selectedProducts.reduce((acc, product) => acc + product.price * product.count, 0);

  const itemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const handleRemoveItem = (item) => {
    dispatch(removeSelectedProduct(item));
    setIsModalOpen(false);
  };

  const handleLongPress = (item) => {
    setItemToRemove(item);
    setIsModalOpen(true);
  };

  const handleDecrement = (item) => {
    if (item.count === 1) {
      // If the count is 1, show the confirmation modal
      setItemToRemove(item);
      setIsModalOpen(true);
    } else {
      dispatch(decrementCount(item));
    }
  };

  // Step 2: Function to handle payment type selection
  const handlePaymentTypeSelect = (type) => {
    setPaymentType(type);
  };

  // Step 3: Open a new modal for payment selection
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handlePaymentModalOpen = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
  };

  const [isSelectedPaymentModalOpen, setIsSelectedPaymentModalOpen] = useState(false);

  const handleSelectedPaymentModalOpen = () => {
    setIsSelectedPaymentModalOpen(true);
    setIsPaymentModalOpen(false);
  };

  const handleSelectedPaymentModalClose = () => {
    setIsSelectedPaymentModalOpen(false);
  };

  const handleCreateTransaction = async () => {
    if (paymentType === "cash") {
      if (isNaN(cashAmount) || cashAmount < total + total * 0.05) {
        // Invalid cash amount, do not proceed with the transaction
        // You can display an error message to the user or take appropriate action.
        return;
      }
    }

    const items = selectedProducts.map((product) => ({
      productId: product.id,
      quantity: product.count,
    }));

    try {
      const response = await api.post("/transaction", {
        items,
        paymentType,
      });

      if (response.data.ok) {
        toast({
          title: "Transaction Added",
          description: "New transaction has been added successfully.",
          status: "success",
          duration: 1800,
          isClosable: true,
          onCloseComplete() {
            dispatch(clearSelectedProduct());
          },
        });
      } else {
        toast({
          title: "Error!",
          description: "Failed to add new transaction. Please try again.",
          status: "error",
          duration: 1800,
          isClosable: true,
        });
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast({
          title: "Error!",
          description: error.response?.data?.error,
          status: "error",
          duration: 1800,
          isClosable: true,
        });
      } else {
        // Handle any errors, e.g., network issues
        console.error("Error adding cashier:", error);
        toast({
          title: "Error!",
          description: "An error occurred. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  return (
    <Flex direction="column" width="30vw" h="100vh" bgColor="red.700">
      <style>
        {`
          .scroll-container::-webkit-scrollbar {
            width: 0;
            height: 0;
          }
        `}
      </style>
      <Box mt="38px" mx={{ base: 0, md: 2 }}>
        <Flex justifyContent={"center"} alignItems="center">
          <Text textAlign="center" color="yellow.300" fontSize="2xl">
            <b>Order</b> Menu
          </Text>
        </Flex>
        <Box display="flex" mt={4} justifyContent="center" maxHeight="400px" className="scroll-container">
          <Box h={"400px"} p={4} className="scroll-container" overflowY={"scroll"}>
            <SimpleGrid columns={1} spacing={2} className="scroll-container">
              {selectedProducts?.map((selectedProduct, index) => (
                <motion.div variants={itemVariants} initial="initial" animate="animate" exit="initial" key={selectedProduct.id}>
                  <Box
                    px={4}
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    gap={2}
                    borderRadius={"8px"}
                    w="300px"
                    h={"90px"}
                    boxShadow={"2xl"}
                    bg="white"
                    transition="background 0.4s, transform 0.8s"
                    _hover={{ background: "yellow.100", transform: "scale(1.05)"}}
                    onContextMenu={(e) => e.preventDefault()}
                    onMouseDown={(e) => {
                      const timer = setTimeout(() => handleLongPress(selectedProduct), longPressDuration);
                      e.target.dataset.timer = timer;
                    }}
                    onMouseUp={(e) => {
                      clearTimeout(e.target.dataset.timer);
                    }}
                    onMouseLeave={(e) => {
                      clearTimeout(e.target.dataset.timer);
                    }}
                  >
                    <Box w="60px">
                      <Image src={`http://localhost:8000/public/${selectedProduct.image}`} />
                    </Box>
                    <Flex direction="column">
                      <Text textAlign={"center"} fontSize="sm" color="black" fontWeight={"bold"}>
                        {selectedProduct.name}
                      </Text>
                      <Text color="black" fontSize={"sm"}>
                        {formatToRupiah(selectedProduct.price)}
                      </Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                      <IconButton as={BiMinus} size="sm" p={2} bgColor={"yellow.300"} _hover={{ background: "red.700", color: "yellow.300" }} onClick={() => handleDecrement(selectedProduct)}>
                        {" "}
                        <b>-</b>
                      </IconButton>
                      <Text color="black" fontWeight={"bold"}>
                        {selectedProduct.count}
                      </Text>
                      <IconButton as={BiPlus} size="sm" p={2} w={"20px"} bgColor={"yellow.300"} _hover={{ background: "red.700", color: "yellow.300" }} onClick={() => dispatch(incrementCount(selectedProduct))}></IconButton>
                    </Flex>
                  </Box>
                </motion.div>
              ))}
            </SimpleGrid>
          </Box>
        </Box>
      </Box>
      {total > 0 && (
        <Box my={8}>
          <Divider />
        </Box>
      )}
      {total > 0 && (
        <Flex direction={"column"} mt={4}>
          <Flex alignItems="center" justifyContent="space-between" mx={8}>
            <Text color="yellow.300" fontSize="xl">
              Sub Total
            </Text>
            <Text color="yellow.300" fontWeight="bold" fontSize="xl">
              {formatToRupiah(total)}
            </Text>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" mx={8}>
            <Text color="yellow.300" fontSize="xl">
              Tax (5%)
            </Text>
            <Text color="yellow.300" fontWeight="bold" fontSize="xl">
              {formatToRupiah(total * 0.05)}
            </Text>
          </Flex>
          <Button size={"lg"} mt={10} mx={8} bg={"yellow.300"} color={"red.700"} onClick={handlePaymentModalOpen} _hover={{ background: "yellow.200" }}>
            <Text fontWeight={"bold"} fontSize={"lg"}>
              {" "}
              CHARGE {formatToRupiah(total + total * 0.05)}{" "}
            </Text>
          </Button>
        </Flex>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isCentered motionPreset="slideInBottom">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
        <ModalContent>
          <ModalHeader>Remove Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to remove this item?</ModalBody>
          <ModalFooter>
            <Flex gap={2}>
              <Button w="80px" colorScheme="red" onClick={() => handleRemoveItem(itemToRemove)}>
                Yes
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>No</Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isPaymentModalOpen} onClose={handlePaymentModalClose} isCentered motionPreset="slideInBottom" blockScrollOnMount={false}>
        <ModalOverlay bg="blackAlpha.300" />
        <ModalContent>
          <ModalHeader>Payment Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex h={"6vh"} justifyContent={"center"} alignItems={"center"}>
              <Text>
                Total Price <b>{formatToRupiah(total + total * 0.05)}</b>{" "}
              </Text>
              <Select
                value={paymentType}
                onChange={(e) => handlePaymentTypeSelect(e.target.value)} // Step 2: Handle payment type selection
              >
                <option value="cash">Cash</option>
                <option value="qris">QRIS</option>
                <option value="debitcard">Debit Card</option>
                <option value="creditcard">Credit Card</option>
              </Select>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button w="160px" bgColor="red.700" color={"yellow.300"} _hover={{ background: "red.900" }} onClick={handleSelectedPaymentModalOpen}>
              Confirm Payment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isSelectedPaymentModalOpen} onClose={handleSelectedPaymentModalClose} isCentered motionPreset="slideInBottom" blockScrollOnMount={false}>
        <ModalOverlay bg="blackAlpha.300" />
        <ModalContent>
          <ModalHeader>
            {paymentType === "cash" && "Cash Payment"}
            {paymentType === "creditcard" && "Credit Card Payment"}
            {paymentType === "debitcard" && "Debit Card Payment"}
            {paymentType === "qris" && "QRIS Payment"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction={"column"} justifyContent={"center"} alignItems={"center"}>
              {paymentType === "cash" && (
                <Flex direction="column" alignItems="center">
                  <Text mb="10px">Enter Cash Amount</Text>
                  <Input
                    type="number"
                    value={cashAmount}
                    onChange={(e) => {
                      const amount = parseFloat(e.target.value);
                      setCashAmount(amount);
                      const change = amount - (total + total * 0.05);
                      setChangeAmount(change);
                    }}
                  />
                </Flex>
              )}
              {paymentType === "creditcard" && (
                <Flex direction={"column"} gap={4} justifyContent={"center"} alignItems={"center"}>
                  <Text fontWeight={"bold"}>Waiting EDC Machine</Text>
                  <Image w={"80%"} src="https://1.bp.blogspot.com/-CEyh4wMF3JA/YMOrAyUMN8I/AAAAAAAAGBA/X6OP2DL7wFE_TxTk8y9wMb3FHDtoBiY2gCLcBGAsYHQ/s800/ezgif.com-video-to-gif__4_.gif" />
                </Flex>
              )}
              {paymentType === "debitcard" && (
                <Flex direction={"column"} gap={4} justifyContent={"center"} alignItems={"center"}>
                  <Text fontWeight={"bold"}>Waiting EDC Machine</Text>
                  <Image w={"80%"} src="https://1.bp.blogspot.com/-CEyh4wMF3JA/YMOrAyUMN8I/AAAAAAAAGBA/X6OP2DL7wFE_TxTk8y9wMb3FHDtoBiY2gCLcBGAsYHQ/s800/ezgif.com-video-to-gif__4_.gif" />
                </Flex>
              )}
              {paymentType === "qris" && (
                <Flex justifyContent={"center"} alignItems={"center"}>
                  <Image w={"90%"} src="https://i.ibb.co/5xjjD4P/qr-dummy.png" />
                </Flex>
              )}
              <Text mt={"10px"}>
                Charge <b>{formatToRupiah(total + total * 0.05)}</b>{" "}
              </Text>
              {paymentType === "cash" && (
                <Text>
                  Change <b>{formatToRupiah(changeAmount > 0 ? changeAmount : 0)}</b>
                </Text>
              )}
            </Flex>
            <Flex justifyContent={"center"} alignItems={"center"} mt={"10px"}>
              <Button w="80px" bgColor="red.700" color={"yellow.300"} _hover={{ background: "red.900" }} onClick={handleCreateTransaction} disabled={paymentType === "cash" && (isNaN(cashAmount) || cashAmount < total + total * 0.05)}>
                Pay
              </Button>
            </Flex>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default Order;
