// import Admin_Dashboard from "./Admin_Dashboard"

import Login from "./Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLogin from "./UserLogin";
import LandingPage from "./Landingpage";
import Dashboard from "./Dashboard";


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
      </Routes>
    </Router>
   
{/*<Landing_page/> */}

    </>
  )
}

export default App
