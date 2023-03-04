import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginUser } from "../hooks/useAuthData";
const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [show, setShow] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const { mutate, isLoading } = useLoginUser(onSuccess, onError);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUser((preData) => {
      return {
        ...preData,
        [name]: value,
      };
    });
  };

  const loginHandler = () => {
    mutate(user);
  };

  function onSuccess(data) {
    localStorage.setItem("token", data?.data?.token);
    navigate('/chat');
  }

  function onError(error) {
    toast({
      title: error.response.data.error,
      status: "error",
      isClosable: true,
    });
  }
  
  return (
    <VStack spacing="5px">
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email"
          onChange={changeHandler}
          value={user.email}
          name="email"
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={changeHandler}
            value={user.password}
            name="password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.76rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        type="submit"
        isLoading={isLoading}
        onClick={loginHandler}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setUser({ email: "guest@example.com", password: "Guest1234$" });
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
