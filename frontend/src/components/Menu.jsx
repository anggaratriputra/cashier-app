import { Box, Button, ButtonGroup, Flex, Heading, Image, Input, Select, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function Menu() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortingCriteria, setSortingCriteria] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [productsPerPage] = useState(10);
  const toast = useToast();
  const navigate = useNavigate();

  const paginate = (index) => setCurrentPage(index);

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
        const responseData = await api.get(`/products?page=${currentPage}&limit=${productsPerPage}`);
        const datas = responseData.data.details;
        const totalData = responseData.data.pagination.totalData;
        const totalPages = Math.ceil(totalData / productsPerPage);

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
  return (
    <>
      <Flex>
        <Sidebar />
        <Box bgColor={"#f7f7f7"} h={"100vh"} w={"60vw"} overflowY={"scroll"}>
          <Box mt="38px" ml="40px">
            <Text fontSize={"2xl"}>
              <b>Search</b> Category
            </Text>
            <Input
              w={"35vw"}
              mt={"10px"}
              p={"10px"}
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
          </Box>

          <Box mt="38px">
            <Text ml="40px" fontSize="2xl">
              <b>Menu </b>Category
            </Text>

            <Box display={"flex"} ml={"40px"} mt={"10px"}>
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
                  onClick={() => filterProductsByCategory(category.name)}>
                  {capitalizeFirstLetter(category.name)}
                </Button>
              ))}
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
                onClick={() => filterProductsByCategory("all")}>
                All
              </Button>
            </Box>
          </Box>

          <Box display={"flex"} mt="38px" w={"55vw"} justifyContent={"space-between"}>
            <Text ml="40px" fontSize="2xl">
              <b>Choose</b> Order
            </Text>
            <Box display={"flex"} alignItems={"center"}>
              <Select value={sortingCriteria} onChange={handleSortingChange}>
                <option value="name-asc">Sort by Name (A-Z)</option>
                <option value="name-desc">Sort by Name (Z-A)</option>
                <option value="price-asc">Sort by Price (Ascending)</option>
                <option value="price-desc">Sort by Price (Descending)</option>
              </Select>
            </Box>
          </Box>

          <Box display={"flex"} flexWrap={"wrap"} ml={"30px"}>
            {filteredProducts.map((product) => (
              <Box key={product.id} w={"20vw"} minH={"200px"} bg={"yellow.300"} m={"10px"} p={"10px"} borderRadius={"10px"} color={"orange.700"}>
                <Heading fontSize={"md"}>{product.name}</Heading>
                <Image src={`localhost:8000/public/${product.image}`} alt={`${product.name}`} />
                <Text>{product.description}</Text>
                <Text>{product.price}</Text>
              </Box>
            ))}
          </Box>

          <Box display={"flex"} justifyContent={"center"} mb={'10px'}>
            <Text fontSize={"xl"} mr={"10px"}>
              Page:
            </Text>
            <ButtonGroup mr={"50px"}>
              <Button key={1} size={"sm"} onClick={() => changePage(1)} variant={"outline"}>
                1
              </Button>
              {totalPages > 1 &&
                Array.from({ length: totalPages - 1 }, (_, index) => (
                  <Button key={index + 2} variant={"outline"} size={"sm"} onClick={() => paginate(index + 2)}>
                    {index + 2}
                  </Button>
                ))}
            </ButtonGroup>
          </Box>
        </Box>
      </Flex>
    </>
  );
}

export default Menu;