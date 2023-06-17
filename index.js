const oracledb=require('oracledb');
const express=require('express');
const bodyParser=require('body-parser');
const enc=bodyParser.urlencoded({extended:true});

const app=express();
app.use("/assets",express.static("assets"));
app.set('view engine', 'ejs');
app.use(express.static('public'));
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
app.get("/Main2", async (req, res) => {
    let connection;
    async function fetchDataCustomer() {
        try {
            connection = await oracledb.getConnection({
                user: 'pharmacy_admin',
                password: '12345',
                connectString: 'localhost/xepdb1'
            });

            const result = await connection.execute(`SELECT * FROM product`);
            console.log(result.rows);
            
            const jsonData = result.rows.map(row => {
                return {
                  Pro_name: row[1],
                  Pro_price: row[3]

                };
            });
            console.log(jsonData);
            
            res.render('Main2', { data: jsonData }); // Corrected: data should be result.rows
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
            Doc_shift: row[7]
          };
        });
  
        console.log(jsonData);
  
        res.render('appointment', { query, data: jsonData });
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
  
app.post('/addConsult', async (req, res) => {
    const { Doc_id, Doc_Hos,Patient_id } = req.body;

    let connection;

    try {
    connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
        connectString: 'localhost/xepdb1'
    });

    const insertQuery = `INSERT INTO Consults(Patient_id,Doctor_id)
                        VALUES (:Patient_id,:Doc_id)`;

    const bindParams = {
        Patient_id,
        Doc_id
    };

    const result = await connection.execute(insertQuery, bindParams);

    
    
    } catch (error) {
    // Handle error
    res.status(500).json({ error: 'An error occurred while adding the pharmacy to the database.' });
    console.error(error);
    } finally {
    if (connection) {
        try {
        await connection.close();
        } catch (error) {
        console.error(error);
        }
    }
    }
});










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
            const result = await connection.execute(`SELECT * FROM product WHERE product_name LIKE INITCAP('%${query}%')`);
            console.log(result.rows);
            const result1 = await connection.execute(`SELECT p.Pharmacy_name,p.Pharmacy_address.city,p.Pharmacy_address.District,p.OVERALL_RATING FROM Pharmacy p WHERE p.Pharmacy_name LIKE INITCAP('%${query}%')`);
            console.log(result1.rows);
            const jsonData = result.rows.map(row => {
                return {
                    Pro_name: row[1],
                    Pro_price: row[3]

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
  




let GLOBAL_ID='';

app.post("/regi", enc, async (req, res) => {
    async function fetchDataCustomer(un, email, house, road, city, district, pass) {
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
    fetchDataCustomer(un, email, house, road, city, district, pass)
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
    console.log('AT regi GET:', GLOBAL_ID);
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




