import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import {
  useAddUserGroup,
  useRemoveUserGroup,
  useUpdateGroupChat,
} from "../hooks/useChat";
import { useCurrentUser, useSearchUser } from "../hooks/useUser";
import UserBadge from "./UserBadge";
import UserListItems from "./UserListItems";

const UpdateGroupChatModal = ({ selectedChat, setSelectedChat }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const { data: user } = useCurrentUser();
  const { data: users, isLoading: userLoading } = useSearchUser(search);
  const queryClient = useQueryClient();
  const { isLoading: chatLoading, mutate } = useUpdateGroupChat(
    onSuccess,
    onError
  );

  const { isLoading: userAddLoading, mutate: userAdd } = useAddUserGroup(
    onSuccessUser,
    onErrorUser
  );
  const { isLoading: userRemoveLoading, mutate: userRemove } =
    useRemoveUserGroup();

  const toast = useToast();

  // This function is used to add a user to a group chat.
  const handleAddUser = (checkUser) => {
    // It checks if the user is already in the group, and if the user is the admin of the group.
    if (selectedChat.users.find((u) => u._id === checkUser._id)) {
      toast({
        title: "User already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    // If the user is not the admin, it will not allow the user to add someone to the group.
    if (selectedChat.groupAdmin._id != user?.data._id) {
      toast({
        title: "Only admin can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    // If the user is the admin, it will add the user to the group.
    const obj = {
      chatId: selectedChat._id,
      userId: checkUser._id,
    };

    userAdd(obj);
  };

  // This function is used to remove a user from a chat.
  const handleRemove = (checkUser) => {
    // If the user is the admin of the chat.
    if (
      selectedChat.groupAdmin._id !== user?.data._id &&
      checkUser._id !== user?.data._id
    ) {
      toast({
        title: "Only admin can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    const obj = {
      chatId: selectedChat._id,
      userId: checkUser._id,
    };

    // If the user is the admin, the user can remove anyone from the chat.
    userRemove(obj, {
      onSuccess: (data) => {
        if (checkUser._id === user?.data?._id) {
          setSelectedChat();
          queryClient.invalidateQueries("show-chats");
        } else {
          setSelectedChat(data.data);
          queryClient.invalidateQueries("show-chats");
        }
      },
      onError: (error) => {
        toast({
          title: error.response.data.error,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      },
    });
  };

  const handleUpdate = () => {
    const obj = {
      chatId: selectedChat._id,
      chatName: groupName,
    };
    mutate(obj);
  };

  const handleSearch = (e) => {
    let { value } = e.target;
    setSearch(value);
  };

  function onSuccess(data) {
    setSelectedChat(data.data);
    queryClient.invalidateQueries("show-chats");
    setGroupName("");
  }

  function onError(error) {
    toast({
      title: error.response.data.error,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setGroupName("");
  }

  function onSuccessUser(data) {
    setSelectedChat(data.data);
    queryClient.invalidateQueries("show-chats");
  }

  function onErrorUser(error) {
    toast({
      title: error.response.data.error,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  }

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat?.users?.map((user) => (
                <UserBadge
                  key={user._id}
                  user={user}
                  handleFunction={() => handleRemove(user)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={chatLoading}
                onClick={handleUpdate}
              >
                Update
              </Button>
            </FormControl>
            <FormControl display="flex">
              <Input
                placeholder="Add User To Group"
                mb={1}
                onChange={(e) => handleSearch(e)}
              />
            </FormControl>
            {userLoading || userAddLoading || userRemoveLoading ? (
              <Spinner size="lg" />
            ) : (
              users?.data
                ?.splice(0, 4)
                .map((user) => (
                  <UserListItems
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user?.data)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
