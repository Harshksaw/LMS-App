import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../services/apis';

const VideoUpload: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState('');

  const uploadVideo = async () => {
    const fileInput = document.getElementById('videoFile') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      setStatus('No file selected');
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await axios.post(`${BASE_URL}/api/v1/video`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status !== 200) {
        console.error('Received non-JSON response:', response.data);
        throw new TypeError('Received non-JSON response');
      }

      const data = response.data;
      console.log(data.message);
      setStatus('Video uploaded successfully');
      setProcessing(true);

      // Start long polling to check the status
      checkStatus(data.lessonId);
    } catch (error) {
      console.error('Error:', error);
      setStatus('Failed to upload video');
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async (lessonId: string) => {
    const checkInterval = 5000; // Check every 5 seconds
    const timeout = 60000; // Timeout after 60 seconds
    const startTime = Date.now();

    const pollStatus = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/checkStatus/${lessonId}`);
        if (response.status === 200) {
          setProcessing(false);
          setStatus('Video processing completed');
        } else if (Date.now() - startTime > timeout) {
          setProcessing(false);
          setStatus('Request timeout');
        } else {
          setTimeout(pollStatus, checkInterval);
        }
      } catch (error) {
        console.error('Error checking status:', error);
        setProcessing(false);
        setStatus('Failed to check status');
      }
    };

    pollStatus();
  };

  return (
    <div className="video-upload-container flex justify-center items-center flex-col gap-10 m-auto">
      <FileInput loading={loading || processing} />
      <UploadButton loading={loading} processing={processing} onClick={uploadVideo} />
      <div id="status">{status}</div>
    </div>
  );
};

const FileInput: React.FC<{ loading: boolean }> = ({ loading }) => (
  <input type="file" id="videoFile" disabled={loading} className="bg-white" />
);

const UploadButton: React.FC<{ loading: boolean, processing: boolean, onClick: () => void }> = ({ loading, processing, onClick }) => (
  <button onClick={onClick} disabled={loading || processing} className="bg-blue-500 text-white p-2 rounded">
    {loading ? 'Uploading...' : processing ? 'Processing...' : 'Upload Video'}
  </button>
);

export default VideoUpload;