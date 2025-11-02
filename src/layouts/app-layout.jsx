import Header from "@/components/Header";
import React from "react";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <main className="min-h-screen container mx-auto px-4">
        <Header />
        <Outlet />
      </main>
      <div className="p-4 bg-zinc-200 mt-5 w-full flex justify-center">
        made by yashthorat7
      </div>
    </div>
  );
};

export default AppLayout;
