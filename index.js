const oracledb=require('oracledb');
const express=require('express');
const bodyParser=require('body-parser');
const enc=bodyParser.urlencoded({extended:true});
const ejs=require("ejs");
const { connection } = require('mongoose');

const app=express();
app.use("/assets",express.static("assets"));
app.use("/public",express.static("public"));

app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

global.LoggedDoctor='Doc_00001';
global.LoggedManager='Emp_00001';
global.LoggedEmployee='Emp_00001';
global.LoggedPharmacy='Pha_00001';
global.LoggedPatient='Pat_00001';

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
    let id="Doctor_007";
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

//Patient list/patient_list

app.get("/doc-dashboard",(req,res)=>{
    res.render("dashboard-new");
})


app.get("/doctor-list", async (req, res) => 
{
    //let connection;
    let username=req.query.username;
    let loggedDoc= 'Doc_00001';
    console.log("M ",username);
    async function fetchDataCustomer() 
    {
        try 
        {
            const connection = await oracledb.getConnection({
                user: 'pharmacy_admin',
                password: '12345',
                connectString: 'localhost/xepdb1'
            });

            const result = await connection.execute(`SELECT DOCTOR_NAME, DOCTOR_EMAIL, 
            DOCTOR_ADDRESS, 
            DOCTOR_QUALIFICATION, DOCTOR_HOSPITAL, SPECIALIZATION
            FROM DOCTOR`);
            console.log(result.rows);
            const jsonData = result.rows.map(row => 
            {
                return {
                    name: row[0],
                    email: row[1],
                    address: row[2],
                    qua: row[3],
                    hos: row[4],
                    special: row[5]
                };
            });
            console.log(jsonData);

            res.render('doctor-list', { data: jsonData,username:username }); // Corrected: data should be result.rows
            return result.rows;
        } 
        catch (error) 
        {
            res.status(500).json({ error: 'An error occurred' });
            console.log(error);
            return error;
        } 
        finally 
        {
            if (connection) 
            {
                try 
                {
                    console.log("NO error");
                    await connection.close(); // Close the connection when you're done
                } 
                catch (error) 
                {
                    console.error(error);
                }
            }
        }
    }

    await fetchDataCustomer(); // Corrected: await the fetchDataCustomer function
});


app.get("/patient_list", async (req, res) => 
{
    //let connection;
    let username=req.query.username;
    let loggedDoc= 'Doc_00001';
    console.log("M ",username);
    async function fetchDataCustomer() 
    {
        try 
        {
            const connection = await oracledb.getConnection({
                user: 'pharmacy_admin',
                password: '12345',
                connectString: 'localhost/xepdb1'
            });

            const result = await connection.execute(`SELECT PATIENT_NAME,PATIENT_EMAIL FROM PATIENT NATURAL JOIN CONSULTS NATURAL JOIN DOCTOR`);
            console.log(result.rows);
            const jsonData = result.rows.map(row => 
            {
                return {
                    name: row[0],
                    email: row[1]
                };
            });
            console.log(jsonData);

            res.render('patient', { data: jsonData,username:username }); // Corrected: data should be result.rows
            return result.rows;
        } 
        catch (error) 
        {
            res.status(500).json({ error: 'An error occurred' });
            console.log(error);
            return error;
        } 
        finally 
        {
            if (connection) 
            {
                try 
                {
                    console.log("NO error");
                    await connection.close(); // Close the connection when you're done
                } 
                catch (error) 
                {
                    console.error(error);
                }
            }
        }
    }

    await fetchDataCustomer(); // Corrected: await the fetchDataCustomer function
});

