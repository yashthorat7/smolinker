import Header from '@/components/Header';
import React from 'react';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div>
      <main className="container mx-auto min-h-screen px-4">
        <Header />
        <Outlet />
      </main>
      <div className="mt-4 flex w-full justify-center bg-white p-2">made by yashthorat7</div>
    </div>
  );
};

export default AppLayout;
