// import Admin_Dashboard from "./Admin_Dashboard"

import Login from "./Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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


function App() {
 

  return (
    <>
    {/*<h5>hello</h5>
    
    
    
   
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim doloremque, numquam perferendis neque, accusamus voluptas quod fugiat eaque in nihil, facilis quis! Dignissimos voluptatibus atque voluptas, harum recusandae ex praesentium!</p>
    
     */}
    
     <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin-Login" element={<Login />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/cars" element={<Cars/>} />
        <Route path="/booking" element={<Bookings/>} />
        <Route path="/user" element={<Users/>} />
        <Route path="/userLogin" element={<UserLogin/>} />
        <Route path="/userRegister" element={<Userregister/>} />
        <Route path="/userforgotpassword" element={<Userforgotpassword/>} />
       

        <Route path="/userDashboard" element={<UserDashboard/>}/>
<Route path="/car" element={<CarDetails/>}/>
<Route path="/bookings" element={<MyBookings/>}/>
<Route path="/profile" element={<Profile/>}/>

        
      </Routes>
    </Router>
  


    </>
  )
}

export default App
