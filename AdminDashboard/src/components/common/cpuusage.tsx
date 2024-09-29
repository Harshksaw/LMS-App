import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../services/apis';
import './CpuUsageBar.css';

const CpuUsageBar = () => {
  const [systemInfo, setSystemInfo] = useState({
    cpuUsage: '0%',
    memoryUsage: '0%',
    totalMemory: '0 GB',
    freeMemory: '0 GB',
    usedMemory: '0 GB',
    diskInfo: { total: '0 GB', used: '0 GB', free: '0 GB' },
    networkInterfaceCount: 0,
  });

  const fetchSystemInfo = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/cpu-usage`);
      setSystemInfo(response.data);
    } catch (error) {
      console.error('Error fetching system info:', error);
    }
  };
  // useEffect(() => {
  //   fetchSystemInfo();
  //   const interval = setInterval(fetchSystemInfo, 60000); // Fetch every 1 minute

  //   return () => clearInterval(interval); // Cleanup interval on component unmount
  // }, []);

  const { cpuUsage, memoryUsage, totalMemory, freeMemory, usedMemory, diskInfo, networkInterfaceCount } = systemInfo;

 
  return (
    <div className='flex gap-5 justify-around'>
<div className="cpu-usage-bar rounded-lg items-center justify-center pt-1 w-1/4 bg-richblack-200 p-2">
  <div className="flex flex-col items-center gap-2">
    <div
      className={`flex mt-5 h-5 transition-width duration-500 ${parseFloat(cpuUsage) > 80 ? 'bg-red-500' : 'bg-green-500'}`}
      style={{ width: `${parseFloat(cpuUsage)}%` }}
    ></div>
    <p className="text-center m-0 text-blue-500">{cpuUsage} CPU Usage</p>
  </div>

  <div className="flex flex-col items-center gap-5 mt-10">
    <div
      className={`h-5 transition-width duration-500 ${parseFloat(memoryUsage) > 80 ? 'bg-red-500' : 'bg-green-500'}`}
      style={{ width: `${parseFloat(memoryUsage)}%` }}
    ></div>
    <p className="text-center m-0 text-blue-500">{memoryUsage} Memory Usage</p>
  </div>
</div>

      <div className="disk-info rounded-lg flex" 
        style={{ width: '45%', backgroundColor: 'rgb(169, 163, 163)', padding: '5px', marginTop: '10px', color: 'blue' }}>
        <p>Total Memory: {totalMemory}</p>
        <p>Free Memory: {freeMemory}</p>
        <p>Used Memory: {usedMemory}</p>
        <p>Disk Total: {diskInfo.total}</p>
        <p>Disk Used: {diskInfo.used}</p>
        <p>Disk Free: {diskInfo.free}</p>
        <p>Network Interfaces: {networkInterfaceCount}</p>
      </div>
    </div>
  );
};

export default CpuUsageBar