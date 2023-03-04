import { useMutation, useQuery } from "react-query";
import axiosInstance from "../../../Utils";

// This is a query that fetches all the chats
const chats = () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  return axiosInstance.get("/api/chat", config);
};

// This is a mutation that adds a new chat
const addChat = (userId) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  return axiosInstance.post("/api/chat", { userId }, config);
};

// This is a function that adds a group chat.
const addGroupChat = (obj) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  return axiosInstance.post("/api/chat/group", obj, config);
};

// This is a function that updates a group chat.
const updateGroupChat = (obj) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  return axiosInstance.put("/api/chat/rename", obj, config);
};

// This is a function that adds a user to a group
const addUserGroup = (obj) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  return axiosInstance.put("/api/chat/groupadd", obj, config);
};

// This is a function that removes a user from a group
const removeUserGroup = (obj) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  return axiosInstance.put("/api/chat/groupremove", obj, config);
};

// This is a function that sends a message to the server.
const sendMessage = (obj) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  return axiosInstance.post("/api/message", obj, config);
};

// The backend will return the message and the user will be able to see it.
const showMessages = ({ queryKey }) => {
  const id = queryKey[1];
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  return axiosInstance.get(`/api/message/${id}`, config);
};

// This is a query that is used to show chats
export const useShowChat = () => {
  return useQuery("show-chats", chats, {
    staleTime: 60000,
  });
};

// This is a mutation that is used to create a chat
export const useCreateChat = (onSuccess, onError) => {
  return useMutation(addChat, {
    onSuccess,
    onError,
  });
};

// This is a mutation that is used to create a group chat
export const useCreateGroupChat = (onSuccess, onError) => {
  return useMutation(addGroupChat, {
    onSuccess,
    onError,
  });
};

// This is a custom hook that is used to update a group chat.
export const useUpdateGroupChat = (onSuccess, onError) => {
  return useMutation(updateGroupChat, {
    onSuccess,
    onError,
  });
};

// This is a custom hook that is used to add a user to a group chat.
export const useAddUserGroup = (onSuccess, onError) => {
  return useMutation(addUserGroup, {
    onSuccess,
    onError,
  });
};

// This is a custom hook that is used to remove a user from a group chat.
export const useRemoveUserGroup = () => {
  return useMutation(removeUserGroup);
};

// This is a custom hook that is used to send a message.
export const useSendMessage = (onSuccess, onError) => {
  return useMutation(sendMessage, {
    onSuccess,
    onError,
  });
};

// This is a function that returns a query.
export const useShowMessages = (id, onSuccess) => {
  return useQuery(["show-messages", id], showMessages, {
    staleTime: 60000,
    onSuccess,
  });
};
