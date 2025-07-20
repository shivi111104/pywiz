import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserLeaderboard from "./components/UserLeaderboard";
import AuthenticationPage from "./pages/AuthenticationPage";
import UserDashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AddQuestion from "./pages/AddQuestion";
import DeleteQuestion from "./pages/DeleteQuestions";
import Leaderboard from "./components/Admin/Leaderboard";
import Intro from "./pages/Intro"
const App = () => {
  const userRole = localStorage.getItem("userRole") || "user";

  const isAdmin = userRole === "admin";
  const AdminRoute = ({ element }) => {
    return isAdmin ? element : <Navigate to="/" replace />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserDashboard />} />
        <Route path="/authenticate" element={<AuthenticationPage />} />
        <Route path="/archive" element={<AuthenticationPage />} />
        <Route path="/campaign" element={<AuthenticationPage />} />
        <Route path="/endless" element={<AuthenticationPage />} />
        <Route path="/profile" element={<AuthenticationPage />} />
        <Route path="/leaderboard" element={<UserLeaderboard />} />
        <Route path="/intro" element={<Intro />} />


        <Route path="/admin/*" element={<AdminRoute element={<AdminDashboard />} />}>
          <Route path="addLevel" element={<AdminRoute element={<AddQuestion />} />} />
          <Route path="deleteLevel" element={<AdminRoute element={<DeleteQuestion />} />} />
          <Route path="leaderboard" element={<AdminRoute element={<Leaderboard />} />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
