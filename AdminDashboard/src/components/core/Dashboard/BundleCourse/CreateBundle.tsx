import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import IconBtn from "../../../common/IconBtn";
import axios from "axios";
import { BASE_URL } from "../../../../services/apis";

import { Link, Router, useNavigate, useSearchParams } from "react-router-dom";
import Step1 from "./StepOne.tsx";
import Step2 from "./Steptwo.tsx";

const VideoSelection = ({ selectedVideos, setSelectedVideos }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/videocourse/getAllVideo`);
        if (res.data) {
          setVideos(res.data);
          toast.success("Videos fetched successfully");
        } else {
          toast.error("Failed to fetch videos");
        }
      } catch (error) {
        toast.error("Failed to fetch videos");
      }
      setLoading(false);
    };
    fetchVideos();
  }, []);

  const handleVideoSelect = (videoId) => {
    if (selectedVideos.includes(videoId)) {
      setSelectedVideos(selectedVideos.filter((id) => id !== videoId));
    } else {
      setSelectedVideos([...selectedVideos, videoId]);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-y-auto h-full border border-white">
      <h3 className="text-2xl font-semibold mb-4 text-richblack-25 text-center">Select Videos</h3>
      <div className="flex flex-wrap gap-4 justify-center ">
        {videos.map((video) => (
          
          <div
            key={video._id}
            className={`w-2/5 p-4 border rounded-lg cursor-pointer  my-10 mx-5   ${
              selectedVideos.includes(video._id) ? "bg-blue-100 border-blue-500" : "bg-richblack-500"
            }`}
            onClick={() => handleVideoSelect(video._id)}
          >
            <img
              src={video?.thumbnail}
              alt={video.courseName}
              className="w-full h-32 object-cover mb-2"
            />
            <h4 className="text-sm font-medium">{video?.courseName}</h4>
            <select
              className="mt-2 p-2 border rounded"
              value={selectedVideos.includes(video._id) ? "selected" : ""}
              onChange={() => handleVideoSelect(video._id)}
            >
              <option value="">Select</option>
              <option value="selected">Selected</option>
            </select>
          
          </div>
        ))}
      </div>
    </div>
  );
};

const Step3 = ({ register, setValue, errors, courseBundleId, setSelectedVideos,selectedVideos }) => {
  const [startDate, setStartDate] = React.useState("");
  const [isListed, setIsListed] = React.useState(false);
  // const [selectedVideos, setSelectedVideos] = useState([]);
  useEffect(() => {
    setValue("videos", selectedVideos);
  }, [selectedVideos, setValue]);

  
  const handleDateChange = (event) => {
    const date = event.target.value;
    setStartDate(date);
    setValue("date", date);
  };

  const handleListedChange = (event) => {
    const checked = event.target.checked;
    setIsListed(checked);
    setValue("isListed", checked);
  };
  useEffect(() => {}, [startDate, isListed]);
  return (
    <div>


      <div className="space-y-2 flex flex-col justify-between gap-10 ">

      <VideoSelection
        selectedVideos={selectedVideos}
        setSelectedVideos={setSelectedVideos}
      />

<div>

        <div className="flex gap-3">
          <label className="text-white">Publish Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={handleDateChange}
            className="form-control"
            />
          {errors.publishDate && (
            <div className="error">{errors.publishDate.message}</div>
          )}
        </div>
        <div className="flex gap-3">
          <label className="text-white"> Listed:</label>
          <input
            type="checkbox"
            checked={isListed}
            onChange={handleListedChange}
            />
          {errors.isListed && (
            <div className="error">{errors.isListed.message}</div>
          )}
        </div>
      </div>
          </div>
    </div>
  );
};

export default function CourseBundleForm() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [step, setStep] = useState(1);
  const [bundleImage, setBundleImage] = useState(id ?? null);

  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);


  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const [courseBundleId, setCourseBundleId] = useState(null);

  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  //   const { token } = useSelector((state) => state.auth);
useEffect(() => {
  console.log(id)
  const res = axios.get(`${BASE_URL}/api/v1/bundle/getAllUserBundle/${id}`);
  console.log(res.data)
  // setSelectedMaterials(res.data.data.studyMaterials)


}, []);
  const handleImageChange = (e: any) => {
    setBundleImage(e.target.files[0]);
  };

  const handleStep1Submit = async (data) => {
    try {
      toast.loading("Please wait...");
      let res = {};
      if (!!id) {
        const param = {
          bundleName: data.bundleName,
          price: data.price,
          aboutDescription: data.aboutDescription,
        };
        res = await axios.put(
          `${BASE_URL}/api/v1/bundle/course-bundle/${id}`,
          param
        );
      } else {
        const formData = new FormData();
        formData.append("bundleName", data.bundleName);
        formData.append("image", bundleImage);
        formData.append("price", data.price);
        formData.append("aboutDescription", data.aboutDescription);
        res = await axios.post(
          `${BASE_URL}/api/v1/bundle/course-bundle`,
          formData
        );
      }
      setCourseBundleId(res?.data?._id ?? res?.data?.data?._id);
      toast.dismiss();
      toast.success(
        !!id ? "Bundle Details update" : "Step 1 completed successfully"
      );
      // if (!!id) {
      // } else {
      // }
      setStep(2);
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to complete Step 1", {
        duration: 2000,
      });
    }
  };

  const handleStep2Submit = async () => {
    const formData = getValues();

    try {
      toast.loading("Please wait...");
      const res = await axios.post(
        `${BASE_URL}/api/v1/bundle/course-bundle/update/${courseBundleId}`,
        { quizzes: formData.quizzes }
      );

      const resp = await axios.post(
        `${BASE_URL}/api/v1/bundle/course-bundle-materials/${courseBundleId}`,
        { studyMaterials: selectedMaterials }
      );

      if (res.status != 200) {
        toast.dismiss();
        toast.error("Update failed");
        return;
      }

      toast.dismiss();
      toast.success("Step 2 completed successfully");
      setStep(3);
    } catch (error) {
      toast.error("Failed to complete Step 2", {
        duration: 2000,
      });
    }
  };

  const handleStep3Submit = async (data) => {
    const formData = getValues();
    try {
      toast.loading("Please wait...");
      const res = await axios.post(
        `${BASE_URL}/api/v1/bundle/course-bundle/updateTime/${courseBundleId}`,
        { date: formData.date, isListed: formData.isListed }
      );
      const resVideo = await axios.post(
        `${BASE_URL}/api/v1/bundle/updateVideo/${courseBundleId}`,
        { video: selectedVideos  }
      );

      if (res.status != 200 || resVideo.status != 200) {
        toast.dismiss();
        toast.error("Update failed");
        return;
      }
      setCourseBundleId(res?.data?._id);
      toast.dismiss();
      toast.success("Step 3 completed successfully");

      navigate("/dashboard/my-courses");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to complete Step 2", {
        duration: 2000,
      });
    }


  };

  const onSubmit = (data: any) => {
    if (step === 1) {
      handleStep1Submit(data);
    } else if (step === 2) {
      handleStep2Submit();
    } else if (step === 3) {
      handleStep3Submit(data);
    }
  };



  useEffect(() => {
    const fetchCourses = async () => {
      const res = await axios.get(
        `${BASE_URL}/api/v1/bundle/course-bundle/${id}`
      );
      if (res.status != 200) {
        toast.dismiss();
        toast.error("something went wront");
        return;
      }
      const course = res?.data?.data;
      setValue(
        "quizzes",
        course.quizes?.map((i) => i._id)
      );
      // studyMaterials;
      setValue("date", course.activeListing);
      setValue("isListed", course.listed);
      setValue("bundleName", course.bundleName);
      setValue("aboutDescription", course.aboutDescription);
      setValue("price", course.price);
    };
    if (!!id) {
      fetchCourses();
    }
  }, []);

  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    // <div className=" inset-0  !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 ">
    <div className="flex-1 w-full gap-x-6 justify-center items-center max-h-full">
      <div className="my-2 w-full rounded-lg border border-richblack-400 bg-richblack-800">
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {step === 1 && "Step 1: Initial Data Collection"}
            {step === 2 && "Step 2: Add Quizzes and Study Material"}
            {step === 3 && "Step 3: Publish and Set Time"}
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-0  px-4 py-20 "
        >
          {step === 1 && (
            <Step1
              register={register}
              errors={errors}
              setValue={setValue}
              handleImageChange={handleImageChange}
            />
          )}
          {step === 2 && (
            <Step2
              {...register}
              register={register}
              getValues={getValues}
              setValue={setValue}
              courseBundleId={courseBundleId}
              selectedMaterials={selectedMaterials}
              setSelectedMaterials={setSelectedMaterials}
              errors={errors}
            />
          )}
          {step === 3 && (
           <Step3
           register={register}
           setValue={setValue}
           courseBundleId={courseBundleId}
           errors={errors}
           selectedVideos={selectedVideos}
           setSelectedVideos={setSelectedVideos}
         />
          )}
          <div className="flex justify-end">
            <IconBtn
              text={step === 3 ? (!!id ? "Update" : "Submit") : "Next"}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
