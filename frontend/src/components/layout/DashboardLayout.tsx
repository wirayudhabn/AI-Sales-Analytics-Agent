import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  const [hideSidebar, setHideSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex min-h-screen">
      <Sidebar hide={hideSidebar} page={3} />
      <div className="min-w-0 flex-1">
        <Header
          hide={hideSidebar}
          handleClick={() => setHideSidebar((hidden) => !hidden)}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <Outlet context={{ searchQuery }} />
      </div>
    </div>
  );
};

export default DashboardLayout;
