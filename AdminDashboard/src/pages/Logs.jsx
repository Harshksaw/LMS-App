import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../services/apis";
import { useSearchParams } from "react-router-dom";

const logUrl = `${BASE_URL}/api/v1/app/logs`;
// const logUrl = `http://127.0.0.1:4000/api/v1/app/logs`;

const Logs = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const [searchParams] = useSearchParams();
  const coupon = searchParams.get("query");
  console.log(coupon);

  const showLogs = async () => {
    setLoading(true);
    const param = { logType: 1 };
    if (coupon) {
      param.title = coupon;
    }
    console.log(param);

    try {
      const res = await fetch(logUrl, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(param),
      });
      const data = await res.json();
      setLogs(data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    showLogs();
  }, []);
  const skItem = (key) => {
    return (
      <div
        className="flex border-b border-richblack-800 px-6 py-8 w-full"
        key={key}
      >
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
    <div>
      <div className="mb-14 flex justify-between">
        {/* <div className="mb-14 flex items-center justify-between"> */}
        <h1 className="text-4xl font-medium text-richblack-5 font-boogaloo text-center lg:text-left">
          Coupon Logs
        </h1>
      </div>
      <>
        <table className="rounded-2xl border border-richblack-800 w-full text-center table">
          <thead>
            <th className="flex-1 text-sm p-3 font-medium uppercase text-white">
              Action
            </th>

            <th className="flex-1 text-sm p-3 font-medium uppercase text-white">
              User Name
            </th>

            <th className="flex-1 text-sm p-3 font-medium uppercase text-white">
              Coupon code
            </th>
            <th className="flex-1 text-sm p-3 font-medium uppercase text-white">
              Course
            </th>
            <th className="flex-1 text-sm p-3 font-medium uppercase text-white">
              Description
            </th>
          </thead>
          {loading && (
            <div>
              {skItem(1)}
              {skItem(2)}
              {skItem(3)}
            </div>
          )}
          <tbody>
            {logs?.map((log) => (
              <tr className="p-5" key={logs._id}>
                <td className="font-medium p-3 text-richblack-100">
                  {log.action}
                </td>
                <td className="font-medium p-3 text-richblack-100">
                  {log.userId?.name}
                </td>
                <td className="font-medium p-3 text-richblack-100">
                  {log.title}
                </td>
                <td className="font-medium p-3 text-richblack-100">
                  {log.courseId?.bundleName ?? "N/A"}
                </td>
                <td className="font-medium p-3 text-richblack-100">
                  {log.description ?? "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Confirmation Modal */}
        {/* {confirmationModal && <ConfirmationModal modalData={confirmationModal} />} */}
      </>
    </div>
  );
};

export default Logs;
