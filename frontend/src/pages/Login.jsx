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
import YupPassword from "yup-password";
YupPassword(yup);

function Login() {
  const { isOpen: showPassword, onToggle: onTogglePassword } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (values, forms) => {
    api
      .get(`/users?q=${values.username}`)
      .then((res) => {
        const { data } = res;
        const filteredUser = data
          .filter((user) => {
            return user.username === values.username;
          })
          .filter((user) => user.password === values.password);
        if (filteredUser.length === 0) {
          toast({
            status: "error",
            title: "Login failed",
            description: "incorrect username or password",
            isClosable: true,
            duration: 5000,
          });
          forms.setSubmitting(false);
          return;
        }
        const [userProfile] = filteredUser;
        dispatch(login(userProfile));

        toast({
          status: "success",
          title: "Login is success",
          description: "Redirecting you to timeline",
          isClosable: true,
          duration: 3000,
          onCloseComplete: () => {
            forms.resetForm();
            navigate("/Home");
          },
        });
      })
      .catch((error) => {
        toast({
          status: "error",
          title: "Something wrong",
          description: error.message,
          isClosable: true,
          duration: 5000,
        });
        forms.resetForm();
      });
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