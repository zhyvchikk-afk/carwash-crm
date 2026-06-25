import { Route, Routes } from "react-router-dom";

import MainLayout from './layouts/MainLayout/MainLayout'
import ProtectedRoute from "./routes/ProtectedRoute";

import HomePage from "./pages/HomePage/HomePage"
import LoginPage from "./pages/LoginPage/LoginPage"
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ServicesPage from "./pages/ServicesPage/ServicesPage";
import CarsPage from "./pages/CarsPage/CarsPage";
import BookingsPage from "./pages/BookingsPage/BookingsPage";
import CreateBookingPage from "./pages/CreateBookingPage/CreateBookingPage";
import AdminBookingsPage from "./pages/AdminBookingsPage/AdminBookingsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage/AdminDashboardPage";
import CalendarPage from "./pages/CalendarPage/CalendarPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage/ResetPasswordPage";



function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />}/>
        <Route path="/services" element={<ServicesPage />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/register" element={<RegisterPage />}/>
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/cars"
          element={
            <ProtectedRoute>
              <CarsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <BookingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking/create"
          element={
            <ProtectedRoute>
              <CreateBookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute>
              <AdminBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/calendar"
          element={<CalendarPage />}
        />
        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage/>}
        />
        <Route
          path="/reset-password/:uid/:token/"
          element={<ResetPasswordPage/>}
        />
      </Route>
    </Routes>
  )
}

export default App