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
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { FaCheck, FaEdit, FaSearch, FaTimes } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import api from "../api";
import UpdateProductModal from "./UpdateProductModal";
import { useNavigate } from "react-router-dom";

function AdminValidationModal({ isOpen, onClose, onNavigate }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCloseable={false} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Permission Denied</ModalHeader>
        <ModalBody>You are not an admin.</ModalBody>
        <ModalFooter>
          <Button colorScheme="red" onClick={onNavigate}>
            OK
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
import UpdateProductModal from "./UpdateProductModal";
import { useNavigate } from "react-router-dom";

function AdminValidationModal({ isOpen, onClose, onNavigate }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCloseable={false} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Permission Denied</ModalHeader>
        <ModalBody>You are not an admin.</ModalBody>
        <ModalFooter>
          <Button colorScheme="red" onClick={onNavigate}>
            OK
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function ListProduct() {
  const [products, setProducts] = useState([]); // State to store product data
  const [activeItem, setActiveItem] = useState("listProduct");
  const [currentPage, setCurrentPage] = useState(1); // Current page of products
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const productsPerPage = 8; // Number of products to display per page
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [productIdForStatusChange, setProductIdForStatusChange] = useState(null);
  const [sortCriteria, setSortCriteria] = useState("alphabetical-asc"); // Default sorting criteria that matches the backend;
  const [totalData, setTotalData] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchInput, setSearchInput] = useState(""); // Initialize with "All"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const profileData = localStorage.getItem("profile"); // Get the profile data from localStorage
  const profile = JSON.parse(profileData);
  const isAdmin = profile?.data?.profile?.isAdmin || false;

  const [isAdminValidationModalOpen, setIsAdminValidationModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const profileData = localStorage.getItem("profile"); // Get the profile data from localStorage
  const profile = JSON.parse(profileData);
  const isAdmin = profile?.data?.profile?.isAdmin || false;

  const [isAdminValidationModalOpen, setIsAdminValidationModalOpen] = useState(false);

  const [productIdForEdit, setProductForEdit] = useState("");
  const toast = useToast();

  const handleSaveProducts = async (productId, updateProductName, updateProductPrice, updateProductcategory, updateProductdescription, image) => {
    try {
      const response = await api.patch(`/products/update/${productId}`, { productName: updateProductName, price: updateProductPrice, category: updateProductcategory, description: updateProductdescription, image });
      if (response.data.ok) {
        // Update the UI with the new product if the API call is successful
        const updatedProduct = products.map((product) => {
          if (product.id === productId) {
            return { ...product, name: updateProductName, price: updateProductPrice, category: updateProductcategory, description: updateProductdescription };
          } else {
            return product;
          }
        });
        setProducts(updatedProduct);
      } else {
        toast({
          title: "Error!",
          description: "Error updating Product. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error!",
        description: "Error updating Product. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Fetch data from the backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(`/products?page=${currentPage}&limit=${productsPerPage}&sort=${sortCriteria}&category=${selectedCategory}&search=${searchInput}`);
        const productData = response.data.details;

        // Calculate the total number of pages based on the filtered data count
        const totalData = response.data.pagination.totalData;
        const totalPages = Math.ceil(totalData / productsPerPage);
        setTotalData(totalData);
        setTotalPages(totalPages);

        setProducts(productData);
      } catch (error) {
        if (error?.response?.status == 404) {
          setTotalData(0);
          setTotalPages(0);
          setProducts([]);
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

    if (!isAdmin) {
      // Display the admin validation modal
      setIsAdminValidationModalOpen(true);
    }

    fetchProducts();
  }, [isAdmin, currentPage, sortCriteria, selectedCategory, searchInput]);
  const setActivePage = (itemName) => {
    setActiveItem(itemName);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle search input change
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const formatToRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  const openConfirmationModal = (productId) => {
    setProductIdForStatusChange(productId);
    onOpen();
  };

  const handleToggleAvailability = (productId) => {
    openConfirmationModal(productId);
  };

  const handleConfirmStatusChange = () => {
    const isActive = !products.find((product) => product.id === productIdForStatusChange).isActive;

    api
      .put(`/products/${productIdForStatusChange}`, { isActive })
      .then((response) => {
        if (response.data.ok) {
          const updatedProducts = products.map((product) => {
            if (product.id === productIdForStatusChange) {
              return { ...product, isActive };
            }
            return product;
          });
          setProducts(updatedProducts);
        } else {
          console.error("Failed to update product status:", response.data.message);
          toast({
            title: "Error",
            description: response.data.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        console.error("Failed to update product status:", error);
        toast({
          title: "Error",
          description: "Failed to update product status.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });

    onClose();
    setProductIdForStatusChange(null);
  };

  const handleEditProduct = (productId) => {
    setProductForEdit(productId);
  };

  const sortingOptions = [
    { label: "Alphabetical (A-Z)", value: "alphabetical-asc" },
    { label: "Alphabetical (Z-A)", value: "alphabetical-desc" },
    { label: "Price (Low to High)", value: "price-asc" },
    { label: "Price (High to Low)", value: "price-desc" },
  ];

  const sortingProduct = [{ label: "All" }, { label: "Food", value: "food" }, { label: "Drink", value: "drink" }];

  const handleSortChange = (event) => {
    const selectedSortValue = event.target.value;
    setSortCriteria(selectedSortValue);
  };

  const handleSortProductChange = (event) => {
    const selectedSortProductValue = event.target.value;
    setSelectedCategory(selectedSortProductValue); // Update selectedCategory
  };

  const handleNavigateToHome = () => {
    navigate("/");
  };
  return (
    <>
      <AdminSidebar setActivePage={setActivePage} activeItem={activeItem} />
      <Flex direction={"column"} ml={{ base: 0, md: 60 }} h="100vh" bgColor="#f7f7f7">
        <Box mt="38px" ml="40px">
          <Text mb={4} fontWeight="bold" fontSize="2xl">
            Product List
          </Text>
          <Flex justifyContent={"space-between"}>
            <Flex alignItems={"center"} gap={2}>
              <Text>Category</Text>
              <Select w="100px" value={selectedCategory} onChange={handleSortProductChange}>
                {sortingProduct.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Flex>
            <Flex justifyContent={"right"} alignItems={"center"} mr="0px">
              <InputGroup w={"700px"}>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaSearch} color="gray.300" />
                </InputLeftElement>
                <Input type="text" value={searchInput} onChange={handleSearchInputChange} placeholder="Search products" />
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
        <Box bgColor="white" mt="18px" mx="40px" borderRadius={15} boxShadow={"lg"} pb={5}>
          <Table variant="simple" maxW="100%" overflow="auto">
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
              {products.length == 0 ? (
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
              {products.map((product) => (
                <Tr
                  key={product.id}
                  style={{
                    backgroundColor: product.isActive ? null : "red", // Background color
                    color: product.isActive ? "black" : "white", // Font color
                  }}>
                  <Td>{product.id}</Td>
                  <Td>{product.name}</Td>
                  <Td>{formatToRupiah(product.price)}</Td>
                  <Td>{product.category}</Td>
                  <Td>
                    <Flex justifyContent={"space-between"} alignItems={"center"}>
                      {product.isActive ? (
                        <>
                          <Text>Available</Text>
                          <Flex>
                            <IconButton colorScheme="green" aria-label="Available" icon={<FaTimes />} size="sm" mr="2" onClick={() => handleToggleAvailability(product.id)} />
                            <IconButton
                              colorScheme="blue"
                              aria-label="Edit"
                              icon={<FaEdit />}
                              size="sm"
                              mr="2"
                              onClick={() => {
                                setIsModalOpen(true);
                                handleEditProduct(product);
                              }}
                            />
                          </Flex>
                        </>
                      ) : (
                        <>
                          <Text fontWeight={"bold"}> Not Available</Text>
                          <Flex>
                            <IconButton colorScheme="red" aria-label="Not Available" icon={<FaCheck />} size="sm" mr="2" onClick={() => handleToggleAvailability(product.id)} />
                            <IconButton colorScheme="blue" aria-label="Edit" icon={<FaEdit />} size="sm" mr="2" />
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
        <Box display="flex" alignItems="center" justifyContent="right" mx={20} gap={2} mt="20px" textAlign="right" mr={20}>
          <Flex alignItems={"center"} gap={2}>
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
          </Flex>
        </Box>
      </Flex>
      <UpdateProductModal isOpen={isModalOpen} productId={productIdForEdit} onClose={() => setIsModalOpen(false)} onSave={handleSaveProducts} />
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
      <AdminValidationModal isOpen={isAdminValidationModalOpen} onClose={() => setIsAdminValidationModalOpen(false)} onNavigate={handleNavigateToHome} />
    </>
  );
}

export default ListProduct;
