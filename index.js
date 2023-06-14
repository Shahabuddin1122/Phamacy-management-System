const oracledb = require('oracledb');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const enc = bodyParser.urlencoded({ extended: true });
const PORT = 4444;

const app = express();
app.use("/assets", express.static("assets"));
app.set('view engine', 'ejs');
app.use("/public", express.static('public'));
let GLOBAL_ID;
let a = 'Pat_00001';
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/login.html');
})

const dbConfig = oracledb.getConnection({
  user: 'pharmacy_admin',
  password: '12345',
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

app.post("/", enc, (req, res) => {
  async function fetchDataCustomer(username, password) {
    try {
      const connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
        connectionString: 'localhost/xepdb1'
      });

      const result = await connection.execute(`SELECT * FROM pharmacy_admin.Login where login_ID='${username}' and password='${password}'`);
      console.log(result.rows);
      return result.rows;
    } catch (error) {
      return error;
    }
  }
  var username = req.body.username;
  var password = req.body.password;
  fetchDataCustomer(username, password).
    then(dbRes => {
      console.log(dbRes);
      if (dbRes.length > 0) {
        fs.writeFile('logindata.txt', username, 'utf8', (err) => {
          if (err) {
            console.error('Error writing file:', err);
          } else {
            console.log('Data has been stored in the file successfully.');
          }
        });

        res.redirect(`/Main2?username=${username}`);
      }
      else {
        res.redirect("/");
      }
    })
    .catch(err => {
      // console.log(err);
      res.redirect("/");
    })
})
app.get("/Main2", async (req, res) => {
  let connection;
  let username = req.query.username;
  console.log("M ", username);
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

      res.render('Main2', { data: jsonData, username: username }); // Corrected: data should be result.rows
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

      res.render('appointment', { query, data: jsonData, username: GLOBAL_ID });
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
  let doctorId = k.doctorId;
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
              BEGIN
                INSERT INTO consults (Doctor_id, Patient_id)
                VALUES (:doctorId, :patientId);
                :message := 'Data inserted successfully';
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
      return { message: result.outBinds.message };
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
      const result = await connection.execute(`select product_id, product_name,pharmacy_id,pharmacy_name,product_price
            from pharmacy join stores using(pharmacy_id) join product using(product_id) 
            WHERE lower(product_name) LIKE lower('%${query}%')`);
      console.log(result.rows);
      const result1 = await connection.execute(`SELECT p.Pharmacy_name,p.Pharmacy_address.city,p.Pharmacy_address.District,p.OVERALL_RATING FROM Pharmacy p WHERE lower(p.Pharmacy_name) LIKE lower('%${query}%')`);
      console.log(result1.rows);
      const jsonData = result.rows.map(row => {
        return {
          // Pro_name: row[0],
          // pharmacy:row[1],
          // Pro_price: row[2]
          Pro_ID: row[0],
          Pro_name: row[1],
          Ph_ID: row[2],
          pharmacy: row[3],
          Pro_price: row[4]

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
      if (jsonData.length > 0) {
        res.render('search', { query, data: jsonData });
        return result.rows;
      }
      else {
        res.render('search_table', { query, data: jsonData1 });
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


app.post("/Patient-signup", enc, (req, res) => {
  async function fetchDataCustomer(name, email, phone, password1, house, road, city, district, dob) {
    try {
      const connection = await oracledb.getConnection({
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
      GLOBAL_ID = result.outBinds.new_login_id;
      console.log('Generated Login ID:', result.outBinds.new_login_id);

      console.log(result.outBinds.message);
      return result;
    } catch (error) {
      return error;
    }
  }


  let password1 = req.body.password1;
  let name = req.body.name;
  let email = req.body.email;
  let phone = req.body.phone;
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
  let house = req.body.house;
  let road = req.body.road;
  let city = req.body.city;
  let district = req.body.district;

  fetchDataCustomer(name, email, phone, password1, house, road, city, district, dob)
    .then(dbRes => {
      console.log(dbRes);
      console.log('AT POST:', GLOBAL_ID);
      //res.redirect("/newlog");
      res.redirect("/newlog");
    })
    .catch(err => {
      // res.redirect("/regi");
      console.log(err);
      res.redirect("/regi");
    });

})
app.get("/Patient-signup", (req, res) => {
  console.log('AT Patient-signup GET:', GLOBAL_ID);
  res.sendFile(__dirname + "/Patient-signup.html");
})









app.post("/regi", enc, async (req, res) => {
  async function fetchDataCustomer(un, email, house, road, city, district, pass, phone) {
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
      GLOBAL_ID = result.outBinds.new_login_id;
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
  let phone = req.body.Phone;
  fetchDataCustomer(un, email, house, road, city, district, pass, phone)
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

app.get("/regi", (req, res) => {
  //console.log('AT regi GET:', GLOBAL_ID);
  res.sendFile(__dirname + "/regi.html");

  //res.render('regi',{data:GLOBAL_ID});

})
app.get("/newlog", (req, res) => {

  res.render('newlog', { data: GLOBAL_ID });
})

app.post("/newlog", enc, (req, res) => {
  async function fetchDataCustomer(username, password) {
    try {
      const connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
        connectionString: 'localhost/xepdb1'
      });

      const result = await connection.execute(`SELECT * FROM pharmacy_admin.Login where login_ID='${username}' and password='${password}'`);
      console.log(result.rows);
      return result.rows;
    } catch (error) {
      return error;
    }
  }
  var username = req.body.username;
  var password = req.body.password;
  fetchDataCustomer(username, password).
    then(dbRes => {
      console.log(dbRes);
      if (dbRes.length > 0) {
        GLOBAL_ID = username;
        res.redirect(`/Main2?username=${username}`);
      }
      else {
        res.redirect("/");
      }
    })
    .catch(err => {
      // console.log(err);
      res.redirect("/");
    })
})





app.post("/forgot_pass", enc, (req, res) => {
  async function fetchDataCustomer(un, pass1, pass2) {
    try {
      const connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
        connectionString: 'localhost/xepdb1'
      });


      const query = `UPDATE login SET password=:1 WHERE LOGIN_ID=:2 AND PASSWORD=:3`;
      const param = {
        1: pass2,
        2: un,
        3: pass1
      }
      const result = await connection.execute(query, param);
      await connection.commit();
      await connection.close();
      return result.rowsAffected;
    } catch (error) {
      return error;
    }

  }

  let un = req.body.username;
  let pass1 = req.body.password1;
  let pass2 = req.body.password2;
  fetchDataCustomer(un, pass1, pass2)
    .then(dbRes => {
      if (dbRes) {
        res.redirect("/");
      }
      else {
        res.redirect("/forgot_pass");

      }
      // console.log(dbRes);

      // res.redirect("/");
    })
    .catch(err => {
      res.redirect("/forgot_pass");
      console.log(err);
    })


})
app.get("/forgot_pass", (req, res) => {
  res.sendFile(__dirname + "/forgot_pass.html");
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

      console.log('A:', result);
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
      console.log('CHeck: ', jsonData[0].Patient_Name);

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

let arrayItem = [];
app.post('/cart-items', async (req, res) => {
  let items = req.body.items;
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: "pharmacy_admin",
      password: "12345",
      connectionString: "localhost/xepdb1"
    })
    const query = `select product.product_id, product.product_name,product.product_type,product.product_price,pharmacy.pharmacy_id,pharmacy_name from pharmacy join stores on pharmacy.pharmacy_id=stores.pharmacy_id
             join product on stores.product_id=product.product_id
             where product.product_id=:1 and pharmacy.pharmacy_id=:2`;
    const binds = {
      1: items['pro_id'],
      2: items['ph_id']
    }
    const option = {
      autoCommit: true,
      outFormat: oracledb.OUT_FORMAT_OBJECT
    }
    const r = await connection.execute(query, binds, option);
    // console.log(r.rows);
    let uniqueItem = r.rows[0];
    uniqueItem['order_quantity'] = 1;
    let flag = 0;
    arrayItem.forEach(i => {
      if (i.PRODUCT_ID == uniqueItem.PRODUCT_ID && i.PHARMACY_ID == uniqueItem.PHARMACY_ID) {
        // console.log('dhukse');
        i.order_quantity++;
        flag = 1;
      }

    })
    if (!flag) arrayItem.push(uniqueItem);
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
  //   console.log("arrayitem:");
  // console.log(arrayItem);


});

app.get("/cart-items", async (req, res) => {
  res.render("cart", { arrayItem })
})


let patientInfo;
let productInfo;
let pharmacyWiseProduct = [];
app.use(bodyParser.json());
app.post("/checkout", async (req, res) => {
  let info = req.body.requiredPrice;
  productInfo = info.productInfo;
  // console.log(productInfo);
  // requiredPrice = {
  //   'productTotal': info.productTotal,
  //   'vat': info.vat,
  //   'shipping': info.shipping,
  //   'allTotal': info.allTotal
  // }
  // console.log("product info");
  // console.log(productInfo);


  // Group products by pharmacy ID
  const groupedProducts = {};
  productInfo.forEach(product => {
    const pharmacyId = product.PHARMACY_ID;
    if (!groupedProducts[pharmacyId]) {
      groupedProducts[pharmacyId] = {
        PHARMACY_ID: pharmacyId,
        PHARMACY_NAME: product.PHARMACY_NAME,
        PRODUCT: [],
        subtotal: 0,
        vat: 0,
        shipping: 20,
        discount: 0,
        allTotal: 0
      };
    }

    // Push relevant product info to the grouped object
    groupedProducts[pharmacyId].PRODUCT.push({
      PRODUCT_ID: product.PRODUCT_ID,
      PRODUCT_NAME: product.PRODUCT_NAME,
      order_quantity: product.order_quantity
    });

    // Calculate subtotal for each pharmacy
    groupedProducts[pharmacyId].subtotal += product.PRODUCT_PRICE * product.order_quantity;
  });

  // Calculate additional values for each grouped object
  Object.values(groupedProducts).forEach(group => {
    // Calculate vat, discount, and allTotal
    group.vat = group.subtotal * 0.15;
    group.discount = group.subtotal * 0.05;
    group.allTotal = group.subtotal + group.vat - group.discount + group.shipping;

    // Push the grouped object to the result array
    pharmacyWiseProduct.push(group);
  });



})

app.get("/checkout", async (req, res) => {
  // console.log(requiredPrice);
  // console.log("DAta SEt");
  // console.log(pharmacyWiseProduct);
  // pharmacyWiseProduct.forEach(i=>{
  //   console.log("product:***");
  //   console.log(i.PRODUCT);
  // })
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: "pharmacy_admin",
      password: "12345",
      connectionString: "localhost/xepdb1"
    })

    let id;
    try {
      // Read the file synchronously
      id = fs.readFileSync('logindata.txt', 'utf8');

      // Process the file data
      // console.log(data);
    } catch (error) {
      // Handle any errors that occur during file reading
      console.error('Error reading the file:', error);
    }
    query = `select patient_name,trunc(months_between(sysdate,patient_dob)/12) as "Age",patient_email,
        p.patient_address.house_no as "house",
        p.patient_address.road_no as "road",
        p.patient_address.city as "city",
        p.patient_address.district as "district",
        phone_no
        from patient p join phone on
        p.patient_id=phone.user_id 
        where p.patient_id=:1`;

    let binds = {
      1: id
    }
    let option = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: true
    }
    const r = await connection.execute(query, binds, option);
    console.log(r.rows);


    patientInfo = r.rows[0];
    console.log(productInfo);

    res.render("order-confirmation", { productInfo, patientInfo, pharmacyWiseProduct });
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

app.use(bodyParser.json());
app.post('/order-history', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: 'pharmacy_admin',
      password: '12345',
      connectString: 'localhost/xepdb1'
    });
    let id;
    try {
      // Read the file synchronously
      id = fs.readFileSync('logindata.txt', 'utf8');

      // Process the file data
      // console.log(data);
    } catch (error) {
      // Handle any errors that occur during file reading
      console.error('Error reading the file:', error);
    }
    // let bill_id;
    // const query = `BEGIN
    //               :bill_id:='BILL_'||LPAD(TO_CHAR(bill_id_seq.NEXTVAL),5,0);
    //             END:`;
    // await connection.execute(query,
    //   {
    //     bill_id: {
    //       dir: oracledb.BIND_OUT,
    //       type: oracledb.STRING
    //     }
    //   }
    //   , { autoCommit: true });

    for (const pwp of pharmacyWiseProduct) {

      const query = `BEGIN
                    insert into bill(bill_id,bill_price)
                    values('BILL_'||LPAD(TO_CHAR(bill_id_seq.NEXTVAL),5,0),:price);
                    :bill_id:='BILL_'||LPAD(TO_CHAR(bill_id_seq.CURRVAL),5,0);
                  END;`;

      const bind = {
        price: pwp.allTotal,
        bill_id: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING
        }
      }
      const option = { autoCommit: true };
      const bill = await connection.execute(query, bind, option);
      let bill_id = bill.outBinds.bill_id;

      // console.log(`bill_id:`);
      // console.log(bill.outBinds);
      for (const p of pwp.PRODUCT) {
        const query = `insert into order_history values
        ('ORD_'||LPAD(TO_CHAR(order_history_id_seq.NEXTVAL),5,0),
        to_date(sysdate,'dd/mm/yyyy'),
        :1,:2,:3,:4,:5)`;
        const binds = {
          1: p.order_quantity,
          2: p.PRODUCT_ID,
          3: bill_id,
          4: pwp.PHARMACY_ID,
          5: id
        };

        const option = {
          autoCommit: true
        };

        await connection.execute(query, binds, option);
      }
    }

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
});

app.get('/order-history', async (req, res) => {
  // res.sendFile(__dirname + "/views/order-history.html");
  let connection;
  let orderArray;
  let total_bills;
  let proTotal;
  try {
    connection = await oracledb.getConnection({
      user: 'pharmacy_admin',
      password: '12345',
      connectString: 'localhost/xepdb1'
    });
    let id;
    try {
      // Read the file synchronously
      id = fs.readFileSync('logindata.txt', 'utf8');

      // Process the file data
      // console.log(data);
    } catch (error) {
      // Handle any errors that occur during file reading
      console.error('Error reading the file:', error);
    }
    const countQuery=`select count(unique bill_id) as "total_bills" from order_history
    where patient_id=:1
    group by patient_id`;

    const countRes=await connection.execute(countQuery,{1:id},{autoCommit:true,outFormat:oracledb.OUT_FORMAT_OBJECT});
    console.log(countRes.rows);
    total_bills=countRes.rows[0].total_bills;

    const countProRes=await connection.execute(`select bill_id,count( product_id) as "total_product" from order_history
    where patient_id=:1
    group by bill_id,patient_id
    order by bill_id`,{1:id},{autoCommit:true,outFormat:oracledb.OUT_FORMAT_OBJECT});

    // console.log(countProRes.rows);
    proTotal=countProRes.rows;



    const query = `select b.bill_id,to_char(o.order_date,'dd/mm/yyyy') as "ORDER_DATE",
    b.bill_status,b.bill_price,ph.pharmacy_id,ph.pharmacy_name,
    pr.product_id,pr.product_name,pr.product_price,o.quantity
    from bill b,order_history o,product pr,pharmacy ph,patient pa
    where pa.patient_id=:1 and
    b.bill_id=o.bill_id and
    o.product_id=pr.product_id and
    o.pharmacy_id=ph.pharmacy_id and
    o.patient_id=pa.patient_id
    
    order by b.bill_id`;
    const bind = {
      1: id
    }

    const option = {
      autoCommit: true,
      outFormat: oracledb.OUT_FORMAT_OBJECT
    }

    const bills = await connection.execute(query, bind, option);
    // console.log(bills.rows);
    rows = bills.rows;

    orderArray = rows.reduce((result, current) => {
      const existItem = result.find(item => item.BILL_ID === current.BILL_ID && item.PHARMACY_ID === current.PHARMACY_ID);
      if (existItem) {
        existItem.PRODUCT.push({
          PRODUCT_ID: current.PRODUCT_ID,
          PRODUCT_NAME: current.PRODUCT_NAME,
          PRODUCT_PRICE: current.PRODUCT_PRICE,
          QUANTITY: current.QUANTITY
        });
        existItem.subtotal+=current.QUANTITY*current.PRODUCT_PRICE;
        existItem.vat=existItem.subtotal*0.15;
        existItem.discount=existItem.subtotal*0.05;
        
      }
      else {
        let pr = {
          PRODUCT_ID: current.PRODUCT_ID,
          PRODUCT_NAME: current.PRODUCT_NAME,
          PRODUCT_PRICE: current.PRODUCT_PRICE,
          QUANTITY: current.QUANTITY
        }
        result.push({
          BILL_ID: current.BILL_ID,
          BILL_STATUS: current.BILL_STATUS,
          BILL_PRICE: current.BILL_PRICE,
          ORDER_DATE: current.ORDER_DATE,
          PHARMACY_ID: current.PHARMACY_ID,
          PHARMACY_NAME: current.PHARMACY_NAME,
          PRODUCT:[pr],
          subtotal:current.QUANTITY*current.PRODUCT_PRICE,
          discount: current.QUANTITY*current.PRODUCT_PRICE*0.05,
          vat: current.QUANTITY*current.PRODUCT_PRICE*0.15,
          shipping: 20
        });
        // result.PRODUCT.push(pr);
      }
      // result.discount=result.subtotal*0.05;
      // result.shipping=20;
      // result.vat=result.subtotal*0.15;
      
      // result.discount=result.subtotal*0.05;
      return result;
    },[]);
    // console.log(orderArray);
    // orderArray.forEach((ord,index)=>{
    //   console.log(`For ${ord.BILL_ID}:`);
    //   console.log(ord.PRODUCT);
    // })


    

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

  res.render("order-history", {orderArray,total_bills,proTotal});
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

app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);
});




