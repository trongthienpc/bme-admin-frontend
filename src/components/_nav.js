import { cilSpeedometer } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CNavItem, CNavTitle } from "@coreui/react";
import React from "react";

const _nav = [
  {
    component: CNavTitle,
    name: "Rooms",
  },

  {
    component: CNavItem,
    name: "Rooms",
    to: "/roomStyle",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: "Resto and Bar",
  },
  {
    component: CNavItem,
    name: "Foods",
    to: "/food",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Drinks",
    to: "/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: "Others",
  },
  {
    component: CNavItem,
    name: "Blog",
    to: "/blog",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "About",
    to: "/about",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Comment",
    to: "/comment",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Login",
    to: "/login",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Register",
    to: "/register",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
];

export default _nav;
