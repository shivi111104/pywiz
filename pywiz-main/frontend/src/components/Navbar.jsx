import React from "react";
import { Link } from "react-router-dom";
import { FaPython } from "react-icons/fa";

const Navbar = () => {
  const userRole = localStorage.getItem("userRole");

  return (
    <div className="bg-transparent  h-[10vh] p-6 flex justify-center items-center sm:text-3xl text-xl text-white z-40">
      <div className="flex gap-16  justify-center  w-4/5 lg:w-1/2 md:ml-20  ">
        <Link to="/" className="relative">
          <h1> Home</h1>
          <h1 className="absolute left-1 top-1 text-black"> Home</h1>
        </Link>
        <Link to="/leaderboard" className="relative">
          <h1>Leaderboard</h1>
          <h1 className="absolute left-1 top-1 text-black">Leaderboard</h1>
        </Link>
        <Link to="/intro" className="relative">
          <h1>About</h1>
          <h1 className="absolute left-1 top-1 text-black">About </h1>
        </Link>
        {/* <Link className="relative">
          <h1>Socials</h1>
          <h1 className="absolute left-1 top-1 text-black">Socials</h1>
        </Link> */}
        {userRole === "admin" ? (
          <Link to="/admin" className="relative">
            <h1>Admin</h1>
            <h1 className="absolute left-1 top-1 text-black">Admin</h1>
          </Link>
        ) : null}
      </div>
      <Link className="grow flex justify-end items-center sm:px-6">
        <FaPython className="h-16 w-16 text-yellow-300" />
      </Link>
    </div>
  );
};

export default Navbar;
