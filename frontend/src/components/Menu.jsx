import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Order from "./Order";
import { FaSearch } from "react-icons/fa";
import { addSelectedProduct, removeSelectedProduct } from "../slices/orderSlices";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { BiMinus, BiPlus } from "react-icons/bi";

function Menu() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeItem, setActiveItem] = useState("menu2");
  const [sortCriteria, setSortCriteria] = useState("alphabetical-asc"); // Default sorting criteria that matches the backend;
  const [searchInput, setSearchInput] = useState(""); // Initialize with "All"
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productsPerPage] = useState(10);
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastProduct, setToastProduct] = useState(null);

  const selectedProducts = useSelector((state) => state.order.selectedProducts);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const responseData = await api.get(`/products/active?sort=${sortCriteria}&category=${selectedCategory}&search=${searchInput}`);
        const datas = responseData.data.details;
        // setTotalPages(totalPages);
        setProducts(datas);
        // setCategories(datasCategory);
      } catch (error) {
        if (error?.response?.status == 403) {
          toast({
            title: "Failed to get products list!",
            description: `You must login first!`,
            status: "error",
            duration: 3000,
            isClosable: true,
            onCloseComplete() {
              navigate("/");
            },
          })
        } else if (error?.response?.status == 401) {
          toast({
            title: "You are not an admin!",
            description: `You do not have access to this page!`,
            status: "error",
            duration: 3000,
            isClosable: true,
            onCloseComplete() {
              navigate("/");
            },
          });
        } else if (error?.response?.status == 404) {
          setProducts([]);
        } else {
          toast({
            title: "Error!",
            description: String(error),
            status: "error",
            isClosable: true,
            duration: 3000,
          });
        }
      }
    };
    getProducts();
  }, [sortCriteria, selectedCategory, searchInput]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        const categoryData = response.data.details;
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const sortingProduct = [
    { label: "All", value: "All" }, // Default "All" option
    ...categories.map((category) => ({
      label: capitalizeFirstLetter(category.name),
      value: category.name,
    })),
  ];

  const handleBoxClick = (product) => {
    const isProductSelected = selectedProducts.some((selectedProduct) => selectedProduct.id === product.id);

    if (!isProductSelected) {
      // Set the product in the modal with a count of 1
      setToastProduct({ ...product, count: 1 });
      setIsModalOpen(true);
    }
  };

  // Handle search input change
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSortChange = (event) => {
    const selectedSortValue = event.target.value;
    setSortCriteria(selectedSortValue);
  };

  const handleSortProductChange = (value) => {
    setSelectedCategory(value); // Update selectedCategory
  };

  const sortingOptions = [
    { label: "Alphabetical (A-Z)", value: "alphabetical-asc" },
    { label: "Alphabetical (Z-A)", value: "alphabetical-desc" },
    { label: "Price (Low to High)", value: "price-asc" },
    { label: "Price (High to Low)", value: "price-desc" },
  ];

  const formatToRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  const setActivePage = (itemName) => {
    setActiveItem(itemName);
  };
  const handleIncrement = () => {
    if (toastProduct) {
      const updatedProduct = { ...toastProduct, count: toastProduct.count + 1 };
      setToastProduct(updatedProduct);
    }
  };

  const handleDecrement = () => {
    if (toastProduct) {
      if (toastProduct.count > 1) {
        const updatedProduct = { ...toastProduct, count: toastProduct.count - 1 };
        setToastProduct(updatedProduct);
      }
    }
  };

  const handleAddToOrder = () => {
    if (toastProduct) {
      const productFromStore = selectedProducts.find((product) => product.id === toastProduct.id);

      if (productFromStore) {
        // Update the count of the product found in the store
        productFromStore.count = toastProduct.count;
        dispatch(addSelectedProduct(productFromStore));
      } else {
        // If the product is not in the store, dispatch the existing toastProduct
        dispatch(addSelectedProduct(toastProduct));
      }

      setIsModalOpen(false);
    }
  };

  return (
    <Flex width={"100vw"} bgColor="#f7f7f7">
      <Sidebar setActivePage={setActivePage} activeItem={activeItem} />
      <Flex direction={"column"} ml={{ base: 0, md: "18vw" }} h="100vh" w={"58vw"} bgColor="#f7f7f7">
        <Box mt="38px">
          <Text ml="40px" fontSize="2xl">
            <b>Menu </b>Category
          </Text>
          <Box display={"flex"} ml={"40px"} mt={"28px"}>
            {sortingProduct.map((option) => (
              <Button
                key={option.value} // Add a unique key to each button
                mr={"10px"}
                fontSize={"lg"}
                color={selectedCategory === option.value ? "red.700" : "yellow.300"}
                bgColor={selectedCategory === option.value ? "yellow.300" : "red.700"}
                _hover={{ bgColor: "yellow.400" }}
                padding={"10px"}
                borderRadius={"10px"}
                minW={"100px"}
                textAlign={"center"}
                onClick={() => handleSortProductChange(option.value)} // Pass the category value to the function
              >
                {option.label}
              </Button>
            ))}
          </Box>
        </Box>
        <Box display={"flex"} mt="24px" w={"54vw"} justifyContent={"space-between"}>
          <Text ml="40px" fontSize="2xl">
            <b>Choose</b> Order
          </Text>
        </Box>
        <Flex ml={"48px"} mt={6} justifyContent={"space-between"} gap={4}>
          <InputGroup w={"38vw"}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FaSearch} color="gray.300" />
            </InputLeftElement>
            <Input type="text" value={searchInput} onChange={handleSearchInputChange} placeholder="Search products" />
          </InputGroup>
          <Box display={"flex"} alignItems={"center"}>
            <Select w="200px" mr={"60px"} value={sortCriteria} onChange={handleSortChange}>
              {sortingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Box>
        </Flex>
        <Box display="flex" justifyContent="center" maxHeight="460px">
          <Box mt={6} overflowY="scroll">
            <SimpleGrid columns={4} spacing={2}>
              {products.length == 0 ? (
                <Flex justifyContent={"center"}>
                  <Text textAlign={"center"} fontStyle={"italic"}>
                    No data matches.
                  </Text>
                </Flex>
              ) : (
                ""
              )}
              {products.map((product) => (
                <Flex
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="lg"
                  key={product.id}
                  m="10px"
                  p="10px"
                  width="180px"
                  height="190px"
                  borderRadius="14px"
                  color="black"
                  transition="background-color 0.3s, color 0.3s, transform 0.3s"
                  _hover={{ bg: "red.700", color: "yellow.300", transform: "scale(1.1)" }} // Change background color to red on hover
                  onClick={() => handleBoxClick(product)} // Dispatch the action to set the selected product
                >
                  <Flex flexGrow={2}>
                    <Text fontWeight={"bold"} fontSize="md" textAlign="center">
                      {product.name}
                    </Text>
                  </Flex>
                  <Flex justifyContent="center" flexGrow={2}>
                    <Image w="100px" h={"90px"} src={`http://localhost:8000/public/${product.image}`} alt={product.name} />
                  </Flex>
                  <Flex>
                    <Text fontWeight={"medium"} fontSize="sm" textAlign="center">
                      {formatToRupiah(product.price)}
                    </Text>
                  </Flex>
                </Flex>
              ))}
            </SimpleGrid>
          </Box>
        </Box>
      </Flex>

      {selectedProducts.length > 0 && (
        <motion.div initial={{ opacity: 0, scale: 1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.1 }} transition={{ duration: 0.6 }}>
          <Flex width="24vw">
            <Order />
          </Flex>
        </motion.div>
      )}
      {/* Add the Modal code here */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isCentered motionPreset="slideInBottom">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
        <ModalContent>
          <ModalHeader>
            <Text textAlign={"center"}>{toastProduct ? toastProduct.name : "Product Name"}</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {toastProduct && (
              <Flex direction={"column"} justifyContent={"center"} alignItems={"center"}>
                <Image w="70%" src={`http://localhost:8000/public/${toastProduct.image}`} alt={toastProduct.name} />
                <Flex mt={6} justifyContent={"center"} alignItems="center">
                  <IconButton as={BiMinus} size="md" p={2} bgColor={"yellow.300"} _hover={{ background: "red.700", color: "yellow.300" }} onClick={handleDecrement}></IconButton>
                  <Text fontWeight="bold" fontSize="lg" mx="4">
                    {toastProduct ? toastProduct.count : 0}
                  </Text>
                  <IconButton as={BiPlus} size="md" p={2} bgColor={"yellow.300"} _hover={{ background: "red.700", color: "yellow.300" }} onClick={handleIncrement}></IconButton>
                </Flex>
              </Flex>
            )}
          </ModalBody>
          <Flex mt={6} gap={2} justifyContent="center">
            <Button bgColor="red.700" color={"yellow.300"} _hover={{ background: "red.900" }} onClick={handleAddToOrder}>
              Add to Order
            </Button>
            <Button bgColor="yellow.300" color={"red.700"} _hover={{ background: "yellow.600", color: "white" }} onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </Flex>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default Menu;
