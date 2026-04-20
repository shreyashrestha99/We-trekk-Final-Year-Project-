import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// PUBLIC
import MainHome from "./page/MainHome";
import Register from "./page/Register";
import Login from "./page/Login";
import Explore from "./page/Explore";
import About from "./page/About";
import ContactUs from "./page/ContactUs";
import TrekDetails from "./page/TrekDetails";

// TREKKER
import TrekkerDashboard from "./page/Trekker/TrekkerDashboard";
import MyBookings from "./page/Trekker/MyBookings";
import ExpenseTracker from "./page/Trekker/ExpenseTracker";
import BrowseTreksRides from "./page/Trekker/BrowseTreksRides";
import TrekkerProfile from "./page/Trekker/TrekkerProfile";
import Payment from "./page/Trekker/Payment";
import PaymentVerification from "./page/Trekker/PaymentVerification";

// VENDOR
import VendorDashboard from "./page/Vendor/VendorDashboard";
import CreateRide from "./page/Vendor/CreateRide";
import ManageRides from "./page/Vendor/ManageRides";
import ManageBookings from "./page/Vendor/ManageBookings";
import VendorEarnings from "./page/Vendor/VendorEarnings";
import VendorNotifications from "./page/Vendor/VendorNotifications";
import VendorProfile from "./page/Vendor/VendorProfile";

// GUIDE
import GuideDashboard from "./page/Guide/GuideDashboard";
import CreateTrek from "./page/Guide/CreateTrek";
import TrekSchedules from "./page/Guide/TrekSchedules";
import MyTreks from "./page/Guide/MyTreks";
import TrekBookings from "./page/Guide/TrekBookings";
import GuideEarnings from "./page/Guide/GuideEarnings";
import GuideNotifications from "./page/Guide/GuideNotifications";
import GuideProfile from "./page/Guide/GuideProfile";

// ADMIN
import AdminDashboard from "./page/Admin/AdminDashboard";
import AllUsers from "./page/Admin/AllUsers";
import Verification from "./page/Admin/Verifications";
import BrowseTreksRidesAdmin from "./page/Admin/BrowseTreksRidesAdmin";
import AdminTreks from "./page/Admin/AdminTreks";
import Disputes from "./page/Admin/Disputes";

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
      <Route path="/trek/:id" element={<TrekDetails />} />

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
      <Route path="/trekker/explore" element={
        <ProtectedRoute allowedRoles={["Trekker"]}>
          <BrowseTreksRides />
        </ProtectedRoute>
      } />
      <Route path="/trekker/profile" element={
        <ProtectedRoute allowedRoles={["Trekker"]}>
          <TrekkerProfile />
        </ProtectedRoute>
      } />
      <Route path="/trekker/payment" element={
        <ProtectedRoute allowedRoles={["Trekker"]}>
          <Payment />
        </ProtectedRoute>
      } />
      <Route path="/payment-verification" element={
        <ProtectedRoute allowedRoles={["Trekker"]}>
          <PaymentVerification />
        </ProtectedRoute>
      } />

      {/* VENDOR ROUTES */}
      <Route path="/vendor/dashboard" element={
        <ProtectedRoute allowedRoles={["LocalVendor"]}>
          <VendorDashboard />
        </ProtectedRoute>
      } />
      <Route path="/vendor/create-ride" element={
        <ProtectedRoute allowedRoles={["LocalVendor"]}>
          <CreateRide />
        </ProtectedRoute>
      } />
      <Route path="/vendor/rides" element={
        <ProtectedRoute allowedRoles={["LocalVendor"]}>
          <ManageRides />
        </ProtectedRoute>
      } />
      <Route path="/vendor/bookings" element={
        <ProtectedRoute allowedRoles={["LocalVendor"]}>
          <ManageBookings />
        </ProtectedRoute>
      } />
      <Route path="/vendor/earnings" element={
        <ProtectedRoute allowedRoles={["LocalVendor"]}>
          <VendorEarnings />
        </ProtectedRoute>
      } />
      <Route path="/vendor/notifications" element={
        <ProtectedRoute allowedRoles={["LocalVendor"]}>
          <VendorNotifications />
        </ProtectedRoute>
      } />
      <Route path="/vendor/profile" element={
        <ProtectedRoute allowedRoles={["LocalVendor"]}>
          <VendorProfile />
        </ProtectedRoute>
      } />

      {/* GUIDE ROUTES */}
      <Route path="/guide/dashboard" element={
        <ProtectedRoute allowedRoles={["Guide"]}>
          <GuideDashboard />
        </ProtectedRoute>
      } />
      <Route path="/guide/create-trek" element={
        <ProtectedRoute allowedRoles={["Guide"]}>
          <CreateTrek />
        </ProtectedRoute>
      } />
      <Route path="/guide/schedules" element={
        <ProtectedRoute allowedRoles={["Guide"]}>
          <TrekSchedules />
        </ProtectedRoute>
      } />
      <Route path="/guide/treks" element={
        <ProtectedRoute allowedRoles={["Guide"]}>
          <MyTreks />
        </ProtectedRoute>
      } />
      <Route path="/guide/bookings" element={
        <ProtectedRoute allowedRoles={["Guide"]}>
          <TrekBookings />
        </ProtectedRoute>
      } />
      <Route path="/guide/earnings" element={
        <ProtectedRoute allowedRoles={["Guide"]}>
          <GuideEarnings />
        </ProtectedRoute>
      } />
      <Route path="/guide/notifications" element={
        <ProtectedRoute allowedRoles={["Guide"]}>
          <GuideNotifications />
        </ProtectedRoute>
      } />
      <Route path="/guide/profile" element={
        <ProtectedRoute allowedRoles={["Guide"]}>
          <GuideProfile />
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
      <Route path="/admin/browse" element={
        <ProtectedRoute allowedRoles={["Admin"]}>
          <BrowseTreksRidesAdmin />
        </ProtectedRoute>
      } />
      <Route path="/admin/treks" element={
        <ProtectedRoute allowedRoles={["Admin"]}>
          <AdminTreks />
        </ProtectedRoute>
      } />
      <Route path="/admin/disputes" element={
        <ProtectedRoute allowedRoles={["Admin"]}>
          <Disputes />
        </ProtectedRoute>
      } />

      {/* CATCH-ALL: redirect any unknown URL to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}

export default App;
