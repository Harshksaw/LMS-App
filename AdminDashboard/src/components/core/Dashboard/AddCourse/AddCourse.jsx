import { useEffect } from "react";
import RenderSteps from "./RenderSteps";

export default function AddCourse() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const steps = [
    { id: 1, title: 'Step 1: Course Information' },
    { id: 2, title: 'Step 2: Upload Video' },
    // Add more steps if needed
  ];
  return (
    <div className="flex w-full items-start gap-x-6">
      <div className="flex flex-1 flex-col">
        <h1 className="mb-14 text-3xl font-medium text-richblack-5 font-boogaloo text-center lg:text-left">
          Add Course
        </h1>

        <div className="flex-1">
        <RenderSteps steps={steps} />
        </div>
      </div>

      {/* Course Upload Tips */}
      <div className="sticky top-10 hidden lg:block max-w-[400px] flex-1 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 ">
  <p className="mb-8 text-lg text-richblack-5">⚡ Course Upload Tips</p>

  <ul className="ml-5 list-item list-disc space-y-4 text-md text-richblack-5">
    <li>Until upload is completed, don't quit. After it's uploaded, you can do something else but do look at CPU usage.</li>
  </ul>
</div>
    </div>
  );
}
