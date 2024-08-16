import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../services/apis';
import toast from 'react-hot-toast';

const DailyUpdateForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    heading: '',
    description: '',
    content: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    toast.loading('Saving daily update...');
      const response = await axios.post(`${BASE_URL}/api/v1/DailyUpdate/createDailyUpdate`, formData);
      toast.dismiss();
        toast.success('Daily update saved successfully');
      console.log('Daily update saved:', response.data);
    } catch (error) {
      console.error('Error saving daily update:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='max-w-full mx-auto p-4 bg-white rounded-lg shadow-md'>
      <div className='mb-4'>
        <label className="block text-gray-700 font-bold mb-2 ">Title:</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2 ">Heading:</label>
        <input type="text" name="heading" value={formData.heading} onChange={handleChange} required  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className='mb-4'>
        <label className="block text-gray-700 font-bold mb-2 ">Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32" />
      </div>
      <div className='mb-4'>
        <label className="block text-gray-700 font-bold mb-2 ">Content:</label>
        <textarea name="content" value={formData.content} onChange={handleChange} required  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-48"/>
      </div>
      <div className='mb-4'>
        <label className="block text-gray-700 font-bold mb-2 ">Image URL:</label>
        <input type="file" name="image" value={formData.image} onChange={handleChange} required  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      </div>
      <button type="submit"  className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Submit</button>
    </form>
  );
};

export default DailyUpdateForm;