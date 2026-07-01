import React, { useState } from "react";

function UserBooking() {

const [name,setName] = useState("");
const [car,setCar] = useState("");
const [date,setDate] = useState("");

const handleBooking = (e) => {

e.preventDefault();

const newBooking = {id: Date.now(),name,car,date,status:"Pending"
};

const oldBookings = JSON.parse(localStorage.getItem("bookings")) || [];

const updatedBookings = [...oldBookings,newBooking];

localStorage.setItem("bookings",JSON.stringify(updatedBookings));

alert("Booking Successful");

setName("");
setCar("");
setDate("");

};

return(

<div className="page">

<h2>Car Booking</h2>

<form onSubmit={handleBooking}>

<input type="text" placeholder="Your Name" value={name} onChange={(e)=>setName(e.target.value)} required/>

<input type="text" placeholder="Car Name" value={car} onChange={(e)=>setCar(e.target.value)} required/>

<input type="date" value={date} onChange={(e)=>setDate(e.target.value)} required />

<button type="submit">Book Car</button>

</form>

</div>

)

}

export default UserBooking;