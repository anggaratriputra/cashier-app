import { Box, Flex, Text, Input, Button, FormControl, FormLabel, FormErrorMessage, useToast, InputRightElement, IconButton, InputGroup } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as yup from "yup";
import api from "../api";
import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import { useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";

function UpdateAdminProfile() {
  const username = useSelector((state) => state.account.profile.data.profile.username);

  const [showPassword, setShowPassword] = useState(false);

  const [activeItem, setActiveItem] = useState(null);
  const toast = useToast();
  const setActivePage = (newProfile) => {
    setActiveItem(newProfile);
  };

  const { acceptedFiles, getRootProps } = useDropzone({
    accept: "image/jpeg, image/png",
    onDrop: (acceptedFiles) => {
      formik.setFieldValue("photoProfile", acceptedFiles[0]);
    },
  });

  const validationSchema = yup.object({
    firstName: yup.string().max(10, "Must be 10 characters or less").required("Required first name"),
    lastName: yup.string().max(15, "Must be 15 characters or less").required("Required last name"),
    email: yup.string().email("Invalid email address").required("Required valid email"),
    password: yup
      .string()
      .optional()
      .required("Please enter your password.")
      .matches("^(?=.*?[a-zA-Z])(?=.*?[0-9]).{6,}$", "Must contain at least 6 characters, including at least one letter and one number"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .optional(), // Make confirmPassword optional
  });


  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      photoProfile: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const data = new FormData();
        data.append("firstName", values.firstName);
        data.append("lastName", values.lastName);
        data.append("email", values.email);
        data.append("password", values.password);
        data.append("confirmPassword", values.confirmPassword);
        if (values.photoProfile instanceof File) {
          data.append("photoProfile", values.photoProfile);
        }
        await api.patch(`/login/profile`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        //handle success or redirect to another page
        console.log("Profile successfully updated!");
        toast({
          title: "Profile Updated",
          description: "you profile has been successfully updated!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Failed to update profile!",
          description: String(error),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.error("Failed to update profile!", error);
      }
    },
  });

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const response = await api.get(`/login/profile/${username}`);
        const profile = response.data.detail; // Assuming your API response structure has a "detail" field

        // Set the initial form values based on the fetched profile details
        formik.setValues({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          photoProfile: profile.photoProfile,
        });
      } catch (error) {
        console.error("Error fetching profile details:", error);
      }
    };

    fetchProfileDetails();
  }, [username]);

  return (
    <>
      <AdminSidebar setActivePage={setActivePage} activeItem={activeItem} />
      <Flex direction={"column"} ml={{ base: 0, md: 60 }}>
        <Box bgColor={"#f7f7f7"} h={"100vh"} w={"100vw"} p={"20px"}>
          <Text fontWeight="bold" fontSize="2xl" mb="20px">
            Update Profile
          </Text>
          <form onSubmit={formik.handleSubmit}>
            <FormControl mt={2} isInvalid={formik.errors.firstName && formik.touched.firstName}>
              <FormLabel>First Name</FormLabel>
              <Input w={"400px"} type="text" id="firstName" name="firstName" placeholder="First Name" value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              <FormErrorMessage>{formik.errors.firstName}</FormErrorMessage>
            </FormControl>
            <FormControl mt={2} isInvalid={formik.errors.lastName && formik.touched.lastName}>
              <FormLabel>Last Name</FormLabel>
              <Input w={"400px"} type="text" id="lastName" name="lastName" placeholder="Last Name" value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
            </FormControl>
            <FormControl mt={2} isInvalid={formik.errors.email && formik.touched.email}>
              <FormLabel>E-Mail</FormLabel>
              <Input w={"400px"} type="text" id="email" name="email" placeholder="E-Mail" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl mt={2} isInvalid={formik.errors.password && formik.touched.password}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type="{showPassword ? 'text' : 'password'}" id="password" name="password" placeholder="Password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} w={"400px"} />
                <InputRightElement>
                  <IconButton size="sm" onClick={() => setShowPassword(!showPassword)} icon={showPassword ? <ViewOffIcon /> : <ViewIcon />} />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
            </FormControl>
            <FormControl mt={2} isInvalid={formik.errors.confirmPassword && formik.touched.confirmPassword}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="{showPassword ? 'text' : 'password'}"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formik.values.confirmPassword}
                w={"400px"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormErrorMessage>{formik.errors.confirmPassword}</FormErrorMessage>
            </FormControl>
            <FormControl mt={2} isInvalid={formik.errors.photoProfile && formik.touched.photoProfile}>
              <FormLabel>Profile Picture</FormLabel>
              <div {...getRootProps()} style={{ border: "2px dashed  #cccccc", borderRadius: "4px", padding: "20px", cursor: "pointer", width: "400px" }}>
                <p>Drag 'n' drop an image here, or click to select an image</p>
              </div>
              <FormErrorMessage>{formik.errors.photoProfile}</FormErrorMessage>
            </FormControl>
            <Button type="submit" mt="10px" colorScheme="red">
              Update Profile
            </Button>
          </form>
        </Box>
      </Flex>
    </>
  );
}

export default UpdateAdminProfile;
