import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BASE_URL } from "../services/apis";
import UserTable from "../components/core/User/UsersTable";

const AllUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/auth/getAllUsers`);
        if (!res.data) {
          toast.dismiss();
          toast.error("something went wront");
          return;
        }
        setUsers(res?.data?.data);
        setAllUsers(res?.data?.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const search = (text: string) => {
    if (!text) return setUsers(allUsers);
    const resultsData = allUsers.filter((user: any) => {
      return (user?.name + user?.email + user?.phoneNumber)
        ?.toString()
        .toLowerCase()
        ?.includes(text?.toLowerCase());
    });

    setUsers(resultsData);
  };

  return (
    <div>
      <div className="mb-14 flex justify-between items-center">
        {/* <div className="mb-14 flex items-center justify-between"> */}
        <h1 className="text-4xl font-medium text-richblack-5 font-boogaloo text-center lg:text-left">
          USERS
        </h1>
        <input
          type="search"
          placeholder="search here..."
          onChange={(e) => search(e.target.value)}
          className="px-2 rounded text-black outline-none"
        />
      </div>
      {users && (
        <UserTable setLoading={loading} users={users} loading={false} />
      )}
    </div>
  );
};

export default AllUsers;
