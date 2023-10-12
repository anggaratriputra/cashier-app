import { Box, Flex, Text, Input, Button, FormControl, FormLabel, FormErrorMessage, useToast, InputRightElement } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";
import api from "../api";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";

function UpdateProfile() {


  const [activeItem, setActiveItem] = useState("updateProfile");
  const toast = useToast();
  const setActivePage = (newProfile) => {
    setActiveItem(newProfile);
  };

  const { username } = useParams();

  const { acceptedFiles, getRootProps } = useDropzone({
    accept: "image/", //only img file will be acc
    onDrop: (acceptedFiles) => {
      formik.setFieldValue("image", acceptedFiles[0]);
    },
  });

  const validationSchema = yup.object({
    firstName: yup.string().max(10, 'Must be 10 characters or less').required('Required'),
    lastName: yup.string().max(15, 'Must be 15 characters or less').required('Required'),
    email: yup.string().email('Invalid email address').required('Required'),
    password: yup
  .string()
  .required('Please enter your password.')
  .matches(
    '^(?=.*?[a-zA-Z])(?=.*?[0-9]).{6,}$',
    'Must contain at least 6 characters, including at least one letter and one number'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      photoProfile: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const data = new FormData()
    data.append('firstName', values.firstName);
    data.append('lastName', values.lastName);
    data.append('email', values.email);
    data.append('password', values.password);
    data.append('confirmPassword', values.confirmPassword);

    // Append the photoProfile if it's a file (e.g., an image)
    if (values.photoProfile instanceof File) {
      data.append('photoProfile', values.photoProfile);
    }
        await api.patch(`/login/update/${username}`, data, {});

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
        const response = await api.get(`/login/profile`);
        const profile = response.data.detail; // Assuming your API response structure has a "detail" field

        // Set the initial form values based on the fetched profile details
        formik.setValues({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          password: profile.password,
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
    <Sidebar setActivePage={setActivePage} activeItem={activeItem} />
      <Flex direction={"column"} ml={{ base: 0, md: 60 }}>
        <Box bgColor={"#f7f7f7"} h={"100vh"} w={"100vw"} p={"20px"}>
          <Text fontWeight="bold" fontSize="2xl" mb="20px">
            Update Profile
          </Text>
          <form onSubmit={formik.handleSubmit}>
            <FormControl isInvalid={formik.errors.firstName && formik.touched.firstName}>
              <FormLabel>First Name</FormLabel>
              <Input type="text" id="firstName" name="firstName" placeholder="First Name" value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              <FormErrorMessage>{formik.errors.firstName}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={formik.errors.lastName && formik.touched.lastName}>
              <FormLabel>Last Name</FormLabel>
              <Input type="text" id="lastName" name="lastName" placeholder="Last Name" value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={formik.errors.email && formik.touched.email}>
              <FormLabel>E-Mail</FormLabel>
             <Input type="text" id="email" name="email" placeholder="E-Mail" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={formik.errors.password && formik.touched.password}>
              <FormLabel>Password</FormLabel>
             <Input type="{showPassword ? 'text' : 'password'}" id="password" name="password" placeholder="Password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={formik.errors.confirmPassword && formik.touched.confirmPassword}>
              <FormLabel>Confirm Password</FormLabel>
              <Input type="{showPassword ? 'text' : 'password'}" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              <FormErrorMessage>{formik.errors.confirmPassword}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={formik.errors.photoProfile && formik.touched.photoProfile}>
              <FormLabel>Profile Picture</FormLabel>
              <div {...getRootProps()} style={{ border: "2px dashed  #cccccc", borderRadius: "4px", padding: "20px", cursor: "pointer" }}>
                <p>Drag 'n' drop an image here, or click to select an image</p>
              </div>
              <FormErrorMessage>{formik.errors.photoProfile}</FormErrorMessage>
            </FormControl>

            <Button type="submit" mt="10px">
              Update Profile
            </Button>
          </form>
        </Box>
      </Flex>
    </>
  );
}

export default UpdateProfile;