import { useQuery } from "react-query";
import axiosInstance from "../../../Utils";

// This function is used to get the current user
const user = () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  return axiosInstance.get("/api/user/getuser", config);
};

// This is a function that takes in an object with a key of queryKey
const searchUser = ({ queryKey }) => {
  // This is a variable that is assigned to the value of the second item in the queryKey array
  const query = queryKey[1];
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  return axiosInstance.get(`/api/user?search=${query}`, config);
};


// This is a React Hook that uses the useQuery hook from the SWR library.
// It returns the current user.
export const useCurrentUser = () => {
  return useQuery("current-user", user, {
    staleTime: 60000,
  });
};

// This is a React Hook that uses the useQuery hook from the SWR library.
// It returns the search results for a user.
export const useSearchUser = (query) => {
  return useQuery(["search-user", query], searchUser, {
    refetchOnWindowFocus: false,
    staleTime:60000
  });
};
