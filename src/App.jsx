import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ChatRoomPage from "./pages/ChatRoom";
import { ToastContainer } from "react-toastify";
import NavBar from "./components/NavBar";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function App() {
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);
  
  return (
    <div className="flex flex-col main-body" style={{minHeight:'100vh'}}>
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat/:roomId" element={<ChatRoomPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer position="top-right" />
    </div>
  );
}
