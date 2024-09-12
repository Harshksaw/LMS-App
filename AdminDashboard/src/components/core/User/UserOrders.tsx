import axios from "axios";
import React, { useState, useEffect } from "react";
import toast, { LoaderIcon } from "react-hot-toast";
import { BASE_URL } from "../../../services/apis";

const UserOrder = ({ id }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      // toast.loading('Fetching Orders');

      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/payment/getUserOrders/${id}`
        );
        console.log(response.data, "---response.data");
        setOrders(response.data.data);

        toast.success("Orders fetched successfully");
      } catch (error) {
        toast.error("Error fetching orders");
        console.error("Error fetching orders:", error);
      }
    };
    getOrders();
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button
        className="text-richblack-25 mx-auto p-6 bg-gray-100 rounded-lg shadow-md bg-caribbeangreen-400 text-2xl"
        onClick={handleOpenModal}
      >
        User Order
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black  bg-opacity-75 ">
          <div className="bg-black p-6 rounded-lg shadow-md max-h-full overflow-y-auto w-[60%]">
            <h2 className="text-xl mb-4">Order Details</h2>

            {orders.length === 0 && (
              <div className="text-center text-richblack-5 mt-4">
                No orders found ...........
                <LoaderIcon
                  style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                    marginLeft: "10px",
                    marginBottom: "5px",
                    padding: "20px",
                  }}
                />
              </div>
            )}
            {orders.map((order: any) => (
              <div
                key={order._id}
                className=" bg-richblack-100 mx-auto p-6 bg-gray-100 rounded-lg shadow-md mb-4 w-full"
              >
                <h5>Order ID: {order._id}</h5>
                <p>User: {order.user ? order.user.name : "Guest"}</p>
                <p>Total Amount: ₹{order.totalAmount}</p>
                <p>
                  Order Date: {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
            ))}
            <button
              className="mt-4 p-2 bg-white rounded-lg shadow-md"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrder;
