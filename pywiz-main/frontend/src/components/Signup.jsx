import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaGraduationCap,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaCalendar,
  FaLock,
  FaSchool,
  FaBuilding,
} from "react-icons/fa";

const Signup = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confpassword: "",
    prn: "",
    panelNum: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };

  const handleNextPage = () => {
    if (!formData.prn || formData.prn.length !== 10) {
      setErrorMessage("PRN must be 10 digits");
      return;
    }

    if (!formData.panelNum) {
      setErrorMessage("Please select a panel");
      return;
    }

    setErrorMessage("");
    setCurrentPage(currentPage + 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "prn") {
      if (/^\d*$/.test(value) || value === "") {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.username ||
      // !formData.email ||
      !formData.password ||
      !formData.confpassword ||
      !formData.prn ||
      !formData.panelNum
    ) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confpassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
    if (!passwordRegex.test(formData.password)) {
      setErrorMessage(
        "Password must be at least 5 characters long and contain at least one lowercase and one uppercase letter."
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        if (data.error.includes("Username")) {
          setErrorMessage(
            "Username is already taken. Please choose another one."
          );
        } else if (data.error.includes("email")) {
          setErrorMessage(
            "Email is already registered. Please use a different email."
          );
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } else {
        setErrorMessage(
          data.message
        );
      }
    } catch (error) {
      console.error("Error registering user:", error.message);
    }
  };

  return (
    <div className=" md:w-5/6 lg:w-3/4  rounded-3xl py-12  h-fit ">
      <div className=" flex flex-col  ">
        <h1 className="text-white font-bold px-8 mb-2 text-4xl">
          Create An Account
        </h1>
        <p className="  text-gray-50  font-light px-8 mb-6 text-lg">
          Enhance your Learning Experience
        </p>
      </div>
      {currentPage % 2 !== 0 && (
        <form className=" text-sm mx-8">
          <div className="relative mt-6">
            <input
              type="text"
              name="prn"
              id=""
              onChange={handleChange}
              value={formData.prn}
              placeholder="PRN"
              className="bg-[#262626] mx-auto rounded-2xl text-white p-4 px-16 w-full"
            />

            <FaSchool className="absolute top-1/2 -translate-y-1/2 left-6 w-6 h-6 text-[#626262] " />
          </div>
          <div className="relative mt-6">
            <select
              name="panelNum"
              onChange={handleChange}
              value={formData.panelNum}
              className="bg-[#262626] border-[1px] border-gray-600  mx-auto rounded-2xl text-white p-4 px-16 w-full"
            >
              <option value="" disabled defaultValue>
                Panel
              </option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
            <FaCalendar className="absolute top-1/2 -translate-y-1/2 left-6 w-6 h-6 text-[#626262] " />
          </div>
          {errorMessage && (
            <div className="text-red-500 text-sm text-center m-4">
              {errorMessage}
            </div>
          )}
          <button
            type="button"
            onClick={handleNextPage}
            className="bg-[#5C4AD8] relative left-full -translate-x-full rounded-2xl text-white p-4 px-16 w-1/2 mt-6"
          >
            Next
          </button>
        </form>
      )}
      {currentPage % 2 === 0 && (
        <form className="mx-8 text-sm" onSubmit={handleSubmit}>
          <div className="relative  ">
            <input
              type="text"
              name="username"
              id=""
              onChange={handleChange}
              value={formData.username}
              placeholder="Full Name"
              className="bg-[#262626] mx-auto rounded-2xl text-white p-4 px-16 w-full"
            />
            <FaUser className=" absolute left-6 top-1/2 -translate-y-1/2 text-[#626262] " />
          </div>
          {/* <div className="relative mt-6 ">
            <input
              type="email"
              name="email"
              id=""
              onChange={handleChange}
              value={formData.email}
              placeholder="Email"
              className="bg-[#262626] mx-auto rounded-2xl text-white p-4 px-16 w-full"
            />
            <FaUser className=" absolute left-6 top-1/2 -translate-y-1/2 text-[#626262] " />
          </div> */}
          <div className="relative mt-6">
            {" "}
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id=""
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

          <div className="relative mt-6">
            {" "}
            <input
              type={showPassword2 ? "text" : "password"}
              name="confpassword"
              id=""
              onChange={handleChange}
              value={formData.confpassword}
              placeholder="Confirm Password"
              className="bg-[#262626] rounded-2xl text-white  p-4 px-16  w-full"
            />{" "}
            <FaLock className=" absolute left-6 top-1/2 -translate-y-1/2 text-[#626262]" />
            {showPassword2 ? (
              <FaEyeSlash
                className="absolute right-6 cursor-pointer top-1/2 -translate-y-1/2 text-[#626262]"
                onClick={togglePasswordVisibility2}
              />
            ) : (
              <FaEye
                className="absolute right-6 cursor-pointer top-1/2 -translate-y-1/2 text-[#626262]"
                onClick={togglePasswordVisibility2}
              />
            )}
          </div>
          <div className=" text-base h-content flex justify-between font-semibold  text-[#00CFFD] text-end  mt-2 p-2 ">
            <p
              onClick={handleNextPage}
              className="text-start  w-1/6 hover:underline cursor-pointer"
            >
              Back
            </p>
          </div>
          {errorMessage && (
            <div className="text-red-500 text-center mb-4">{errorMessage}</div>
          )}
          <button
            type="submit"
            className="bg-[#5C4AD8]  rounded-2xl mt-6 min-h-16  text-white font-bold text-xl text-center p-2 w-full "
          >
            Sign Up
          </button>
        </form>
      )}
    </div>
  );
};

export default Signup;
