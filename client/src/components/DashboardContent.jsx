import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaArrowRight } from "react-icons/fa";
import utilities from "./utility.js";
import "./index.css";
import Chart from "./chart.jsx";
import { NavLink } from "react-router-dom";
const DashboardContent = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [pdfs, setPdfs] = useState([]);
  const [outputDetails, setOutputDetails] = useState([]);
  const [outputbrfDetails, setOutputBrfDetails] = useState([]);

  const getPdfs = async (req, res, next) => {
    try {
      const data = await fetch(`api/user/pdf/${currentUser._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await data.json();
      setPdfs(response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPdfs();
    fetchOutputDetails();
    fetchBrfOutputDetails();
  }, []);

  const fetchOutputDetails = async () => {
    try {
      const response = await fetch(`api/user/output/${currentUser._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      setOutputDetails(responseData);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchBrfOutputDetails = async () => {
    try {
      const response = await fetch(`api/user/outputbrf/${currentUser._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      setOutputBrfDetails(responseData);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="ml-[16%] h-[100vh] overflow-hidden">
        <div className="flex justify-between p-8 pb-2 items-center w-[100%]">
          <h1 className="text-2xl flex items-center">
            DASHBOARD <FaArrowRight className="mx-3" /> UTILITIES
          </h1>
        </div>
        <div className="flex items-center">
          <Chart />
          <div className="bg-[#2c2c2c] text-white h-[18rem] w-[40%] rounded-xl shadow-2xl">
            <h1 className="p-4 flex justify-center text-2xl">
              Overview (January)
            </h1>
            <div className="border-2 border-white py-2 mx-4 rounded-2xl h-[12rem]">
              <div className="flex items-center">
                <div className="bg-transparent border-2 border-white mx-3 text-center p-2 rounded-lg w-1/2 h-[5rem]">
                  <p>PDFs Uploaded: </p>
                  <span className="text-[#F3C622] text-2xl">{pdfs.length}</span>
                </div>
                <div className="bg-transparent border-2 border-white mx-3 text-center p-2 rounded-lg w-1/2 h-[5rem]">
                  <p>PDFs Processed (Editable): </p>
                  <span className="text-[#F3C622] text-2xl">
                    {outputDetails.length}
                  </span>
                </div>
              </div>
              <div className="flex items-center mt-2">
                <div className="bg-transparent border-2 border-white mx-3 text-center p-2 rounded-lg w-1/2 h-[5rem]">
                  <p>PDFs Processed (BRF): </p>
                  <span className="text-[#F3C622] text-2xl">
                    {" "}
                    {outputbrfDetails.length}
                  </span>
                </div>
                <div className="bg-transparent border-2 border-white mx-3 text-center p-2 rounded-lg w-1/2 h-[5rem]">
                  <p>Running Processes: </p>
                  <span className="text-[#F3C622] text-2xl">
                    0
                  </span>
                </div>
                {/* <p>No. of PDFs Processed (BRF): {outputbrfDetails.length}</p>
                <p>
                  Running Processes:{" "}
                  <span className="text-[#F3C622]">NULL</span>
                </p> */}
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-[100%] mt-5">
          {utilities.map((item, index) => (
            <NavLink
              to={item.link}
              key={index}
              className="bg-[#2C2C2C] w-[20rem] h-[15rem] m-7 mt-3 rounded-xl box"
            >
              <div className="h-[6rem]">
                <h1 className="text-[#EFEFEF] flex justify-center text-xl p-7 text-center">
                  {item.title}
                </h1>
              </div>
              <img src={item.icon} className="flex justify-center mx-auto" alt={item.alt}/>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default DashboardContent;