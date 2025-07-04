import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
// import useNotificationWebSocket from '../hooks/useNotificationWebSocket';

const Sidebar = ({ notifications, isOpen, toggleSidebar, token, sendMessage, pagination }) => {
    // State for tracking selected notifications
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isReadDropdownOpen, setIsReadDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Function to format the created date
    const formatDate = (date) => formatDistanceToNow(new Date(date), { addSuffix: true });

    // Function to toggle the selection of a single notification
    const toggleNotificationSelection = (uid) => {
        setSelectedNotifications((prevSelected) => {
            if (prevSelected.includes(uid)) {
                return prevSelected.filter((notificationUid) => notificationUid !== uid);
            } else {
                return [...prevSelected, uid];
            }
        });
    };

    // Function to handle "Select All" action
    const handleSelectAll = () => {
        if (selectedNotifications.length === notifications.length) {
            setSelectedNotifications([]);
        } else {
            setSelectedNotifications(notifications.map((notification) => notification.uid));
        }
    };

    // Function to handle dropdown action selection
    const handleAction = (action) => {
        // Determine the payload based on the action selected
        const payload = {
            action_choice: action,
            notification_uids: selectedNotifications.length > 0 ? selectedNotifications : undefined,
        };

        // Make the API call
        patchNotificationData(payload);
        setIsDropdownOpen(false); // Close dropdown after selection
    };

    // Function to send PATCH request to API
    const patchNotificationData = (payload) => {
        fetch('http://localhost:8000/api/v1/me/notifications', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Response:', data);
                // Handle the response, update UI, or show notifications if needed
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    // Check if any notification is selected to determine available dropdown options
    const hasSelectedNotifications = selectedNotifications.length > 0;

    useEffect(() => {
        if (pagination) {
            setCurrentPage(pagination.page);
            setTotalPages(pagination.total_pages);
        }
    }, [pagination]);

    return (
        <>
            {/* Backdrop to dim the rest of the screen when sidebar is open */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 transition-all ${isOpen ? 'block' : 'hidden'}`}
                onClick={toggleSidebar}
            ></div>

            {/* Sidebar itself */}
            <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center p-4">
                    <h2 className="text-lg font-bold text-gray-800">Notifications</h2>
                    <button onClick={toggleSidebar} className="text-gray-600 hover:text-blue-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                {/* Select All Checkbox */}
                <div className="flex justify-between px-4 py-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedNotifications.length === notifications.length}
                            onChange={handleSelectAll}
                            className="h-4 w-4"
                        />
                        <span className="text-gray-600">Select All</span>
                    </label>

                    <div className='flex items-center space-x-2'>
                        {/* Dropdown Button */}
                        <div>
                            <button
                                onClick={() => setIsDropdownOpen((prev) => !prev)}
                                type="button"
                                className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-600"
                            >
                                Actions
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    <ul className="py-2">
                                        {/* Show Mark All Options if No Notifications Selected */}
                                        {!hasSelectedNotifications && (
                                            <>
                                                <li
                                                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleAction('MARK_ALL_AS_READ')}
                                                >
                                                    Mark All As Read
                                                </li>
                                                <li
                                                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleAction('REMOVED_ALL')}
                                                >
                                                    Remove All
                                                </li>
                                            </>
                                        )}

                                        {/* Show Mark Options if Some Notifications are Selected */}
                                        {hasSelectedNotifications && (
                                            <>
                                                <li
                                                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleAction('MARK_AS_READ')}
                                                >
                                                    Mark As Read
                                                </li>
                                                <li
                                                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleAction('MARK_AS_REMOVED')}
                                                >
                                                    Mark As Removed
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                        {/* Notification filter */}
                        <div>
                            <button
                                onClick={() => setIsReadDropdownOpen(prev => !prev)}
                                type="button"
                                className="px-3 py-2 text-xs font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-600"
                            >
                                <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" strokeWidth="2"
                                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </button>

                            {isReadDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    <ul className="py-2 text-sm text-gray-700">
                                        <li
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                sendMessage({ is_read: true });
                                                setIsReadDropdownOpen(false);
                                            }}
                                        >
                                            Show Read
                                        </li>
                                        <li
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                sendMessage({ is_read: false });
                                                setIsReadDropdownOpen(false);
                                            }}
                                        >
                                            Show Unread
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Notification List */}
                <div className="space-y-4 px-4 py-2 overflow-y-auto max-h-[calc(100vh-160px)]">
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <div
                                key={index}
                                className={`p-3 border-b border-gray-200 text-gray-700 ${notification.is_read ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-800'}`}
                            >
                                <div className="flex items-center space-x-3">
                                    {/* User Avatar */}
                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                        {/* Displaying first letter of the username */}
                                        <span className="text-white font-medium">{notification?.user?.username?.[0]}</span>
                                    </div>
                                    <div className="flex-1">
                                        {/* Username and Notification Message */}
                                        <div className="font-semibold">{notification?.user?.username}</div>
                                        <div>{notification?.notification?.message}</div>
                                        <div className="text-sm text-gray-500">{formatDate(notification?.created_at)}</div>
                                    </div>
                                    {/* Checkbox for selecting individual notification */}
                                    <input
                                        type="checkbox"
                                        checked={selectedNotifications.includes(notification.uid)} // Use uid here
                                        onChange={() => toggleNotificationSelection(notification.uid)} // Pass uid here
                                        className="h-4 w-4"
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-gray-500">No notifications</div>
                    )}
                </div>
                <div className="flex justify-center items-center space-x-2 p-4">
                    <button
                        onClick={() => currentPage > 1 && sendMessage({ page: currentPage - 1 })}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => currentPage < totalPages && sendMessage({ page: currentPage + 1 })}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>

            </div>
        </>
    );
};

export default Sidebar;
