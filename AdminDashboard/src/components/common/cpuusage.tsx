import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { IconBase } from "react-icons/lib";

const CpuUsageBar = () => {
  const [systemInfo, setSystemInfo] = useState({
    cpuUsage: "0",
    memoryUsage: "0",
    totalMemory: "0",
    freeMemory: "0",
    usedMemory: "0",
    diskInfo: { total: "0", used: "0", free: "0" },
    networkInterfaceCount: "0",
    requestCount: "0",
  });

  useEffect(() => {
    const wsUrl = `wss://system.krishnaacademy.in/ws`;
    console.log(`Connecting to WebSocket at ${wsUrl}`);
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSystemInfo(data);

      // High-usage toast logic
      if (data.cpuUsage > 80 || data.memoryUsage > 80) {
        toast.dismiss("high-usage-toast"); // Clear previous toast first
        toast("High usage detected!", {
          id: "high-usage-toast",
          duration: Infinity,
          style: {
            background: "red",
            color: "white",
          },
        });
      } else {
        toast.dismiss("high-usage-toast"); // Clear unneeded toast
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  const formatUsage = (usage) => `${usage}%`;
  const {
    cpuUsage,
    memoryUsage,
    totalMemory,
    freeMemory,
    usedMemory,
    diskInfo,
    networkInterfaceCount,
    requestCount,
  } = systemInfo;

  return (
    <div className="flex flex-row gap-5 justify-around mt-7">
      <Toaster />
      <div className="cpu-usage-bar rounded-lg items-center justify-center pt-1 w-[20%] bg-richblack-200 p-2">
        <p className="text-center m-0 text-blue-500 font-bold text-md">
          CPU USAGE {formatUsage(cpuUsage)}
        </p>

        <p className="text-center m-0 text-blue-500 font-bold text-sm">
          Request Count {requestCount}
        </p>
        <p className="text-center m-0 text-blue-500 font-bold text-xs">
          Net Req Count: {networkInterfaceCount}
        </p>
      </div>

      <div
        className="disk-info rounded-lg flex"
        style={{
          width: "50%",
          backgroundColor: "rgb(169, 163, 163)",
          padding: "5px",
          marginTop: "10px",
          color: "blue",
        }}
      >
        <p>Total Memory: {totalMemory} GB</p>
        <p>Free Memory: {freeMemory} GB</p>
        <p>Used Memory: {usedMemory} GB</p>
        <p>Disk Total: {diskInfo.total}</p>
        <p>Disk Used: {diskInfo.used}</p>
        <p>Disk Free: {diskInfo.free}</p>
        <p>Memory Usage: {formatUsage(memoryUsage)}</p>
        <p> USERS {networkInterfaceCount}</p>
      </div>
    </div>
  );
};

export default CpuUsageBar;
