import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";

// This is a component that is used to wrap the Chat component.
// It is used to set the title of the page and to render the Header component.
const ChatLayout = ({ setSelectedChat, notification, setNotification }) => {
  document.title = "Chat";
  return (
    <>
      <Header
        setSelectedChat={setSelectedChat}
        notification={notification}
        setNotification={setNotification}
      />
      <Outlet />
    </>
  );
};

export default ChatLayout;
