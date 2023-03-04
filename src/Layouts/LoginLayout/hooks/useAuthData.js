import { useMutation } from "react-query";
import axiosInstance from "../../../Utils";

const login = (values) => {
  return axiosInstance.post("/api/user/login", values);
};

const signup = (values) => {
  return axiosInstance.post("/api/user/signup", values);
};

export const useLoginUser = (onSuccess, onError) => {
  return useMutation(login, { onError, onSuccess });
};

export const useSignUpUser = (onSuccess, onError) => {
  return useMutation(signup, { onError, onSuccess });
};
