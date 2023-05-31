let a=require('server.js');
function Submit()
{
    let name=document.getElementById("id").value;
    let pass=document.getElementById("pass").value;
    let btn=document.getElementsByClassName("btn");
    if(name.length==0 || pass.length==0)
    {
        btn.disable= true;
    }
    else {
        let name1="SHAHABUDDIN";
        let pass1="12345";
        if(name==name1 && pass==pass1)
        {
            alert(`Welcome ${name} you have successfully login in the account with ${pass}`);
           // Window.location.href = 'C:/Users/shahabuddin%20akhon%20hr/Desktop/pharmacy%20management%20System/main.html'
        }
        else
        {
            alert("Login failed")
        }
        
    }
}