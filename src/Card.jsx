import React from "react";
import "./Card.css"

function Card({title,number}){

return(

<div className="card">

<h3>{title}</h3>

<h1>{number}</h1>

</div>

)

}

export default Card;