app.get("/payment", async (req, res) => 
{
    //let connection;
    let username=req.query.username;
    let DocID= global.LoggedDoctor;
    console.log("M ",username);
    async function fetchDataCustomer() 
    {
        try 
        {
            const connection = await oracledb.getConnection({
                user: 'pharmacy_admin',
                password: '12345',
                connectString: 'localhost/xepdb1'
            });

            const result = await connection.execute(`SELECT PHARMACY_NAME, INCOME FROM EARNING NATURAL JOIN PHARMACY WHERE DOCTOR_ID= '${DocID}'`);
            console.log(result.rows);
            const jsonData = result.rows.map(row =>  
            {
                return {
                    name: row[0],
                    income: row[1]
                };
            });
            console.log(jsonData);

            res.render('payment', { data: jsonData,username:username }); // Corrected: data should be result.rows
            return result.rows;
        } 
        catch (error) 
        {
            res.status(500).json({ error: 'An error occurred' });
            console.log(error);
            return error;
        } 
        finally 
        {
            if (connection) 
            {
                try 
                {
                    console.log("NO error");
                    await connection.close(); // Close the connection when you're done
                } 
                catch (error) 
                {
                    console.error(error);
                }
            }
        }
    }

    await fetchDataCustomer(); // Corrected: await the fetchDataCustomer function
});



app.get("/appointment", async (req, res) => 
{
    //let connection;
    let username=req.query.username;
    let DocID= LoggedDoctor;
    let PhaID= LoggedPharmacy;
    console.log("M ",username);
    async function fetchDataCustomer() 
    {
        try 
        {
            const connection = await oracledb.getConnection({
                user: 'pharmacy_admin',
                password: '12345',
                connectString: 'localhost/xepdb1'
            });

            const result = await connection.execute(`SELECT PATIENT_ID, PATIENT_NAME, PATIENT_EMAIL FROM PATIENT NATURAL JOIN CONSULTS NATURAL JOIN DOCTOR WHERE DOCTOR_ID= '${DocID}' AND PHARMACY_ID= '${PhaID}'`);
            const result0 = await connection.execute(`SELECT PHARMACY_ID, PHARMACY_NAME FROM DOCTOR NATURAL JOIN HASDOC NATURAL JOIN PHARMACY WHERE DOCTOR_ID= '${DocID}'`);
            console.log(result.rows);
            console.log(result0.rows);
            const jsonData = result.rows.map(row =>  
            {
                return {
                    id: row[0],
                    name: row[1],
                    email: row[2]
                }; 
            }); 
            const jsonData0 = result0.rows.map(row => 
            {
                return {
                    pid: row[0],
                    pname: row[1]
                }
            });
            console.log(jsonData);
            console.log(jsonData0);

            res.render('appointment', { data: jsonData, phaname: jsonData0, username:username }); // Corrected: data should be result.rows
            return result.rows;    
        }          
        catch (error) 
        {
            res.status(500).json({ error: 'An error occurred' }); 
            console.log(error);
            return error;
        } 
        finally 
        {
            if (connection) 
            {
                try 
                {
                    console.log("NO error");
                    await connection.close(); // Close the connection when you're done
                } 
                catch (error) 
                {
                    console.error(error);
                }
            }
        }
    }

    await fetchDataCustomer(); // Corrected: await the fetchDataCustomer function
});

app.post("/pharmacy-name", async (req, res) => 
{
    async function fetchDataCustomer(pharma_name) 
    {
        try 
        {
            const connection = await oracledb.getConnection({
                user: 'pharmacy_admin',
                password: '12345',
                connectString: 'localhost/xepdb1'
            });

            const query=`SELECT PHARMACY_ID,PHARMACY_NAME FROM PHARMACY WHERE PHARMACY_NAME= :1`;
            const param={
                1:pharma_name
            }
            const result=await connection.execute(query,param);
            global.LoggedPharmacy= result.rows[0][0];
            console.log(result.rows[0]); 
            await connection.close();
            return result;
        } catch (error) {
            return error;
        }
    }
    var pharma_name= req.body.pharma_name;
    console.log(pharma_name);
    fetchDataCustomer(pharma_name).
    then(dbRes=>{
        console.log(dbRes);
        res.redirect("/appointment"); 
    })
    .catch(err=>{
        console.error(err);
        res.json({ message: 'Error occurred while deleting data' });
    })
});



