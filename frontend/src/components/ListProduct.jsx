import React, { useState, useEffect } from "react";
import { Box, Flex, Text, Table, Thead, Tbody, Tr, Th, Td, Button, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import { FaCheck, FaTimes } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import api from "../api";

function ListProduct() {
  const [products, setProducts] = useState([]); // State to store product data
  const [activeItem, setActiveItem] = useState("listProduct");
  const [currentPage, setCurrentPage] = useState(1); // Current page of products
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const productsPerPage = 8; // Number of products to display per page
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [productIdForStatusChange, setProductIdForStatusChange] = useState(null);

  // Fetch data from the backend API
  useEffect(() => {
    api
      .get(`/products?page=${currentPage}&limit=${productsPerPage}`)
      .then((response) => {
        // Assuming your API response has a "details" property with an array of products
        const productData = response.data.details;
        setProducts(productData);

        // Calculate the total number of pages based on the total data count
        const totalData = response.data.pagination.totalData;
        const totalPages = Math.ceil(totalData / productsPerPage);
        setTotalPages(totalPages);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [currentPage]);

  const setActivePage = (itemName) => {
    setActiveItem(itemName);
  };

  const handlePageChange = (newPage) => {
    // Ensure the new page is within bounds
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Function to format a number as Indonesian Rupiah
  const formatToRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  const openConfirmationModal = (productId) => {
    // Set the productId for status change
    setProductIdForStatusChange(productId);
    onOpen();
  };

  const handleToggleAvailability = (productId) => {
    // Open the confirmation modal with the productId
    openConfirmationModal(productId);
  };

  const handleConfirmStatusChange = () => {
    // Find the product by its ID in your products state
    const updatedProducts = products.map((product) => {
      if (product.id === productIdForStatusChange) {
        // Toggle the isActive property
        return { ...product, isActive: !product.isActive };
      }
      return product;
    });

    // Update the products state with the updatedProducts array
    setProducts(updatedProducts);

    // Close the confirmation modal
    onClose();

    // Clear the productIdForStatusChange
    setProductIdForStatusChange(null);
  };

  return (
    <>
      <AdminSidebar setActivePage={setActivePage} activeItem={activeItem} />
      <Flex direction={"Column"} ml={{ base: 0, md: 60 }} h="100vh" bgColor="#f7f7f7">
        <Box mt="38px" ml="40px">
          <Text fontWeight="bold" fontSize="2xl">
            Product List
          </Text>
        </Box>
        <Box bgColor="white" mt="38px" mx="40px" h="65vh" borderRadius={15} boxShadow={"lg"}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Price</Th>
                <Th>Category</Th>
                <Th>Stock</Th>
              </Tr>
            </Thead>
            <Tbody>
              {products.map((product) => (
                <Tr
                  key={product.id}
                  style={{
                    backgroundColor: product.isActive ? null : "red", // Background color
                    color: product.isActive ? "black" : "white", // Font color
                  }}
                >
                  <Td>{product.id}</Td>
                  <Td>{product.name}</Td>
                  <Td>{formatToRupiah(product.price)}</Td>
                  <Td>{product.category}</Td>
                  <Td>
                    <Flex justifyContent={"space-between"} alignItems={"center"}>
                      {product.isActive ? (
                        <>
                          <Text>Available</Text>
                          <IconButton colorScheme="green" aria-label="Available" icon={<FaTimes />} size="sm" mr="2" onClick={() => handleToggleAvailability(product.id)} />
                        </>
                      ) : (
                        <>
                          <Text>Not Available</Text>
                          <IconButton colorScheme="red" aria-label="Not Available" icon={<FaCheck />} size="sm" mr="2" onClick={() => handleToggleAvailability(product.id)} />
                        </>
                      )}
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="right" gap={2} mt="20px" textAlign="right" mr={20}>
          <Text fontWeight={"bold"}> Page </Text>
          <Box>
            <Button key={1} size="sm" onClick={() => handlePageChange(1)} variant={currentPage === 1 ? "solid" : "outline"} mr="5px">
              1
            </Button>
            {totalPages > 1 &&
              Array.from({ length: totalPages - 1 }, (_, index) => (
                <Button key={index + 2} size="sm" onClick={() => handlePageChange(index + 2)} variant={currentPage === index + 2 ? "solid" : "outline"} mr="5px">
                  {index + 2}
                </Button>
              ))}
          </Box>
        </Box>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Status Change</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to change the availability status?</ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleConfirmStatusChange()}>
              Confirm
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ListProduct;
