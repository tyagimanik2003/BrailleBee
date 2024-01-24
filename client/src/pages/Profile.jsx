import React,{useState} from "react";
import DashNav from "../components/DashNav";
import { useSelector } from "react-redux";
import {useDispatch} from 'react-redux';
import { updateUserFailure, updateUserSuccess, updateUserStart, signOut} from "../redux/user/userSlice.js";

const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({});
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };
  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut())
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-[100vh] overflow-hidden">
      <DashNav />
      <div className="mt-[5rem] max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold flex justify-center">Profile</h1>
        <img
            src={currentUser.profilePicture}
            className="rounded-full self-center cursor-pointer object-cover mx-auto w-20 h-20"
          />
        <form className="flex flex-col mt-5" onSubmit={handleSubmit}>
          
          <input
            defaultValue={currentUser.username}
            type="text"
            id="username"
            className="bg-slate-100 p-3 rounded-lg my-7"
            placeholder="Username"
            onChange={handleChange}
          />
          <input
            defaultValue={currentUser.email}
            type="email"
            id="email"
            className="bg-slate-100 p-3 rounded-lg"
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            type="password"
            id="password"
            className="bg-slate-100 p-3 rounded-lg my-7"
            placeholder="Password"
            onChange={handleChange}
          />
          <button className="bg-[#F3C622] text-white p-3 rounded-lg font-bold hover:opacity-90">
            Update
          </button>
        </form>
        <div className="flex justify-between mt-5"> 
          <span className="text-red-700 cursor-pointer">Delete Account</span>
          <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign Out</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
