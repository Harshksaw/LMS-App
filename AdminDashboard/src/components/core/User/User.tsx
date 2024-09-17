import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../services/apis";
import { useParams } from "react-router-dom";
import toast, { LoaderIcon } from "react-hot-toast";

import UserOrder from "./UserOrders";
import AddCourses from "./AddCourses";
import UserCourses from "./UserCourses";

interface UserProps {
  name: string;
  email: string;
  phoneNumber: string;
  age: number;
  image: string; // Add this line
  accountType: string;
  createdAt: string;
  isBanned: boolean;
  token: string;
  loginAttempts: boolean;
}

const User: React.FC<UserProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserProps | null>(null);

  const fetchData = async () => {
    const response = await axios.get(
      `${BASE_URL}/api/v1/auth/getUserById/${id}`
    );
    if (!response.data) {
      toast.error("Something went wrong");
      return;
    }
    setUser(response.data.user);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const logoutUser = async () => {
    await axios
      .post(
        `${BASE_URL}/api/v1/auth/logout`,
        {},
        {
          headers: {
            Authorization: "Bearer " + user?.token,
          },
        }
      )
      .then(async (res) => {
        toast.success("user logout from his device");
        fetchData();
      })
      .catch((error) => {
        toast.error("Error While Logout!");
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md ">
      <div className=" text-gray-800 mb-6 text-center bg-richblack-50 flex justify-between px-5 py-2 items-center">
        <h2>User Profile</h2>
        {!!user?.loginAttempts && (
          <button
            onClick={logoutUser}
            className="bg-pink-600 text-white rounded px-3 py-1"
          >
            Logout user
          </button>
        )}
      </div>
      {user && (
        <div className="bg-richblack-50 px-10 pt-3">
          <div className="text-center mb-6">
            <img
              src={user.image}
              alt={`${user.name}'s avatar`}
              className="w-24 h-24 rounded-full  mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <p className="text-gray-600 ">{user.email}</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <div className="font-medium text-gray-700 ">Phone Number</div>
              <div className="">{user.phoneNumber}</div>
            </div>
            <div className="flex justify-between border-b pb-2 ">
              <div className="font-medium text-gray-700">Account Type</div>
              <div className="">{user?.accountType}</div>
            </div>
            <div className="flex justify-between border-b pb-2">
              <div className="font-medium text-gray-700">Created At</div>
              <div>{new Date(user.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex justify-between border-b pb-2">
              <div className="font-medium text-gray-700">Status</div>
              <div>{user.isBanned ? "Banned" : "Active"}</div>
            </div>
            <div className="flex justify-between border-b pb-2">
              <div className="font-medium text-gray-700">Device Data</div>
              <div>
                {user.deviceData.deviceName} ({user.deviceData.systemName}{" "}
                {user.deviceData.systemVersion})
              </div>
            </div>
            {/* Add more rows as needed */}
          </div>
        </div>
      )}
      <div>
        <AddCourses id={id} />
      </div>
      <div className="flex flex-row justify-between items-center mt-10">
        <div>
          <UserOrder id={id} />
        </div>
        <div>
          <UserCourses id={id} />
        </div>
      </div>
    </div>
  );
};

export default User;
