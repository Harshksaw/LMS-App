import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../services/apis';
import './CpuUsageBar.css';

const CpuUsageBar = () => {
  const [systemInfo, setSystemInfo] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    totalMemory: 0,
    freeMemory: 0,
    usedMemory: 0,
    diskInfo: {},
    networkInterfaces: {},
  });

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/cpu-usage`);
        setSystemInfo(response.data);
      } catch (error) {
        console.error('Error fetching system info:', error);
      }
    };

    fetchSystemInfo();
    const interval = setInterval(fetchSystemInfo, 600000); // Fetch every 1 minute

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const { cpuUsage, memoryUsage, totalMemory, freeMemory, usedMemory, diskInfo, networkInterfaces } = systemInfo;

  return (
    <div className='flex gap-5 justify-around'>
      <div className="cpu-usage-bar rounded-lg" style={{ width: '25%', backgroundColor: 'rgb(169, 163, 163)', padding: '5px' }}>

        <div>

        <div
          style={{
            width: `${cpuUsage * 100}%`,
            backgroundColor: cpuUsage > 0.8 ? 'red' : 'green',
            height: '20px',
            transition: 'width 0.5s',
          }}
          ></div>
        <p style={{ textAlign: 'center', margin: '0', color: 'blue' }}>{(cpuUsage * 100).toFixed(2)}% CPU Usage</p>

          </div>

          <div>
          <div
          style={{
            width: `${memoryUsage * 100}%`,
            backgroundColor: memoryUsage > 0.8 ? 'red' : 'green',
            height: '20px',
            transition: 'width 0.5s',
          }}
        ></div>
        <p style={{ textAlign: 'center', margin: '0', color: 'blue' }}>{(memoryUsage * 100).toFixed(2)}% Memory Usage</p>
          </div>

      </div>

      <div className="disk-info rounded-lg flex " 
      style={{ width: '45%', backgroundColor: 'rgb(169, 163, 163)', padding: '5px', marginTop: '10px', color: 'blue' }}
      >
        <p>Total Memory: {(totalMemory / (1024 ** 3)).toFixed(2)} GB</p>
        <p>Free Memory: {(freeMemory / (1024 ** 3)).toFixed(2)} GB</p>
        <p>Used Memory: {(usedMemory / (1024 ** 3)).toFixed(2)} GB</p>
        <p>Disk Info: {JSON.stringify(diskInfo)}</p>
        <p>Network Interfaces: {JSON.stringify(networkInterfaces)}</p>
      </div>
    </div>
  );
};

export default CpuUsageBar;