import { ACCOUNT_TYPE } from "../src/utils/constants";

export const sidebarLinks = [
  {
    id: 1,
    name: "Dashboard",
    path: "/dashboard",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscDashboard",
  },
  {
    id: 2,
    name: "All Users",
    path: "/dashboard/all-users",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscAccount",
  },
  // {
  //   id: 3,
  //   name: "Add User",
  //   path: "/dashboard/add-user",
  //   type: ACCOUNT_TYPE.ADMIN,
  //   icon: "VscAdd",
  // },
  {
    id: 4,
    name: "All Courses Bundle",
    path: "/dashboard/my-courses",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscLibrary",
  },
  {
    id: 5,
    name: "Add Bundle Course",
    path: "/dashboard/add-course",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscBook",
  },
  {
    id: 6,
    name: "Add Quiz",
    path: "/dashboard/add-quiz",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscAdd",
  },
  {
    id: 7,
    name: "All Quiz",
    path: "/dashboard/my-quiz",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscLibrary",
  },
  {
    id: 8,
    name: "Study Materials",
    path: "/dashboard/allstudymaterials",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscNotebook",
  },
  {
    id: 9,
    name: "Create Study Materials",
    path: "/dashboard/create-studymaterials",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscAdd",
  },
  {
    id: 10,
    name: "All Course Video",
    path: "/dashboard/all-course-video",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscAdd",
  },
  {
    id: 11,
    name: "Add Course Video",
    path: "/dashboard/course-video",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscAdd",
  },
  {
    id: 12,
    name: "Payments",
    path: "/dashboard/payments",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscCreditCard",
  },
  {
    id: 13,
    name: "Daily Update",
    path: "/dashboard/daily-update",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscLibrary",
  },
  {
    id: 14,
    name: "Create Daily Update",
    path: "/dashboard/create-update",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscAdd",
  },
  {
    id: 15,
    name: "App Config",
    path: "/dashboard/app-config",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscAdd",
  },
  {
    id: 16,
    name: "Coupons",
    path: "/dashboard/coupons",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscAdd",
  },
];