app.post("/delete-patient", async (req, res) =>  
{
    async function fetchDataCustomer(id) 
    {
        try 
        {
            const connection = await oracledb.getConnection({
                user: 'pharmacy_admin',
                password: '12345',
                connectString: 'localhost/xepdb1'
            });

            const query=`DELETE FROM PATIENT WHERE PATIENT_ID = :1`;
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
    var patientId= req.body.patientId;
    console.log(patientId);
    fetchDataCustomer(patientId).
    then(dbRes=>{
        console.log(dbRes);
        res.redirect("/appointment"); 
    })
    .catch(err=>{
        console.error(err);
        res.json({ message: 'Error occurred while deleting data' });
    })
});


app.post("/checked-patient", async (req, res) =>  
{
    let DocID=global.LoggedDoctor;
    let PhaID=global.LoggedPharmacy;
    async function fetchDataCustomer(id) 
    {
        try 
        {
            const connection = await oracledb.getConnection({
                user: 'pharmacy_admin',
                password: '12345',
                connectString: 'localhost/xepdb1'
            });

            const query=`DELETE FROM PATIENT WHERE PATIENT_ID = :1`;
            const param={
                1:id
            }
            const result=await connection.execute(query,param);
            await connection.commit();
            await connection.execute(`UPDATE EARNING SET INCOME=INCOME+500 WHERE DOCTOR_ID= '${DocID}'`);
            await connection.commit();
            await connection.close();
            return result;
        } catch (error) {
            return error;
        }
    }
    var patientId= req.body.patientId;
    console.log(patientId);
    fetchDataCustomer(patientId).
    then(dbRes=>{
        console.log(dbRes);
        res.redirect("/appointment"); 
    })
    .catch(err=>{
        console.error(err);
        res.json({ message: 'Error occurred while deleting data' });
    })
});


app.get("/schedule", async (req, res) =>  
{
    //let connection;
    let username=req.query.username;
    let DocID= LoggedDoctor;
    let PhaID= LoggedPharmacy;
    console.log("M ",username);
    async function fetchDataCustomer() 
    {
        try 
        {
            const connection = await oracledb.getConnection({
                user: 'pharmacy_admin',
                password: '12345',
                connectString: 'localhost/xepdb1'
            });

            const result = await connection.execute(`
            SELECT 
            PHARMACY_NAME, PHARMACY_EMAIL,
            PHARMACY.PHARMACY_ADDRESS.HOUSE_NO || ' ' ||PHARMACY.PHARMACY_ADDRESS.CITY || ' Road ' || PHARMACY.PHARMACY_ADDRESS.ROAD_NO || ' ' || PHARMACY.PHARMACY_ADDRESS.DISTRICT , 
            START_TIME, END_TIME, CONSULT_DAY 
            FROM 
            SCHEDULE NATURAL JOIN HAS NATURAL JOIN DOCTOR NATURAL JOIN HASDOC NATURAL JOIN PHARMACY WHERE DOCTOR_ID= '${DocID}'`);
            console.log(result.rows);
            const jsonData = result.rows.map(row => 
            {
                return {
                    name: row[0],
                    email: row[1],
                    address: row[2],
                    start: row[3],
                    end: row[4],
                    con: row[5]                    
                };
            });
            console.log(jsonData);

            res.render('schedule', { data: jsonData,username:username }); // Corrected: data should be result.rows
            return result.rows;
        } 
        catch (error) 
        {
            res.status(500).json({ error: 'An error occurred' });
            console.log(error);
            return error;
        } 
        finally 
        {
            if (connection) 
            {
                try 
                {
                    console.log("NO error");
                    await connection.close(); // Close the connection when you're done
                } 
                catch (error) 
                {
                    console.error(error);
                }
            }
        }
    }

    await fetchDataCustomer(); // Corrected: await the fetchDataCustomer function
});

app.listen(4343);