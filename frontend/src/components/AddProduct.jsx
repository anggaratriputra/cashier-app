import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Text, useToast } from "@chakra-ui/react";
import AdminSidebar from "./AdminSidebar";
import { useState } from "react";
import api from "../api";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../slices/accountSlices";

function AddProduct() {
  const [activeItem, setActiveItem] = useState("addProduct");
  const [selectedFileName, setSelectedFileName] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const setActivePage = (itemName) => {
    setActiveItem(itemName);
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Product Name is required"),
    price: Yup.number().required("Price is required"),
    category: Yup.string().required("Category is required"),
    description: Yup.string().required("Description is required"),
    image: Yup.mixed().required("Image is required"),
  });

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: "image/", //only img file will be acc
    onDrop: (acceptedFiles) => {
      formik.setFieldValue("image", acceptedFiles[0]);
      setSelectedFileName(acceptedFiles[0].name);
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      category: "",
      description: "",
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("price", values.price);
        formData.append("category", values.category);
        formData.append("description", values.description);
        formData.append("img", values.image);

        // Send a POST request to API to update the data in the MySQL database
        await api.post("/products/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast({
          title: "Product Created",
          description: "The product has been successfully added to the database!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        if (error?.response?.status === 401) {
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
        } else if (error?.response?.status === 400) {
          toast({
            title: "Product already exists!",
            description: "Product names must be unique.",
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
        } else {
          toast({
            title: "Product failed to build!",
            description: String(error),
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    },
  });

  return (
    <>
      <AdminSidebar setActivePage={setActivePage} activeItem={activeItem} />
      <Flex direction={"row"} justifyContent={"center"} alignItems={"center"} ml={{ base: 0, md: 60 }} bgColor={"#f7f7f7"} >
        <Box h={"100vh"} w={"60vw"} p={"40px"} justifyContent={"center"}>
          <Box bgColor={"white.700"} boxShadow={"md"} border={"1px solid"} borderColor={"blackAlpha.100"} p={"20px"} justifyContent={"center"} alignItems={"center"}  h={"90vh"} borderRadius={"10px"}>
            <Text fontWeight="bold" mb={"20px"} fontSize="2xl">
              Add Product
            </Text>

            <form onSubmit={formik.handleSubmit}>
              <FormControl isInvalid={formik.errors.name && formik.touched.name}>
                <FormLabel>Product Name</FormLabel>
                <Input w={"400px"} type="text" id="productName" name="name" placeholder="Product Name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}></Input>
                <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={formik.errors.price && formik.touched.price}>
                <FormLabel>Price</FormLabel>
                <Input w={"400px"} type="number" id="price" name="price" placeholder="Price" value={formik.values.price} onChange={formik.handleChange} onBlur={formik.handleBlur}></Input>
                <FormErrorMessage>{formik.errors.price}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={formik.errors.category && formik.touched.category}>
                <FormLabel>Category</FormLabel>
                <Input w={"400px"} type="text" id="category" name="category" placeholder="Category" value={formik.values.category} onChange={formik.handleChange} onBlur={formik.handleBlur}></Input>
                <FormErrorMessage>{formik.errors.category}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={formik.errors.description && formik.touched.description}>
                <FormLabel>Description</FormLabel>
                <Input w={"400px"} type="text" id="description" name="description" placeholder="description" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur}></Input>
                <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={formik.errors.image && formik.touched.image}>
                <FormLabel>Product Image</FormLabel>
                <div {...getRootProps()} style={{ border: "2px dashed  #cccccc", borderRadius: "4px", width: "400px", padding: "20px", cursor: "pointer" }}>
                  <input {...getRootProps()} style={{ cursor: "pointer", backgroundColor: "#f7f7f7" }} />
                  <Text>Drag 'n' drop an image here, or click to select an image</Text>
                </div>
                <Text>Selected File: {selectedFileName}</Text>
                <FormErrorMessage>{formik.errors.image}</FormErrorMessage>
              </FormControl>

              <Button type="submit" mt={"10px"}>
                Create Product
              </Button>
            </form>
          </Box>
        </Box>
      </Flex>
    </>
  );
}

export default AddProduct;
