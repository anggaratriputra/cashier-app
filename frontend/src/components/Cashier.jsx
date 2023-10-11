import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  InputGroup,
  InputLeftElement,
  Input,
  Icon,
  Select,
  useToast,
} from "@chakra-ui/react";
import { FaCheck, FaTimes, FaEdit, FaSearch, FaPlusCircle } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import api from "../api";
import CashierForm from "./CashierForm";

function Cashier() {
  const [cashiers, setCashiers] = useState([]); // State to store product data
  const [activeItem, setActiveItem] = useState("cashier");
  const [currentPage, setCurrentPage] = useState(1); // Current page of products
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const cashiersPerPage = 8; // Number of products to display per page
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenForm, onOpen: onOpenForm, onClose: onCloseForm } = useDisclosure();
  const [cashierIdForStatusChange, setCashierIdForStatusChange] = useState(null);
  const [sortCriteria, setSortCriteria] = useState("alphabetical-asc"); // Default sorting criteria that matches the backend;
  const [searchInput, setSearchInput] = useState(""); // Initialize with "All"
  const [totalData, setTotalData] = useState(0);

  const toast = useToast();

  const fetchCashiers = async () => {
    try {
      const response = await api.get(`/cashier?page=${currentPage}&limit=${cashiersPerPage}&sort=${sortCriteria}&search=${searchInput}`);
      const cashierData = response.data.details;

      // Calculate the total number of pages based on the filtered data count
      const totalData = response.data.pagination.totalData;
      const totalPages = Math.ceil(totalData / cashiersPerPage);
      setTotalData(totalData);
      setTotalPages(totalPages);
      setCashiers(cashierData);
    } catch (error) {
      if (error?.response?.status == 404) {
        setTotalData(0);
        setTotalPages(0);
        setCashiers([]);
      } else {
        console.error(error);
        toast({
          title: "Error!",
          description: String(error),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  // Fetch data from the backend API
  useEffect(() => {
    fetchCashiers();
  }, [currentPage, sortCriteria, searchInput]);

  const handleAddCashier = async (values, actions) => {
    try {
      // Make a POST request to your API to add a new cashier
      const response = await api.post("/cashier/register", values);

      // Check if the request was successful
      if (response.data.ok) {
        // Optionally, you can display a success toast or take any other action here
        toast({
          title: "Cashier Added",
          description: "New cashier has been added successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchCashiers();

        // Close the modal
        onCloseForm();

        // Clear the form
        actions.resetForm();
      } else {
        // Handle the case where the API request was not successful
        toast({
          title: "Error!",
          description: "Failed to add the cashier. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 400) {
        toast({
          title: "Error!",
          description: error.response?.data?.error,
          status: "error",
          duration: 3000,
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

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const sortingOptions = [
    { label: "Alphabetical (A-Z)", value: "alphabetical-asc" },
    { label: "Alphabetical (Z-A)", value: "alphabetical-desc" },
  ];

  const handleSortChange = (event) => {
    const selectedSortValue = event.target.value;
    setSortCriteria(selectedSortValue);
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
      <Flex direction={"column"} ml={{ base: 0, md: 60 }} h="100vh" bgColor="#f7f7f7">
        <Box mt="38px" ml="40px">
          <Text mb={4} fontWeight="bold" fontSize="2xl">
            Cashiers List
          </Text>
          <Button
            colorScheme="red" // You can adjust the color as needed
            leftIcon={<FaPlusCircle />} // Icon for the "Add Cashier" button
            mb={4}
            onClick={onOpenForm}
          >
            Add Cashier
          </Button>
          <Flex justifyContent={"space-between"}>
            <Flex justifyContent={"right"} alignItems={"center"} mr="0px">
              <InputGroup w={"820px"}>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaSearch} color="gray.300" />
                </InputLeftElement>
                <Input type="text" value={searchInput} onChange={handleSearchInputChange} placeholder="Search cashiers" />
              </InputGroup>
            </Flex>
            <Flex gap={4} justifyContent={"right"} alignItems={"center"} mr="40px">
              <Text>Sort By</Text>
              <Select w="200px" value={sortCriteria} onChange={handleSortChange}>
                {sortingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Flex>
          </Flex>
        </Box>
        <Box bgColor="white" mt="28px" mx="40px" borderRadius={15} boxShadow={"lg"}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Username</Th>
                <Th>Cashier Name</Th>
                <Th>Cashier Email</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {cashiers.length == 0 ? (
                <Tr>
                  <Td colSpan={5}>
                    <Text textAlign={"center"} fontStyle={"italic"}>
                      No data matches.
                    </Text>
                  </Td>
                </Tr>
              ) : (
                ""
              )}
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
                  <Td>{cashier.email}</Td>
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

      {/* Modal for adding a new cashier */}
      <Modal isOpen={isOpenForm} onClose={onCloseForm} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Cashier</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Render the CashierForm component for adding a new cashier */}
            <CashierForm onSubmit={handleAddCashier} />
          </ModalBody>
          <ModalFooter>{/* You can add additional modal footer elements if needed */}</ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Cashier;
