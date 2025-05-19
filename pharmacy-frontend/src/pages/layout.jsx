import React from "react";
import { Outlet } from "react-router-dom";
import HeaderM from "../components/HeaderM";
import Navbar from "../components/NavigationPanel";

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderM />
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
