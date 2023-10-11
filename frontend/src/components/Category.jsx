import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Text, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import AdminSidebar from "./AdminSidebar";
import { useEffect, useState } from "react";
import api from "../api";

export default function Category() {
  const [activeItem, setActiveItem] = useState("category");
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const toast = useToast();
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
        setCategories(response.data.categories);
      }
    } catch (error) {
      if (error.response.status !== 404) {
        toast({
          title: "Error!",
          description: "Error fetching categories. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteCategory = async (categoryName) => {
    try {
      await api.delete(`/categories/${categoryName}`);
      fetchCategories();
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

  const handleEditCategory = async (category) => {
    try {
      const { name, newName } = category;
      await api.put(`/categories/${name}`, { newName });
      category.name = newName;
      setIsEditing(false);
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
      <Flex direction={"row"} ml={{ base: 0, md: 60 }}>
        <Box bgColor={"#f7f7f7"} h={"100vh"} w={"100vw"} p={"20px"}>
          <Text fontWeight="bold" mt="38px" mb={"20px"} fontSize="2xl">
            Add Category
          </Text>
          <form onSubmit={formik.handleSubmit}>
            <FormControl isInvalid={formik.errors.name && formik.touched.name}>
              <FormLabel htmlFor="name">Category Name</FormLabel>
              <Input type="text" id="name" name="name" placeholder="Category Name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
            </FormControl>

            <Button mt={4} colorScheme="teal" isLoading={formik.isSubmitting} type="submit">
              Create Category
            </Button>
          </form>
          <Text fontWeight="bold" mt="38px" mb={"20px"} fontSize="2xl">
            Category List
          </Text>
          <Box display={"flex"} flexDir={"column"}>
            {categories.length === 0 ? (
              <Text>Category is Empty!</Text>
            ) : (
              categories.map((category, index) => (
                <div key={index}>
                  <Box display={"flex"} w={"80vw"} h={"10%"} alignItems={"center"}>
                    {isEditing ? (
                      <Box display={"flex"} w={"100vw"} my={"5px"}>
                        <Input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                        <Button colorScheme="teal" onClick={() => handleEditCategory(category)}>
                          Save
                        </Button>
                      </Box>
                    ) : (
                      <Box display={"flex"} w={"100vw"} my={"5px"}>
                        <Text fontSize={"20px"} minW={"70vw"}>
                          {category.name}
                        </Text>
                        <Button colorScheme="red" onClick={() => handleDeleteCategory(category.name)}>
                          Delete
                        </Button>
                        <Button
                          colorScheme="blue"
                          onClick={() => {
                            setIsEditing(true);
                          }}>
                          Edit
                        </Button>
                      </Box>
                    )}
                  </Box>
                </div>
              ))
            )}
          </Box>
        </Box>
      </Flex>
    </>
  );
}
