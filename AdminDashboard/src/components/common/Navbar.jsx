import React, { useState, useEffect, useRef } from "react";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { NavbarLinks } from "../../../data/navbar-links";
import StudyNotionLogo from "../../assets/krishna/krishna.png";
import { fetchCourseCategories } from "../../services/operations/courseDetailsAPI";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { logout } from "../../services/operations/authAPI";
import { VscDashboard, VscSignOut } from "react-icons/vsc";
import ConfirmationModal from "./ConfirmationModal";

const Navbar = () => {
  // console.log("Printing base url: ", import.meta.env.VITE_APP_BASE_URL);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  // console.log('USER data from Navbar (store) = ', user)
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const fetchSublinks = async () => {
    try {
      setLoading(true);
      const res = await fetchCourseCategories();
      // const result = await apiConnector("GET", categories.CATEGORIES_API);
      // const result = await apiConnector('GET', 'http://localhost:4000/api/v1/course/showAllCategories');
      // console.log("Printing Sublinks result:", result);
      setSubLinks(res);
    } catch (error) {
      console.log("Could not fetch the category list = ", error);
    }
    setLoading(false);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ref = useRef(null);

  // console.log('data of store  = ', useSelector((state)=> state))

  // useEffect(() => {
  //     fetchSublinks();
  // }, [])

  // when user click Navbar link then it will hold yellow color
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  // when user scroll down , we will hide navbar , and if suddenly scroll up , we will show navbar
  const [showNavbar, setShowNavbar] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);

    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  });

  // control Navbar
  const controlNavbar = () => {
    if (window.scrollY > 200) {
      if (window.scrollY > lastScrollY) setShowNavbar("hide");
      else setShowNavbar("show");
    } else setShowNavbar("top");

    setLastScrollY(window.scrollY);
  };

  return (
    <>
      <nav
        className={`z-[10] h-[12vh] flex py-3 w-full items-center justify-center border-b-[1px] border-b-richblack-700 text-white translate-y-0 transition-al ${showNavbar} `}
      >
        {/* <nav className={` fixed flex items-center justify-center w-full h-16 z-[10] translate-y-0 transition-all text-white ${showNavbar}`}> */}
        <div className="flex w-11/12 max-w-maxContent items-center justify-between ">
          {/* logo */}
          <Link to="/">
            <img src={StudyNotionLogo} width={50} height={16} loading="lazy" />
          </Link>

          {/* Nav Links - visible for only large devices*/}
          <ul className="hidden sm:flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div
                    className={`group relative flex cursor-pointer items-center gap-1 ${
                      matchRoute("/catalog/:catalogName")
                        ? "bg-yellow-25 text-black rounded-xl p-1 px-3"
                        : "text-richblack-25 rounded-xl p-1 px-3"
                    }`}
                  >
                    <p>{link.title}</p>
                    <MdKeyboardArrowDown />
                    {/* drop down menu */}
                    <div
                      className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] 
                                                    flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible 
                                                    group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]"
                    >
                      <div className="absolute left-[50%] top-0 z-[100] h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                      {loading ? (
                        <p className="text-center ">Loading...</p>
                      ) : subLinks.length ? (
                        <>
                          {subLinks?.map((subLink, i) => (
                            <Link
                              to={`/catalog/${subLink.name
                                .split(" ")
                                .join("-")
                                .toLowerCase()}`}
                              className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                              key={i}
                            >
                              <p>{subLink.name}</p>
                            </Link>
                          ))}
                        </>
                      ) : (
                        <p className="text-center">No Courses Found</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "bg-yellow-25 text-black"
                          : "text-richblack-25"
                      } rounded-xl p-1 px-3 `}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Login/SignUp/Dashboard */}
          <div className="flex gap-x-4 items-center">
            {user && user?.accountType !== "Admin" && (
              <Link to="/dashboard/cart" className="relative">
                <AiOutlineShoppingCart className="text-[2.35rem] text-richblack-5 hover:bg-richblack-700 rounded-full p-2 duration-200" />
                {totalItems > 0 && (
                  <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {/* for large devices */}
            {/* {token !== null && <ProfileDropDown />} */}
            {/* for small devices */}
            {/* {token !== null && <MobileProfileDropDown />} */}

            <div
              onClick={(e) => e.stopPropagation()}
              className="flex  gap-5 right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-richblack-800"
            >
              <Link to="/dashboard/my-profile">
                <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
                  <VscDashboard className="text-lg" />
                  Dashboard
                </div>
              </Link>
              {token !== null && (
                <div
                  // onClick={() => {
                  //   dispatch(logout(navigate));
                  // }}
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Are you sure ?",
                      text2: "You will be logged out of your account.",
                      btn1Text: "Logout",
                      btn2Text: "Cancel",
                      btn1Handler: () => {
                        dispatch(logout(navigate));
                        setConfirmationModal(null);
                      },
                      btn2Handler: () => setConfirmationModal(null),
                    })
                  }
                  className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25"
                >
                  <VscSignOut className="text-lg" />
                  Logout
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
};

export default Navbar;
