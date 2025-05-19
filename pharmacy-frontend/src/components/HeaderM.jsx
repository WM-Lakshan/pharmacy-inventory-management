// // // import React, { useState } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import { Bell, Search, User } from "lucide-react";

// // // const HeaderM = () => {
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const navigate = useNavigate();

// // //   const handleSearch = (e) => {
// // //     e.preventDefault();
// // //     console.log("Searching for:", searchTerm);
// // //   };

// // //   const handleProfileClick = () => {
// // //     navigate("/ProfileV");
// // //   };

// // //   return (
// // //     <div className="flex items-center justify-between p-4 bg-white border-b">
// // //       {/* Search Bar with Hover Effects */}
// // //       <form
// // //         onSubmit={handleSearch}
// // //         className="flex items-center flex-grow max-w-xl mx-4"
// // //       >
// // //         <div className="relative w-full group">
// // //           <input
// // //             type="text"
// // //             placeholder="Search product, supplier, order"
// // //             value={searchTerm}
// // //             onChange={(e) => setSearchTerm(e.target.value)}
// // //             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 group-hover:border-blue-400 group-hover:shadow-sm"
// // //           />
// // //           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
// // //         </div>
// // //       </form>

// // //       {/* Right Side Icons */}
// // //       <div className="flex items-center space-x-4">
// // //         {/* Notification Icon */}
// // //         <button className="p-2 rounded-full text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-colors duration-200">
// // //           <Bell className="w-6 h-6" />
// // //         </button>

// // //         {/* Profile Icon */}
// // //         <button
// // //           onClick={handleProfileClick}
// // //           className="p-1 rounded-full border-2 border-transparent hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
// // //         >
// // //           <div className="w-8 h-8 bg-gray-300 flex items-center justify-center rounded-full">
// // //             <User className="w-5 h-5 text-gray-600" />
// // //           </div>
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default HeaderM;

// // // import React, { useState } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import { Bell, Search, User, Filter } from "lucide-react";

// // // const HeaderM = () => {
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const navigate = useNavigate();

// // //   const handleSearch = (e) => {
// // //     e.preventDefault();
// // //     console.log("Searching for:", searchTerm);
// // //   };

// // //   const handleProfileClick = () => {
// // //     navigate("/ProfileV");
// // //   };

// // //   return (
// // //     <div className="flex items-center justify-between p-4 bg-white border-b sticky top-0 z-10">
// // //       {/* Search Bar with Hover Effects */}
// // //       <form
// // //         onSubmit={handleSearch}
// // //         className="flex items-center flex-grow max-w-xl"
// // //       >
// // //         <div className="relative w-full group">
// // //           <input
// // //             type="text"
// // //             placeholder="Search product, supplier, order"
// // //             value={searchTerm}
// // //             onChange={(e) => setSearchTerm(e.target.value)}
// // //             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 group-hover:border-blue-400 group-hover:shadow-sm"
// // //           />
// // //           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
// // //         </div>
// // //       </form>

// // //       {/* Right Side Icons */}
// // //       <div className="flex items-center space-x-3">
// // //         {/* Notification Icon */}
// // //         <button className="p-2 rounded-full text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-colors duration-200 relative">
// // //           <Bell className="w-5 h-5" />
// // //           <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
// // //         </button>

// // //         {/* Profile Icon */}
// // //         <button
// // //           onClick={handleProfileClick}
// // //           className="p-1 rounded-full border-2 border-transparent hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
// // //         >
// // //           <div className="w-8 h-8 bg-gray-300 flex items-center justify-center rounded-full">
// // //             <User className="w-5 h-5 text-gray-600" />
// // //           </div>
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default HeaderM;

// // // import React, { useState } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import { Bell, Search, User, Filter } from "lucide-react";
// // // import NotificationPanel from "../pages/notificationPanel"; // Adjust the import path as necessary

// // // const HeaderM = () => {
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
// // //   const navigate = useNavigate();

