import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Admin/Sidebar";
import Statistics from "../components/Admin/Statistics";
import AddQuestion from "./AddQuestion";
import DeleteQuestion from "./DeleteQuestions";
import Leaderboard from "../components/Admin/Leaderboard";

const AdminDashboard = () => {
  return (
    <div className="bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-200 min-h-screen ">
      <div className="bg-black fixed top-0 left-0 w-full bg-opacity-25">
        <Navbar />
      </div>
      <div className="h-[10vh]"></div>
      <div className="grow ">
        <Sidebar />
      </div>
      <div className="p-16 ml-[20%] ">
  
          <Routes>
            <Route path="/" element={<Statistics />} />
            <Route path="addLevel" element={<AddQuestion />} />
            <Route path="deleteLevel" element={<DeleteQuestion />} />
            <Route path="leaderboard" element={<Leaderboard />} />
          </Routes>
    
      </div>
    </div>
  );
};

export default AdminDashboard;
