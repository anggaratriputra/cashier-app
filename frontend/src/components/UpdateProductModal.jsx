import { Input, Button, FormControl, FormLabel, FormErrorMessage, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Textarea } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

function UpdateProductModal({ isOpen, onClose, productId }) {
  const [selectedFileName, setSelectedFileName] = useState(productId.image);
  const toast = useToast();

  const validationSchema = Yup.object({
    productName: Yup.string().required("Product Name is required"),
    price: Yup.number().required("Price is required"),
    category: Yup.string().required("Category is required"),
    description: Yup.string().required("Description is required"),
  });

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: "image/", //only img file will be acc
    maxSize: 2000000,
    onDrop: (acceptedFiles) => {
      formik.setFieldValue("image", acceptedFiles[0]);
      setSelectedFileName(acceptedFiles[0].name);
    },
  });
  //   onSave(productId.id, updateProductName, updateProductPrice, updateProductcategory, updateProductdescription, selectedFile, selectedFileName);
  //   onClose();
  // };

  const formik = useFormik({
    initialValues: {
      productName: productId.name,
      price: productId.price,
      category: productId.category,
      description: productId.description,
      image: productId.image,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("productName", values.productName);
        formData.append("price", values.price);
        formData.append("category", values.category);
        formData.append("description", values.description);
        formData.append("image", values.image);

        // Send a PATCH request to API to update the product
        await api.patch(`/products/update/${productId.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSelectedFileName('')

        toast({
          title: "Product Updated",
          description: "The product has been successfully updated!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose()
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
  //   // Fetch the existing product details and populate the form
  //   const fetchProductDetails = async () => {
  //     try {
  //       const response = await api.get(`/products`);
  //       const product = response.data.details;

  //       // Set the initial form values based on the fetched product details
  //       formik.setValues({
  //         image: product.image,
  //         productName: product.name,
  //         price: product.price,
  //         category: product.category,
  //         description: product.description,
  //       });
  //     } catch (error) {
  //       console.error("Error fetching product details:", error);
  //       toast({
  //         title: "failed to get product!",
  //         description: String(error),
  //         status: "error",
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //     }
  //   };

  //   fetchProductDetails();
  // }, []);

  // useEffect(() => {
  //   setUpdateProductName(productId.name);
  //   setUpdateProductPrice(productId.price);
  //   setUpdateProductCategory(productId.category);
  //   setUpdateProductDescription(productId.description);
  //   setSelectedFile(productId.image);
  //   setSelectedFileName(productId.image);
  // }, [productId]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={formik.handleSubmit}>
            <ModalHeader>Update Product</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isInvalid={formik.errors.productName && formik.touched.productName}>
                <FormLabel>Product Name</FormLabel>
                <Input type="text" placeholder={`${productId.name}`} value={formik.values.productName} onChange={formik.handleChange} name="productName" />
                <FormErrorMessage>{formik.errors.productName}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={formik.errors.price && formik.touched.price}>
                <FormLabel>Product Price</FormLabel>
                <Input type="number" placeholder={`${productId.price}`} value={formik.values.price} onChange={formik.handleChange} name="price" />
                <FormErrorMessage>{formik.errors.price}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={formik.errors.category && formik.touched.category}>
                <FormLabel>Product Category</FormLabel>
                <Input type="text" placeholder={`${productId.category}`} value={formik.values.category} onChange={formik.handleChange} name="category" />
                <FormErrorMessage>{formik.errors.category}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={formik.errors.description && formik.touched.description}>
                <FormLabel>Product Description</FormLabel>
                <Textarea placeholder={`${productId.description}`} value={formik.values.description} onChange={formik.handleChange} name="description" />
                <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={formik.errors.image && formik.touched.image}>
                <FormLabel>Product Image</FormLabel>
                <div {...getRootProps()} style={{ border: "2px dashed  #cccccc", borderRadius: "4px", padding: "20px", cursor: "pointer" }}>
                  <input {...getInputProps()} onChange={(event) => formik.setFieldValue("image", event.currentTarget.files[0])} />
                  <p>Drag 'n' drop an image here, or click to select an image</p>
                </div>
                <p>Selected File: {selectedFileName}</p>
                <FormErrorMessage>{formik.errors.image}</FormErrorMessage>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" type="submit">
                Update Product
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateProductModal;
