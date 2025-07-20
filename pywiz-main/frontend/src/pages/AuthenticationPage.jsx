import React, { useState } from "react";
import Signup from "../components/Signup";
import Login from "../components/Login";

const AuthenticationPage = () => {
  const [loginPage, setLoginPage] = useState(false);

  const handlePage = (index) => {
    if (index === 1) {
      setLoginPage(true);
    } else {
      setLoginPage(false);
    }
  };

  return (
    <div className="h-screen  bg-[#18181B] flex max-md:items-center max-md:justify-center  ">
      <div className="grow max-md:hidden bg-[url(https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/1-gorgeous-night-sky-colorful-liquid.jpg)] bg-cover bg-center ">
        <div className="h-1/4 text-6xl flex items-center text-[#FF9271] font-bold px-16">
          <h1 className="">PyWiz</h1>
        </div>
      </div>
      <div className="2xl:w-2/5 lg:w-1/2  md:w-2/3 sm:w-5/6 w-full bg-[#18181B] flex flex-col justify-center items-center h-full">
        <div className=" sm:w-5/6 md:w-2/3 lg:w-3/4 w-full flex justify-center items-center gap-6 text-center text-white font-semibold text-xl ">
          <div className={`${loginPage && "border-b-2"}  cursor-pointer p-4 h-full w-2/5 `}>
            <h1
              onClick={() => handlePage(1)}
            >
              Log-In
            </h1>
          </div>
          <div  className={`${!loginPage && "border-b-2"} cursor-pointer h-full p-4 w-2/5 `}>
            <h1
              onClick={() => handlePage(2)}
            >
              Sign-Up
            </h1>
          </div>
        </div>
        {loginPage ? <Login /> : <Signup />}
      </div>
    </div>
  );
};

export default AuthenticationPage;
