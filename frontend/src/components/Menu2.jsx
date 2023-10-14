import { Box, Button, ButtonGroup, Flex, Heading, Icon, Image, Input, InputGroup, InputLeftElement, Select, SimpleGrid, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Order from "./Order";
import { FaSearch } from "react-icons/fa";
import { addSelectedProduct, removeSelectedProduct } from "../slices/orderSlices";
import { useDispatch, useSelector } from "react-redux";

function Menu2() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeItem, setActiveItem] = useState("menu2");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortingCriteria, setSortingCriteria] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [productsPerPage] = useState(10);
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedProducts = useSelector((state) => state.order.selectedProducts);
  const handleBoxClick = (product) => {
    // Check if the product is already in the array
    const isProductSelected = selectedProducts.some((selectedProduct) => selectedProduct.id === product.id);

    // If the product is not already selected, add it to the array
    if (!isProductSelected) {
      dispatch(addSelectedProduct(product));
    }
    // If the product is already selected, do nothing
  };

  const filterProductsByCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    setFilteredProducts(categoryName === "" || categoryName === "all" ? products : products.filter((product) => product.category === categoryName));
  };

  const filterProductsByNameAndCategory = () => {
    const categoryFiltered = selectedCategory === "all" ? products : products.filter((product) => product.category === selectedCategory);
    const nameFiltered = searchInput ? categoryFiltered.filter((product) => product.name.toLowerCase().includes(searchInput.toLowerCase())) : categoryFiltered;

    const sortedProducts = nameFiltered.slice();
    if (sortingCriteria === "name-asc") {
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortingCriteria === "name-desc") {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortingCriteria === "price-asc") {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortingCriteria === "price-desc") {
      sortedProducts.sort((a, b) => a.price - b.price);
    }
    setFilteredProducts(sortedProducts);
  };

  const handleSortingChange = (e) => {
    setSortingCriteria(e.target.value);
    filterProductsByNameAndCategory();
  };
  const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const changePage = (newPage) => newPage >= 1 && newPage <= totalPages && setCurrentPage(newPage);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const responseData = await api.get(`/products`);
        const datas = responseData.data.details;
        const responseDataCategory = await api.get("/categories");
        const datasCategory = responseDataCategory.data.details;
        setTotalPages(totalPages);
        setProducts(datas);
        setCategories(datasCategory);
        setFilteredProducts(datas);
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
          });
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
  }, [currentPage]);

  const formatToRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  const setActivePage = (itemName) => {
    setActiveItem(itemName);
  };

  return (
    <Flex>
      <Sidebar setActivePage={setActivePage} activeItem={activeItem} />
      <Flex direction={"column"} ml={{ base: 0, md: 64 }} width={"60vw"} h="100vh" bgColor="#f7f7f7">
        <Box mt="38px">
          <Flex gap={10} alignItems={"center"}>
            <Text ml="40px" fontSize="2xl">
              <b>Menu </b>Category
            </Text>
            <InputGroup w={"35vw"}>
              <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search menu.."
                value={searchInput}
                onInput={(e) => {
                  setSearchInput(e.target.value);
                  filterProductsByNameAndCategory();
                }}
                onBlur={() => {
                  if (searchInput === "") {
                    filterProductsByNameAndCategory();
                  }
                }}
              />
            </InputGroup>
          </Flex>

          <Box display={"flex"} ml={"40px"} mt={"30px"}>
            <Button
              mr={"10px"}
              fontSize={"lg"}
              color={selectedCategory === "all" ? "red.700" : "yellow.300"}
              bgColor={selectedCategory === "all" ? "yellow.300" : "red.700"}
              _hover={{ bgColor: "yellow.400" }}
              padding={"10px"}
              borderRadius={"10px"}
              minW={"100px"}
              textAlign={"center"}
              onClick={() => filterProductsByCategory("all")}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                mr={"10px"}
                fontSize={"lg"}
                color={selectedCategory === category.name ? "red.700" : "yellow.300"}
                bgColor={selectedCategory === category.name ? "yellow.300" : "red.700"}
                _hover={{ bgColor: "yellow.400" }}
                padding={"10px"}
                borderRadius={"10px"}
                minW={"100px"}
                textAlign={"center"}
                onClick={() => filterProductsByCategory(category.name)}
              >
                {capitalizeFirstLetter(category.name)}
              </Button>
            ))}
          </Box>
        </Box>

        <Box display={"flex"} mt="38px" w={"50vw"} justifyContent={"space-between"}>
          <Text ml="40px" fontSize="2xl">
            <b>Choose</b> Order
          </Text>
          <Box display={"flex"} alignItems={"center"} mr={24}>
            <Select value={sortingCriteria} onChange={handleSortingChange}>
              <option value="name-asc">Sort by Name (A-Z)</option>
              <option value="name-desc">Sort by Name (Z-A)</option>
              <option value="price-asc">Sort by Price (Ascending)</option>
              <option value="price-desc">Sort by Price (Descending)</option>
            </Select>
          </Box>
        </Box>

        <Box display="flex" justifyContent="center" maxHeight="465px">
          <Box mt={4} overflowY="scroll">
            <SimpleGrid columns={4} spacing={2}>
              {filteredProducts.map((product) => (
                <Flex
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="lg"
                  key={product.id}
                  m="10px"
                  p="10px"
                  width="180px"
                  height="200px"
                  borderRadius="14px"
                  color="black"
                  _hover={{ bg: "red.700", color: "yellow.300" }} // Change background color to red on hover
                  transition="background-color 0.3s, color 0.3s"
                  onClick={() => handleBoxClick(product)} // Dispatch the action to set the selected product
                >
                  <Text fontWeight={"bold"} fontSize="md" textAlign="center">
                    {product.name}
                  </Text>
                  <Image w="75%" h="60%" src={`http://localhost:8000/public/${product.image}`} alt={product.name} />
                  <Text fontWeight={"medium"} fontSize="sm" textAlign="center">
                    {formatToRupiah(product.price)}
                  </Text>
                </Flex>
              ))}
            </SimpleGrid>
          </Box>
        </Box>
      </Flex>
      <Order />
    </Flex>
  );
}

export default Menu2;