// // //   const handleSearch = (e) => {
// // //     e.preventDefault();
// // //     console.log("Searching for:", searchTerm);
// // //   };

// // //   const handleProfileClick = () => {
// // //     navigate("/ProfileV");
// // //   };

// // //   const toggleNotificationPanel = () => {
// // //     setNotificationPanelOpen(!notificationPanelOpen);
// // //   };

// // //   return (
// // //     <div className="flex items-center justify-between p-4 bg-white border-b sticky top-0 z-10">
// // //       {/* Search Bar with Hover Effects */}
// // //       <form
// // //         onSubmit={handleSearch}
// // //         className="flex items-center flex-grow max-w-xl"
// // //       >
// // //         <div className="relative w-full group">
// // //           <input
// // //             type="text"
// // //             placeholder="Search product, supplier, order"
// // //             value={searchTerm}
// // //             onChange={(e) => setSearchTerm(e.target.value)}
// // //             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 group-hover:border-blue-400 group-hover:shadow-sm"
// // //           />
// // //           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
// // //         </div>
// // //       </form>

// // //       {/* Right Side Icons */}
// // //       <div className="flex items-center space-x-3">
// // //         {/* Notification Icon */}
// // //         <div className="relative">
// // //           <button
// // //             className="p-2 rounded-full text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-colors duration-200 relative"
// // //             onClick={toggleNotificationPanel}
// // //           >
// // //             <Bell className="w-5 h-5" />
// // //             <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
// // //           </button>
// // //           <NotificationPanel
// // //             isOpen={notificationPanelOpen}
// // //             onClose={() => setNotificationPanelOpen(false)}
// // //           />
// // //         </div>

// // //         {/* Profile Icon */}
// // //         <button
// // //           onClick={handleProfileClick}
// // //           className="p-1 rounded-full border-2 border-transparent hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
// // //         >
// // //           <div className="w-8 h-8 bg-gray-300 flex items-center justify-center rounded-full">
// // //             <User className="w-5 h-5 text-gray-600" />
// // //           </div>
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default HeaderM;

// // import React, { useState, useEffect } from "react"; // Fixed import
// // import { useNavigate } from "react-router-dom";
// // import { Bell, Search, User } from "lucide-react";
// // import NotificationPanel from "../pages/notificationPanel";
// // import axios from "axios";
// // const HeaderM = () => {
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
// //   const [unreadCount, setUnreadCount] = useState(0);
// //   const navigate = useNavigate();

// //   // Fetch unread notification count on initial load
// //   useEffect(() => {
// //     fetchUnreadNotificationCount();
// //   }, []);

// //   const fetchUnreadNotificationCount = async () => {
// //     try {
// //       const userData = JSON.parse(localStorage.getItem("user")) || {};
// //       const userId = userData.id;
// //       const userType = userData.role;

// //       if (!userId || !userType) return;

// //       const response = await axios.get("/api/notifications/unread-count", {
// //         params: { userId, userType },
// //       });

// //       setUnreadCount(response.data.count);
// //     } catch (error) {
// //       console.error("Error fetching unread notification count:", error);
// //     }
// //   };

// //   const handleSearch = (e) => {
// //     e.preventDefault();
// //     console.log("Searching for:", searchTerm);
// //   };

// //   const handleProfileClick = () => {
// //     navigate("/user-profile");
// //   };

// //   const toggleNotificationPanel = () => {
// //     setNotificationPanelOpen(!notificationPanelOpen);
// //   };

// //   const handleNotificationsUpdate = (count) => {
// //     setUnreadCount(count);
// //   };

// //   return (
// //     <div className="flex items-center justify-between p-4 bg-white border-b sticky top-0 z-10 shadow-sm">
// //       {/* Search Bar with Hover Effects */}
// //       <form
// //         onSubmit={handleSearch}
// //         className="flex items-center flex-grow max-w-xl"
// //       >
// //         <div className="relative w-full group">
// //           <input
// //             type="text"
// //             placeholder="Search product, supplier, order"
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 group-hover:border-blue-400 group-hover:shadow-sm"
// //           />
// //           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
// //         </div>
// //       </form>

