// import { useState } from "react";
import PropTypes from "prop-types";
import SideBar from "../components/Sidebar/Sidebar";
const DefaultLayout = ({ children }) => {
  //   const [sidebarOpen,setSidebarOpen] = useState(false);
  return (
    <div>
      <div className="dark:bg-boxdark-2 dark:text-bodydark">
        <div className="flex h-screen overflow-hidden">
          <SideBar/>
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <main>
              <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;

DefaultLayout.propTypes = {
  children: PropTypes.object,
};
