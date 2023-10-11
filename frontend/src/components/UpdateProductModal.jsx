import { Input, Button, FormControl, FormLabel, FormErrorMessage, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Textarea } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

function UpdateProductModal({ isOpen, onClose, productId, onSave }) {
  const [updateProductName, setUpdateProductName] = useState(productId.productName);
  const [updateProductPrice, setUpdateProductPrice] = useState(productId.price);
  const [updateProductcategory, setUpdateProductCategory] = useState(productId.category);
  const [updateProductdescription, setUpdateProductDescription] = useState(productId.description);
  const toast = useToast();

  const validationSchema = Yup.object({
    productName: Yup.string().required("Product Name is required"),
    price: Yup.number().required("Price is required"),
    category: Yup.string().required("Category is required"),
    description: Yup.string().required("Description is required"),
  });

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: "image/", //only img file will be acc
    onDrop: (acceptedFiles) => {
      formik.setFieldValue("image", acceptedFiles[0]);
    },
  });

  const handleSave = () => {
    onSave(productId.id, updateProductName, updateProductPrice, updateProductcategory, updateProductdescription);
    onClose();
  };

  const formik = useFormik({
    initialValues: {
      productName: "",
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

        // Send a PATCH request to API to update the product
        await api.patch(`/update/products/${productId.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

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
        const response = await api.get(`/products`);
        const product = response.data.details;

        // Set the initial form values based on the fetched product details
        formik.setValues({
          productName: product.name,
          price: product.price,
          category: product.category,
          description: product.description,
        });
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast({
          title: "failed to get product!",
          description: String(error),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchProductDetails();
  }, [productId.name, formik]);

  useEffect(() => {
    setUpdateProductName(productId.name);
    setUpdateProductPrice(productId.price);
    setUpdateProductCategory(productId.category);
    setUpdateProductDescription(productId.description);
  }, [productId]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={formik.handleSubmit}>
              <FormControl isInvalid={formik.errors.productName && formik.touched.productName}>
                <FormLabel>Product Name</FormLabel>
                <Input type="text" placeholder="Product Name" value={updateProductName} onChange={(e) => setUpdateProductName(e.target.value)} />
              </FormControl>
              <FormControl isInvalid={formik.errors.price && formik.touched.price}>
                <FormLabel>Product Price</FormLabel>
                <Input type="number" placeholder="Product Price" value={updateProductPrice} onChange={(e) => setUpdateProductPrice(e.target.value)} />
              </FormControl>
              <FormControl isInvalid={formik.errors.category && formik.touched.category}>
                <FormLabel>Product Category</FormLabel>
                <Input type="text" placeholder="Product Category" value={updateProductcategory} onChange={(e) => setUpdateProductCategory(e.target.value)} />
              </FormControl>
              <FormControl isInvalid={formik.errors.description && formik.touched.description}>
                <FormLabel>Product Description</FormLabel>
                <Textarea placeholder="Product Description" value={updateProductdescription} onChange={(e) => setUpdateProductDescription(e.target.value)} />
              </FormControl>
              <FormControl isInvalid={formik.errors.image && formik.touched.image}>
                <FormLabel>Product Image</FormLabel>
                <div {...getRootProps()} style={{ border: "2px dashed  #cccccc", borderRadius: "4px", padding: "20px", cursor: "pointer" }}>
                  <input {...getRootProps()} />
                  <p>Drag 'n' drop an image here, or click to select an image</p>
                </div>
                <FormErrorMessage>{formik.errors.image}</FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSave}>
              Update Product
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateProductModal;
