import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Box, Button, Flex, FormControl, FormLabel, Input, Text, InputRightElement, InputGroup } from "@chakra-ui/react";
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";
import * as Yup from "yup";

const CashierForm = ({ onSubmit }) => {
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
    // Add more validation rules as needed
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Formik
      initialValues={{
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        // Add more form fields here
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Flex direction="column">
          <Form>
            <Field name="username">
              {({ field }) => (
                <Box mt={2}>
                  <FormControl>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <Input {...field} type="text" id="username" placeholder="Username" />
                    <Text color="red.500">
                      <ErrorMessage name="username" />
                    </Text>
                  </FormControl>
                </Box>
              )}
            </Field>
            <Field name="firstName">
              {({ field }) => (
                <Box mt={2}>
                  <FormControl>
                    <FormLabel htmlFor="firstName">First Name</FormLabel>
                    <Input {...field} type="text" id="firstName" placeholder="First Name" />
                    <Text color="red.500">
                      <ErrorMessage name="firstName" />
                    </Text>
                  </FormControl>
                </Box>
              )}
            </Field>
            <Field name="lastName">
              {({ field }) => (
                <Box mt={2}>
                  <FormControl>
                    <FormLabel htmlFor="lastName">Last Name</FormLabel>
                    <Input {...field} type="text" id="lastName" placeholder="Last Name" />
                    <Text color="red.500">
                      <ErrorMessage name="lastName" />
                    </Text>
                  </FormControl>
                </Box>
              )}
            </Field>
            <Field name="email">
              {({ field }) => (
                <Box mt={2}>
                  <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input {...field} type="text" id="email" placeholder="Email" />
                    <Text color="red.500">
                      <ErrorMessage name="email" />
                    </Text>
                  </FormControl>
                </Box>
              )}
            </Field>
            <Field name="password">
              {({ field }) => (
                <Box mt={2}>
                  <FormControl>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <InputGroup>
                      <Input {...field} type={showPassword ? "text" : "password"} id="password" placeholder="Password" />
                      <InputRightElement>
                        <Button h="1.75rem" mr={2} size="sm" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <Text color="red.500">
                      <ErrorMessage name="password" />
                    </Text>
                  </FormControl>
                </Box>
              )}
            </Field>

            <Box mt={4} display="flex" justifyContent="right">
              <Button type="submit" colorScheme="red">
                Submit
              </Button>
            </Box>
          </Form>
        </Flex>
      )}
    </Formik>
  );
};


export default CashierForm;