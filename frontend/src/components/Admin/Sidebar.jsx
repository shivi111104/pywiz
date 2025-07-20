import React, { useEffect, useState } from "react";
import {
  MdOutlineAddCircle,
  MdDelete,
  MdAdminPanelSettings,
  MdLeaderboard,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { IoStatsChart } from "react-icons/io5";


const Sidebar = () => {
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);
  
  const Menu = [
    {
      title: "Statistics",
      icon: <IoStatsChart className="w-12 h-8 " />,
      link:"",
    },
    {
      title: "Add Level",
      icon: <MdOutlineAddCircle className="w-12 h-8 " />,
      link:"addLevel",
    },
    {
      title: "View Questions",
      icon: <MdDelete className="w-12 h-8" />,
      link:"deleteLevel",
    },
    {
      title: "Leaderboard",
      icon: <MdLeaderboard className="w-12 h-8" />,
      link:"leaderboard",
    },
  ];
  const handleSubmenuClick = (index) => {
    setActiveMenuIndex(index);
  };

  return (
    <div className="w-1/5 h-full fixed text-white overflow-hidden">
      <div className="h-1/6 text-2xl flex p-3 items-center border-b-black border-b-2">
        <div className=" h-full flex items-center ">
          <MdAdminPanelSettings className="w-12 h-12" />
        </div>
        <h1 className="px-6">Welcome, Admin</h1>
      </div>
      <div className=" flex flex-col justify-start items-center gap-8 sm:text-xl text-xl mt-8">
        {Menu.map((menu, index) => (
          <Link to={`${menu.link}`}
              className={`w-full p-3 flex ${
                activeMenuIndex === index ? "bg-[#EEEDFE] text-[#8E88F7]" : ""
              }`}
              key={index}
              onClick={() => {
                handleSubmenuClick(index);
              }}
            >
              <div className=" h-full flex items-center  ">{menu.icon}</div>
              <div className="px-6">{menu.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
