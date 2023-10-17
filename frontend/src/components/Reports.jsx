import { Box, Flex, Text, useToast } from "@chakra-ui/react";
import AdminSidebar from "./AdminSidebar";
import { useEffect, useState } from "react";
import api from "../api";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../slices/accountSlices";

function Reports() {
  const [activeItem, setActiveItem] = useState("reports");
  const [transactions, setTransactions] = useState("");
  const toast = useToast();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const setActivePage = (itemName) => {
    setActiveItem(itemName);
  };

  const fetchTransaction = async () => {
    try {
      const response = await api.get("/transaction");
      const transactionDatas = response.data.detail;
      setTransactions(transactionDatas);
    } catch (error) {
      if (error.response.status === 404) {
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
  },[transactions]);
  return (
    <>
      <AdminSidebar setActivePage={setActivePage} activeItem={activeItem} />
      <Flex direction={"row"} ml={{ base: 0, md: 64 }}>
        <Box bgColor={"#f7f7f7"} h={"100vh"} w={"100vw"}>
          <Text fontWeight="bold" mt="38px" ml="40px" fontSize="2xl">
            Reports
          </Text>
        </Box>
      </Flex>
    </>
  );
}

export default Reports;
