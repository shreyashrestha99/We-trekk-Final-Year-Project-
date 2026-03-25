import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// PUBLIC
import MainHome from "./page/MainHome";
import Register from "./page/Register";
import Login from "./page/Login";
import Explore from "./page/Explore";
import About from "./page/About";
import ContactUs from "./page/ContactUs";

// TREKKER
import TrekkerDashboard from "./page/Trekker/TrekkerDashboard";
import MyBookings from "./page/Trekker/MyBookings";
import ExpenseTracker from "./page/Trekker/ExpenseTracker";
import TrekkerGroups from "./page/Trekker/TrekkerGroups";
import TrekkerProfile from "./page/Trekker/TrekkerProfile";

// VENDOR
import VendorDashboard from "./page/Vendor/VendorDashboard";
import ManageTreks from "./page/Vendor/ManageTreks";

// GUIDE
import GuideDashboard from "./page/Guide/GuideDashboard";

// ADMIN
import AdminDashboard from "./page/Admin/AdminDashboard";
import AllUsers from "./page/Admin/AllUsers";
import Verification from "./page/Admin/Verifications";

function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/" element={<MainHome />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<ContactUs />} />

      {/* TREKKER ROUTES */}
      <Route path="/trekker/dashboard" element={
        <ProtectedRoute allowedRoles={["Trekker"]}>
          <TrekkerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/trekker/bookings" element={
        <ProtectedRoute allowedRoles={["Trekker"]}>
          <MyBookings />
        </ProtectedRoute>
      } />
      <Route path="/trekker/expenses" element={
        <ProtectedRoute allowedRoles={["Trekker"]}>
          <ExpenseTracker />
        </ProtectedRoute>
      } />
      <Route path="/trekker/groups" element={
        <ProtectedRoute allowedRoles={["Trekker"]}>
          <TrekkerGroups />
        </ProtectedRoute>
      } />
      <Route path="/trekker/profile" element={
        <ProtectedRoute allowedRoles={["Trekker"]}>
          <TrekkerProfile />
        </ProtectedRoute>
      } />

      {/* VENDOR ROUTES */}
      <Route path="/vendor/dashboard" element={
        <ProtectedRoute allowedRoles={["LocalVendor"]}>
          <VendorDashboard />
        </ProtectedRoute>
      } />
      <Route path="/vendor/treks" element={
        <ProtectedRoute allowedRoles={["LocalVendor"]}>
          <ManageTreks />
        </ProtectedRoute>
      } />

      {/* GUIDE ROUTES */}
      <Route path="/guide/dashboard" element={
        <ProtectedRoute allowedRoles={["Guide"]}>
          <GuideDashboard />
        </ProtectedRoute>
      } />

      {/* ADMIN ROUTES */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={["Admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={["Admin"]}>
          <AllUsers />
        </ProtectedRoute>
      } />
      <Route path="/admin/verify" element={
        <ProtectedRoute allowedRoles={["Admin"]}>
          <Verification />
        </ProtectedRoute>
      } />

    </Routes>
  );
}

export default App;
