import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing_page.css";

function LandingPage() {

const navigate = useNavigate();

return (

<div className="landing-container">

<h1 className="title">Welcome To Our Portal 🚀</h1>

<p className="subtitle">
Select your role to continue
</p>

<div className="card-container">

<div className="card admin-card" onClick={()=>navigate("/admin-login")}>

<div className="logo">🛠️</div>
<h2>Admin</h2>
<p>Manage the system dashboard</p>

</div>

<div className="card user-card" onClick={()=>navigate("/user-login")}>

<div className="logo">👤</div>
<h2>User</h2>
<p>Access your personal account</p>

</div>

</div>

<div className="footer-text">
✨ Smart Management System ✨
</div>

</div>

)

}

export default LandingPage;