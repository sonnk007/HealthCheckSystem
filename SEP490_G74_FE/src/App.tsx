import React, { useContext } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import NurseLayoutPage from './LayoutPages/NurseLayoutPage';
import NursePage from './Pages/NursePage';
import AdminPage from './Pages/AdminPage';
import AdminLayoutPage from './LayoutPages/AdminLayoutPage';
import DoctorLayoutPage from './LayoutPages/DoctorLayoutPage';
import DoctorPage from './Pages/DoctorPage';
import AppRoutes from './Routes/AppRoutes';
import { AuthProvider } from './ContextProvider/AuthContext';

function App() {
  return (
    <AuthProvider children={<AppRoutes />} />
  );
}

export default App;