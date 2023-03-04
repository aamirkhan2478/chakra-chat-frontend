import { Box } from "@chakra-ui/react";
import React from "react";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import { useCurrentUser } from "../hooks/useUser";
const ChatPage = ({
  selectedChat,
  setSelectedChat,
  notification,
  setNotification,
}) => {
  const { data: user } = useCurrentUser();

  document.title = `Chat | ${user?.data?.name}`;
  return (
    <div style={{ width: "100%" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user?.data && (
          <MyChats
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
          />
        )}

        {user?.data && (
          <ChatBox
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            notification={notification}
            setNotification={setNotification}
          />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
