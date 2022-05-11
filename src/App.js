import React, { useEffect } from 'react';
import {  Routes, Route, Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from 'react-redux';

import app from './firebase';

import { SET_USER } from './redux/actions/types';
import { setUser, clearUser } from './redux/actions/user_action';

import Chatpage from './components/ChatPage/Chatpage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';

function App(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/')
        dispatch(setUser(user))
      } else {
        navigate('/login');
        dispatch(clearUser())
      }
    });
  }, []);

  if (isLoading) {
    return (
      <div>
        ...isLoading
      </div>
    );
  } else {
    return (
      <Routes>
        <Route path="/" element={<Chatpage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    );
  }
}

export default App;