// //       {/* Right Side Icons */}
// //       <div className="flex items-center space-x-4">
// //         {/* Notification Icon */}
// //         <div className="relative">
// //           <button
// //             className={`p-2 rounded-full text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 relative ${
// //               notificationPanelOpen ? "bg-blue-50 text-blue-500" : ""
// //             }`}
// //             onClick={toggleNotificationPanel}
// //             aria-label="Notifications"
// //           >
// //             <Bell className="w-5 h-5" />

// //             {/* Notification Dot - Only shown when unread notifications exist */}
// //             {unreadCount > 0 && (
// //               <span className="absolute top-0 right-0 flex items-center justify-center">
// //                 {unreadCount > 9 ? (
// //                   <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-xs font-bold rounded-full">
// //                     9+
// //                   </span>
// //                 ) : (
// //                   <span className="absolute -top-1 -right-1 h-[14px] w-[14px] bg-red-500 rounded-full border-2 border-white"></span>
// //                 )}
// //               </span>
// //             )}
// //           </button>

// //           <NotificationPanel
// //             isOpen={notificationPanelOpen}
// //             onClose={() => setNotificationPanelOpen(false)}
// //             onNotificationsUpdate={handleNotificationsUpdate}
// //           />
// //         </div>

// //         {/* Profile Icon */}
// //         <button
// //           onClick={handleProfileClick}
// //           className="p-1 rounded-full border-2 border-transparent hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
// //           aria-label="Profile"
// //         >
// //           <div className="w-8 h-8 bg-gray-200 flex items-center justify-center rounded-full shadow-sm overflow-hidden">
// //             <User className="w-5 h-5 text-gray-600" />
// //           </div>
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default HeaderM;

// //////////////////correct one ////////////////////

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Bell, Search, User } from "lucide-react";
// import NotificationPanel from "../components/NotificationPanel";
// import axios from "axios";

// const HeaderM = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const navigate = useNavigate();

//   // Fetch unread notification count on initial load and periodically
//   useEffect(() => {
//     fetchUnreadNotificationCount();

//     // Set up periodic checking for new notifications (every 1 minute)
//     const intervalId = setInterval(() => {
//       fetchUnreadNotificationCount();
//     }, 60000);

//     // Clean up interval on component unmount
//     return () => clearInterval(intervalId);
//   }, []);

//   const fetchUnreadNotificationCount = async () => {
//     try {
//       const userData = JSON.parse(localStorage.getItem("user")) || {};
//       const userId = userData.id;
//       const userType = userData.role;

//       if (!userId || !userType) return;

//       const response = await axios.get("/api/notifications/unread-count", {
//         params: { userId, userType },
//       });

//       setUnreadCount(response.data.count || 0);
//     } catch (error) {
//       console.error("Error fetching unread notification count:", error);
//       // For development - simulate random notification count
//       if (process.env.NODE_ENV !== "production") {
//         setUnreadCount(Math.floor(Math.random() * 10));
//       }
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (!searchTerm.trim()) return;

//     // Redirect to search page with the search term
//     navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
//   };

//   const handleProfileClick = () => {
//     navigate("/user-profile");
//   };

//   const toggleNotificationPanel = () => {
//     setNotificationPanelOpen(!notificationPanelOpen);

//     // If we're opening the panel, refresh the notification count
//     if (!notificationPanelOpen) {
//       fetchUnreadNotificationCount();
//     }
//   };

//   const handleNotificationsUpdate = (count) => {
//     setUnreadCount(count);
//   };

//   return (
//     <div className="flex items-center justify-between p-4 bg-white border-b sticky top-0 z-10 shadow-sm">
//       {/* Search Bar with Hover Effects */}
//       <form
//         onSubmit={handleSearch}
//         className="flex items-center flex-grow max-w-xl"
//       >
//         <div className="relative w-full group">
//           <input
//             type="text"
//             placeholder="Search product, supplier, order"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 group-hover:border-blue-400 group-hover:shadow-sm"
//           />
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
//         </div>
//       </form>

