import React from "react";
import JoditEditor from "../../../services/JoditEditor";
import Example from "./Example";
import MyEditor from "./MyEditor";

const Dashboard = () => {
  return (
    <div>
      <h1>Test editor</h1>
      {/* <MyEditor /> */}
      {/* <Example /> */}
      <JoditEditor />
    </div>
  );
};

export default Dashboard;
