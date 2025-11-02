import React from "react";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <main className="min-h-screen min-w-screen px-6 container">
        <Outlet />
      </main>
      <div p-20 text-white bg-slate-100 mt-5>
        made by yashthorat7
      </div>
    </div>
  );
};

export default AppLayout;
