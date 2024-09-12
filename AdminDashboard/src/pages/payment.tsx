import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../services/apis";
import toast from "react-hot-toast";

const OrderScreen: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/payment/get-order`
        );
        console.log(response.data, "---response.data");
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching orders");
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <table className="rounded-2xl border border-richblack-800 w-full text-center table">
        <thead>
          <th className="flex-1 text-sm p-3 font-medium uppercase text-white">
            Order ID
          </th>

          <th className="flex-1 text-sm p-3 font-medium uppercase text-white">
            User
          </th>

          <th className="flex-1 text-sm p-3 font-medium uppercase text-white">
            Amount
          </th>
          <th className="flex-1 text-sm p-3 font-medium uppercase text-white">
            Date
          </th>
          <th className="flex-1 text-sm p-3 font-medium uppercase text-white">
            Items
          </th>
          <th className="flex-1 text-sm p-3 font-medium uppercase text-white">
            Bundle
          </th>
        </thead>

        <tbody>
          {orders.map((order: any) => (
            <tr className="p-5" key={order._id}>
              <td className="font-medium p-3 text-richblack-100">
                {order._id}
              </td>
              <td className="font-medium p-3 text-richblack-100">
                {order.user ? order.user.name : "Guest"}
              </td>
              <td className="font-medium p-3 text-richblack-100">
                ₹{order.totalAmount}
              </td>
              <td className="font-medium p-3 text-richblack-100">
                {new Date(order.orderDate).toLocaleDateString()}
              </td>
              <td className="font-medium p-3 text-richblack-100">
                {order.items?.itemType + ": " + order.items?.price ?? "N/A"}
              </td>
              <td className="font-medium p-3 text-richblack-100">
                {order.items?.item?.bundleName ?? "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  card: {
    padding: "16px",
    flexDirection: "row",

    margin: "16px 0",
    cursor: "pointer",
  },
};

export default OrderScreen;
