import React, { useState } from "react";

const TimeInput = ({ onTimeChange }) => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
  
    const handleTimeChange = () => {
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      onTimeChange(totalSeconds);
    };
  
    return (
      <div className="time-input flex items-center space-x-2">
      <input
        type="number"
        value={hours}
        className="p-2 border rounded-md text-center w-16"
        onChange={(e) => setHours(Number(e.target.value))}
        onBlur={handleTimeChange}
        placeholder="HH"
        min="0"
        max="23"
      />
      <span className="text-lg">:</span>
      <input
        type="number"
        value={minutes}
        className="p-2 border rounded-md text-center w-16"
        onChange={(e) => setMinutes(Number(e.target.value))}
        onBlur={handleTimeChange}
        placeholder="MM"
        min="0"
        max="59"
      />
      <span className="text-lg">:</span>
      <input
        type="number"
        value={seconds}
        className="p-2 border rounded-md text-center w-16"
        onChange={(e) => setSeconds(Number(e.target.value))}
        onBlur={handleTimeChange}
        placeholder="SS"
        min="0"
        max="59"
      />
    </div>
    );
  };
  
  export default TimeInput;