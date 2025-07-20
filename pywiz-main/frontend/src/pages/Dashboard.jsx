import React, { useState } from "react";
import UserProfile from "../components/UserProfile";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AchievementModal from "../components/AchievementModal";
import Modal from "react-modal";
import StatisticsModal from "../components/StatisticsModal";

Modal.setAppElement("#root");

const UserDashboard = () => {
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [isStatOpen, setIsStatOpen] = useState(false);
  const userRole = localStorage.getItem("userRole") || "notLoggedIn";
  const isLoggedIn = userRole !== "notLoggedIn"  ;

  const navigate = useNavigate();

  const handleAchievementsClick = () => {
    if (!isLoggedIn) {
      navigate("/authenticate");
    } else {
      setIsAchievementModalOpen(true);
    }
  };

  const handleStatsClick = () => {
    if (!isLoggedIn) {
      navigate("/authenticate");
    } else {
      setIsStatOpen(true);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#0078D9] to-[#D7C85E] via-[#9EEAFF]">
      <Navbar />
      <div className="flex justify-center items-center w-full min-h-[90vh] md:text-3xl text-2xl ">
        <div className="lg:w-3/4 xl:w-2/3 md:w-4/5 w-full  min-h-[600px] flex-col flex justify-center items-center space-y-20">
          <div className="flex justify-center h-[45vh]  w-full gap-4">
            <Link
              to="/campaign"
              className="w-1/2 h-full relative rounded-3xl shadow-3xl temp-bg campaign-bg evil-bg"
            >
              <div className=" h-1/4 w-full bg-black bg-opacity-75 absolute top-[60%] flex justify-center items-center">
                <p className=" text-white ">Campaign</p>
              </div>
            </Link>
            <Link
              to="/endless"
              className="w-1/2 h-full relative rounded-3xl shadow-3xl temp-bg evil-bg"
            >
              <div className=" h-1/4 w-full bg-black bg-opacity-75 absolute top-[60%] flex justify-center items-center">
                <p className="  text-white ">Endless</p>
              </div>
            </Link>
          </div>
          <div className="flex justify-center w-full h-[28vh] gap-4">
            <div
              className="w-1/3 h-full rounded-3xl shadow-3xl relative temp-bg archive-bg"
              onClick={handleAchievementsClick}
            >
              <div className=" h-1/4 w-full bg-black bg-opacity-75 absolute top-[60%] flex justify-center items-center">
                <p className=" text-white ">Achievements</p>
              </div>
            </div>

            <Link
              to="/tutorial"
              className="w-1/3 h-full rounded-3xl relative shadow-3xl temp-bg howtoplay-bg"
            >
              <div className=" h-1/4 w-full bg-black bg-opacity-75 absolute top-[60%] flex justify-center text-center items-center">
                <p className=" text-white ">How To Play</p>
              </div>
            </Link>

            <div
              className="w-1/3 h-full rounded-3xl temp-bg shadow-2xl relative "
              onClick={handleStatsClick}
            >
              <div className=" h-1/4 w-full bg-black bg-opacity-75 absolute top-[60%] flex justify-center text-center items-center">
                <p className=" text-white ">Stats</p>
              </div>
              <UserProfile />
            </div>
          </div>
        </div>
      </div>
      <AchievementModal
        isOpen={isAchievementModalOpen}
        onClose={() => setIsAchievementModalOpen(false)}
      />
      <StatisticsModal
        isOpen={isStatOpen}
        onClose={() => setIsStatOpen(false)}
      />
    </div>
  );
};

export default UserDashboard;
