import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const LoginProtectedRoute = () => {
  return localStorage.getItem("token") ? <Outlet /> : <Navigate to="/" />;
};

const ChatProtectedRoute = () => {
  return !localStorage.getItem("token") ? <Outlet /> : <Navigate to="/chat" />;
};

export {LoginProtectedRoute, ChatProtectedRoute};
