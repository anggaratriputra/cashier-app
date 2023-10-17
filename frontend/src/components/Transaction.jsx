import React, { useState, useEffect } from "react";
import { Box, Flex, Text, Button, Select, useToast, Accordion, AccordionPanel, AccordionItem, AccordionButton, AccordionIcon, Spacer } from "@chakra-ui/react";
import { FaCheck, FaEdit, FaSearch, FaTimes } from "react-icons/fa";
import Sidebar from "./Sidebar";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showUnauthorizedModal } from "../slices/accountSlices";
import { logout } from "../slices/accountSlices";
import { format } from "date-fns";

function Transaction() {
  const [datas, setDatas] = useState([]); // State to store product data
  const [activeItem, setActiveItem] = useState("transaction");
  const [currentPage, setCurrentPage] = useState(1); // Current page of products
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const productsPerPage = 10; // Number of products to display per page
  const [sortCriteria, setSortCriteria] = useState("date-desc"); // Default sorting criteria that matches the backend;
  const [totalData, setTotalData] = useState(0);
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch(); // State to store category data

  // Fetch data from the backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(`/transaction?page=${currentPage}&limit=${productsPerPage}&sort=${sortCriteria}`);
        const datas = response.data.detail;
        // Calculate the total number of pages based on the filtered data count
        const totalData = response.data.pagination.totalData;
        const totalPages = Math.ceil(totalData / productsPerPage);
        setTotalData(totalData);
        setTotalPages(totalPages);
        setDatas(datas);
      } catch (error) {
        if (error?.response?.status == 404) {
          setTotalData(0);
          setTotalPages(0);
          setDatas([]);
        } else if (error?.response?.status == 401) {
          setTotalData(0);
          setTotalPages(0);
          setDatas([]);
          dispatch(showUnauthorizedModal("/admin/addproduct"));
        } else if (error?.response?.status == 403) {
          toast({
            title: "Session expired",
            description: "Your session is expired, please login again.",
            status: "error",
            duration: 3000,
            isClosable: true,
            onCloseComplete() {
              dispatch(logout());
              navigate("/");
            },
          });
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

    fetchProducts();
  }, [currentPage, sortCriteria]);

  const setActivePage = (itemName) => {
    setActiveItem(itemName);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle search input change

  const formatToRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "MMMM d, yyyy HH:mm:ss a");
  };

  function capitalizeFirstWord(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const sortingOptions = [
    { label: "Date (DESC)", value: "date-desc" },
    { label: "Date (ASC)", value: "date-asc" },
    { label: "Price (Low to High)", value: "price-asc" },
    { label: "Price (High to Low)", value: "price-desc" },
  ];

  const handleSortChange = (event) => {
    const selectedSortValue = event.target.value;
    setSortCriteria(selectedSortValue);
  };

  return (
    <>
      <Sidebar setActivePage={setActivePage} activeItem={activeItem} />
      <Flex direction={"column"} ml={{ base: 0, md: 64 }} padding={2} maxW="100%" h="100vh" bgColor="#f7f7f7">
        <Box mt="38px" ml="40px">
          <Text mb={4} fontWeight="bold" fontSize="2xl">
            Transaction History
          </Text>
          <Flex justifyContent={"space-between"}>
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
        <Box bgColor="white" mt="18px" mx="40px" borderRadius={15} boxShadow={"lg"} pb={5} h="60vh" overflowY="auto" maxW="100%" overflowX="hidden">
          <Flex padding="10px" width={"100%"} mx={2} fontWeight="bold">
            <Text textAlign={"center"} flex="0.5" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
              Transaction ID
            </Text>
            <Text flex="1" textAlign={"center"} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
              Date
            </Text>
            <Text flex="1" textAlign={"center"} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
              Payment Method
            </Text>
            <Text flex="1" textAlign={"center"} mr={8} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
              Total Price
            </Text>
          </Flex>
          {datas.length == 0 ? (
            <Text textAlign={"center"} fontStyle={"italic"}>
              No data matches.
            </Text>
          ) : (
            ""
          )}
          <Accordion allowToggle>
            {datas.map((data) => (
              <AccordionItem>
                <AccordionButton _expanded={{ bg: "red.700", color: "yellow.300" }}>
                  <Flex justifyContent={"space-between"} width="100%">
                    <Text flex="0.5" textAlign={"center"} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                      {data.id}
                    </Text>
                    <Text flex="1" textAlign={"center"} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                      {formatDate(data.createdAt)}
                    </Text>
                    <Text flex="1" textAlign={"center"} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                      {capitalizeFirstWord(data.paymentBy)}
                    </Text>
                    <Text flex="1" textAlign={"center"} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                      {formatToRupiah(data.totalPrice)}
                    </Text>
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel bgColor={"yellow.300"} pb={4}>
                  {data.Products.map((product) => (
                    <Flex justifyContent={"space-between"} width="100%">
                      <Text flex="0.5" textAlign={"center"} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                        &nbsp;
                      </Text>
                      <Text flex="1" textAlign={"center"} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                        &nbsp;
                      </Text>
                      <Text fontWeight={"bold"} flex="1" textAlign={"center"} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                        {product.transactionItems.quantity}x
                      </Text>
                      <Text fontWeight={"bold"} flex="1" mr={4} textAlign={"center"} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                        {product.name}
                      </Text>
                    </Flex>
                  ))}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
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
    </>
  );
}

export default Transaction;
