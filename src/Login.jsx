import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {

  const navigate = useNavigate();
 const handleback=()=> navigate("/")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState("");

  const staticEmail = "thabeebbilal@gmail.com";
  const staticPassword = "1";

  const handleLogin = (e) => {
    e.preventDefault();

    if(email.trim().toLowerCase() === staticEmail && password === staticPassword){
      localStorage.setItem("driveease_admin_session", JSON.stringify({ role: "admin", createdAt: Date.now() }));
      navigate("/dashboard");
    }else{
      setError(" Invalid Email or Password");
    }
  };

  return (

    <div className="container">

      <form className="login-box" onSubmit={handleLogin}>

        <h2>Admin Login</h2>

        {error && <p className="error">{error}</p>}

        <input
        type="email"
        placeholder="Enter Email"
        onChange={(e)=>setEmail(e.target.value)}
        />

        <input
        type="password"
        placeholder="Enter Password"
        onChange={(e)=>setPassword(e.target.value)}
        />

        <button type="submit">Login</button>

        <button type="button" onClick={handleback}>Back</button>

      </form>

    </div>

  );
}

export default Login;