import { Box, Button, Divider, Flex, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, Text, useToast } from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";
import AdminSidebar from "./AdminSidebar";
import { useEffect, useState } from "react";
import api from "../api";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../slices/accountSlices";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Reports() {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
      },
    },
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("reports");
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState({});
  const [startDate, setStartDate] = useState(""); // Start date for the date range
  const [endDate, setEndDate] = useState(""); // End date for the date range
  const [salesAggregateData, setSalesAggregateData] = useState({
    labels: [],
    datasets: [
      {
        label: "Sales",
        data: [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  });
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const setActivePage = (itemName) => {
    setActiveItem(itemName);
  };

  const fetchTransaction = async () => {
    try {
      const response = await api.get("/transaction/reports");
      const transactionDatas = response.data.detail;

      // Format the createdAt date to the desired format(YYYY-MM-DD)
      const formattedTransactions = transactionDatas.map((transaction) => ({
        ...transaction,
        createdAt: new Date(transaction.createdAt).toISOString().split("T")[0],
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      if (error?.response?.status === 404) {
        toast({
          title: "Error!",
          description: "Error fetching Transaction Data. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else if (error?.response?.status === 403) {
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
      } else if (error?.response?.status === 401) {
        toast({
          title: "You are not an admin!",
          description: "You do not have access to this page!",
          status: "error",
          duration: 3000,
          isClosable: true,
          onCloseComplete() {
            dispatch(logout());
            navigate("/");
          },
        });
      }
    }
  };
  useEffect(() => {
    fetchTransaction();
  }, []);

  const handleGenerateReport = () => {
    // Filter transactions within the selected date range
    const filteredTransactions = transactions.filter((transaction) => {
      const transactionDate = transaction.createdAt.split("T")[0];
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    // Calculate sales aggregate data for the filtered transactions
    // digunakan untuk menghitung data agregat penjualan berdasarkan transaksi yang telah difilter. 
    const salesData = filteredTransactions.reduce((acc, transaction) => {
      if (!acc[transaction.createdAt]) {
        acc[transaction.createdAt] = 0;
      }
      acc[transaction.createdAt] += transaction.totalPrice;
      return acc;
    }, {});

    setSalesAggregateData({
      ...salesAggregateData,
      labels: Object.keys(salesData),
      datasets: [
        {
          ...salesAggregateData.datasets[0],
          data: Object.values(salesData),
        },
      ],
    });
  };

  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  return (
    <>
      <AdminSidebar setActivePage={setActivePage} activeItem={activeItem} />
      <Flex ml={{ base: 0, md: 64 }} flexDir={"column"} bgColor={"#f7f7f7"}>
        <Text fontWeight="bold" mt="38px" ml="40px" fontSize="2xl">
          Reports
        </Text>
        <Box minH={"100vh"} w={"83vw"} display={"flex"} flexDir={"column"} alignItems={"center"}>
          <Box p={"15px"} w={"75vw"}>
            <Line options={options} data={salesAggregateData} />

            <FormControl mt={4}>
              <FormLabel>Date Range</FormLabel>
              <InputGroup>
                <Input type="date" placeholder="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} w={"30vw"} mr={"10px"} />
                <InputLeftAddon children="-" />
                <Input type="date" placeholder="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} w={"30vw"} />
              </InputGroup>
            </FormControl>

            <Button mt={4} onClick={handleGenerateReport} bgColor={"red.700"} color={"yellow.300"} _hover={{ bgColor: "red.500" }}>
              Generate Report
            </Button>
          </Box>

          <Box w={"100%"} mb={"20px"}>
            <Text fontWeight="bold" mt="38px" ml="40px" fontSize="2xl">
              Transaction History
            </Text>
            <Box display={"flex"} w={"100%"} ml={"40px"} gap={3} mt={5} overflowX={"auto"}>
              {transactions.map((transaction) => (
                <Box key={transaction.id} w={"10vw"} h={"10vw"} display={"flex"} flexDir={"column"} justifyContent={"center"} alignItems={'center'} shadow={"md"} p={"10px"} mb={"10px"} borderRadius={"10px"}>
                  <Text>Transaction ID: {transaction.id}</Text>
                  <Text>Total Price: {transaction.totalPrice}</Text>
                  <Button onClick={() => openModal(transaction)} w={"80%"} mt={"10px"} bgColor={"red.700"} color={"yellow.300"} _hover={{ bgColor: "red.500" }}>
                    View Products
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Flex>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Product Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Transaction ID: {selectedTransaction.id}</Text>
            <Text>Total Price: {selectedTransaction.totalPrice}</Text>
            <Text>Payment Method: {selectedTransaction.paymentBy}</Text>
            <Text>Transaction Date: {selectedTransaction.createdAt}</Text>
            <Divider mt={4} mb={4} />
            <Text fontWeight="bold">Products:</Text>
            {selectedTransaction?.Products?.map((product) => (
              <Box key={product.id} borderWidth="1px" borderRadius="lg" p="4" mb="4">
                <Text fontSize="lg" fontWeight="bold">
                  {product.name}
                </Text>
                <Text>Quantity: {product.transactionItems.quantity}</Text>
                <Text>Price: {product.price}</Text>
              </Box>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => setIsModalOpen(false)} bgColor={"red.700"} color={"yellow.300"} _hover={{ bgColor: "red.500" }}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
export default Reports;