//       {/* Right Side Icons */}
//       <div className="flex items-center space-x-4">
//         {/* Notification Icon */}
//         <div className="relative">
//           <button
//             className={`p-2 rounded-full text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 relative ${
//               notificationPanelOpen ? "bg-blue-50 text-blue-500" : ""
//             }`}
//             onClick={toggleNotificationPanel}
//             aria-label="Notifications"
//           >
//             <Bell className="w-5 h-5" />

//             {/* Notification Badge - Only shown when unread notifications exist */}
//             {unreadCount > 0 && (
//               <span className="absolute top-0 right-0 flex items-center justify-center">
//                 {unreadCount > 9 ? (
//                   <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-xs font-bold rounded-full">
//                     9+
//                   </span>
//                 ) : (
//                   <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-xs font-bold rounded-full">
//                     {unreadCount}
//                   </span>
//                 )}
//               </span>
//             )}
//           </button>

//           {/* Notification Panel */}
//           <NotificationPanel
//             isOpen={notificationPanelOpen}
//             onClose={() => setNotificationPanelOpen(false)}
//             onNotificationsUpdate={handleNotificationsUpdate}
//           />
//         </div>

//         {/* Profile Icon */}
//         <button
//           onClick={handleProfileClick}
//           className="p-1 rounded-full border-2 border-transparent hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
//           aria-label="Profile"
//         >
//           <div className="w-8 h-8 bg-gray-200 flex items-center justify-center rounded-full shadow-sm overflow-hidden">
//             <User className="w-5 h-5 text-gray-600" />
//           </div>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default HeaderM;

///////////////////////working //////////////////////////////

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, User } from "lucide-react";
import axios from "axios";

const HeaderM = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  // Fetch unread notification count on initial load and periodically
  useEffect(() => {
    fetchUnreadNotificationCount();

    // Set up periodic checking for new notifications (every 1 minute)
    const intervalId = setInterval(() => {
      fetchUnreadNotificationCount();
    }, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchUnreadNotificationCount = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user")) || {};
      const userId = userData.id;
      const userType = userData.role;

      if (!userId || !userType) return;

      const response = await axios.get("/api/notifications/unread-count", {
        params: { userId, userType },
      });

      setUnreadCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching unread notification count:", error);
      // For development - simulate random notification count
      if (process.env.NODE_ENV !== "production") {
        setUnreadCount(Math.floor(Math.random() * 10));
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // Redirect to search page with the search term
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleProfileClick = () => {
    navigate("/user-profile");
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b sticky top-0 z-10 shadow-sm">
      {/* Search Bar with Hover Effects */}
      <form
        onSubmit={handleSearch}
        className="flex items-center flex-grow max-w-xl"
      >
        <div className="relative w-full group">
          <input
            type="text"
            placeholder="Search product, supplier, order"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 group-hover:border-blue-400 group-hover:shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
        </div>
      </form>

      {/* Right Side Icons */}
      <div className="flex items-center space-x-4">
        {/* Notification Icon */}
        <div className="relative">
          <button
            className="p-2 rounded-full text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 relative"
            onClick={() => navigate("/notifications")}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />

            {/* Notification Badge - Only shown when unread notifications exist */}
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center">
                {unreadCount > 9 ? (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    9+
                  </span>
                ) : (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </span>
            )}
          </button>
        </div>

        {/* Profile Icon */}
        <button
          onClick={handleProfileClick}
          className="p-1 rounded-full border-2 border-transparent hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
          aria-label="Profile"
        >
          <div className="w-8 h-8 bg-gray-200 flex items-center justify-center rounded-full shadow-sm overflow-hidden">
            <User className="w-5 h-5 text-gray-600" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default HeaderM;
