import { Box, Flex, Text, Input, Button, FormControl, FormLabel, FormErrorMessage, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api";
import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { useParams } from "react-router-dom";

function UpdateProduct() {
  const [activeItem, setActiveItem] = useState("updateProduct");
  const toast = useToast();
  const setActivePage = (itemName) => {
    setActiveItem(itemName);
  };

  const { name } = useParams();

  const validationSchema = Yup.object({
    productName: Yup.string().required("Product Name is required"),
    price: Yup.number().required("Price is required"),
    category: Yup.string().required("Category is required"),
    description: Yup.string().required("Description is required"),
  });

  const formik = useFormik({
    initialValues: {
      productName: "",
      price: "",
      category: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Send a PUT request to API to update the product
        await api.put(`/products/${name}`, values);

        //handle success or redirect to another page
        console.log("Product updated successfully!");
        toast({
          title: "Product Updated",
          description: "The product has been successfully updated!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Product failed to update!",
          description: String(error),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.error("Product failed to update!", error);
      }
    },
  });

  useEffect(() => {
    // Fetch the existing product details and populate the form
    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`/products/${name}`);
        const product = response.data.detail; // Assuming your API response structure has a "detail" field

        // Set the initial form values based on the fetched product details
        formik.setValues({
          productName: product.name,
          price: product.price,
          category: product.category,
          description: product.description,
        });
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [name, formik]);

  return (
    <>
    <AdminSidebar setActivePage={setActivePage} activeItem={activeItem} />
      <Flex direction={"column"} ml={{ base: 0, md: 60 }}>
        <Box bgColor={"#f7f7f7"} h={"100vh"} w={"100vw"} p={"20px"}>
          <Text fontWeight="bold" fontSize="2xl" mb="20px">
            Update Product
          </Text>
          <form onSubmit={formik.handleSubmit}>
            <FormControl isInvalid={formik.errors.productName && formik.touched.productName}>
              <FormLabel>Product Name</FormLabel>
              <Input type="text" id="productName" name="productName" placeholder="Product Name" value={formik.values.productName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              <FormErrorMessage>{formik.errors.productName}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={formik.errors.price && formik.touched.price}>
              <FormLabel>Price</FormLabel>
              <Input type="number" id="price" name="price" placeholder="Price" value={formik.values.price} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              <FormErrorMessage>{formik.errors.price}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={formik.errors.category && formik.touched.category}>
              <FormLabel>Category</FormLabel>
              <Input type="text" id="category" name="category" placeholder="Category" value={formik.values.category} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              <FormErrorMessage>{formik.errors.category}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={formik.errors.description && formik.touched.description}>
              <FormLabel>Description</FormLabel>
              <Input type="text" id="description" name="description" placeholder="Description" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
            </FormControl>

            <Button type="submit" mt="10px">
              Update Product
            </Button>
          </form>
        </Box>
      </Flex>
    </>
  );
}

export default UpdateProduct