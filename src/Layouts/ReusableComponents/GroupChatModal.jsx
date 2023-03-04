import {
  Box,
  Button,
  FormControl,
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
import UserBadge from "../ChatLayout/components/UserBadge";
import UserListItems from "../ChatLayout/components/UserListItems";
import { useCreateGroupChat } from "../ChatLayout/hooks/useChat";
import { useSearchUser } from "../ChatLayout/hooks/useUser";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const toast = useToast();

  const { data: users, isLoading: userLoading } = useSearchUser(search);
  const { mutate } = useCreateGroupChat(onSuccess, onError);
  const queryClient = useQueryClient();

  const handleSearch = (e) => {
    let { value } = e.target;
    setSearch(value);
  };

  const handleGroup = (addUsers) => {
    if (selectedUsers.includes(addUsers)) {
      toast({
        title: "User already in group",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, addUsers]);
  };

  const handleSubmit = () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    const obj = {
      name: groupChatName,
      users: JSON.stringify(selectedUsers.map((u) => u._id)),
    };
    mutate(obj);
  };

  const handleDelete = (deleteUser) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user._id !== deleteUser._id)
    );
  };

  function onSuccess(data) {
    toast({
      title: "New group chat created successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    onClose();
    queryClient.setQueryData("show-chats", (oldQueryData) => {
      return {
        ...oldQueryData,
        data: [...oldQueryData.data, data.data],
      };
    });
  }

  function onError(error) {
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
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users eg:John Doe, Jane Doe"
                mb={1}
                onChange={(e) => handleSearch(e)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((user) => (
                <UserBadge
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>
            {userLoading ? (
              <Spinner size="lg" />
            ) : (
              users?.data
                ?.splice(0, 4)
                .map((user) => (
                  <UserListItems
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
