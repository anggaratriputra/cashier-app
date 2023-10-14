import React, { useState, useEffect } from "react";
import { Box, Flex, Text, Input, Button, FormControl, FormLabel, FormErrorMessage, useToast, InputRightElement, InputGroup } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useFormik } from "formik"; // Add this import
import * as yup from "yup";
import api from "../api";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import AdminSidebar from "./AdminSidebar";
import { logout } from "../slices/accountSlices";
import { showUnauthorizedModal } from "../slices/accountSlices";
import { useNavigate } from "react-router-dom";

function UpdateAdminProfile() {
  const username = useSelector((state) => state.account.profile.data.profile.username);
  const [showPassword, setShowPassword] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();


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
    username: yup.string().max(15, "Must be 15 characters or less").required("Required"),
    firstName: yup.string().max(10, "Must be 10 characters or less").required("Required"),
    lastName: yup.string().max(15, "Must be 15 characters or less").required("Required"),
    email: yup.string().email("Invalid email address").required("Required"),
    password: yup.string().optional().matches("^(?=.*?[a-zA-Z])(?=.*?[0-9]).{6,}$", "Must contain at least 6 characters, including at least one letter and one number"),
    confirmPassword: yup
      .string()
      .optional()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      
  });

  const onSubmit = async (values) => {
    try {
      const data = new FormData();
      data.append("username", values.username);
      data.append("firstName", values.firstName);
      data.append("lastName", values.lastName);
      data.append("email", values.email);
      data.append("password", values.password);
      data.append("confirmPassword", values.confirmPassword);
      if (values.photoProfile instanceof File) {
        data.append("photoProfile", values.photoProfile);
      }
      const response = await api.patch(`/login/admin/profile`, data);
      
      if (response.data.ok) {
        // Optionally, you can display a success toast or take any other action here
        toast({
          title: "Profile Changed",
          description: "Your profile has been changed.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Handle the case where the API request was not successful
        toast({
          title: "Error!",
          description: "Failed to change your profile. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 400) {
        toast({
          title: "Error!",
          description: error.response?.data?.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Handle any errors, e.g., network issues
        console.error("Error change profile:", error);
        toast({
          title: "Error!",
          description: "An error occurred. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };


  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const response = await api.get(`/login/profile/admin/${username}`);
        const profile = response.data.detail; // Assuming your API response structure has a "detail" field

        formik.setValues({

          username: profile.username,
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          photoProfile: profile.photoProfile,
        });
      } catch (error) {
        if (error?.response?.status == 401) {
          dispatch(showUnauthorizedModal("/home"));
        } else if (error?.response?.status == 403) {
          toast({
            title: "Session expired",
            description: "Your session is expired, please login again.",
            status: "error",
            duration: 3000,
            isClosable: true,
            onCloseComplete() {
              dispatch(logout());
              navigate("/")
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

    fetchProfileDetails();
  }, [username]);

  const formik = useFormik({
    initialValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      photoProfile: null,
    },
    validationSchema,
    onSubmit,
  });

  return (
    <>
      <AdminSidebar setActivePage={setActivePage} activeItem={activeItem} />
      <Flex direction={"column"} h={"100vh"} p={"20px"} bgColor={"#f7f7f7"} ml={{ base: 0, md: 60 }}>
        <Box mt={4}>
          <Text fontWeight="bold" fontSize="2xl" mb="20px">
            Update Profile
          </Text>
          <form onSubmit={formik.handleSubmit}>
          <Box mt={2}>
              <FormControl>
                <FormLabel htmlFor="username">Username</FormLabel>
                <Input w = {"400px"} onChange={formik.handleChange} name="username" value={formik.values.username} type="text" id="username" placeholder="username" />
                <Text color="red.500">{formik.touched.name ? formik.errors.name : ""}</Text>
              </FormControl>
            </Box>
            <Box mt={2}>
              <FormControl>
                <FormLabel htmlFor="firstName">First Name</FormLabel>
                <Input w = {"400px"} onChange={formik.handleChange} name="firstName" value={formik.values.firstName} type="text" id="firstName" placeholder="First Name" />
                <Text color="red.500">{formik.touched.name ? formik.errors.name : ""}</Text>
              </FormControl>
            </Box>
            <Box mt={2}>
              <FormControl>
                <FormLabel htmlFor="lastName">Last Name</FormLabel>
                <Input w = {"400px"} onChange={formik.handleChange} name="lastName" value={formik.values.lastName} type="text" id="lastName" placeholder="Last Name" />
                <Text color="red.500">{formik.touched.name ? formik.errors.name : ""}</Text>
              </FormControl>
            </Box>
            <Box mt={2}>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input w = {"400px"} onChange={formik.handleChange} name="email" value={formik.values.email} type="text" id="email" placeholder="Email" />
                <Text color="red.500">{formik.touched.name ? formik.errors.name : ""}</Text>
              </FormControl>
            </Box>
            <Box mt={2}>
              <FormControl>
                <FormLabel htmlFor="password">New Password</FormLabel>
                <InputGroup  w = {"400px"}>
                  <Input onChange={formik.handleChange} name="newPassword" type={showPassword ? "text" : "password"} id="password" placeholder="New Password" />
                  <InputRightElement>
                    <Button h="1.75rem" mr={2} size="sm" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <Text color="red.500">{formik.touched.name ? formik.errors.name : ""}</Text>
              </FormControl>
            </Box>
            <Box mt={2}>
              <FormControl>
                <FormLabel htmlFor="password">Confirm Password</FormLabel>
                <InputGroup w = {"400px"}>
                  <Input onChange={formik.handleChange} name="newPassword" type={showPassword ? "text" : "password"} id="password" placeholder="Confirm Password" />
                  <InputRightElement>
                    <Button h="1.75rem" mr={2} size="sm" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <Text color="red.500">{formik.touched.name ? formik.errors.name : ""}</Text>
              </FormControl>
            </Box>
            <FormControl isInvalid={formik.errors.photoProfile && formik.touched.photoProfile}>
              <FormLabel>Profile Picture</FormLabel>
              <div {...getRootProps()} style={{ border: "2px dashed  #cccccc", borderRadius: "4px", padding: "20px", cursor: "pointer", width:"400px"}}>
                <p>Drag 'n' drop an image here, or click to select an image</p>
              </div>
              <FormErrorMessage>{formik.errors.photoProfile}</FormErrorMessage>
            </FormControl>
            <Box mt={4} display="flex" justifyContent="left">
              <Button type="submit" colorScheme="red">
                Update
              </Button>
            </Box>
          </form>
        </Box>
      </Flex>
    </>
  );
}

export default UpdateAdminProfile;
