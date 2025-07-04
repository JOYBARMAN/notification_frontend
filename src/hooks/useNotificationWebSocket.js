import { useEffect, useRef, useState } from 'react';

const useNotificationWebSocket = (token) => {
    const [notificationCount, setNotificationCount] = useState(0);
    const [notificationMessages, setNotificationMessages] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, page_Size: 25, total_pages: 1 });
    const wsRef = useRef(null);

    useEffect(() => {
        if (!token) return;

        const wsUrl = 'ws://127.0.0.1:8000/ws/me/notifications';
        const ws = new WebSocket(wsUrl, token);

        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
            console.log("WebSocket Message Received:", event.data);
            const data = JSON.parse(event.data);
            if (data) {
                setNotificationCount(data?.results?.unread_notifications);
                setNotificationMessages(data?.results?.notifications);
                setPagination(data?.pagination);
            } else {
                setNotificationCount(0);
            }
        };

        ws.onerror = (err) => {
            console.error('WebSocket error', err);
        };

        ws.onclose = () => {
            console.log('WebSocket closed');
        };

        wsRef.current = ws;

        return () => {
            wsRef.current?.close();
        };
    }, [token]);

    const sendMessage = (messageObj) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(messageObj));
        }
    };

    return { notificationCount, notificationMessages, sendMessage, pagination };
};


export default useNotificationWebSocket;
