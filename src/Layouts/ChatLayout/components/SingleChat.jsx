import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useCurrentUser } from "../hooks/useUser";
import ProfileModal from "../../ReusableComponents/ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { useSendMessage, useShowMessages } from "../hooks/useChat";
import { useQueryClient } from "react-query";
import "../assets/style.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../assets/animations/typing.json";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({
  selectedChat,
  setSelectedChat,
  notification,
  setNotification,
}) => {
  const [message, setMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { data: user } = useCurrentUser();
  const {
    data: messages,
    isLoading: messagesLoading,
    refetch,
  } = useShowMessages(selectedChat?._id, onSuccessFetch);
  const { mutate } = useSendMessage(onSuccess, onError);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user?.data);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  console.log('add new notification', notification);
  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
        ) {
          //give notification
          if (!notification.includes(newMessageReceived)) {
            setNotification([newMessageReceived, ...notification]);
            queryClient.invalidateQueries("show-messages");
          }
        } else {
          refetch();
        }
      });
    });

  const toast = useToast();
  const queryClient = useQueryClient();
  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
  };

  const sendMessage = (e) => {
    if (e.key === "Enter" && message) {
      socket.emit("stop typing", selectedChat._id);
      const obj = {
        content: message,
        chatId: selectedChat._id,
      };
      setMessage("");
      mutate(obj);
    }
  };

  const typingHandler = (e) => {
    setMessage(e.target.value);

    //Typing indicator logic
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timeLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timeLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timeLength);
  };

  function onSuccess(data) {
    socket.emit("new message", data.data);
    queryClient.invalidateQueries("show-messages");
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

  function onSuccessFetch() {
    socket.emit("join chat", selectedChat._id);
    selectedChatCompare = selectedChat;
  }

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat?.isGroupChat ? (
              <>
                {getSender(user?.data, selectedChat?.users)}
                <ProfileModal
                  user={getSenderFull(user?.data, selectedChat?.users)}
                />
              </>
            ) : (
              <>
                {selectedChat?.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  selectedChat={selectedChat}
                  setSelectedChat={setSelectedChat}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {messagesLoading ? (
              <Spinner size="xl" w={20} h={20} alignSelf="center" m="auto" />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages?.data} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={message}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontStyle="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
