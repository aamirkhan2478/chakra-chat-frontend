import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import ChatLayout from "../Layouts/ChatLayout";
import ChatPage from "../Layouts/ChatLayout/pages/ChatPage";
import LoginLayout from "../Layouts/LoginLayout";
import MainPage from "../Layouts/LoginLayout/pages/MainPage";
import {
  LoginProtectedRoute,
  ChatProtectedRoute,
} from "../Layouts/ReusableComponents/ProtectedRoute";

const AppRouters = () => {
  const [selectedChat, setSelectedChat] = useState();
  const [notification, setNotification] = useState([]);
  return (
    <Routes>
      <Route element={<ChatProtectedRoute />}>
        <Route path="/" element={<LoginLayout />}>
          <Route path="/" element={<MainPage />} />
        </Route>
      </Route>
      <Route element={<LoginProtectedRoute />}>
        <Route
          path="/chat"
          element={
            <ChatLayout
              setSelectedChat={setSelectedChat}
              notification={notification}
              setNotification={setNotification}
            />
          }
        >
          <Route
            path="/chat"
            element={
              <ChatPage
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
                notification={notification}
                setNotification={setNotification}
              />
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouters;
