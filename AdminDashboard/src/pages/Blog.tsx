import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../services/apis';



const Blog = () => {

    const [blogData, setBlogData] = useState([
      id:"",
      
    ]);
    useEffect(() => {
      const fetchData=async ()=>{
        const response=await axios.get(`${BASE_URL}/api/v1/DailyUpdate/getAllUpdates`);
        console.log(response.data);
        setBlogData(response.data); 
      }
      fetchData();
    }, [])
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Daily Updates </h1>
     {blogData.length===0?(
      <p className="text-center text-gray-500">No updates found</p>
     ):(
      <div className='flex flex-wrap -mx-2'>
      {

        blogData.map((blog)=>(
          <div key={blog.id} className="w-full md:w-full lg:w-1/3 px-2 mb-4">
          <BlogCard blog={blog} />
        </div>
        ))
      }
      </div>
     )
     
     }
    </div>
  )
}


const BlogCard = ({ blog }) => {
  return (
    <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden mb-4">
      <div className="md:w-1/3">
        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
      </div>
      <div className="md:w-2/3 p-4">
        <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
        <h3 className="text-lg font-semibold mb-2">{blog.heading}</h3>
        <p className="text-gray-700 mb-4">{blog.description.slice(0,100)}</p>
        <small className="text-gray-500">{new Date(blog.date).toLocaleDateString()}</small>
      </div>
    </div>
  );
};
export default Blog