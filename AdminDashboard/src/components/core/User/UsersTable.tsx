import { useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { Link } from "react-router-dom";
import { HiClock } from "react-icons/hi";
import { FaCheck } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

import toast from "react-hot-toast";
import React from "react";

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function UserTable({ users, loading, setLoading }) {
  const [confirmationModal, setConfirmationModal] = useState(null);

  // Loading Skeleton
  const skItem = () => {
    return (
      <div className="flex border-b border-richblack-800 px-6 py-8 w-full">
        <div className="flex flex-1 gap-x-4 ">
          <div className="h-[148px] min-w-[300px] rounded-xl skeleton "></div>

          <div className="flex flex-col w-[40%]">
            <p className="h-5 w-[50%] rounded-xl skeleton"></p>
            <p className="h-20 w-[60%] rounded-xl mt-3 skeleton"></p>

            <p className="h-2 w-[20%] rounded-xl skeleton mt-3"></p>
            <p className="h-2 w-[20%] rounded-xl skeleton mt-2"></p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Table className="rounded-2xl border border-richblack-800 ">
        {/* heading */}
        <Thead>
          <Tr className="flex gap-x-10 rounded-t-3xl border-b border-b-richblack-800 px-6 py-2">
            <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
              Name
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Email
            </Th>
           
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Phone Number
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Created At
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Status
            </Th>
          </Tr>
        </Thead>

        {/* loading Skeleton */}
        {loading && (
          <div>
            {skItem()}
            {skItem()}
            {skItem()}
          </div>
        )}

        <Tbody>
          {!loading && users?.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                No users found
              </Td>
            </Tr>
          ) : (
            users?.map((user) => (
              <Link to={`/dashboard/user/${user._id}`} className="flex-1">
                <Tr
                  key={user._id}
                  className="flex gap-x-10 border-b border-richblack-800 px-6 py-8 justify-center items-center"
                >
                  <Td className="flex-1 text-left text-sm font-medium text-richblack-100">
                    <p className="text-lg font-semibold text-richblack-5 capitalize">
                      {user.name}
                    </p>
                  </Td>
                  <Td className="text-left text-sm font-medium text-richblack-100">
                    {user.email}
                  </Td>
                  
                  <Td className="text-left text-sm font-medium text-richblack-100">
                    {user.phoneNumber}
                  </Td>
                  <Td className="text-left text-sm font-medium text-richblack-100">
                    {formatDate(user.createdAt)}
                  </Td>
                  <Td>
                    {user.isBanned ? (
                      <p className="mt-2 flex w-fit flex-row items-center gap-2 rounded-full bg-red-700 px-2 py-[2px] text-[12px] font-medium text-white">
                        Banned
                      </p>
                    ) : (
                      <div className="mt-2 flex w-fit flex-row items-center gap-2 rounded-full bg-green-700 px-2 py-[2px] text-[12px] font-medium text-white">
                        <p className="flex h-3 w-3 items-center justify-center rounded-full bg-white text-green-700">
                          <FaCheck size={8} />
                        </p>
                        Active
                      </div>
                    )}
                  </Td>
                </Tr>
              </Link>
            ))
          )}
        </Tbody>
      </Table>

      {/* Confirmation Modal */}
      {/* {confirmationModal && <ConfirmationModal modalData={confirmationModal} />} */}
    </>
  );
}