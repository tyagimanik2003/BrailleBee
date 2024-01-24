import React from 'react'
import { NavLink } from "react-router-dom";
import LandingProp from "../assets/landingProp.svg";
// import Bee from "../assets/bee.png";
import Header from '../components/Header';
import arrow from '../assets/Arrow.svg';
import Logobee from '../assets/logobee.svg'
import './index.css';
const Home = () => {
  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url("src/assets/Bg.svg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Header />
      <div className=" h-[100vh] flex justify-start">
        <div className="w-[100%] ml-10 mt-[10rem]">
            <h1 className='text-lg font-semibold'>WELCOME TO</h1>
            <h1 className="text-9xl font-black">
                 <span className="text-[#000] py-0">BRAILLE<span className="text-[#FFCD6BE0]">BEE </span></span>
            </h1>
            <h1 className="text-xl mt-5 font-bold">
                "Breaking Barriers: Empowering Education for the Visually Challenged"
            </h1>
            <p className="text-lg mt-5 w-[45%]"> 
            Introducing a revolutionary tool to effortlessly translate academic textbooks into braille format. Our solution goes beyond traditional conversions, extracting text and images while preserving formatting. Elevate accessibility with contextual image descriptions, ensuring a comprehensive learning experience for visually challenged students. Join us in bridging the gap to an inclusive education.
            </p>
           <NavLink to="/sign-up">
           <button className="font-bold text-2xl items-center flex border-black border-2 rounded-full py-2 px-3 my-11">
                Let's Start
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                </svg>
            </button>
           </NavLink>
           <div className='flex items-center text-[#2B2C3B] mt-[6rem]'>
            <h1 className='font-semibold'>
                <span className='text-3xl'>1.)<span className='text-xl mx-1'>Choose a file</span></span>
                <p className='font-normal'>Upload a PDF from your device.</p>
            </h1>
            <img src={arrow} className='mx-[7rem]'/>
            <h1 className='font-semibold'>
                <span className='text-3xl'>2.)<span className='text-xl mx-1'>Convert in a Click</span></span>
                <p className='font-normal'>Get your file converted securely in seconds.</p>
            </h1>
            <img src={arrow} className='mx-[7rem]'/>
            <h1 className='font-semibold'>
                <span className='text-3xl'>3.)<span className='text-xl mx-1'>Download document</span></span>
                <p className='font-normal'>Download, open and view your file.</p>
            </h1>
           </div>
        </div>
        <div className=" flex justify-start">
          <img className="w-[38rem] absolute right-[10rem] top-[6rem] " src={LandingProp}/>
            
        </div>
      </div>
    </div>
  )
}

export default Home