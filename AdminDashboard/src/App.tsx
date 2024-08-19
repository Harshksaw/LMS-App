import { useEffect, useState } from "react";
import { Route, Routes, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PageNotFound from "./pages/PageNotFound";
import CourseDetails from "./pages/CourseDetails";

import AppConfig from "./components/core/AppConfig/AppConfig";
import Navbar from "./components/common/Navbar";

import OpenRoute from "./components/core/Auth/OpenRoute";
import ProtectedRoute from "./components/core/Auth/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Settings from "./components/core/Dashboard/Settings/Settings";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse/EditCourse";
import Instructor from "./components/core/Dashboard/Instructor";

import AddCourse from "./components/core/Dashboard/AddCourse/AddCourse";

import ViewCourse from "./pages/ViewCourse";
// import VideoDetails from "./components/core/ViewCourse/VideoDetails";

import { ACCOUNT_TYPE } from "./utils/constants";

import { HiArrowNarrowUp } from "react-icons/hi";
import AddQuiz from "./pages/AddQuiz";
import StudyMaterials from "./pages/StudyMaterials";
import MyQuiz from "./pages/MyQuiz";
import CourseBundleForm from "./components/core/Dashboard/BundleCourse/CreateBundle";
import EditQuiz from "./pages/EditQuiz";
import AllUsers from "./pages/AllUsers";
import User from "./components/core/User/User";
import React from "react";
import Blog from "./pages/Blog";
import DailyUpdateForm from "./pages/createBlog";
import EditBlog from "./pages/EditBlog";
import ViewBlog from "./pages/ViewBlog";

function App() {
  const { user } = useSelector((state) => state.profile);

  // Scroll to the top of the page when the component mounts
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Go upward arrow - show , unshow
  const [showArrow, setShowArrow] = useState(false);

  const handleArrow = () => {
    if (window.scrollY > 500) {
      setShowArrow(true);
    } else setShowArrow(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleArrow);
    return () => {
      window.removeEventListener("scroll", handleArrow);
    };
  }, [showArrow]);

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />

      {/* go upward arrow */}
      <button
        onClick={() => window.scrollTo(0, 0)}
        className={`bg-yellow-25 hover:bg-yellow-50 hover:scale-110 p-3 text-lg text-black rounded-2xl fixed right-3 z-10 duration-500 ease-in-out ${
          showArrow ? "bottom-6" : "-bottom-24"
        } `}
      >
        <HiArrowNarrowUp />
      </button>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        {/* Open Route - for Only Non Logged in User */}
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />

        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />

        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />

        {/* Protected Route - for Only Logged in User */}
        {/* Dashboard */}
        <Route
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Route only for Instructors */}
          {/* add course , MyCourses, EditCourse*/}
          {user?.accountType === ACCOUNT_TYPE.ADMIN && (
            <>
              <Route path="dashboard" element={<Instructor />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route
                path="dashboard/add-course"
                element={<CourseBundleForm />}
              />
              //for video cources
              <Route path="dashboard/course-video" element={<AddCourse />} />
              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
              <Route path="courses/:courseId" element={<CourseDetails />} />
              <Route path="dashboard/my-profile" element={<MyProfile />} />
              <Route path="dashboard/add-quiz" element={<AddQuiz />} />
              <Route path="dashboard/all-users" element={<AllUsers />} />
              <Route path="dashboard/user/:id" element={<User />} />
              <Route path="dashboard/my-quiz" element={<MyQuiz />} />
              <Route path="/dashboard/quiz/:id" element={<EditQuiz />} />
              <Route path="/dashboard/daily-update" element={<Blog />} />
              <Route
                path="/dashboard/view-daily-update/:id"
                element={<ViewBlog />}
              />
              <Route
                path="/dashboard/create-update"
                element={<DailyUpdateForm />}
              />
              <Route path="/dashboard/edit-update/:id" element={<EditBlog />} />
              <Route
                path="dashboard/create-studymaterials"
                element={<StudyMaterials />}
              />
              <Route path="/dashboard/app-config" element={<AppConfig />} />
              <Route path="dashboard/Settings" element={<Settings />} />
            </>
          )}
        </Route>

        {/* For the watching course lectures */}
        <Route
          element={
            <ProtectedRoute>
              <ViewCourse />
            </ProtectedRoute>
          }
        ></Route>

        {/* Page Not Found (404 Page ) */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
