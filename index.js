const oracledb=require('oracledb');
const express=require('express');
const bodyParser=require('body-parser');
const enc=bodyParser.urlencoded({extended:true});

const app=express();
app.use("/assets",express.static("assets"));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+'/login.html');
})
app.post("/",enc,(req,res)=>{
    async function fetchDataCustomer(username,password){
        try {
            const connection=await oracledb.getConnection({
                user:'pharmacy_admin',
                password:'12345',
                connectionString: 'localhost/xepdb1'
            });
    
            const result=await connection.execute(`SELECT * FROM pharmacy_admin.Login where login_ID='${username}' and password='${password}'`);
            return result.rows;
        } catch (error) {
            return error;
        }
    }
    var username=req.body.username;
    var password=req.body.password;
    fetchDataCustomer(username,password).
    then(dbRes=>{
        // console.log(dbRes);
        if(dbRes.length>0){
            
            res.redirect("/Main2");
        }
        else{
            res.redirect("/");
        }
    })
    .catch(err=>{
        // console.log(err);
        res.redirect("/");
    })
})
app.get("/Main2",(req,res)=>{
    res.sendFile(__dirname+"/Main2.html");
})
app.post("/regi",enc,(req,res)=>{
    async function fetchDataCustomer(id,un,email,house,road,city,district,pass){
        try {
            const connection=await oracledb.getConnection({
                user:'pharmacy_admin',
                password:'12345',
                connectionString: 'localhost/xepdb1'
            });
    
            // const result=await connection.execute(`INSERT INTO DOCTOR (doctor_id,doctor_name,doctor_email,doctor_address) values('${id}','${un}','${email}',addr('${road}','${city}','${house}','${district}'))`);
            // await connection.execute(`INSERT INTO LOGIN VALUES('${id}','${pass}');`);
            // await connection.execute(`commit;`);
            const query=`INSERT INTO DOCTOR (doctor_id,doctor_name,doctor_email,doctor_address) values(:1,:2,:3,addr(:4,:5,:6,:7))`;
            const param={
                1:id,
                2:un,
                3:email,
                4:road,
                5:city,
                6:house,
                7:district
            }
            const result=await connection.execute(query,param);
            await connection.commit();
            await connection.execute(`insert into login values(:1,:2)`,[id,pass]);
            await connection.commit();
            await connection.close();
            return result;
        } catch (error) {
            return error;
        }
        
    }
    let id="Doctor_003";
    let un=req.body.username;
    let email=req.body.email;
    let house=req.body.house;
    let road=req.body.road;
    let city=req.body.City;
    let district=req.body.District;
    let pass=req.body.password1;
    fetchDataCustomer(id,un,email,house,road,city,district,pass)
        .then(dbRes=>{
            // if(dbRes){
            //     res.redirect("/");
            // }
            // else{
            //     res.redirect("/regi");
            // }
            // console.log(dbRes);
            res.redirect("/");
        })
        .catch(err=>{
            res.redirect("/regi");
            console.log(err);
        })
            
        
})
app.get("/regi",(req,res)=>{
    res.sendFile(__dirname+"/regi.html");
})
app.post("/forgot_pass",enc,(req,res)=>{
    async function fetchDataCustomer(un,pass1,pass2){
        try {
            const connection=await oracledb.getConnection({
                user:'pharmacy_admin',
                password:'12345',
                connectionString: 'localhost/xepdb1'
            });
    
            
            const query=`UPDATE login SET password=:1 WHERE LOGIN_ID=:2 AND PASSWORD=:3`;
            const param={
                1:pass2,
                2:un,
                3:pass1
            }
            const result=await connection.execute(query,param);
            await connection.commit();
            await connection.close();
            return result.rowsAffected;
        } catch (error) {
            return error;
        }
        
    }
    
    let un=req.body.username;
    let pass1=req.body.password1;
    let pass2=req.body.password2;
    fetchDataCustomer(un,pass1,pass2)
        .then(dbRes=>{
            if(dbRes){
                res.redirect("/");
            }
            else{
                res.redirect("/forgot_pass");
                
            }
            // console.log(dbRes);
            
            // res.redirect("/");
        })
        .catch(err=>{
            res.redirect("/forgot_pass");
            console.log(err);
        })
            
        
})
app.get("/forgot_pass",(req,res)=>{
    res.sendFile(__dirname+"/forgot_pass.html");
})
app.post("/profile",enc,(req,res)=>{
    async function fetchDataCustomer(id){
        try {
            const connection=await oracledb.getConnection({
                user:'pharmacy_admin',
                password:'12345',
                connectionString: 'localhost/xepdb1'
            });

            const query=`DELETE FROM Doctor WHERE doctor_id =:1`;
            const param={
                1:id
            }
    
            const result=await connection.execute(query,param);
            await connection.commit();
            await connection.close();
            return result;
        } catch (error) {
            return error;
        }
    }
    var id=req.body.id;
    fetchDataCustomer(id).
    then(dbRes=>{
        console.log(dbRes);
        
        res.redirect("/");
        
    })
    .catch(err=>{
        //console.log(err);
        res.redirect("/regi");
        //console.log(err);
    })
})
app.get("/profile",(req,res)=>{
    res.sendFile(__dirname+"/profile.html");
})
app.listen(4444);