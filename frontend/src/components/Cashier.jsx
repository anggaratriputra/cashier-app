import React, { useState, useEffect } from "react";
import { Box, Flex, Text, Table, Thead, Tbody, Tr, Th, Td, Button, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import { FaCheck, FaTimes, FaEdit } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import api from "../api";

function Cashier() {
  const [cashiers, setCashiers] = useState([]); // State to store product data
  const [activeItem, setActiveItem] = useState("cashier");
  const [currentPage, setCurrentPage] = useState(1); // Current page of products
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const cashiersPerPage = 8; // Number of products to display per page
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cashierIdForStatusChange, setCashierIdForStatusChange] = useState(null);

  // Fetch data from the backend API
  useEffect(() => {
    api
      .get(`/cashier?page=${currentPage}&limit=${cashiersPerPage}`)
      .then((response) => {
        // Assuming your API response has a "details" property with an array of products
        const cashiersData = response.data.details;
        setCashiers(cashiersData);

        // Calculate the total number of pages based on the total data count
        const totalData = response.data.pagination.totalData;
        const totalPages = Math.ceil(totalData / cashiersData);
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
  const openConfirmationModal = (cashierId) => {
    // Set the cashierId for status change
    setCashierIdForStatusChange(cashierId);
    onOpen();
  };

  const handleToggleAvailability = (cashierId) => {
    // Open the confirmation modal with the cashierId
    openConfirmationModal(cashierId);
  };

  const handleConfirmStatusChange = (cashierId) => {
    // Find the product by its ID in your products state
    const updatedCashiers = cashiers.map((cashier) => {
      if (cashier.id === cashierIdForStatusChange) {
        // Toggle the isActive property
        return { ...cashier, isActive: !cashier.isActive };
      }
      return cashier;
    });

    handleToggleCashierStatus(cashierId);

    // Update the products state with the updatedProducts array
    setCashiers(updatedCashiers);

    // Close the confirmation modal
    onClose();

    // Clear the productIdForStatusChange
    setCashierIdForStatusChange(null);
  };

  const handleToggleCashierStatus = (cashierId) => {
    // Make a GET request to the API endpoint with the cashierId
    api
      .put(`/cashier/${cashierId}/toggle-status`)
      .then((response) => {
        // Handle the successful response here (e.g., show a success message)
        console.log("Status toggled successfully");

        // You may want to refresh the cashier list to reflect the updated status
        // You can do this by re-fetching the cashier data or updating the current list
      })
      .catch((error) => {
        // Handle any errors (e.g., show an error message)
        console.error("Error toggling status:", error);
      });
  };

  return (
    <>
      <AdminSidebar setActivePage={setActivePage} activeItem={activeItem} />
      <Flex direction={"Column"} ml={{ base: 0, md: 60 }} h="100vh" bgColor="#f7f7f7">
        <Box mt="38px" ml="40px">
          <Text fontWeight="bold" fontSize="2xl">
            Cashier List
          </Text>
        </Box>
        <Box bgColor="white" mt="38px" mx="40px" h="65vh" borderRadius={15} boxShadow={"lg"}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Username</Th>
                <Th>Cashier Name</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {cashiers.map((cashier) => (
                <Tr
                  key={cashier.id}
                  style={{
                    backgroundColor: cashier.isActive ? null : "red", // Background color
                    color: cashier.isActive ? "black" : "white", // Font color
                  }}
                >
                  <Td>{cashier.id}</Td>
                  <Td>{cashier.username}</Td>
                  <Td>{cashier.firstName + " " + cashier.lastName}</Td>
                  <Td>
                    <Flex justifyContent={"space-between"} alignItems={"center"}>
                      {cashier.isActive ? (
                        <>
                          <Text>Active</Text>
                          <Flex>
                            <IconButton colorScheme="green" aria-label="Available" icon={<FaTimes />} size="sm" mr="2" onClick={() => handleToggleAvailability(cashier.id)} />
                          </Flex>
                        </>
                      ) : (
                        <>
                          <Text>Not Active</Text>
                          <Flex>
                            <IconButton colorScheme="red" aria-label="Not Available" icon={<FaCheck />} size="sm" mr="2" onClick={() => handleToggleAvailability(cashier.id)} />
                          </Flex>
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
            <Button colorScheme="red" mr={3} onClick={() => handleConfirmStatusChange(cashierIdForStatusChange)}>
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

export default Cashier;
