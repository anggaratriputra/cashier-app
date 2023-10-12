import { Box, Button, Container, FormControl, FormErrorMessage, FormLabel, Heading, Input, Center, InputGroup, InputRightElement, VStack, useDisclosure, useToast, Text, Flex, AbsoluteCenter, Image } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { RiSpeakLine } from "react-icons/ri";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import api from "../api";
//   import { add } from "../slices/users";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../slices/accountSlices";
import { logout } from "../slices/accountSlices";
import YupPassword from "yup-password";
YupPassword(yup);

function Login() {
  const { isOpen: showPassword, onToggle: onTogglePassword } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginAccount = async (username, password) => {
    try {
      const response = await api.post("/login", {
        user_identity: username,
        password,
      });

      // Handle the response from the server
      if (response.status === 200) {
        const responseData = response.data;
        const isAdmin = responseData.data.profile.isAdmin === true;
        const isActive = responseData.data.profile.isActive === true;

        dispatch(login(responseData));

        if (isAdmin) {
          navigate("/admin/addproduct");
        } else {
          if (isActive) {
            navigate("/home");
          } else {
            toast({
              title: "Failed to login!",
              description: "Username or password is incorrect",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        }
      }
    } catch (error) {
      toast({
        title: "Failed to login!",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = (values, forms) => {
    const { username, password } = values;

    // Call the loginUser function to send the POST request to the back end
    loginAccount(username, password);

    // Rest of your form submission logic
  };

  const loginSchema = yup.object().shape({
    username: yup.string().required("username can't be empty").min(6, "minimum characters is 6"),
    password: yup.string().required("password can't be empty"),
  });
  return (
    <Box position="relative" h="100vh">
      <AbsoluteCenter>
        <Container maxW="lg" bgColor="white" boxShadow="md" p="6" rounded="md" bg="white" mt={5}>
          <Box pt={7} px={5} pb={5}>
            <Flex gap="10px" mb={10} alignItems={"center"} justifyContent={"center"}>
              <Image src="https://i.ibb.co/CQY63yt/mekdilogo1.png" w={"60%"} />
            </Flex>
            <Formik initialValues={{ username: "", password: "" }} validationSchema={loginSchema} onSubmit={handleSubmit}>
              {({ isSubmitting }) => (
                <Form>
                  <VStack gap={4}>
                    <Field name="username">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.username && form.touched.username} isDisabled={isSubmitting}>
                          <FormLabel>Username</FormLabel>
                          <Input {...field} placeholder="Username" bgColor="white" />
                          <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="password">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.password && form.touched.password} isDisabled={isSubmitting}>
                          <FormLabel>Password</FormLabel>
                          <InputGroup size="md">
                            <Input {...field} placeholder="Password" bgColor="white" pr="4.5rem" type={showPassword ? "text" : "password"} />
                            <InputRightElement w="4.5rem">
                              <Button bg="white" boxShadow={"md"} size="sm" onClick={onTogglePassword}>
                                {showPassword ? <AiFillEyeInvisible size={"20px"} /> : <AiFillEye size={"20px"} />}
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                          <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Center>
                      <Button isLoading={isSubmitting} type="submit" colorScheme="red" variant="solid" w={450} boxShadow={"md"}>
                        Login
                      </Button>
                    </Center>
                  </VStack>
                </Form>
              )}
            </Formik>
          </Box>
        </Container>
      </AbsoluteCenter>
    </Box>
  );
}

export default Login;
