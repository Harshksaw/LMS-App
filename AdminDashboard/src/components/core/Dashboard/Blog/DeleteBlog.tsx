import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../../../../services/apis";
export const DeleteBlog = ({ id }) => {
  // const { id } = useParams();
  const HandleClick = async () => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/v1/DailyUpdate/DeleteUpdate/${id}`
      );
      console.log(response.data);
      toast.success("Blog Deleted Successfully");
    } catch (e) {
      console.log("error while deleting blog", e);
      toast.dismiss();
      toast.error("Blog Deletion Failed");
    }
  };
  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 mt-4 ml-4 inline-block"
      onClick={HandleClick}
    >
      Delete
    </button>
  );
};
