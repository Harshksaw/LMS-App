import React from "react";

const Step1 = ({ register, errors, setValue, handleImageChange }) => (
    <div>
        <h2>Step 1: Initial Data Collection</h2>
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="bundleName">
                Bundle Name <sup className="text-pink-200">*</sup>
            </label>
            <input
                id="bundleName"
                placeholder="Enter Bundle Name"
                {...register("bundleName", { required: true })}
                className="form-style w-full"
            />
            {errors.bundleName && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    Bundle name is required
                </span>
            )}
        </div>
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="bundleImage">
                Bundle Image <sup className="text-pink-200">*</sup>
            </label>
            <input
                type="file"
                id="bundleImage"
                accept="image/*"
                onChange={handleImageChange}
                className="form-style w-full"
            />
            {errors.bundleImage && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    Image is required
                </span>
            )}
        </div>
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="aboutDescription">
                About Description <sup className="text-pink-200">*</sup>
            </label>
            <textarea
                id="aboutDescription"
                placeholder="Enter Description"
                {...register("aboutDescription", { required: true })}
                className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.aboutDescription && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    Description is required
                </span>
            )}
        </div>
        <div className="flex flex-col space-y-2">
    <label className="text-sm text-richblack-5" htmlFor="price">
        Price <sup className="text-pink-200">*</sup>
    </label>
    <input
        type="number"
        id="price"
        placeholder="Enter Price"
        {...register("price", { required: true })}
        className="form-style w-full"
    />
    {errors.price && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
            Price is required
        </span>
    )}
</div>
    </div>
);

export default Step1;