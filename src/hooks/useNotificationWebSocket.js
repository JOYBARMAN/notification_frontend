import { useEffect, useRef, useState } from 'react';

const useNotificationWebSocket = (token) => {
    const [notificationCount, setNotificationCount] = useState(0);
    const [notificationMessages, setNotificationMessages] = useState([]);
    const wsRef = useRef(null);

    useEffect(() => {
        if (!token) return;

        // Construct WebSocket URL
        const wsUrl = 'ws://127.0.0.1:8000/ws/me/notifications/';

        // Create WebSocket connection with the token passed in the protocol
        const ws = new WebSocket(wsUrl, token);  // The token is passed as a protocol

        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data) {
                setNotificationCount(data?.results?.unread_notifications);

                setNotificationMessages(data?.results?.notifications);

            }
            else {
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

    return { notificationCount, notificationMessages };

};

export default useNotificationWebSocket;
