import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../services/apis';
import './CpuUsageBar.css';
const CpuUsageBar = () => {
  const [cpuUsage, setCpuUsage] = useState(0);

  useEffect(() => {
    const fetchCpuUsage = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/cpu-usage`);
        setCpuUsage(response.data.cpuUsage);
      } catch (error) {
        console.error('Error fetching CPU usage:', error);
      }
    };

    fetchCpuUsage();
    const interval = setInterval(fetchCpuUsage, 60000); // Fetch every 1 minute

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="cpu-usage-bar" style={{ width: '100%', backgroundColor: '#f0f0f0', padding: '5px' }}>
      <div
        style={{
          width: `${cpuUsage * 100}%`,
          backgroundColor: cpuUsage > 0.8 ? 'red' : 'green',
          height: '20px',
          transition: 'width 0.5s',
        }}
      ></div>
      <p style={{ textAlign: 'center', margin: '0' }}>{(cpuUsage * 100).toFixed(2)}% CPU Usage</p>
    </div>
  );
};

export default CpuUsageBar;