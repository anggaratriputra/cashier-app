import React, { useState, useEffect, useRef } from "react";
import { Box, Flex, Text, Input, Button, FormControl, FormLabel, FormErrorMessage, useToast, InputRightElement, InputGroup } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
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
  const [selectedFileName, setSelectedFileName] = useState("");

  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const setActivePage = (newProfile) => {
    setActiveItem(newProfile);
  };

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: "image/",
    maxSize: 2000000,
    onDrop: (acceptedFiles) => {
      formik.setFieldValue("photoProfile", acceptedFiles[0]); // Set the selected file in formik
      setSelectedFileName(acceptedFiles[0].name);
    },
  });

  const validationSchema = yup.object({
    firstName: yup.string().max(10, "Must be 10 characters or less").required("Required"),
    lastName: yup.string().max(15, "Must be 15 characters or less").required("Required"),
    email: yup.string().email("Invalid email address").required("Required"),
    newPassword: yup
      .string()
      .optional()
      .matches(/^(?=.*?[a-zA-Z])(?=.*?[0-9]).{6,}$/, "Must contain at least 6 characters, including at least one letter and one number"),
    confirmPassword: yup
      .string()
      .optional()
      .oneOf([yup.ref("newPassword"), ""], "Passwords must match"),
  });

  const onSubmit = async (values) => {
    try {
      const data = new FormData();
      data.append("firstName", values.firstName);
      data.append("lastName", values.lastName);
      data.append("email", values.email);

      if (values.photoProfile)
      data.append("photoProfile", values.photoProfile);

      if (values.password) {
        data.append("password", values.password);
      }

      console.log(values.photoProfile)
      const response = await api.patch(`/login/admin/profile`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      
      if (response.data.ok) {
        newPasswordRef.current.value = ""; // Reset "New Password" field
        confirmPasswordRef.current.value = ""; // Reset "Confirm Password" field
        setSelectedFileName('')
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
        const profile = response.data.detail;

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
              navigate("/");
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
      };
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
      <Flex direction={"column"} h={"100vh"} p={"20px"} bgColor={"#f7f7f7"} ml={{ base: 0, md: 64 }}>
        <Box mt={4} ml={6}>
          <Text fontWeight="bold" fontSize="2xl" mb="20px">
            Update Profile
          </Text>
          <form onSubmit={formik.handleSubmit}>
            <Box mt={2}>
              <FormControl>
                <FormLabel htmlFor="firstName">First Name</FormLabel>
                <Input w={"400px"} onChange={formik.handleChange} name="firstName" value={formik.values.firstName} type="text" id="firstName" placeholder="First Name" />
                <Text color="red.500">{formik.touched.firstName ? formik.errors.firstName : ""}</Text>
              </FormControl>
            </Box>
            <Box mt={2}>
              <FormControl>
                <FormLabel htmlFor="lastName">Last Name</FormLabel>
                <Input w={"400px"} onChange={formik.handleChange} name="lastName" value={formik.values.lastName} type="text" id="lastName" placeholder="Last Name" />
                <Text color="red.500">{formik.touched.lastName ? formik.errors.lastName : ""}</Text>
              </FormControl>
            </Box>
            <Box mt={2}>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input w={"400px"} onChange={formik.handleChange} name="email" value={formik.values.email} type="text" id="email" placeholder="Email" />
                <Text color="red.500">{formik.touched.email ? formik.errors.email : ""}</Text>
              </FormControl>
            </Box>
            <Box mt={2}>
              <FormControl>
                <FormLabel htmlFor="newPassword">New Password</FormLabel>
                <InputGroup w={"400px"}>
                  <Input
                    ref={newPasswordRef}
                    onChange={formik.handleChange}
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    placeholder="New Password"
                  />
                  <InputRightElement>
                    <Button h="1.75rem" mr={2} size="sm" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <Text color="red.500">{formik.touched.newPassword ? formik.errors.newPassword : ""}</Text>
              </FormControl>
            </Box>
            <Box mt={2}>
              <FormControl>
                <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                <InputGroup w={"400px"}>
                  <Input
                    ref={confirmPasswordRef}
                    onChange={formik.handleChange}
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Confirm Password"
                  />
                  <InputRightElement>
                    <Button h="1.75rem" mr={2} size="sm" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <Text color="red.500">{formik.touched.confirmPassword ? formik.errors.confirmPassword : ""}</Text>
              </FormControl>
            </Box>
            <FormControl isInvalid={formik.errors.image && formik.touched.image}>
              <FormLabel>Photo Profile</FormLabel>
              <div {...getRootProps()} style={{ border: "2px dashed  #cccccc", borderRadius: "4px", padding: "20px", cursor: "pointer" }}>
              <input {...getInputProps()} name="photoProfile" onChange={(event) => formik.setFieldValue("photoProfile", event.currentTarget.files[0])} />
                <p>Drag 'n' drop an image here, or click to select an image</p>
              </div>
              <p>Selected File: {selectedFileName}</p>
              <FormErrorMessage>{formik.errors.image}</FormErrorMessage>
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
