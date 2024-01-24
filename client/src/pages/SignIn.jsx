import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import loginProp from "../assets/login_prop.svg";
import { FcGoogle } from "react-icons/fc";
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice.js";
import { fetchPdfsSuccess, fetchPdfsStart, fetchPdfsFailure } from "../redux/user/pdfSlice.js";
import {useDispatch,useSelector} from 'react-redux';
import './index.css';
import OAuth from "../components/OAuth";

const Signin = () => {
  const [formData, setFormData] = useState({});
  const {loading, error} = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart);
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      // const pdfData = await pdfRes.json();

      // dispatch(fetchPdfsSuccess(pdfData));
      navigate('/dashboard')
    } catch (error) {
      dispatch(signInFailure(error));
      // dispatch(fetchPdfsFailure(error));
    }
  };
  return (
    <div className="">
      <div className="flex h-[100vh]">
        <div className="w-1/2 p-[3rem] bg-[#F3EAAF]">
          <NavLink to='/'>
            <h1 className="text-6xl font-black text-[#481F01] pb-[2rem]">
              BRAILLEBEE
            </h1>
          </NavLink>
          <h1 className="font-bold text-4xl  text-[#481F01] my-[4rem] mb-[7rem]">
            Login Yourself
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="my-6">
              <h1 className="text-2xl font-light">Email:</h1>
              <input
                placeholder=""
                type="email"
                id="email"
                onChange={handleChange}
                required
                className="border-2 border-gray-300 text-2xl w-[85%] p-1 rounded-md text-[#481F01]"
              />
            </div>
            <div className="my-6">
              <h1 className="text-2xl font-light">Password:</h1>
              <input
                placeholder=""
                id="password"
                onChange={handleChange}
                type="password"
                className="border-2 border-gray-300 text-2xl w-[85%] p-1 rounded-md text-[#481F01]"
              />
            </div>
            <div className="w-[85%] flex mt-[5rem] text-xl items-center">
              <div className="w-[40%]">
                <NavLink to="/sign-up">
                  <h1 className="underline">I don't have an account</h1>
                </NavLink>
              </div>
              <div className="w-[60%] justify-end flex">
                {/* <button className="bg-[#fff] p-2 mx-2 rounded-md flex items-center">
                  <FcGoogle className="mr-2" />
                  Log in with Google
                </button> */}
                <OAuth/>
                <button
                  disabled={loading}
                  className="font-bold p-2 px-5 rounded-md text-white border-2 bg-[#481F01] border-[#481F01]"
                >
                  {loading ? "Loading..." : "NEXT"}
                </button>
              </div>
            </div>
          </form>
          <p className="text-red-600">{error ? error || 'Something went Wrong' : ''}</p>
        </div>
        <div className="w-1/2 ">
          <div className="flex items-center justify-center floating-image">
            <img src={loginProp} className="w-[90%]" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signin