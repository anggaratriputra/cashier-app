import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Icon, IconButton, Input, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import AdminSidebar from "./AdminSidebar";
import { useEffect, useState } from "react";
import api from "../api";
import CategoryUpdateModal from "./UpdateCategoryModal";
import ConfirmationModal from "./ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../slices/accountSlices";
import { FiDelete, FiTrash, FiTrash2 } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";

export default function ListCategory() {
  const [activeItem, setActiveItem] = useState("category");
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const setActivePage = (itemName) => {
    setActiveItem(itemName);
  };
  const validationSchema = Yup.object({
    name: Yup.string().required("Category is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await api.post("/categories/input", values);
        toast({
          title: "Category created successfully!",
          description: "The new category has been successfully added to the database!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        formik.resetForm();
      } catch (error) {
        toast({
          title: "Error!",
          description: "Error creating category. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
  });

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");

      if (response.data.ok) {
        setCategories(response.data.details);
      }
    } catch (error) {
      if (error.response.status === 404) {
        toast({
          title: "Error!",
          description: "Error fetching categories. Please try again.",
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
    fetchCategories();
  }, [categories]);

  const handleDeleteCategory = async (categoryName) => {
    setSelectedCategory(categoryName);
    onOpen();
  };

  const handleConfirmDeleteCategory = async () => {
    try {
      await api.delete(`/categories/${selectedCategory}`);
      fetchCategories();
      onClose();
    } catch (error) {
      toast({
        title: "Error!",
        description: "Error deleting category. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSaveCategory = async (categoryId, newName) => {
    try {
      const response = await api.put(`/categories/${categoryId}`, { newName });
      if (response.data.ok) {
        // Update the UI with the new category name if the API call is successful
        const updatedCategories = categories.map((category) => {
          if (category.id === categoryId) {
            return { ...category, name: newName };
          } else {
            return category;
          }
        });
        setCategories(updatedCategories);
      } else {
        toast({
          title: "Error!",
          description: "Error updating category. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error!",
        description: "Error updating category. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <AdminSidebar setActivePage={setActivePage} activeItem={activeItem} />
      <Flex direction={"row"} ml={{ base: 0, md: 64 }} alignItems={"center"} justifyContent={"center"} bgColor={"#f7f7f7"}>
        <Box h={"100vh"} w={"60vw"} alignItems={"center"} justifyContent={"center"} p={"40px"}>
          <Box bgColor={"white.700"} boxShadow={"md"} border={"1px solid"} borderColor={"blackAlpha.100"} p={"40px"} h={"90vh"} borderRadius={"10px"}>
            <Text fontWeight="bold" mb={"20px"} fontSize="2xl">
              Add Category
            </Text>
            <form onSubmit={formik.handleSubmit}>
              <FormControl isInvalid={formik.errors.name && formik.touched.name}>
                <FormLabel htmlFor="name">Category Name</FormLabel>
                <Input type="text" id="name" name="name" placeholder="Category Name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} w={"100%"} />
                <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
              </FormControl>
              <Button mt={4} bgColor={"red.700"} color={"yellow.300"} _hover={{background:"red.900"}} isLoading={formik.isSubmitting} type="submit">
                Create Category
              </Button>
            </form>
            <Text fontWeight="bold" mt="18px" mb={"20px"} fontSize="2xl">
              Category List
            </Text>
            <Box display={"flex"} flexDir={"column"}>
              {categories.length === 0 ? (
                <Text>Category is Empty!</Text>
              ) : (
                <Box h={"45vh"} overflowY={"auto"}>
                  {categories.map((category, index) => (
                    <Flex p={4} alignItems={"center"} justifyContent={"space-between"}>
                      <Flex>
                        <Text fontSize={"20px"}>{category.name}</Text>
                      </Flex>
                      <Flex gap={1}>
                        <IconButton
                          colorScheme="blue"
                          onClick={() => {
                            setIsModalOpen(true);
                            setSelectedCategory(category);
                          }}
                          icon={<FaEdit />}
                        ></IconButton>
                        <IconButton icon={<FiTrash2 />} colorScheme="red" onClick={() => handleDeleteCategory(category.name)}></IconButton>
                      </Flex>
                    </Flex>
                  ))}
                </Box>
              )}
              <CategoryUpdateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveCategory} categoryToEdit={selectedCategory} />
              <ConfirmationModal isOpen={isOpen} onClose={onClose} onConfirm={handleConfirmDeleteCategory} message={`Are you sure you want to delete the category: ${selectedCategory}?`} />
            </Box>
          </Box>
        </Box>
      </Flex>
    </>
  );
}
