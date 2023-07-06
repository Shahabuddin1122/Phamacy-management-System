const oracledb=require('oracledb');
const express=require('express');
const bodyParser=require('body-parser');
const enc=bodyParser.urlencoded({extended:true});


const app=express();
app.use(express.json());
app.use("/assets",express.static("assets"));
app.use("/images",express.static("images"));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use("/views",express.static("views"));


let loggedID='';
app.get("/",(req,res)=>{
    res.sendFile(__dirname+'/login.html');
})
app.post("/",enc,(req,res)=>{
    async function fetchDataCustomer(username,password){
        try {
            const connection=await oracledb.getConnection({
                user:'project_prac',
                password:'12345678',
                connectionString: 'localhost/xepdb1'
            });
    
            const result=await connection.execute(`SELECT * FROM project_prac.Login where login_ID='${username}' and password='${password}'`);
            console.log(result.rows);
            return result.rows;
        } catch (error) {
            return error;
        }
    }
    var username=req.body.username;
    var password=req.body.password;
    fetchDataCustomer(username,password).
    then(dbRes=>{
        loggedID=dbRes[0][0];
        if(dbRes.length>0){
            
            res.redirect("/manager-home");
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

let GLOBAL_ID='';

app.post("/Patient-signup",enc,(req,res)=>{
    async function fetchDataCustomer(name,email,phone,password1,house,road,city,district,dob){
        try {
            const connection=await oracledb.getConnection({
                user:'project_prac',
                password:'12345678',
                connectionString: 'localhost/xepdb1'
            });

            const result = await connection.execute(
                `BEGIN
                   :new_login_id := '';
                   
        
                   INSERT INTO patient (patient_name, patient_email,patient_address,patient_dob)
                   VALUES (:name, :email,addr(:road,:city,:house,:district),to_date(:dob,'dd-mm-yyyy'))
                   RETURNING patient_id INTO :new_login_id;

                   INSERT INTO login (login_id,password,USER_TYPE)
                   VALUES (:new_login_id, :password1,'PATIENT');

                   INSERT INTO phone (user_id, phone_no)
                   VALUES (:new_login_id, :phone);
        
                   :message := 'Records inserted successfully';
                END;`,
                {
                  new_login_id: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
                  password1: password1,
                  phone: phone,
                  name: name,
                  email: email,
                  road: road,
                  city: city,
                  house: house,
                  district: district,
                  dob: dob,
                  message: { type: oracledb.STRING, dir: oracledb.BIND_OUT }
                }
              );
            
            await connection.commit();
            await connection.close();
            GLOBAL_ID=result.outBinds.new_login_id;
            console.log('Generated Login ID:', result.outBinds.new_login_id);
        
            console.log(result.outBinds.message);
            return result;
        }   catch (error) {
            return error;
        }
    }
           
    
    let password1=req.body.password1;
    let name=req.body.name;
    let email=req.body.email;
    let phone=req.body.phone;
    //let dob=new Date(req.body.dob);
    let dob = req.body.dob;
    const dateObj = new Date(dob);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1; // Months are zero-based
    const year = dateObj.getFullYear();

    // Format day and month with leading zeroes if necessary
    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;

    dob = formattedDay + '-' + formattedMonth + '-' + year;
    let house=req.body.house;
    let road=req.body.road;
    let city=req.body.city;
    let district=req.body.district;
    
    fetchDataCustomer(name,email,phone,password1,house,road,city,district,dob)
        .then(dbRes=>{
            console.log(dbRes);
            console.log('AT POST:', GLOBAL_ID);
            //res.redirect("/newlog");
            res.redirect("/login");
        })
        .catch(err=>{
            // res.redirect("/regi");
            console.log(err);
            res.redirect("/Patient-signup");
        });

})
app.get("/Patient-signup",(req,res)=>{
    console.log('AT Patient-signup GET:', GLOBAL_ID);
    res.sendFile(__dirname+"/Patient-signup.html");
})

let GLOBAL_ID2='';
app.post("/employee-signup",enc,(req,res)=>{
    async function fetchDataCustomer(name,email,phone,password1,house,road,city,district,dob){
        try {
            const connection=await oracledb.getConnection({
                user:'project_prac',
                password:'12345678',
                connectionString: 'localhost/xepdb1'
            });

            const result = await connection.execute(
                `BEGIN
                   :new_login_id_2 := '';
        
                   INSERT INTO employee (employee_name, employee_email,employee_address,employee_dob)
                   VALUES (:name, :email,addr(:road,:city,:house,:district),to_date(:dob,'dd-mm-yyyy'))
                   RETURNING employee_id INTO :new_login_id_2;

                   INSERT INTO login (login_id,password,USER_TYPE)
                   VALUES (:new_login_id_2, :password1,'EMPLOYEE');

                   INSERT INTO phone (user_id, phone_no)
                   VALUES (:new_login_id_2, :phone);
        
                   :message := 'Rec
                   
                   
                   ords inserted successfully';
                END;`,
                {
                  new_login_id_2: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
                  password1: password1,
                  phone: phone,
                  name: name,
                  email: email,
                  road: road,
                  city: city,
                  house: house,
                  district: district,
                  dob: dob,
                  message: { type: oracledb.STRING, dir: oracledb.BIND_OUT }
                }
              );
            
            await connection.commit();
            await connection.close();
            GLOBAL_ID2=result.outBinds.new_login_id_2;
            console.log('Generated Login ID:', result.outBinds.new_login_id_2);
        
            console.log(result.outBinds.message);
            return result;
        }   catch (error) {
            return error;
        }
    }
           
    
    let password1=req.body.password1;
    let name=req.body.name;
    let email=req.body.email;
    let phone=req.body.phone;
    //let dob=new Date(req.body.dob);
    let dob = req.body.dob;
    console.log(dob);
    const dateObj = new Date(dob);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1; // Months are zero-based
    const year = dateObj.getFullYear();

    // Format day and month with leading zeroes if necessary
    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;

    dob = formattedDay + '-' + formattedMonth + '-' + year;
    console.log(dob);
    let house=req.body.house;
    let road=req.body.road;
    let city=req.body.city;
    let district=req.body.district;
    
    fetchDataCustomer(name,email,phone,password1,house,road,city,district,dob)
        .then(dbRes=>{
            console.log(dbRes);
            console.log('AT POST:', GLOBAL_ID2);
            //res.redirect("/newlog");
            res.redirect("/manager-home");
        })
        .catch(err=>{
            // res.redirect("/regi");
            console.log(err);
            res.redirect("/employee-signup");
        });

})
app.get("/employee-signup",(req,res)=>{
    console.log('AT Employee-signup GET:', GLOBAL_ID2);
    res.sendFile(__dirname+"/employee-signup.html");
})

let GLOBAL_ID3='';

app.post("/regi", enc, async (req, res) => {
    async function fetchDataCustomer(name,email,phone,password1,house,road,city,district) {
      try {
        const connection = await oracledb.getConnection({
          user:'project_prac',
          password:'12345678',
          connectString: 'localhost/xepdb1'
        });
  
        const result = await connection.execute(
          `BEGIN
             :new_login_id_3 := '';
  
             INSERT INTO doctor (doctor_name, doctor_email,doctor_address)
             VALUES (:un, :email,addr(:road,:city,:house,:district))
             RETURNING doctor_id INTO :new_login_id_3;
             
             INSERT INTO login (login_id,password,USER_TYPE)
             VALUES (:new_login_id_3, :password1,'DOCTOR');

             INSERT INTO phone (user_id, phone_no)
             VALUES (:new_login_id_3, :phone);
  
             :message := 'Records inserted successfully';
          END;`,
          {
            new_login_id_3: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
            password1: password1,
            name: name,
            phone: phone,
            email: email,
            road: road,
            city: city,
            house: house,
            district: district,
            message: { type: oracledb.STRING, dir: oracledb.BIND_OUT }
          }
        );
        
        await connection.commit();
        await connection.close();
        GLOBAL_ID3=result.outBinds.new_login_id_3;
        console.log('Generated Login ID:', result.outBinds.new_login_id_3);
        
        console.log(result.outBinds.message);
        return result;
      } catch (error) {
        return error;
      }
    }
  
    let name = req.body.name;
    let email = req.body.email;
    let phone =req.body.phone;
    let house = req.body.House_No;
    let road = req.body.Road_NO;
    let city = req.body.City;
    let district = req.body.District;
    let password1 = req.body.password1;
    fetchDataCustomer(name, email, house, road, city, district, password1,phone)
      .then(dbRes => {

        console.log(dbRes);
        //res.redirect("/");
        console.log('AT POST:', GLOBAL_ID3);
        res.redirect("/login");
      })
      .catch(err => {
        console.log(err);
        res.redirect("/regi");
      });
  });
  
app.get("/regi",(req,res)=>{
    console.log('AT regi GET:', GLOBAL_ID3);
    res.sendFile(__dirname+"/regi.html");
    
    //res.render('regi',{data:GLOBAL_ID3});
    
})

app.get("/manager-home", (req, res) => {
    res.sendFile(__dirname + "/manager-home.html");
  });

  app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/login.html");
  });
  let GLOBAL_ID4='';
app.post("/manager-homepage-add-doctor", enc, async(req, res) => {
    async function fetchDataCustomer(name,email,phone,password,house,road,city,district,qual,hosp,specialist,day,shift,pharmacy) {
      try {
        const connection = await oracledb.getConnection({
          user:'project_prac',
          password:'12345678',
          connectString: 'localhost/xepdb1'
        });
  
        console.log(email);
        const result = await connection.execute(
          `DECLARE
            scheduleid varchar2(50);
          BEGIN
             :new_login_id_3 := '';
             :new_login_id_4 := '';
             :new_login_id_5 := '';

             SELECT schedule_id INTO scheduleid FROM schedule WHERE upper(shift) = upper(:shift);
  
             INSERT INTO doctor (doctor_name, doctor_email,doctor_address,doctor_qualification, doctor_hospital,specialization)
             VALUES (:name, :email,addr(:road,:city,:house,:district), :qual, :hosp, :specialist)
             RETURNING doctor_id INTO :new_login_id_3;
             
             INSERT INTO login (login_id,password,USER_TYPE)
             VALUES (:new_login_id_3, :password,'DOCTOR');

             INSERT INTO phone (user_id, phone_no)
             VALUES (:new_login_id_3, :phone);

             INSERT INTO Has (consult_day, doctor_id, schedule_id)
             VALUES (:day,:new_login_id_3, scheduleid)
             RETURNING has_id INTO :new_login_id_4;

             INSERT INTO hasdoc(doctor_id, pharmacy_id)
             VALUES(:new_login_id_3, :pharmacy)
             RETURNING hasdoc_id INTO :new_login_id_5;
  
             :message := 'Records inserted successfully';
          END;`,
          {
            new_login_id_3: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
            new_login_id_4: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
            new_login_id_5: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
            name: name,
            email: email,
            phone: phone,
            password: password,
            house: house,
            road: road,
            city: city,
            district: district,
            qual: qual,
            hosp: hosp,
            specialist: specialist,
            day: day,
            shift: shift,
            pharmacy: pharmacy,
            message: { type: oracledb.STRING, dir: oracledb.BIND_OUT }
          }
        );
        
        await connection.commit();
        await connection.close();
        GLOBAL_ID4=result.outBinds.new_login_id_3;
        console.log('Generated Login ID:', result.outBinds.new_login_id_3);
        
        console.log(result.outBinds.message);
        return result;
      } catch (error) {
        return error;
      }
    }
  
    let name = req.body.name;
    console.log(req.body.name);
    let email = req.body.email;
    let phone =req.body.phone;
    let password = req.body.password;
    let house = req.body.house;
    let road = req.body.road;
    let city = req.body.city;
    let district = req.body.district;
    let qual = req.body.qual;
    let hosp = req.body.hosp;
    let specialist=req.body.specialist;
    let day=req.body.day;
    let shift=req.body.shift;
    let pharmacy=req.body.pharmacy;
    console.log(req.body)
    fetchDataCustomer(name, email, phone, password, house, road, city, district, qual,hosp,specialist,day,shift,pharmacy)
      .then(dbRes => {

        console.log(dbRes);
        //res.redirect("/");
        console.log('AT POST:', GLOBAL_ID4);
        res.redirect("/manager-home");
      })
      .catch(err => {
        console.log(err);
        res.redirect("/manager-homepage-add-doctor");
      });
  });
  
app.get("/manager-homepage-add-doctor",(req,res)=>{
    console.log('AT add-docgtor GET:', GLOBAL_ID4);
    res.sendFile(__dirname+"/manager-homepage-add-doctor.html");
    
    //res.render('regi',{data:GLOBAL_ID3});
    
})
let GLOBAL_ID5='';

app.post("/manager-homepage-add-employee", enc, async(req, res) => {
  async function fetchDataCustomer(name,email,phone,password1,house,road,city,district,dob,salary,manID){
    try {
        const connection=await oracledb.getConnection({
            user:'project_prac',
            password:'12345678',
            connectionString: 'localhost/xepdb1'
        });

        //console.log(pharmacyId, 'Done');
        console.log(manID, 'Done');
        const result = await connection.execute(
            `DECLARE
            pharmacyid varchar2(50);
            BEGIN
               :new_login_id_2 := '';
               SELECT Pharmacy_id INTO pharmacyid FROM employee WHERE upper(employee_id) = upper(:manID);

               INSERT INTO employee (employee_name, employee_email,employee_address,employee_dob,employee_salary,Pharmacy_id,manager_id)
               VALUES (:name, :email,addr(:road,:city,:house,:district),to_date(:dob,'dd-mm-yyyy'),:salary, pharmacyid,:manID)
               RETURNING employee_id INTO :new_login_id_2;

               INSERT INTO login (login_id,password,USER_TYPE)
               VALUES (:new_login_id_2, :password1,'EMPLOYEE');

               INSERT INTO phone (user_id, phone_no)
               VALUES (:new_login_id_2, :phone);
               :pharmacyid := pharmacyid;
               :message := 'Records inserted successfully';
            END;`,
            {
              new_login_id_2: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
              pharmacyid: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
              name: name,
              email: email,
              phone: phone,
              password1: password1,
              house: house,
              road: road,
              city: city,
              district: district,
              dob: dob,
              salary: salary,
              //pharmacyId: pharmacyId,
              manID: manID,
              message: { type: oracledb.STRING, dir: oracledb.BIND_OUT }
              
            }
          );
      
        await connection.commit();
        await connection.close();
        //console.log(pharmacyId, 'Done2');
        GLOBAL_ID5=result.outBinds.new_login_id_2;
        console.log('Generated Login ID:', result.outBinds.new_login_id_2);
        console.log('Generated Login ID:', result.outBinds.pharmacyid);
    
        console.log(result.outBinds.message);
        return result;
    }   catch (error) {
        console.error(error);
        return error;
    }
}
       
let name=req.body.name;
let email=req.body.email;
let phone=req.body.phone;
let password1=req.body.password1;
let house=req.body.house;
let road=req.body.road;
let city=req.body.city;
let district=req.body.district;
//let dob=new Date(req.body.dob);
let dob = req.body.dob;
const dateObj = new Date(dob);
const day = dateObj.getDate();
const month = dateObj.getMonth() + 1; // Months are zero-based
const year = dateObj.getFullYear();

// Format day and month with leading zeroes if necessary
const formattedDay = day < 10 ? '0' + day : day;
const formattedMonth = month < 10 ? '0' + month : month;

dob = formattedDay + '-' + formattedMonth + '-' + year;
//pharmacyId=pID;
//console.log(pharmacyId, 'STart');
let salary = req.body.salary;
let manID=req.body.manID;

fetchDataCustomer(name,email,phone,password1,house,road,city,district,dob,salary,manID)
    .then(dbRes=>{
        console.log(dbRes);
        console.log('AT POST:', GLOBAL_ID5);

        //console.log(pharmacyId); 

        //res.redirect("/newlog");
        res.redirect("/manager-home");
    })
    .catch(err=>{
        // res.redirect("/regi");
        console.log(err);
        res.redirect("/manager-homepage-add-employee");
    });

})
app.get("/manager-homepage-add-employee",(req,res)=>{
console.log('AT Employee-signup GET:', GLOBAL_ID5);
res.sendFile(__dirname+"/manager-homepage-add-employee.html");
})


  app.get('/manager-homepage-doctor', async (req, res) => {
    //const query = req.query.search_doctor;
  
    let connection;

    //let username=req.query.username;
    //console.log("M ",username);
  
    async function fetchDataCustomer() {
      try {
        connection = await oracledb.getConnection({
            user:'project_prac',
            password:'12345678',
          connectString: 'localhost/xepdb1'
        });
  
        const result = await connection.execute(
          `SELECT d.Doctor_id, d.Doctor_Name, d.Doctor_Email, p.phone_no, (d.doctor_address.house_no ||' , '|| d.doctor_address.road_no ||' , '||d.doctor_address.city ||' , '|| d.doctor_address.district), d.doctor_qualification, s.shift,  h.Consult_day, d.doctor_hospital, d.specialization
          FROM doctor d
          JOIN has h ON d.doctor_id = h.doctor_id
          JOIN schedule s ON h.schedule_id = s.schedule_id
          JOIN phone p ON d.doctor_id=p.user_id`);
          console.log(result.rows);
  
  
        const jsonData = result.rows.map(row => {
          return {
            id: row[0],
            name: row[1],
            email: row[2],
            phone: row[3],
            address: row[4],
            qual: row[5],
            shift: row[6],
            day: row[7],
            hospital: row[8],
            specialization: row[9]
          };
        });
  
        console.log(jsonData);
  
        res.render('manager-homepage-doctor', { data: jsonData });
        return result.rows;
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
        return error;
      } finally {
        if (connection) {
          try {
            console.log("NO error");
            console.log(jsondata);
            await connection.close(); // Close the connection when you're done
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  
    await fetchDataCustomer();
  });

  app.use(express.urlencoded({ extended: true }));

  app.post('/delete-doctor', async (req, res) => {
    async function fetchDataCustomer(doctorId){
      try {
          const connection=await oracledb.getConnection({
              user:'project_prac',
              password:'12345678',
              connectionString: 'localhost/xepdb1'
          });

          const queries=
          [`DELETE FROM doctor WHERE doctor_id = :1`,
           `DELETE FROM login WHERE login_id = :1`,
           `DELETE FROM phone WHERE user_id = :1`];
          const param={
            1:doctorId
          }

          for (const query of queries) {
            await connection.execute(query, param);
          }
          //const result=await connection.execute(query,param);
            
          await connection.commit();
          await connection.close();
          return result;
      } catch (error) {
          return error;
      }
  }
  //var doctorId = document.getElementById('doctorId').value;
  var doctorId=req.body.doctorId;
  console.log(doctorId);
  fetchDataCustomer(doctorId).
  then(dbRes=>{
      console.log(dbRes);
      
      res.redirect("/manager-homepage-doctor");
      
  })
  .catch(err=>{
      //res.redirect("/regi");
      console.error(err);
      res.json({ message: 'Error occurred while deleting data' });
  })

  });

  app.get("/sign-in", (req, res) => {
    res.sendFile(__dirname + "/sign-in.html");
  });

  app.get("/manager-homepage-employee", (req, res) => {

   let connection;

   async function fetchDataCustomer() {
     try {
       connection = await oracledb.getConnection({
           user:'project_prac',
           password:'12345678',
         connectString: 'localhost/xepdb1'
       });
 
       const result = await connection.execute(
         `SELECT e.employee_id, e.employee_Name, e.employee_Email, p.phone_no, (e.employee_address.house_no ||' , '|| e.employee_address.road_no ||' , '||e.employee_address.city ||' , '|| e.employee_address.district), TRUNC(MONTHS_BETWEEN(SYSDATE, e.employee_dob) / 12), e.employee_salary, m.employee_name
         FROM employee e, employee m,phone p
         where upper(e.employee_id)=upper(p.user_id)
         and upper(e.manager_id)=upper(m.employee_id)`);
         console.log(result.rows);
 
 
       const jsonData = result.rows.map(row => {
         return {
           id: row[0],
           name: row[1],
           email: row[2],
           phone: row[3],
           address: row[4],
           age: row[5],
           salary: row[6],
           mname: row[7],
         };
       });
 
       console.log(jsonData);
 
       res.render('manager-homepage-employee', { data: jsonData });
       return result.rows;
     } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'An error occurred' });
       return error;
     } finally {
       if (connection) {
         try {
           console.log("NO error");
           console.log(jsondata);
           await connection.close(); // Close the connection when you're done
         } catch (error) {
           console.error(error);
         }
       }
     }
   }
 
  fetchDataCustomer();
  });

 app.post('/delete-employee', async (req, res) => {
  async function fetchDataCustomer(employeeId){
    try {
        const connection=await oracledb.getConnection({
            user:'project_prac',
            password:'12345678',
            connectionString: 'localhost/xepdb1'
        });

        const queries=
        [`DELETE FROM employee WHERE employee_id = :1`,
         `DELETE FROM login WHERE login_id = :1`,
         `DELETE FROM phone WHERE user_id = :1`];
        const param={
          1:employeeId
        }

        for (const query of queries) {
          await connection.execute(query, param);
        }
        //const result=await connection.execute(query,param);
          
        await connection.commit();
        await connection.close();
        return result;
    } catch (error) {
        return error;
    }
}
//var doctorId = document.getElementById('doctorId').value;
var employeeId=req.body.employeeId;
console.log(employeeId);
fetchDataCustomer(employeeId).
then(dbRes=>{
    console.log(dbRes);
    
    res.redirect("/manager-homepage-employee");
    
})
.catch(err=>{
    //res.redirect("/regi");
    console.error(err);
    res.json({ message: 'Error occurred while deleting data' });
})

}); 


let pharmaID='Pha_00003';
  app.get("/manager-homepage-medicine", async (req, res) => {
      let connection;
  
      async function fetchDataCustomer() {
        try {
          connection = await oracledb.getConnection({
              user:'project_prac',
              password:'12345678',
            connectString: 'localhost/xepdb1'
          });
    
          const query=
            `SELECT UNIQUE p.product_id, p.product_name, p.product_type, p.product_price, to_char(s.manufactured_date, 'dd-MON-yyyy'), to_char(s.Expired_date, 'dd-MON-yyyy'), s.store_quantity, to_char(su.supply_date, 'dd-MON-yyyy'), su.supply_quantity,sup.supplier_email,s.store_id
            from stores s, product p, supply su, supplier sup
            where s.product_id=p.product_id
            and p.product_id=su.product_id
            and su.supplier_id=sup.supplier_id
            and pharmacy_id= :1`;
          const param={
            1:pharmaID
          }

            const result= await connection.execute(query,param)
            console.log(result.rows);
    
            const jsonData = result.rows.map(row => {
            return {
              id: row[0],
              name: row[1],
              type: row[2],
              price: row[3],
              mdate: row[4],
              edate: row[5],
              quantity: row[6],
              sdate: row[7],
              squantity: row[8],
              email: row[9],
              store: row[10]
            };
          });
    
          console.log(jsonData);
    
          res.render('manager-homepage-medicine', { data: jsonData });
          return result.rows;
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'An error occurred' });
          return error;
        } finally {
          if (connection) {
            try {
              console.log("NO error");
              console.log(jsondata);
              await connection.close(); // Close the connection when you're done
            } catch (error) {
              console.error(error);
            }
          }
        }
      }
    
      await fetchDataCustomer();
    });

    app.post('/delete-product', async (req, res) => {
      async function fetchDataCustomer(storeId){
        try {
            const connection=await oracledb.getConnection({
                user:'project_prac',
                password:'12345678',
                connectionString: 'localhost/xepdb1'
            });
   
            console.log(storeId + 'done');
            const query=`UPDATE STORES
            SET store_quantity=store_quantity-1
            WHERE store_id= :1`;
            const param={
              1:storeId
            }
  
            await connection.execute(query, param);
            
            //const result=await connection.execute(query,param);
              
            await connection.commit();
            await connection.close();
            return result;
        } catch (error) {
            return error;
        }
    }
    //var doctorId = document.getElementById('doctorId').value;
    let storeId=req.body.storeId1;
    console.log(storeId);
    fetchDataCustomer(storeId).
    then(dbRes=>{
        console.log(dbRes);
        
        res.redirect("/manager-homepage-medicine");
        
    })
    .catch(err=>{
        //res.redirect("/regi");
        console.error(err);
        res.json({ message: 'Error occurred while deleting data' });
    })
  
  });

  app.post('/add-product', async (req, res) => {
    async function fetchDataCustomer(storeId){
      try {
          const connection=await oracledb.getConnection({
              user:'project_prac',
              password:'12345678',
              connectionString: 'localhost/xepdb1'
          });
 
          console.log(storeId + 'done');
          const query=`UPDATE STORES
          SET store_quantity=store_quantity+1
          WHERE store_id= :1`;
          const param={
            1:storeId
          }

          await connection.execute(query, param);
          
          //const result=await connection.execute(query,param);
            
          await connection.commit();
          await connection.close();
          return result;
      } catch (error) {
          return error;
      }
  }
  //var doctorId = document.getElementById('doctorId').value;
  let storeId=req.body.storeId2;
  console.log(storeId);
  fetchDataCustomer(storeId).
  then(dbRes=>{
      console.log(dbRes);
      
      res.redirect("/manager-homepage-medicine");
      
  })
  .catch(err=>{
      //res.redirect("/regi");
      console.error(err);
      res.json({ message: 'Error occurred while adding data' });
  })

});

  app.get("/manager-profile-settings", (req, res) => {
    res.sendFile(__dirname + "/manager-profile-settings.html");
  });
///let loginID='EMP_00070';
  app.get("/manager-profile", (req, res) => {
   /// const query=loginID;
    let connection;
    console.log(loggedID);
    //const query = loginID;
    async function fetchDataCustomer() {
        try {
            connection = await oracledb.getConnection({
              user:'project_prac',
              password:'12345678',
                connectString: 'localhost/xepdb1'
            });

            const result=await connection.execute(
              `BEGIN
               FETCH_MANAGER_PROFILE_INFO(:query, :result);
               END;`,
              {
                query: loggedID,
                result: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
              }
            );
              //const result= await connection.execute(query,param)
              const resultSet = result.outBinds.result;
              const rows = await resultSet.getRows(100);
            console.log('at profile:',rows);
            const jsonData = rows.map(row => {
                return {
                  id: row[0],
                  pid: row[1],
                  name: row[2],
                  email: row[3],
                  phone: row[4],
                  road: row[5],
                  house: row[6],
                  city: row[7],
                  district: row[8],
                  dob: row[9],
                  age: row[10],
                  salary: row[11],
                  pass: row[12]

                };
            });
            console.log(jsonData);
            
            res.render('manager-profile', { data: jsonData }); // Corrected: data should be result.rows
            return result.rows;
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
            console.error(error);
            return error;
        } finally {
            if (connection) {
                try {
                    console.log("NO error");
                    await connection.commit();
                    await connection.close(); // Close the connection when you're done
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }

    fetchDataCustomer();
    
  });
let GLOBAL_ID6='';

    app.post("/manager-homepage-add-medicine", enc, async(req, res) => {
      async function fetchDataCustomer(pname,type,price,mdate,edate,quantity,email,sname,sdate,city) {
        try {
          const connection = await oracledb.getConnection({
            user:'project_prac',
            password:'12345678',
            connectString: 'localhost/xepdb1'
          });
    
          console.log(email);
          const result = await connection.execute(
            `
            BEGIN
               :new_login_id_1 := '';
               :new_login_id_2 := '';
               :new_login_id_3 := '';
               :new_login_id_4 := '';
  
              
    
               INSERT INTO supplier (supplier_name, supplier_email,supplier_area)
               VALUES (:name, :email,:city)
               RETURNING supplier_id INTO :new_login_id_1;

               INSERT INTO product (product_name, product_type ,product_price)
               VALUES (:pname, :type, :price)
               RETURNING product_id INTO :new_login_id_2;

               INSERT INTO supply (supply_date, supply_quantity, supplier_id, product_id)
               VALUES (:sdate,:quantity, :new_login_id_1, :new_login_id_2)
               RETURNING supply_id INTO :new_login_id_3;
               
               INSERT INTO stores(product_id,pharmacy_id,manufactured_date, expired_date)
               VALUES (:new_login_id_2, :pharmaID, :mdate, :edate)
               RETURNING store_id INTO :new_login_id_4;
    
               :message := 'Records inserted successfully';
            END;`,
            {
              new_login_id_1: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
              new_login_id_2: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
              new_login_id_3: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
              new_login_id_4: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
              pharmaID: pharmaID,
              pname: pname,
              type: type,
              price: price,
              mdate: mdate,
              edate: edate,
              quantity: quantity,
              email: email,
              sname: sname,
              sdate: sdate,
              city: city,
              message: { type: oracledb.STRING, dir: oracledb.BIND_OUT }
            }
          );
          
          await connection.commit();
          await connection.close();
          GLOBAL_ID4=result.outBinds.new_login_id_3;
          console.log('Generated Login ID:', result.outBinds.new_login_id_3);
          
          console.log(result.outBinds.message);
          return result;
        } catch (error) {
          return error;
        }
      }
    
      let pname = req.body.pname;
      console.log(pname)
      let type = req.body.type;
      let price =req.body.price;
      let mdate = req.body.mdate;
      const dateObj = new Date(mdate);
      const day = dateObj.getDate();
      const month = dateObj.getMonth() + 1; // Months are zero-based
      const year = dateObj.getFullYear();

// Format day and month with leading zeroes if necessary
      const formattedDay = day < 10 ? '0' + day : day;
      const formattedMonth = month < 10 ? '0' + month : month;

      mdate = formattedDay + '-' + formattedMonth + '-' + year;
      let edate = req.body.edate;
      const dateObj2 = new Date(edate);
      const day2 = dateObj2.getDate();
      const month2 = dateObj2.getMonth() + 1; 
      const year2 = dateObj2.getFullYear();
      const formattedDay2 = day2 < 10 ? '0' + day2 : day2;
      const formattedMonth2 = month2 < 10 ? '0' + month2 : month2;

      edate = formattedDay2 + '-' + formattedMonth2 + '-' + year2;
      let quantity = req.body.quantity;
      let email = req.body.email;
      let sname = req.body.sname;
      let sdate = req.body.sdate;

      const dateObj3 = new Date(sdate);
      const day3 = dateObj3.getDate();
      const month3 = dateObj3.getMonth() + 1; 
      const year3 = dateObj3.getFullYear();
      const formattedDay3 = day3 < 10 ? '0' + day3 : day3;
      const formattedMonth3 = month3 < 10 ? '0' + month3 : month3;

      sdate = formattedDay3 + '-' + formattedMonth3 + '-' + year3;
      let city = city;
      console.log(req.body)
      fetchDataCustomer(pname, type, price, mdate, edate, quantity, email, sname, sdate,city)
        .then(dbRes => {
  
          console.log(dbRes);
          //res.redirect("/");
          console.log('AT POST:', GLOBAL_ID6);
          res.redirect("/manager-home");
        })
        .catch(err => {
          console.log(err);
          res.redirect("/manager-homepage-add-medicine");
        });
    });

    app.get("/manager-homepage-add-medicine", (req, res) => {
      res.sendFile(__dirname + "/manager-homepage-add-medicine.html");
    });

app.post("/forgot_pass",enc,(req,res)=>{
    async function fetchDataCustomer(un,pass1,pass2){
        try {
            const connection=await oracledb.getConnection({
                user:'project_prac',
                password:'12345678',
                connectionString: 'localhost/xepdb1'
            });

            const query=`UPDATE LOGIN SET password=:1 WHERE LOGIN_ID=:2 AND PASSWORD=:3`;
            const param={
                1:pass2,
                2:un,
                3:pass1,
            }
    
            const result=await connection.execute(query,param);
            await connection.commit();
            await connection.close();
            return result;
        } catch (error) {
            return error;
        }
    }
    var un=req.body.username;
    var pass1=req.body.password1;
    var pass2=req.body.password2;
    fetchDataCustomer(un,pass1,pass2).
    then(dbRes=>{
        // console.log(dbRes);
        
        res.redirect("/");
        
    })
    .catch(err=>{
        //console.log(err);
        res.redirect("/");
        //console.log(err);
    })
})
app.get("/forgot_pass",(req,res)=>{
    res.sendFile(__dirname+"/forgot_pass.html");
})

app.post("/profile",enc,(req,res)=>{
    async function fetchDataCustomer(id){
        try {
            const connection=await oracledb.getConnection({
                user:'project_prac',
                password:'12345678',
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
        res.redirect("/");
        //console.log(err);
    })
})
app.get("/profile",(req,res)=>{
    res.sendFile(__dirname+"/profile.html");
})

app.listen(8888);