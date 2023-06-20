const { response } = require("express");
//const index2=require("./index2.js");

fetch("http://localhost:4444/fetch").then(result=>{
    result.json();
}).then(response=>{
    let data1="";
    response.map((values)=>{
        data1=`<div class="inside-card">
        <img src="images/dragon-fruit-dessert-pitaya.jpg" alt="Not supporting">
        <div class="text">"
            <h5>${values.Pro_name}</h5>
            <p>${values.Pro_price}</p>
        </div>
    </div>`
    });
    document.getElementById(box).innerHTML=data1
})
.catch(error=>{
    console.log(error);
})