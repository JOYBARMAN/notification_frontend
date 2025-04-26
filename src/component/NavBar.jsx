import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import Sidebar from './SideBar';

const Navbar = ({ notificationCount = 0, notificationMessages=[], token="" }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Function to toggle the sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Sample notifications data
    const notifications = notificationMessages

    return (
        <>
            <header className="bg-white shadow-md px-6 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">

                    {/* Left: Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-gray-800">
                            <img src="data:image/png;base64,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" alt="Logo" className="h-12 w-auto" />
                        </Link>
                    </div>

                    {/* Middle: Navigation Links */}
                    <nav className="hidden md:flex space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">Home</Link>
                        <Link to="/blog" className="text-gray-600 hover:text-blue-600 font-medium">Blog</Link>
                        <Link to="/contact" className="text-gray-600 hover:text-blue-600 font-medium">Contact</Link>
                        <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">Login</Link>
                    </nav>

                    {/* Right: Notification Icon */}
                    <div className="relative">
                        <button onClick={toggleSidebar} className="text-gray-600 hover:text-blue-600 focus:outline-none">
                            {/* Bell Icon */}
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2"
                                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002
                       6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67
                       6.165 6 8.388 6 11v3.159c0 .538-.214
                       1.055-.595 1.436L4 17h5m6 0v1a3 3 0
                       11-6 0v-1m6 0H9">
                                </path>
                            </svg>
                        </button>
                        {/* Notification Badge */}
                        {notificationCount > 0 && (
                            <span className="absolute -top-2 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                {notificationCount}
                            </span>
                        )}
                    </div>

                </div>
            </header>

            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                notifications={notifications}
                token={token}
            />
        </>
    );
};

export default Navbar;
