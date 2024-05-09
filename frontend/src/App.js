import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode'; // Correct import
import Signup from './components/Signup/signup.js';
import Login from './components/Login/login.js';
import AppLayout from './components/AppLayout';
import Task from './components/Task'; // Import the Task component here

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
        console.log('User state set with token:', decodedToken);
      } catch (error) {
        console.error('Error decoding token:', error);
        setUser(null);
      }
    } else {
      setUser(null);
      console.log('User state set to null');
    }
  }, []);

  console.log('User state:', user);

  return (
    <>
      <Toaster position="top-right" gutter={8} />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={user ? <AppLayout /> : <Navigate to="/login" />}
        />
        {user && <Route path="/:projectId" element={<Task />} />}
      </Routes>
    </>
  );
}

export default App;
