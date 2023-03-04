import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { object, string } from "yup";
import { ref } from "yup";
import { useSignUpUser } from "../hooks/useAuthData";

const Signup = () => {
  const [show, setShow] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { mutate, isLoading } = useSignUpUser(onSuccess, onError);
  const initialValues = {
    name: "",
    email: "",
    password: "",
    cpassword: "",
    pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  };

  const clickHandler = (values) => {
    mutate(values);
  };

  function onSuccess(data) {
    localStorage.setItem("token", data?.data?.token);
    navigate("/chat");
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
      <Formik
        initialValues={initialValues}
        onSubmit={clickHandler}
        validationSchema={object({
          name: string()
            .matches(
              /^(?=.{3,20}$)(?![a-z])(?!.*[_.]{2})[a-zA-Z ]+(?<![_.])$/,
              "Name should have at least 3 characters and should not any number!"
            )
            .required("Name is required!"),
          email: string().required("Email is requird!").email("Invalid Email!"),
          password: string()
            .required("Password is required!")
            .matches(
              /^(?=.*[0-9])(?=.*[a-zA-Z ])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&* ]{8,20}$/,
              "Password must contain at least 8 characters, 1 number, 1 upper, 1 lowercase and 1 special character!"
            ),
          cpassword: string()
            .oneOf([ref("password"), null], "Password not match!")
            .required("Confirm Password is required!"),
        })}
      >
        {({
          errors,
          touched,
          isValid,
          dirty,
          handleBlur,
          setFieldValue,
          handleChange,
          handleSubmit,
        }) => (
          <>
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Enter Your Name"
                name="name"
                isInvalid={Boolean(errors.name) && Boolean(touched.name)}
                onBlur={handleBlur}
                onChange={handleChange("name")}
              />
              <FormHelperText color="red">
                {Boolean(touched.name) && errors.name}
              </FormHelperText>
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter Your Email"
                name="email"
                isInvalid={Boolean(errors.email) && Boolean(touched.email)}
                onBlur={handleBlur}
                onChange={handleChange("email")}
              />
              <FormHelperText color="red">
                {Boolean(touched.email) && errors.email}
              </FormHelperText>
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup size="md">
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Enter Your Password"
                  name="password"
                  isInvalid={
                    Boolean(errors.password) && Boolean(touched.password)
                  }
                  onBlur={handleBlur}
                  onChange={handleChange("password")}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.76rem" size="sm" onClick={() => setShow(!show)}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormHelperText color="red">
                {Boolean(touched.password) && errors.password}
              </FormHelperText>
            </FormControl>
            <FormControl id="cpassword" isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup size="md">
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Enter Confirm Password"
                  name="cpassword"
                  isInvalid={
                    Boolean(errors.cpassword) && Boolean(touched.cpassword)
                  }
                  onBlur={handleBlur}
                  onChange={handleChange("cpassword")}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.76rem" size="sm" onClick={() => setShow(!show)}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormHelperText color="red">
                {Boolean(touched.cpassword) && errors.cpassword}
              </FormHelperText>
            </FormControl>
            <FormControl id="pic">
              <FormLabel>Picture</FormLabel>
              <Input
                type="file"
                p={1.5}
                accept="image/*"
                name="pic"
                onChange={(e) => {
                  const file = e.target.files[0];
                  const data = new FormData();
                  data.append("file", file);
                  data.append("upload_preset", "chat-app");
                  data.append("cloud_name", "aamir18");
                  fetch(
                    "https://api.cloudinary.com/v1_1/aamir18/image/upload",
                    {
                      method: "post",
                      body: data,
                    }
                  )
                    .then((res) => res.json())
                    .then((data) => {
                      setFieldValue("pic", data.url.toString());
                    });
                }}
              />
            </FormControl>
            <Button
              colorScheme="blue"
              width="100%"
              style={{ marginTop: 15 }}
              type="submit"
              isLoading={isLoading}
              disabled={!isValid || !dirty}
              onClick={handleSubmit}
            >
              Sign Up
            </Button>
          </>
        )}
      </Formik>
    </VStack>
  );
};

export default Signup;
