const oracledb=require('oracledb');
const express=require('express');
const fs = require('fs');
const bodyParser=require('body-parser');
const enc=bodyParser.urlencoded({extended:true});

const app=express();
app.use("/assets",express.static("assets"));
app.set('view engine', 'ejs');
app.use("/public",express.static('public'));
app.use("/public/images",express.static("images"));
let GLOBAL_ID;
let a='Pat_00001';
app.get("/",(req,res)=>{
    res.sendFile(__dirname+'/login.html');
})

const dbConfig=oracledb.getConnection({
    user:'pharmacy_admin',
    password:'12345',
    connectionString: 'localhost/xepdb1'
});
async function fetchDataFromDatabase(query) {
  
    const connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
        connectString: 'localhost/xepdb1'
    }); 
    const result = await connection.execute(`SELECT * FROM products WHERE name LIKE '%${query}%'`);
    await connection.commit();
    await connection.close();
  
    return result.rows;
  }
  
app.post("/",enc,(req,res)=>{
    async function fetchDataCustomer(username,password){
        try {
            const connection=await oracledb.getConnection({
                user:'pharmacy_admin',
                password:'12345',
                connectionString: 'localhost/xepdb1'
            });
    
            const result=await connection.execute(`SELECT * FROM pharmacy_admin.Login where login_ID='${username}' and password='${password}'`);
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
        console.log(dbRes);
        if(dbRes.length>0){
            fs.writeFile('logindata.txt', username, 'utf8', (err) => {
                if (err) {
                  console.error('Error writing file:', err);
                } else {
                  console.log('Data has been stored in the file successfully.');
                }
              });
              
            res.redirect(`/Main2?username=${username}`);
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
app.get("/Main2", async (req, res) => {
    let connection;
    let username=req.query.username;
    console.log("M ",username);
    async function fetchDataCustomer() {
        try {
            connection = await oracledb.getConnection({
                user: 'pharmacy_admin',
                password: '12345',
                connectString: 'localhost/xepdb1'
            });

            const result = await connection.execute(`select pro.product_name,p.pharmacy_name,pro.product_price
            from pharmacy p join stores s using(pharmacy_id) join product pro using(product_id)`);
            console.log(result.rows);
            
            const jsonData = result.rows.map(row => {
                return {
                  Pro_name: row[0],
                  pharma: row[1],
                  Pro_price: row[2]

                };
            });
            console.log(jsonData);
            
            res.render('Main2', { data: jsonData,username:username }); // Corrected: data should be result.rows
            return result.rows;
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
            console.log(error);
            return error;
        } finally {
            if (connection) {
                try {
                    console.log("NO error");
                    await connection.close(); // Close the connection when you're done
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }

    await fetchDataCustomer(); // Corrected: await the fetchDataCustomer function
});







app.get('/appointment', async (req, res) => {
    const query = req.query.search_doctor;
  
    let connection;
  
    async function fetchDataCustomer(query) {
      try {
        connection = await oracledb.getConnection({
          user: 'pharmacy_admin',
          password: '12345',
          connectString: 'localhost/xepdb1'
        });
  
        const result = await connection.execute(
          `BEGIN
             FETCH_APPOINTMENT_DATA(:query, :result);
           END;`,
          {
            query: `%${query}%`,
            result: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
          }
        );
  
        const resultSet = result.outBinds.result;
        const rows = await resultSet.getRows(100);
  
        console.log(rows);
  
        const jsonData = rows.map(row => {
          return {
            Doc_id: row[0],
            Doc_name: row[1],
            Doc_Email: row[2],
            Doc_Que: row[3],
            Doc_Hos: row[4],
            Doc_day: row[5],
            Doc_start: row[6],
            Doc_shift: row[8],
            Doc_speci: row[9]
          };
        });
  
        console.log(jsonData);
  
        res.render('appointment', { query, data: jsonData,username:GLOBAL_ID });
        return rows;
      } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
        console.error(error);
        return error;
      } finally {
        if (connection) {
          try {
            console.log("NO error");
            await connection.close(); // Close the connection when you're done
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  
    await fetchDataCustomer(query);
});
  















  app.use(bodyParser.json());
  app.post('/addConsult', async (req, res) => {
    //const patientId = req.query.username;
    let k = req.body.a;
    let doctorId=k.doctorId;
    //let patientId;

    const patientId = fs.readFileSync('logindata.txt', 'utf8');
      console.log(patientId);
      // Perform operations or logic using the patientId here
      async function insertData(doctorId, patientId) {
          let connection;
          try {
            connection = await oracledb.getConnection({
              user: 'pharmacy_admin',
              password: '12345',
              connectString: 'localhost/xepdb1'
            });
      
            const result = await connection.execute(
              `
              DECLARE
                v_serial NUMBER;
              BEGIN
                INSERT INTO consults (Doctor_id, Patient_id)
                VALUES (:doctorId, :patientId)
                RETURNING serial INTO v_serial;
                
                :message := 'Data inserted successfully. Serial: ' || v_serial;
              EXCEPTION
                WHEN OTHERS THEN
                  :message := SQLERRM;
              END;

              `,
              {
                doctorId: doctorId,
                patientId: patientId,
                message: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
              }
            );
      
            console.log(result.outBinds.message);
            return {message: result.outBinds.message} ;
          } catch (error) {
            console.error(error);
            return { message: 'Error occurred while inserting data' };
          } finally {
            if (connection) {
              try {
                await connection.commit();
                await connection.close();

              } catch (error) {
                console.error(error);
              }
            }
          }
        }
      
        insertData(doctorId, patientId)
          .then(data => {
            res.json(data);
          })
          .catch(error => {
            console.error(error);
            res.json({ message: 'Error occurred while inserting data' });
          });
    
   
  });
        
  //let GLOBAL_ID='';









app.post("/Patient-signup",enc,(req,res)=>{
    async function fetchDataCustomer(name,email,phone,password1,house,road,city,district,dob){
        try {
            const connection=await oracledb.getConnection({
            user: 'pharmacy_admin',
         	  password: '12345',
          	connectString: 'localhost/xepdb1'
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
            res.redirect("/newlog");
        })
        .catch(err=>{
            // res.redirect("/regi");
            console.log(err);
            res.redirect("/regi");
        });

})
app.get("/Patient-signup",(req,res)=>{
    console.log('AT Patient-signup GET:', GLOBAL_ID);
    res.sendFile(__dirname+"/Patient-signup.html");
})   

   

  










app.get('/search', async (req, res) => {
    const query = req.query.query; 
  
    let connection;
    async function fetchDataCustomer(query) {
        try {
            connection = await oracledb.getConnection({
                user: 'pharmacy_admin',
                password: '12345',
                connectString: 'localhost/xepdb1'
            });
            const result = await connection.execute(`select pro.product_name,p.pharmacy_name,pro.product_price
            from pharmacy p join stores s using(pharmacy_id) join product pro using(product_id) WHERE lower(product_name) LIKE lower('%${query}%')`);
            console.log(result.rows);
            const result1 = await connection.execute(`SELECT p.Pharmacy_name,p.Pharmacy_address.city,p.Pharmacy_address.District,p.OVERALL_RATING FROM Pharmacy p WHERE lower(p.Pharmacy_name) LIKE lower('%${query}%')`);
            console.log(result1.rows);
            const jsonData = result.rows.map(row => {
                return {
                    Pro_name: row[0],
                    pharmacy:row[1],
                    Pro_price: row[2]

                };
            });
            const jsonData1 = result1.rows.map(row => {
                //const pharma_add = row[3].split(',');///for pharmacy
                return {
                    Pro_name: row[0],
                    pro_city: row[1],
                    pro_District: row[2],
                    pro_rating: row[3]


                };
            });
            console.log(jsonData);
            console.log(jsonData1);
            if(jsonData.length > 0){
                res.render('search', { query,data:jsonData }); 
                return result.rows;
            }
            else 
            {
                res.render('search_table', { query,data:jsonData1 }); 
                return result.rows;
            }

            
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
            console.log(error);
            return error;
        } finally {
            if (connection) {
                try {
                    console.log("NO error");
                    await connection.close(); // Close the connection when you're done
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }

    await fetchDataCustomer(query);
});
  






app.post("/regi", enc, async (req, res) => {
    async function fetchDataCustomer(un, email, house, road, city, district, pass,phone) {
      try {
        const connection = await oracledb.getConnection({
          user: 'pharmacy_admin',
          password: '12345',
          connectString: 'localhost/xepdb1'
        });
  
        const result = await connection.execute(
          `BEGIN
             :new_login_id := '';
             INSERT INTO login (password,USER_TYPE)
             VALUES (:pass,'DOCTOR')
             RETURNING login_id INTO :new_login_id;
             insert into phone values(:phone,:new_login_id);
             INSERT INTO doctor (doctor_id, doctor_name, doctor_email,doctor_address)
             VALUES (:new_login_id, :un, :email,addr(:road,:city,:house,:district));
             
             :message := 'Records inserted successfully';
          END;`,
          {
            new_login_id: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
            pass: pass,
            un: un,
            email: email,
            road: road,
            city: city,
            house: house,
            district: district,
            phone: phone,
            message: { type: oracledb.STRING, dir: oracledb.BIND_OUT }
          }
        );
        
        await connection.commit();
        await connection.close();
        GLOBAL_ID=result.outBinds.new_login_id;
        console.log('Generated Login ID:', result.outBinds.new_login_id);
        
        console.log(result.outBinds.message);
        return result;
      } catch (error) {
        return error;
      }
    }
  
    let un = req.body.username;
    let email = req.body.email;
    let house = req.body.House_No;
    let road = req.body.Road_NO;
    let city = req.body.City;
    let district = req.body.District;
    let pass = req.body.password1;
    let phone=req.body.Phone;
    fetchDataCustomer(un, email, house, road, city, district, pass,phone)
      .then(dbRes => {

        console.log(dbRes);
        //res.redirect("/");
        console.log('AT POST:', GLOBAL_ID);
        res.redirect("/newlog");
      })
      .catch(err => {
        console.log(err);
        res.redirect("/regi");
      });
  });
  
app.get("/regi",(req,res)=>{
    //console.log('AT regi GET:', GLOBAL_ID);
    res.sendFile(__dirname+"/regi.html");
    
    //res.render('regi',{data:GLOBAL_ID});
    
})
app.get("/newlog",(req,res)=>{

    res.render('newlog',{data:GLOBAL_ID});
})

app.post("/newlog",enc,(req,res)=>{
    async function fetchDataCustomer(username,password){
        try {
            const connection=await oracledb.getConnection({
                user:'pharmacy_admin',
                password:'12345',
                connectionString: 'localhost/xepdb1'
            });
    
            const result=await connection.execute(`SELECT * FROM pharmacy_admin.Login where login_ID='${username}' and password='${password}'`);
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
        console.log(dbRes);
        if(dbRes.length>0){
            GLOBAL_ID=username;
            res.redirect(`/Main2?username=${username}`);
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






app.get("/profile", async (req, res) => {
    let connection;
    const username = req.query.username;
    async function fetchDataCustomer() {
        try {
            connection = await oracledb.getConnection({
                user: 'pharmacy_admin',
                password: '12345',
                connectString: 'localhost/xepdb1'
            });

            const result = await connection.execute(`select p.patient_id,p.patient_name,p.patient_email,
            p.Road_no,
            p.City,
            p.House_no,
            p.District,
            phone.phone_no,password
            from patient_view p,phone,login
            where p.patient_id=phone.user_id 
            and login.login_id=p.patient_id
            and p.patient_id='${username}'`);

            console.log('A:',result);
            const jsonData = result.rows.map(row => {
                return {
                  Patient_id: row[0],
                  Patient_Name: row[1],
                  Patient_Email: row[2],
                  Road: row[3],
                  City: row[4],
                  House: row[5],
                  District: row[6],
                  Patient_phone: row[7],
                  Pass: row[8]

                };
            });
            console.log('CHeck: ',jsonData[0].Patient_Name);
            
            res.render('profile', { data: jsonData, username: username }); // Corrected: data should be result.rows
            return result.rows;
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
            console.log(error);
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

    await fetchDataCustomer(); // Corrected: await the fetchDataCustomer function
});



app.use(bodyParser.json());
  
  let arrayItem=[];
  app.post('/cart-items', async(req, res) => {
    let items = req.body.items;
    let connection;
    try {
            connection=await oracledb.getConnection({
            user: "pharmacy_admin",
            password: "12345",
            connectionString: "localhost/xepdb1"
        })
        let uniqueItems=items.reduce((map,item)=>{
            map[item]=(map[item]||0)+1;
            return map;
        },{});
        // console.log(uniqueItems);
        
        for(let key in uniqueItems){
            let value=uniqueItems[key];
            const query=`select product.product_name,product.product_type,product.product_price,pharmacy_name from pharmacy join stores on pharmacy.pharmacy_id=stores.pharmacy_id
            join product on stores.product_id=product.product_id
            where lower(product_name)=lower(:1)`;
            // const query=`select * from pharmacy join stores on pharmacy.pharmacy_id=stores.pharmacy_id
            // join product on stores.product_id=product.product_id
            // where lower(product_name)=lower(:1)`
            const binds={
                1:key
            }
            const option={
                outFormat: oracledb.OUT_FORMAT_OBJECT,
                autoCommit: true
            }
            const r=await connection.execute(query,binds,option);
            // console.log(r.rows,value);
            let obj=r.rows;
            obj=obj.at(0);
            // console.log("obj:");
            // console.log(obj);
            obj['order_quantity']=value;
            arrayItem.push(obj);
        }
        // arrayItem.forEach(i=>{
        //     console.log(i);
        // })
        // console.log(arrayItem.length);
    } catch (error) {
        console.log(error);
    } finally {
        if (connection) {
          try {
            await connection.close();
          } catch (err) {
            console.error(err);
          }
        }
      }
    // console.log("items:::"+items);

    // Send a response back to the client
    // res.json({ message: 'Items received successfully' });
});

app.get("/cart-items",async(req,res)=>{
    // res.sendFile(__dirname+"/dummy.html");
    res.render("cart",{arrayItem})
})
let requiredPrice;
let patientInfo;
app.use(bodyParser.json());
app.post("/checkout",async(req,res)=>{
    requiredPrice=req.body.requiredPrice;
    

    // console.log(requiredPrice);

})

app.get("/checkout",async(req,res)=>{
    // console.log(requiredPrice);
    let connection;
    try {
            connection=await oracledb.getConnection({
            user: "pharmacy_admin",
            password: "12345",
            connectionString: "localhost/xepdb1"
        })
       
        let id='Pat_00001'
        query=`select patient_name,trunc(months_between(sysdate,patient_dob)/12) as "Age",patient_email,
        p.patient_address.house_no as "house",
        p.patient_address.road_no as "road",
        p.patient_address.city as "city",
        p.patient_address.district as "district",
        phone_no
        from patient p join phone on
        p.patient_id=phone.user_id 
        where p.patient_id=:1`;

        let binds={
            1:id
        }
        let option={
            outFormat:oracledb.OUT_FORMAT_OBJECT,
            autoCommit: true
        }
        const r=await connection.execute(query,binds,option);
        console.log(r.rows);
        

        patientInfo=r.rows[0];
        
        res.render("order-confirmation",{arrayItem,patientInfo,requiredPrice});
    } catch (error) {
        console.log(error);
    } finally {
        if (connection) {
          try {
            await connection.close();
          } catch (err) {
            console.error(err);
          }
        }
      }
})




app.get('/fetch', async (req, res) => {
    try {
      const connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
        connectString: 'localhost/xepdb1'
      });
  
      const query = `select *from product`;
  
      const result = await connection.execute(query);
      await connection.commit();
      await connection.close();
  
      const jsonData = result.rows.map(row => {
        return {
          Pro_ID: row[0], // Replace column1, column2, ... with the actual column names from the query
          Pro_name: row[1],
          Pro_Type: row[2],
          Pro_price: row[3]
          // Add more columns as needed
        };
      });
  
      res.json(jsonData);
  
    } catch (error) {
      res.status(500).send(error);
    }
  });

app.listen(4444);




