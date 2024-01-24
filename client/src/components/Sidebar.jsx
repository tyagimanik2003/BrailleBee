import React, { useRef, useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { IoMdClose } from "react-icons/io";
import backgroundImage from "../assets/opaqueBG.svg";
import logobraille from '../assets/Group 11.svg'
import { fetchPdfsStart } from "../redux/user/pdfSlice";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { updateUserFailure, updateUserSuccess, updateUserStart, signOut} from "../redux/user/userSlice.js";
const Sidebar = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const fileRef = useRef(null);
  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut())
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="h-[100vh] w-[15%] bg-[#2C2C2C] absolute top-0 left-0 z-20 text-[#fff] font-medium shadow-xl">
        <div className="flex justify-center px-5 pt-1 pb-7">
          <h1 className="text-3xl font-bold text-[#F3C622]">
            <img src={logobraille}/>
            {/* BRAILLE<span className="text-[#F3C622]">BEE</span> */}
          </h1>
        </div>
        <div className="flex scale-90 lg:scale-100 col-span-1 ml-auto text-lg justify-center font-bold my-auto">
          {currentUser ? (
            <NavLink to="/profile" className="text-white">
              <img
                src={currentUser.profilePicture}
                alt="profile"
                className="w-16 h-16 rounded-full mx-auto my-2"
              />
              <h1>Welcome {currentUser.username}</h1>
            </NavLink>
          ) : (
            <div>
              <NavLink
                to="/sign-up"
                className="w-full hover:bg-black border-2 border-black rounded-full py-[1.5vh] px-[1.5vw] m-[2.5%] hover:text-[#fff] text-black text-center"
              >
                <div>REGISTER</div>
              </NavLink>
              <NavLink
                to="/sign-in"
                className="w-full hover:bg-black border-2 border-black rounded-full py-[1.5vh] px-[1.5vw] m-[2.5%] hover:text-[#fff] text-black text-center"
              >
                <div>LOGIN</div>
              </NavLink>
            </div>
          )}
        </div>
        <div className="w-[80%] mx-auto my-[5rem] text-md">
        <NavLink to='/dashboard' activeClassName="active-link">
            <h1 className={`flex items-center py-2 ${location.pathname === '/dashboard' ? 'text-[#F3C622]  border-2 border-[#F3C622] rounded-lg' : ''}`}>
            {location.pathname === '/dashboard' && <FaArrowRight className="mx-2"/>}Utilities
            </h1>
          </NavLink>
          <NavLink to='/manage-files' activeClassName="active-link">
            <h1 className={`flex items-center py-3 ${location.pathname === '/manage-files' ? 'text-[#F3C622] border-2 border-[#F3C622] rounded-lg' : ''}`}>
            {location.pathname === '/manage-files' && <FaArrowRight className="mx-2"/>}Manage Files
            </h1>
          </NavLink>
          <NavLink to='/convert-to-editable' activeClassName="active-link">
            <h1 className={`flex items-center py-3 ${location.pathname === '/convert-to-editable' ? 'text-[#F3C622]  border-2 border-[#F3C622] rounded-lg' : ''}`}>
            {location.pathname === '/convert-to-editable' && <FaArrowRight className="mx-2"/>}Convert to Editable Copy
            </h1>
          </NavLink>
          <NavLink to='/convert-to-brf' activeClassName="active-link">
            <h1 className={`flex items-center py-3 ${location.pathname === '/convert-to-brf' ? 'text-[#F3C622] border-2 border-[#F3C622] rounded-lg' : ''}`}>
            {location.pathname === '/convert-to-brf' && <FaArrowRight className="mx-2"/>}Convert to BRF copy 
            </h1>
          </NavLink>
          <NavLink to='/compare-files' activeClassName="active-link">
            <h1 className={`flex items-center py-3 ${location.pathname === '/compare-files' ? 'text-[#F3C622] border-2 border-[#F3C622] rounded-lg' : ''}`}>
            {location.pathname === '/compare-files' && <FaArrowRight className="mx-2"/>}Compare Files
            </h1>
          </NavLink>
        </div>
        <div className="mt-[10rem] mx-auto flex justify-center">
          <span onClick={handleSignOut} className="cursor-pointer flex items-center text-lg mx-auto"><IoIosLogOut className="mr-2"/> Log Out</span>
        </div>
      </div>

    </>
  );
};

export default Sidebar;