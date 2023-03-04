import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import React from "react";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "../../ReusableComponents/GroupChatModal";
import { useCurrentUser } from "../hooks/useUser";
import { useShowChat } from "../hooks/useChat";

const MyChats = ({ selectedChat, setSelectedChat }) => {
  const { data: chats, isLoading: chatLoading } = useShowChat();
  const { data: user } = useCurrentUser();
  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chatLoading ? (
          <ChatLoading />
        ) : chats?.data?.length === 0 ? (
          <Box
            cursor="pointer"
            bg={"#38B2AC"}
            color={"white"}
            px={3}
            py={2}
            borderRadius="lg"
          >
            <Text>No Chats Found</Text>
          </Box>
        ) : (
          <Stack overflowY="scroll">
            {chats?.data?.map((chat) => (
              <Box
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(user?.data, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
