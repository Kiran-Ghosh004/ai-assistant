import React, { useContext, useState } from 'react';
import authBg from '../assets/authBg.png';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/userContext';
import axios from 'axios';

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { serverUrl,userData, setUserData } = useContext(userDataContext);
  const [err, setErr] = useState("");
  const [loading,setLoading]=useState(false)

  const handleSignin = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/signin`, {
        email, password
      }, { withCredentials: true });
      setLoading(false);
      setUserData(result.data)
      // TODO: Save user data & navigate
       navigate("/customize")
    } catch (error) {
      console.log(error);
      setUserData(null);
      if (error.response && error.response.data?.message) {
        setErr(error.response.data.message);
        setLoading(false);
      } else {
        setErr("Something went wrong!");
      }
    }
  };

  return (
    <div
      className="w-full h-screen bg-cover bg-center flex justify-center items-center relative"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/60 to-black/80"></div>

      {/* Signin Form */}
      <form
        className="relative z-10 w-[90%] max-w-[450px] bg-[#00000075] backdrop-blur-md shadow-xl shadow-black rounded-2xl flex flex-col items-center justify-center gap-6 px-6 py-10"
        onSubmit={handleSignin}
      >
        <h1 className="text-white text-3xl font-semibold mb-4 text-center">
          Sign<span className="text-blue-400"> In</span>
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full h-[55px] border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 rounded-full text-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <div className="w-full h-[55px] border-2 border-white bg-transparent text-white rounded-full text-lg relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-full bg-transparent outline-none px-5 rounded-full text-white placeholder-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          {!showPassword && (
            <IoEye
              className="absolute top-1/2 right-4 -translate-y-1/2 w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}

          {showPassword && (
            <IoEyeOff
              className="absolute top-1/2 right-4 -translate-y-1/2 w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>

        {err && <p className="text-red-500 text-[17px]">{err}</p>}

        <button
          type="submit"
          className="w-full h-[55px] mt-4 bg-white text-black font-semibold rounded-full text-lg hover:bg-blue-400 hover:text-white transition-all duration-300 cursor-pointer"
          disabled={loading}
        >

          {loading?"loading...":"Sign In"}
        </button>

        <p className="text-white text-lg mt-3 cursor-pointer">
          Don't have an account?{' '}
          <span
            className="text-blue-400 hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signin;
