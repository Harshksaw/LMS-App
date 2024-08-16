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
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div>
        <label>Heading:</label>
        <input type="text" name="heading" value={formData.heading} onChange={handleChange} required />
      </div>
      <div>
        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />
      </div>
      <div>
        <label>Content:</label>
        <textarea name="content" value={formData.content} onChange={handleChange} required />
      </div>
      <div>
        <label>Image URL:</label>
        <input type="text" name="image" value={formData.image} onChange={handleChange} required />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default DailyUpdateForm;