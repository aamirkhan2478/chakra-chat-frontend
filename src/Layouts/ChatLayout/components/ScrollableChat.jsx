import { Avatar, Tooltip } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { useCurrentUser } from "../hooks/useUser";

const ScrollableChat = ({ messages }) => {
  const { data: user } = useCurrentUser();
  const isSameMessage = (currentMessage, currentMessageIndex) => {
    return (
      currentMessageIndex < messages.length - 1 &&
      (messages[currentMessageIndex + 1].sender._id !==
        currentMessage.sender._id ||
        messages[currentMessageIndex + 1].sender._id === undefined) &&
      messages[currentMessageIndex].sender._id !== user?.data._id
    );
  };

  const isLastMessage = (currentMessageIndex) => {
    return (
      currentMessageIndex === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== user?.data._id &&
      messages[messages.length - 1].sender._id
    );
  };

  const isSameSenderMargin = (currentMessage, currentMessageIndex) => {
    if (
      currentMessageIndex < messages.length - 1 &&
      messages[currentMessageIndex + 1].sender._id ===
        currentMessage.sender._id &&
      messages[currentMessageIndex].sender._id !== user?.data._id
    )
      return 45;
    else if (
      (currentMessageIndex < messages.length - 1 &&
        messages[currentMessageIndex + 1].sender._id !==
          currentMessage.sender._id &&
        messages[currentMessageIndex].sender._id !== user?.data._id) ||
      (currentMessageIndex === messages.length - 1 &&
        messages[currentMessageIndex].sender._id !== user?.data._id)
    )
      return 0;
    else return "auto";
  };

  const isSameUser = (currentMessage, currentMessageIndex) => {
    return (
      currentMessageIndex > 0 &&
      messages[currentMessageIndex - 1].sender._id === currentMessage.sender._id
    );
  };
  return (
    <ScrollableFeed>
      {messages.map((message, index) => (
        <div style={{ display: "flex" }} key={message._id}>
          {(isSameMessage(message, index) || isLastMessage(index)) && (
            <Tooltip
              label={message.sender.name}
              placement="bottom-start"
              hasArrow
            >
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={message.sender.name}
                src={message.sender.pic}
              />
            </Tooltip>
          )}

          <span
            style={{
              backgroundColor: `${
                message.sender._id === user.data._id ? "#BEE3F8" : "#B9F5D0"
              }`,
              borderRadius: "25px",
              padding: "5px 15px",
              maxWidth: "75%",
              marginLeft: isSameSenderMargin(message, index),
              marginTop: isSameUser(message, index) ? 3 : 10,
            }}
          >
            {message.content}
          </span>
        </div>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
