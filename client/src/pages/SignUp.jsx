import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import registerProp from "../assets/register_prop.svg";
import OAuth from "../components/OAuth";

const Signup = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if(data.success === false){
        setError(true);
        return;
      }
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(true);
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
          <h1 className="font-bold text-4xl  text-[#481F01] my-[5rem]">
            Welcome!
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="my-6">
              <h1 className="text-2xl font-light">Username:</h1>
              <input
                placeholder=""
                type="text"
                required
                id="username"
                className="border-2 border-gray-300 text-2xl w-[85%] p-1 rounded-md"
                onChange={handleChange}
              />
            </div>
            <div className="my-6">
              <h1 className="text-2xl font-light">Email:</h1>
              <input
                placeholder=""
                type="email"
                required
                id="email"
                className="border-2 border-gray-300 text-2xl w-[85%] p-1 rounded-md"
                onChange={handleChange}
              />
            </div>
            <div className="my-6">
              <h1 className="text-2xl font-light">Password:</h1>
              <input
                placeholder=""
                type="password"
                id="password"
                className="border-2 border-gray-300 text-2xl w-[85%] p-1 rounded-md"
                onChange={handleChange}
              />
            </div>
            <div className="w-[85%] flex mt-[3rem] text-xl items-center">
              <div className="w-1/4">
                <NavLink to="/sign-in">
                  <h1 className="underline">Log in instead</h1>
                </NavLink>
              </div>
              <div className="w-3/4 justify-end flex">
                {/* <button className="bg-[#fff] p-2 mx-2 rounded-md flex items-center">
                  <FcGoogle className="mr-2" />
                  Sign up with Google
                </button> */}
                <OAuth />
                <button
                  disabled={loading}
                  className="font-bold p-2 px-5 rounded-md text-white border-2 bg-[#481F01] border-[#481F01]"
                >
                  {loading ? "Loading..." : "NEXT"}
                </button>
              </div>
            </div>
          </form>
          <p className="text-red-600">{error && 'Something went Wrong'}</p>
        </div>
        <div className="w-1/2 relative floating-image">
          <img
            src={registerProp}
            alt="Register"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;