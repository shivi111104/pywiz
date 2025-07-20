import React, { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        const userRole = data.role || "notLoggedIn";
        const email= formData.email;
        console.log(data.role)
        console.log(email)
        console.log("user")
        localStorage.setItem("userRole", userRole)
        localStorage.setItem("email", email)

        if(userRole === 'admin'){
          navigate("/admin")
        }
        else{
          navigate("/")
        }
      }
      else{
        setErrorMessage(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className=" md:w-5/6 lg:w-3/4  rounded-3xl py-12  h-fit ">
      <div className=" flex flex-col ">
        <h1 className="text-white font-bold px-8 mb-2 text-4xl">
          Welcome back
        </h1>
        <p className="  text-gray-50  font-light px-8 mb-6 text-lg">
          Enhance your Learning Experience
        </p>
      </div>
      <form onSubmit={handleLogin} className=" text-base mx-8 ">
        <div className="relative mt-6 ">
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={formData.username}
            placeholder="Username"
            className="bg-[#262626] mx-auto rounded-2xl text-white p-4 px-16 w-full"
          />
          <FaUser className=" absolute left-6 top-1/2 -translate-y-1/2 text-[#626262] " />
        </div>
        <div className="relative mt-6">
          {" "}
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            onChange={handleChange}
            value={formData.password}
            placeholder="Password"
            className="bg-[#262626] rounded-2xl text-white  p-4 px-16  w-full"
          />
          <FaLock className=" absolute left-6 top-1/2 -translate-y-1/2 text-[#626262]" />
          {showPassword ? (
            <FaEyeSlash
              className="absolute right-6 cursor-pointer top-1/2 -translate-y-1/2 text-[#626262]"
              onClick={togglePasswordVisibility}
            />
          ) : (
            <FaEye
              className="absolute right-6 cursor-pointer top-1/2 -translate-y-1/2 text-[#626262]"
              onClick={togglePasswordVisibility}
            />
          )}
        </div>
        <div className=" text-sm h-content flex justify-between font-semibold  text-[#00CFFD] text-end  mt-2 p-2 ">
          <div>
            <p className=" hover:underline cursor-pointer">Forgot Password?</p>
          </div>
        </div>
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}
        <button
          type="submit"
          className="bg-[#5C4AD8]  rounded-2xl mt-6 min-h-16  text-white font-bold text-xl text-center p-2 w-full "
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
