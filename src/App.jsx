// import Admin_Dashboard from "./Admin_Dashboard"

import Login from "./Login";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserLogin from "./UserLogin";
import LandingPage from "./Landingpage";
import Dashboard from "./Dashboard";
import Cars from "./Cars";
import Bookings from "./Bookings";
import Users from "./Users";
import Userregister from "./Userregister";
import Userforgotpassword from "./Userforgotpassword";

import UserDashboard from "./UserDashboard";
import CarDetails from "./CarDetails";
import MyBookings from "./MyBookings";
import Profile from "./Profile";


function AdminRoute({ children }) {
  let session = null;
  try { session = JSON.parse(localStorage.getItem("driveease_admin_session") || "null"); } catch { session = null; }
  return session?.role === "admin" ? children : <Navigate to="/admin-login" replace />;
}

function UserRoute({ children }) {
  let user = null;
  try { user = JSON.parse(localStorage.getItem("user") || "null"); } catch { user = null; }
  return user?.role === "user" ? children : <Navigate to="/userLogin" replace />;
}

function App() {
 

  return (
    <>
    {/*<h5>hello</h5>
    
    
    
   
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim doloremque, numquam perferendis neque, accusamus voluptas quod fugiat eaque in nihil, facilis quis! Dignissimos voluptatibus atque voluptas, harum recusandae ex praesentium!</p>
    
     */}
    
     <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin-login" element={<Login />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/cars" element={<AdminRoute><Cars /></AdminRoute>} />
        <Route path="/booking" element={<AdminRoute><Bookings /></AdminRoute>} />
        <Route path="/user" element={<AdminRoute><Users /></AdminRoute>} />
        <Route path="/userLogin" element={<UserLogin/>} />
        <Route path="/userRegister" element={<Userregister/>} />
        <Route path="/userforgotpassword" element={<Userforgotpassword/>} />
        <Route path="/userDashboard" element={<UserRoute><UserDashboard /></UserRoute>}/>
        <Route path="/car" element={<UserRoute><CarDetails /></UserRoute>}/>
        <Route path="/bookings" element={<UserRoute><MyBookings /></UserRoute>}/>
        <Route path="/profile" element={<UserRoute><Profile /></UserRoute>}/>

        
      </Routes>
    </Router>
  


    </>
  )
}

export default App
