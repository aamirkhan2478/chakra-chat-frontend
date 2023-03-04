import { Box } from "@chakra-ui/react";
import React from "react";
import SingleChat from "./SingleChat";

const ChatBox = ({
  selectedChat,
  setSelectedChat,
  notification,
  setNotification,
}) => {
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDirection="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        notification={notification}
        setNotification={setNotification}
      />
    </Box>
  );
};

export default ChatBox;
