import { Box, Button, Container, FormControl, FormErrorMessage, FormLabel, Input, Center, InputGroup, InputRightElement, VStack, useDisclosure, useToast, Flex, AbsoluteCenter, Image, HStack, Checkbox } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import api from "../api";
import { useNavigate, useSearchParams} from "react-router-dom";
import YupPassword from "yup-password";
import { useEffect } from "react";
YupPassword(yup);


function ResetPassword() {
    const [searchParams] = useSearchParams();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen: showPassword, onToggle: onTogglePassword } = useDisclosure();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
        console.log("Code from query params:", code);
    } else {
        console.log("Code not found in query params");
    }
}, [searchParams]);

  
  const loginSchema = yup.object().shape({
    password: yup.string().required("Password is required!").matches("^(?=.*?[a-zA-Z])(?=.*?[0-9]).{6,}$", "Must contain at least 6 characters, including at least one letter and one number"),
    confirmPassword: yup.string()
    .oneOf([yup.ref("password"), ""], "Passwords must match"),
  });

  const handleSubmit = async (values) => {
    
    try {
        const data = {
            uniqueCode: searchParams.get("code"),
            password: values.password,
        }
        const response = await api.post(`/login/reset-password`, data);

    if (response.status === 200) {
        toast({
            title: "Reset Password",
            description: "Your password is successfully changed!",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
        navigate('/');
    } else {
        toast({
            title: "Failed to reset password!",
            description: "Failed to send a password reset email",
            status: "error",
            duration: 5000,
            isClosable: true,
        })
    }
    } catch (error) {
        toast({
            title: "Failed to reset password!",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
        });
    }
};

  return (
    <Box position="relative" bg={"red.700"} h="100vh">
      <AbsoluteCenter>
        <Container maxW="lg" bgColor="white" boxShadow="md" p="6" rounded="md" bg="white" mt={5}>
          <Box pt={7} px={5} pb={5}>
            <Flex gap="10px" mb={10} alignItems={"center"} justifyContent={"center"}>
              <Image src="https://i.ibb.co/CQY63yt/mekdilogo1.png" w={"60%"} />
            </Flex>
            <Formik initialValues={{ password: "" }} validationSchema={loginSchema} onSubmit={handleSubmit}>
              {({ isSubmitting }) => (
                <Form>
                  <VStack gap={4}>
                  <Field name="password">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.password && form.touched.password} isDisabled={isSubmitting}>
                          <FormLabel>New Password</FormLabel>
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
                  <Field name="confirmPassword">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.confirmPassword && form.touched.confirmPassword} isDisabled={isSubmitting}>
                          <FormLabel>Confirm Password</FormLabel>
                          <InputGroup size="md">
                            <Input {...field} placeholder="Confirm Password" bgColor="white" pr="4.5rem" type={showPassword ? "text" : "password"} />
                            <InputRightElement w="4.5rem">
                              <Button bg="white" boxShadow={"md"} size="sm" onClick={onTogglePassword}>
                                {showPassword ? <AiFillEyeInvisible size={"20px"} /> : <AiFillEye size={"20px"} />}
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                          <FormErrorMessage>{form.errors.confirmPassword}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                   
                
                    <Center>
                      <Button isLoading={isSubmitting} type="submit" colorScheme="red" variant="solid" w={450} boxShadow={"md"}>
                        Reset Password
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

export default ResetPassword;
