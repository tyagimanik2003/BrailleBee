import { useEffect, useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DashNav = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleDropDown, setToggleDropDown] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [showDashboardNav, setShowDashboardNav] = useState(true);
  const handleDashboardNav = () => {
    if(window.location.pathname === '/profile'){
      setShowDashboardNav(false);
    }
  }
  useEffect(() => {
    handleDashboardNav();
  }, []);
  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div>
      <>
        <div
          className={` max-w-[100vw] px-[2.5vw] py-[2.2vh] z-10 fixed w-full font-urbanist top-0 ${
            toggleMenu ? "bg-opacity-30 backdrop-blur-sm" : "bg-transparent"
          }`}
        >
          <nav className="max-w-9xl mx-auto ">
            <div
              className={`justify-around my-0  ${
                !toggleMenu
                  ? " "
                  : "bg-[#FF3365] bg-opacity-0 backdrop-blur-0 duration-700"
              }`}
            >
              <div className="grid grid-cols-12">
                <div className="mr-auto my-auto col-span-2 text-black">
                  <NavLink to="/dashboard">
                    <h1 className="text-3xl font-bold">
                      BRAILLE<span className="text-[#F3C622]">BEE</span>
                    </h1>
                  </NavLink>
                  {/* <h1 className="text-white text-xl lg:text-5xl font-medium">LOGO</h1> */}
                </div>
                <div className="hidden lg:inline-flex col-span-10 ">
                  {showDashboardNav && (
                    <div className="">
                    <h1 className="text-4xl font-[500] "> Dashboard</h1>
                  </div>
                  )}
                  <div className="flex scale-90 lg:scale-100 col-span-1 ml-auto text-sm font-bold my-auto">
                    {currentUser ? (
                        <NavLink to="/profile" className="flex items-center">
                            <h1>{currentUser.username}</h1>
                            <img src={currentUser.profilePicture} alt="profile" className="w-11 h-11 rounded-full object-cover ml-4"/>
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
                </div>
                {/* Mobile navigation toggle */}
                <div className="col-span-10 col-start-13 lg:hidden flex text-white">
                  <button onClick={() => setToggleMenu(!toggleMenu)}>
                    <Bars3Icon className="lg:h-8 h-6" />
                  </button>
                </div>
              </div>
            </div>
            {/* mobile navigation */}
            <div
              className={`z-40 w-full overflow-hidden flex flex-col lg:hidden gap-8 origin-top duration-700 ${
                !toggleMenu ? "h-0" : "h-screen bg-fixed"
              }`}
            >
              <div className="px-8 py-[2.5vh]">
                <div className="flex flex-col font-light gap-8 text-2xl tracking-wider text-center">
                  <div className="p-[15%] row-span-8 m-auto grid grid-rows-4 bg-white rounded-3xl gap-2 font-bold justify-between">
                    <NavLink
                      to="/"
                      className="hover:bg-[#202427] rounded-full py-[1.5vh] px-[1.5vw] m-[2.5%] hover:text-white text-center"
                      style={({ isActive, isPending }) => {
                        return {
                          color: isActive ? "white" : "#202427",
                          backgroundColor: isActive ? "#202427" : "white",
                        };
                      }}
                    >
                      HOME
                    </NavLink>
                    <NavLink
                      to="/creative"
                      className="hover:bg-[#202427] rounded-full py-[1.5vh] px-[1.5vw] m-[2.5%] hover:text-white text-center"
                      style={({ isActive, isPending }) => {
                        return {
                          color: isActive ? "white" : "#202427",
                          backgroundColor: isActive ? "#202427" : "white",
                        };
                      }}
                    >
                      CREATIVE
                    </NavLink>
                    <NavLink
                      to="/automate"
                      className="hover:bg-[#202427] rounded-full py-[1.5vh] px-[1.5vw] m-[2.5%] hover:text-white text-center"
                      style={({ isActive, isPending }) => {
                        return {
                          color: isActive ? "white" : "#202427",
                          backgroundColor: isActive ? "#202427" : "white",
                        };
                      }}
                    >
                      AUTOMATE
                    </NavLink>
                    <NavLink
                      to="/marketing"
                      className="hover:bg-[#202427] rounded-full py-[1.5vh] px-[1.5vw] m-[2.5%] hover:text-white text-center"
                      style={({ isActive, isPending }) => {
                        return {
                          color: isActive ? "white" : "#202427",
                          backgroundColor: isActive ? "#202427" : "white",
                        };
                      }}
                    >
                      MARKETING
                    </NavLink>
                  </div>
                  <div className="row-span-2 mx-auto font-bold my-auto">
                    <div className="w-full hover:bg-white border-2 border-white rounded-full py-[1.5vh] px-[5vw] m-[2.5%] hover:text-[#202427] text-white text-center">
                      <NavLink to="/getintouch">GET IN TOUCH</NavLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </>
    </div>
    // <div>
    //     {currentUser ? (
    //         <img src={currentUser.profilePicture} alt="profile"/>
    //     ) : (
    //         <div>
    //             <h1>Sign in!</h1>
    //         </div>
    //     )}
    // </div>
  );
};

export default DashNav;
