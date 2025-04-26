import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './component/NavBar';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import LoginPage from './pages/Login';
import useNotificationWebSocket from './hooks/useNotificationWebSocket';

const App = ({ tokenInProps }) => {
  const [token, setToken] = useState(localStorage.getItem('access_token') || null);
  const { notificationCount, notificationMessages } = useNotificationWebSocket(token);

  // Function to update token in App component
  const updateToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('access_token', newToken);
  };

  useEffect(() => {
    if (tokenInProps) {
      setToken(tokenInProps);
      localStorage.setItem('access_token', tokenInProps);
    }

    // Update token on login
    const storedToken = localStorage.getItem('access_token');
    if (storedToken && storedToken !== token) {
      setToken(storedToken);
    }
  }, [token, tokenInProps]);


  return (
    <>
      <Navbar notificationCount={notificationCount} notificationMessages={notificationMessages} token={token} />
      <Routes>
        {/* <Route path="/" element={<LoginPage updateToken={updateToken} />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginPage updateToken={updateToken} />} />
      </Routes>
    </>
  );
};

export default App;
