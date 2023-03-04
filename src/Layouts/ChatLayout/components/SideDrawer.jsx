import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { useCreateChat, useShowChat } from "../hooks/useChat";
import { useSearchUser } from "../hooks/useUser";
import ChatLoading from "./ChatLoading";
import UserListItems from "./UserListItems";

const SideDrawer = ({ isOpen, onClose, setSelectedChat }) => {
  const [search, setSearch] = useState({
    searchQuery: "",
  });
  const toast = useToast();
  const { data: users, isLoading: authLoading } = useSearchUser(
    search.searchQuery
  );
  const { isLoading: chatLoading } = useShowChat();
  const { mutate } = useCreateChat(onSuccess, onError);
  const queryClient = useQueryClient();

  const searchHandler = (e) => {
    let { value, name } = e.target;
    setSearch((preData) => ({ ...preData, [name]: value }));
  };

  const accessChat = (userId) => {
    mutate(userId);
  };

  function onSuccess(data) {
    setSelectedChat(data.data);
    toast({
      title: "New chat created successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    onClose();
    queryClient.setQueryData("show-chats", (oldQueryData) => {
      return {
        ...oldQueryData,
        data: [...oldQueryData?.data, data?.data],
      };
    });
  }

  function onError(error) {
    toast({
      title: error.response.data.error,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top-left",
    });
  }

  return (
    <>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                name="searchQuery"
                value={search.searchQuery}
                onChange={searchHandler}
              />
              <Button onClick={searchHandler}>Go</Button>
            </Box>
            {authLoading ? (
              <ChatLoading />
            ) : users?.data?.length === 0 ? (
              <Box display="flex" justifyContent="center" alignItems="center">
                <Text>No users found</Text>
              </Box>
            ) : (
              users?.data?.map((user) => (
                <UserListItems
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {chatLoading ? <Spinner ml="auto" display="flex" /> : null}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
