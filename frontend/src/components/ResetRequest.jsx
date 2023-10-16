import { Box, Button, Container, FormControl, FormErrorMessage, FormLabel, Input, Center, InputGroup, InputRightElement, VStack, useDisclosure, useToast, Flex, AbsoluteCenter, Image, HStack, Checkbox } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import api from "../api";
//   import { add } from "../slices/users";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, updatePhotoProfile } from "../slices/accountSlices";
import YupPassword from "yup-password";
YupPassword(yup);

function ResetRequest() {
  const toast = useToast();
  const navigate = useNavigate();
  
  const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email address").required("Required"),
  });

  const handleSubmit = async (values) => {
    try {
        const response = await api.post("/login/reset-password/request", values);
        
    if (response.status === 200) {
        toast({
            title: "Pasword Reset Request",
            description: "A password reset email has been sent to your email address",
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
            <Formik initialValues={{ email: "" }} validationSchema={loginSchema} onSubmit={handleSubmit}>
              {({ isSubmitting }) => (
                <Form>
                  <VStack gap={4}>
                    <Field name="email">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.email && form.touched.email} isDisabled={isSubmitting}>
                          <FormLabel>E-mail</FormLabel>
                          <Input {...field} placeholder="Email" bgColor="white" />
                          <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                   
                
                    <Center>
                      <Button isLoading={isSubmitting} type="submit" colorScheme="red" variant="solid" w={450} boxShadow={"md"}>
                        Request Reset Link
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

export default ResetRequest;
