import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import "./App.css"

function Navbar(){
    const navigate=useNavigate()
    

// const [menu,setMenu] = useState(false);



return(
<>
<nav className="navbar">
{/* <div className="menu-icon" onClick={()=>setMenu(!menu)}>
☰
</div> */}
<h2 className="logo">CarRental</h2>

<ul className="nav-links">

<li onClick={()=>navigate("/userlanding")}>
Home
</li>

<li onClick={()=>navigate("/Usercars")}>
Cars
</li>

<li onClick={()=>navigate("/Userreview")}>
Reviews
</li>

<li onClick={()=>navigate("/Usercontact")}>
Contact
</li>

</ul>

</nav>

</>

)



}

export default Navbar;




