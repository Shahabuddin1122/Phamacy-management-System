const oracledb = require('oracledb');
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const enc = bodyParser.urlencoded({ extended: true });
const PORT = 4444;

const app = express();
app.use("/assets", express.static("assets"));
app.set('view engine', 'ejs');
app.use("/public", express.static('public'));
app.use("/images", express.static("images"));
app.use(express.json());

global.LoggedDoctor = 'DOC_00003';
global.LoggedManager = 'Emp_00001';
global.LoggedEmployee = 'Emp_00001';
global.LoggedPharmacy = 'Pha_00001';
global.LoggedPatient = 'PAT_00001';

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
/*
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
*/
///after updating
let loggedID = '';
app.post("/", enc, (req, res) => {
  async function fetchDataCustomer(username, password) {
    try {
      const connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
        connectionString: 'localhost/xepdb1'
      });

      const result = await connection.execute(`SELECT * FROM pharmacy_admin.Login where login_ID='${username}' and password='${password}'`);
      // console.log("---->/", result.rows);
      // console.log(username);
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
        let k = username.substring(0, 3);
        fs.writeFile('logindata.txt', username, 'utf8', (err) => {
          if (err) {
            console.error('Error writing file:', err);
          } else {
            console.log('Data has been stored in the file successfully.');
          }
        });
        if (k == 'PAT' || k == 'Pat') {
          res.redirect(`/Main2?username=${username}`);
        }
        else if (k == 'Emp' || k == 'EMP') {
          if (dbRes[0][2] == 'MANAGER') {
            loggedID = dbRes[0][0];
            res.redirect("/manager-home");
          }
          else {
            res.redirect(`employee`);
          }
        }
        else if (k == 'DOC' || k == 'Doc') {
          res.redirect("/doc-dashboard");
        }
      }
      else {
        res.redirect("/");
      }
    })
    .catch(err => {
      // console.log(err);
      res.redirect("/");
    })
});

app.use(express.urlencoded({ extended: true }));

app.get("/doc-dashboard", async (req, res) => {

  let DocID = global.LoggedDoctor;
  async function fetchDataCustomer() {
    let connection;
    try {
      connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
        connectString: 'localhost/xepdb1'
      });


      const DocName = await connection.execute(`SELECT DOCTOR_NAME FROM DOCTOR WHERE DOCTOR_ID= '${DocID}'`);
      let username = DocName.rows[0];
      res.render("dashboard-new", { username: username });
    }
    catch (error) {
      res.status(500).json({ error: 'An error occurred' });
      console.log(error);
      return error;
    }
    finally {
      if (connection) {
        try {
          console.log("NO error");
          await connection.close(); // 
        }
        catch (error) {
          console.error(error);
        }
      }
    }
  }

  await fetchDataCustomer();
})
app.get("/doctor-list", async (req, res) => {
  let connection;
  let username = req.query.username;
  let DocID = global.LoggedDoctor;
  console.log("M ", username);
  async function fetchDataCustomer() {
    try {
      connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
        connectString: 'localhost/xepdb1'
      });

      const result = await connection.execute(`SELECT DOCTOR_NAME, DOCTOR_EMAIL, 
            DOCTOR_ADDRESS, 
            DOCTOR_QUALIFICATION, DOCTOR_HOSPITAL, SPECIALIZATION
            FROM DOCTOR`);
      console.log(result.rows);
      const jsonData = result.rows.map(row => {
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

      const DocName = await connection.execute(`SELECT DOCTOR_NAME FROM DOCTOR WHERE DOCTOR_ID= '${DocID}'`);
      username = DocName.rows[0];
      res.render('doctor-list', { data: jsonData, username: username }); // Corrected: data should be result.rows
      return result.rows;
    }
    catch (error) {
      res.status(500).json({ error: 'An error occurred' });
      console.log(error);
      return error;
    }
    finally {
      if (connection) {
        try {
          console.log("NO error");
          await connection.close(); // Close the connection when you're done
        }
        catch (error) {
          console.error(error);
        }
      }
    }
  }

  await fetchDataCustomer(); // Corrected: await the fetchDataCustomer function
});


app.get("/patient_list", async (req, res) => {
  let connection;
  let username = req.query.username;
  let DocID = global.LoggedDoctor;

  let loggedDoc = 'Doc_00001';
  console.log("M ", username);
  async function fetchDataCustomer() {
    try {
      connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
        connectString: 'localhost/xepdb1'
      });

      const result = await connection.execute(`SELECT PATIENT_NAME,PATIENT_EMAIL FROM PATIENT NATURAL JOIN CONSULTS NATURAL JOIN DOCTOR`);
      console.log(result.rows);
      const jsonData = result.rows.map(row => {
        return {
          name: row[0],
          email: row[1]
        };
      });
      console.log(jsonData);
      const DocName = await connection.execute(`SELECT DOCTOR_NAME FROM DOCTOR WHERE DOCTOR_ID= '${DocID}'`);
      username = DocName.rows[0];
      res.render('patient', { data: jsonData, username: username }); // Corrected: data should be result.rows
      return result.rows;
    }
    catch (error) {
      res.status(500).json({ error: 'An error occurred' });
      console.log(error);
      return error;
    }
    finally {
      if (connection) {
        try {
          console.log("NO error");
          await connection.close(); // Close the connection when you're done
        }
        catch (error) {
          console.error(error);
        }
      }
    }
  }

  await fetchDataCustomer(); // Corrected: await the fetchDataCustomer function
});

app.get("/payment", async (req, res) => {
  let connection;
  let username = req.query.username;
  let DocID = global.LoggedDoctor;

  console.log("M ", username);
  async function fetchDataCustomer() {
    try {
      connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
        connectString: 'localhost/xepdb1'
      });

      const result = await connection.execute(`SELECT
      PHARMACY.PHARMACY_NAME,
      EARNING.INCOME
  FROM
      EARNING
  JOIN
      PHARMACY ON EARNING.PHARMACY_ID = PHARMACY.PHARMACY_ID
  WHERE
      EARNING.DOCTOR_ID = '${DocID}'`);
      console.log(result.rows);
      const jsonData = result.rows.map(row => {
        return {
          name: row[0],
          income: row[1]
        };
      });
      console.log(jsonData);
      const DocName = await connection.execute(`SELECT DOCTOR_NAME FROM DOCTOR WHERE DOCTOR_ID= '${DocID}'`);
      username = DocName.rows[0];
      res.render('payment', { data: jsonData, username: username }); // Corrected: data should be result.rows
      return result.rows;
    }
    catch (error) {
      res.status(500).json({ error: 'An error occurred' });
      console.log(error);
      return error;
    }
    finally {
      if (connection) {
        try {
          console.log("NO error");
          await connection.close(); // Close the connection when you're done
        }
        catch (error) {
          console.error(error);
        }
      }
    }
  }

  await fetchDataCustomer(); // Corrected: await the fetchDataCustomer function
});
app.get("/appointment-doc", async (req, res) => {
  let connection;
  let DocID = LoggedDoctor;
  let PhaID = LoggedPharmacy;
  async function fetchDataCustomer() {
    try {
      connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
        connectString: 'localhost/xepdb1'
      });

      const DocName = await connection.execute(`SELECT DOCTOR_NAME FROM DOCTOR WHERE DOCTOR_ID= '${DocID}'`);
      const result = await connection.execute(`SELECT
      PATIENT.PATIENT_ID,
      PATIENT.PATIENT_NAME,
      PATIENT.PATIENT_EMAIL,
      PHARMACY.PHARMACY_NAME
  FROM
      PATIENT
  JOIN
      CONSULTS ON PATIENT.PATIENT_ID = CONSULTS.PATIENT_ID
  JOIN
      DOCTOR ON CONSULTS.DOCTOR_ID = DOCTOR.DOCTOR_ID
  JOIN
      PHARMACY ON CONSULTS.PHARMACY_ID = PHARMACY.PHARMACY_ID
  WHERE
      DOCTOR.DOCTOR_ID = '${DocID}'
      AND PHARMACY.PHARMACY_ID = '${PhaID}'`);
      const result0 = await connection.execute(`SELECT PHARMACY_ID, PHARMACY_NAME FROM DOCTOR NATURAL JOIN HASDOC NATURAL JOIN PHARMACY WHERE DOCTOR_ID= '${DocID}'`);
      console.log(result.rows);
      console.log(result0.rows);
      const jsonData = result.rows.map(row => {
        return {
          id: row[0],
          name: row[1],
          email: row[2],
          pname: row[3]
        };
      });
      const jsonData0 = result0.rows.map(row => {
        return {
          pid: row[0],
          pname: row[1]
        }
      });

      let username = DocName.rows[0];
      console.log(jsonData);
      console.log(jsonData0);

      res.render('appointment-doc', { username: username, data: jsonData, phaname: jsonData0 }); // Corrected: data should be result.rows
      return result.rows;
    }
    catch (error) {
      res.status(500).json({ error: 'An error occurred' });
      console.log(error);
      return error;
    }
    finally {
      if (connection) {
        try {
          console.log("NO error");
          await connection.close(); // Close the connection when you're done
        }
        catch (error) {
          console.error(error);
        }
      }
    }
  }

  await fetchDataCustomer(); // Corrected: await the fetchDataCustomer function
});

app.post("/pharmacy-name", async (req, res) => {
  async function fetchDataCustomer(pharma_name) {
    try {
      const connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
        connectString: 'localhost/xepdb1'
      });

      const query = `SELECT PHARMACY_ID,PHARMACY_NAME FROM PHARMACY WHERE PHARMACY_NAME= :1`;
      const param = {
        1: pharma_name
      }
      const result = await connection.execute(query, param);
      global.LoggedPharmacy = result.rows[0][0];
      console.log(result.rows[0]);
      await connection.close();
      return result;
    } catch (error) {
      return error;
    }
  }
  var pharma_name = req.body.pharma_name;
  console.log(pharma_name);
  fetchDataCustomer(pharma_name).
    then(dbRes => {
      console.log(dbRes);
      res.redirect("/appointment-doc");
    })
    .catch(err => {
      console.error(err);
      res.json({ message: 'Error occurred while deleting data' });
    })
});



app.post("/delete-patient", async (req, res) => {
  async function fetchDataCustomer(id) {
    try {
      const connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
        connectString: 'localhost/xepdb1'
      });

      const query = `DELETE FROM PATIENT WHERE PATIENT_ID = :1`;
      const param = {
        1: id
      }
      const result = await connection.execute(query, param);
      await connection.commit();
      await connection.close();
      return result;
    } catch (error) {
      return error;
    }
  }
  var patientId = req.body.patientId;
  console.log(patientId);
  fetchDataCustomer(patientId).
    then(dbRes => {
      console.log(dbRes);
      res.redirect("/appointment-doc");
    })
    .catch(err => {
      console.error(err);
      res.json({ message: 'Error occurred while deleting data' });
    })
});


app.post("/checked-patient", async (req, res) => {
  let DocID = global.LoggedDoctor;
  let PhaID = global.LoggedPharmacy;
  async function fetchDataCustomer(id) {
    try {
      const connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
        connectString: 'localhost/xepdb1'
      });

      const query = `DELETE FROM PATIENT WHERE PATIENT_ID = :1`;
      const param = {
        1: id
      }
      const result = await connection.execute(query, param);
      await connection.commit();
      await connection.execute(`UPDATE EARNING SET INCOME=INCOME+500 WHERE DOCTOR_ID= '${DocID}'`);
      await connection.commit();
      await connection.close();
      return result;
    } catch (error) {
      return error;
    }
  }
  var patientId = req.body.patientId;
  console.log(patientId);
  fetchDataCustomer(patientId).
    then(dbRes => {
      console.log(dbRes);
      res.redirect("/appointment-doc");
    })
    .catch(err => {
      console.error(err);
      res.json({ message: 'Error occurred while deleting data' });
    })
});


app.get("/schedule", async (req, res) => {
  let connection;
  let username = req.query.username;
  let DocID = LoggedDoctor;
  let PhaID = LoggedPharmacy;

  async function fetchDataCustomer() {
    try {
      connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
        connectString: 'localhost/xepdb1'
      });

      const result = await connection.execute(`
      SELECT 
      PHARMACY_NAME,
      PHARMACY_EMAIL,
      PHARMACY.PHARMACY_ADDRESS.HOUSE_NO || ' ' || PHARMACY.PHARMACY_ADDRESS.CITY || ' Road ' || PHARMACY.PHARMACY_ADDRESS.ROAD_NO || ' ' || PHARMACY.PHARMACY_ADDRESS.DISTRICT as "address",
      TO_CHAR(START_TIME, 'HH24:MI AM'),
      TO_CHAR(END_TIME, 'HH24:MI AM'),
      CONSULT_DAY
  FROM
      SCHEDULE
  JOIN
      HAS ON SCHEDULE.SCHEDULE_ID = HAS.SCHEDULE_ID
  JOIN
      DOCTOR ON HAS.DOCTOR_ID = DOCTOR.DOCTOR_ID
  JOIN
      HASDOC ON DOCTOR.DOCTOR_ID = HASDOC.DOCTOR_ID
  JOIN
      PHARMACY ON HASDOC.PHARMACY_ID = PHARMACY.PHARMACY_ID
  WHERE doctor.doctor_id='${DocID}'`);
      console.log(result.rows);
      const DocName = await connection.execute(`SELECT DOCTOR_NAME FROM DOCTOR WHERE DOCTOR_ID= '${DocID}'`);
      username = DocName.rows[0];
      const jsonData = result.rows.map(row => {
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

      res.render('schedule', { data: jsonData, username: username }); // Corrected: data should be result.rows
      return result.rows;
    }
    catch (error) {
      res.status(500).json({ error: 'An error occurred' });
      console.log(error);
      return error;
    }
    finally {
      if (connection) {
        try {
          console.log("NO error");
          await connection.close(); // Close the connection when you're done
        }
        catch (error) {
          console.error(error);
        }
      }
    }
  }

  await fetchDataCustomer(); // Corrected: await the fetchDataCustomer function
});


let GLOBAL_ID2 = '';
app.post("/employee-signup", enc, (req, res) => {
  async function fetchDataCustomer(name, email, phone, password1, house, road, city, district, dob) {
    try {
      const connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
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
        
                   :message := 'Records inserted successfully';
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
      GLOBAL_ID2 = result.outBinds.new_login_id_2;
      console.log('Generated Login ID:', result.outBinds.new_login_id_2);

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
  let house = req.body.house;
  let road = req.body.road;
  let city = req.body.city;
  let district = req.body.district;

  fetchDataCustomer(name, email, phone, password1, house, road, city, district, dob)
    .then(dbRes => {
      console.log(dbRes);
      console.log('AT POST:', GLOBAL_ID2);
      //res.redirect("/newlog");
      res.redirect("/manager-home");
    })
    .catch(err => {
      // res.redirect("/regi");
      console.log(err);
      res.redirect("/employee-signup");
    });

})

app.get("/employee-signup", (req, res) => {
  console.log('AT Employee-signup GET:', GLOBAL_ID2);
  res.sendFile(__dirname + "/employee-signup.html");
})

app.get("/manager-home", (req, res) => {
  res.sendFile(__dirname + "/manager-home.html");
});


let GLOBAL_ID4 = '';
app.post("/manager-homepage-add-doctor", enc, async (req, res) => {
  async function fetchDataCustomer(name, email, phone, password, house, road, city, district, qual, hosp, specialist, day, shift, pharmacy) {
    try {
      const connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
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

             commit;
             
             INSERT INTO login (login_id,password,USER_TYPE)
             VALUES (:new_login_id_3, :password,'DOCTOR');
            
             commit;

             INSERT INTO phone (user_id, phone_no)
             VALUES (:new_login_id_3, :phone);

             commit;

             INSERT INTO Has (consult_day, doctor_id, schedule_id)
             VALUES (:day,:new_login_id_3, scheduleid)
             RETURNING has_id INTO :new_login_id_4;

             commit;

             INSERT INTO hasdoc(doctor_id, pharmacy_id)
             VALUES(:new_login_id_3, :pharmacy)
             RETURNING hasdoc_id INTO :new_login_id_5;

             commit;
  
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
      GLOBAL_ID4 = result.outBinds.new_login_id_3;
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
  let phone = req.body.phone;
  let password = req.body.password;
  let house = req.body.house;
  let road = req.body.road;
  let city = req.body.city;
  let district = req.body.district;
  let qual = req.body.qual;
  let hosp = req.body.hosp;
  let specialist = req.body.specialist;
  let day = req.body.day;
  let shift = req.body.shift;
  let pharmacy = req.body.pharmacy;
  console.log(req.body)
  fetchDataCustomer(name, email, phone, password, house, road, city, district, qual, hosp, specialist, day, shift, pharmacy)
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

app.get("/manager-homepage-add-doctor", (req, res) => {
  console.log('AT add-docgtor GET:', GLOBAL_ID4);
  res.sendFile(__dirname + "/manager-homepage-add-doctor.html");

  //res.render('regi',{data:GLOBAL_ID3});

})
let GLOBAL_ID5 = '';

app.post("/manager-homepage-add-employee", enc, async (req, res) => {
  async function fetchDataCustomer(name, email, phone, password1, house, road, city, district, dob, salary, manID) {
    try {
      const connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
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
      GLOBAL_ID5 = result.outBinds.new_login_id_2;
      console.log('Generated Login ID:', result.outBinds.new_login_id_2);
      console.log('Generated Login ID:', result.outBinds.pharmacyid);

      console.log(result.outBinds.message);
      return result;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  let name = req.body.name;
  let email = req.body.email;
  let phone = req.body.phone;
  let password1 = req.body.password1;
  let house = req.body.house;
  let road = req.body.road;
  let city = req.body.city;
  let district = req.body.district;
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
  let manID = req.body.manID;

  fetchDataCustomer(name, email, phone, password1, house, road, city, district, dob, salary, manID)
    .then(dbRes => {
      console.log(dbRes);
      console.log('AT POST:', GLOBAL_ID5);

      //console.log(pharmacyId); 

      //res.redirect("/newlog");
      res.redirect("/manager-home");
    })
    .catch(err => {
      // res.redirect("/regi");
      console.log(err);
      res.redirect("/manager-homepage-add-employee");
    });

})
app.get("/manager-homepage-add-employee", (req, res) => {
  console.log('AT Employee-signup GET:', GLOBAL_ID5);
  res.sendFile(__dirname + "/manager-homepage-add-employee.html");
})


app.get('/manager-homepage-doctor', async (req, res) => {
  //const query = req.query.search_doctor;

  let connection;

  //let username=req.query.username;
  //console.log("M ",username);

  async function fetchDataCustomer() {
    try {
      connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
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
  async function fetchDataCustomer(doctorId) {
    try {
      const connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
        connectionString: 'localhost/xepdb1'
      });

      const queries =
        [`DELETE FROM doctor WHERE doctor_id = :1`,
          `DELETE FROM login WHERE login_id = :1`,
          `DELETE FROM phone WHERE user_id = :1`];
      const param = {
        1: doctorId
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
  var doctorId = req.body.doctorId;
  console.log(doctorId);
  fetchDataCustomer(doctorId).
    then(dbRes => {
      console.log(dbRes);

      res.redirect("/manager-homepage-doctor");

    })
    .catch(err => {
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
        user: 'pharmacy_admin',
        password: '12345',
        connectString: 'localhost/xepdb1'
      });

      const result = await connection.execute(
        `SELECT e.employee_id, e.employee_Name AS employee_name, e.employee_Email, p.phone_no,
        e.employee_address.house_no || ' , ' || e.employee_address.road_no || ' , ' || e.employee_address.city || ' , ' || e.employee_address.district AS employee_address,
        TRUNC(MONTHS_BETWEEN(SYSDATE, e.employee_dob) / 12) AS employee_age,
        e.employee_salary, m.employee_name AS manager_name
    FROM employee e, employee m, phone p
    WHERE UPPER(e.employee_id) = UPPER(p.user_id)
        AND UPPER(e.manager_id) = UPPER(m.employee_id)`);
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
  async function fetchDataCustomer(employeeId) {
    try {
      const connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
        connectionString: 'localhost/xepdb1'
      });

      const queries =
        [`DELETE FROM employee WHERE employee_id = :1`,
          `DELETE FROM login WHERE login_id = :1`,
          `DELETE FROM phone WHERE user_id = :1`];
      const param = {
        1: employeeId
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
  var employeeId = req.body.employeeId;
  console.log(employeeId);
  fetchDataCustomer(employeeId).
    then(dbRes => {
      console.log(dbRes);

      res.redirect("/manager-homepage-employee");

    })
    .catch(err => {
      //res.redirect("/regi");
      console.error(err);
      res.json({ message: 'Error occurred while deleting data' });
    })

});


let pharmaID = 'Pha_00003';
app.get("/manager-homepage-medicine", async (req, res) => {
  let connection;

  async function fetchDataCustomer() {
    try {
      connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
        connectString: 'localhost/xepdb1'
      });

      const query =
        `SELECT UNIQUE p.product_id, p.product_name, p.product_type, p.product_price, to_char(s.manufactured_date, 'dd-MON-yyyy'), to_char(s.Expired_date, 'dd-MON-yyyy'), s.store_quantity, to_char(su.supply_date, 'dd-MON-yyyy'), su.supply_quantity,sup.supplier_email,s.store_id
            from stores s, product p, supply su, supplier sup
            where s.product_id=p.product_id
            and p.product_id=su.product_id
            and su.supplier_id=sup.supplier_id
            and pharmacy_id= :1`;
      const param = {
        1: pharmaID
      }

      const result = await connection.execute(query, param)
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
  async function fetchDataCustomer(storeId) {
    try {
      const connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
        connectionString: 'localhost/xepdb1'
      });

      console.log(storeId + 'done');
      const query = `UPDATE STORES
            SET store_quantity=store_quantity-1
            WHERE store_id= :1`;
      const param = {
        1: storeId
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
  let storeId = req.body.storeId1;
  console.log(storeId);
  fetchDataCustomer(storeId).
    then(dbRes => {
      console.log(dbRes);

      res.redirect("/manager-homepage-medicine");

    })
    .catch(err => {
      //res.redirect("/regi");
      console.error(err);
      res.json({ message: 'Error occurred while deleting data' });
    })

});

app.post('/add-product', async (req, res) => {
  async function fetchDataCustomer(storeId) {
    try {
      const connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
        connectionString: 'localhost/xepdb1'
      });

      console.log(storeId + 'done');
      const query = `UPDATE STORES
          SET store_quantity=store_quantity+1
          WHERE store_id= :1`;
      const param = {
        1: storeId
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
  let storeId = req.body.storeId2;
  console.log(storeId);
  fetchDataCustomer(storeId).
    then(dbRes => {
      console.log(dbRes);

      res.redirect("/manager-homepage-medicine");

    })
    .catch(err => {
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
        user: 'pharmacy_admin',
        password: '12345',
        connectString: 'localhost/xepdb1'
      });

      const result = await connection.execute(
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
      console.log('at profile:', rows);
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
let GLOBAL_ID6 = '';

app.post("/manager-homepage-add-medicine", enc, async (req, res) => {
  async function fetchDataCustomer(pname, type, price, mdate, edate, quantity, email, sname, sdate, city) {
    try {
      const connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
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
               VALUES (:sname, :email,:city)
               RETURNING supplier_id INTO :new_login_id_1;

               commit;

               INSERT INTO product (product_name, product_type ,product_price)
               VALUES (:pname, :type, :price)
               RETURNING product_id INTO :new_login_id_2;

               commit;

               INSERT INTO supply (supply_date, supply_quantity, supplier_id, product_id)
               VALUES (to_date(:sdate,'dd-mm-yyyy'),:quantity, :new_login_id_1, :new_login_id_2)
               RETURNING supply_id INTO :new_login_id_3;

               commit;
               
               INSERT INTO stores(product_id,pharmacy_id,manufactured_date, expired_date)
               VALUES (:new_login_id_2, :pharmaID, to_date(:mdate,'dd-mm-yyyy'), to_date(:edate,'dd-mm-yyyy'))
               RETURNING store_id INTO :new_login_id_4;

               commit;
    
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
      GLOBAL_ID4 = result.outBinds.new_login_id_3;
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
  let price = req.body.price;
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
  let city = req.body.city;
  // console.log(req.body)
  console.log(sdate + '\n' + mdate + '\n' + edate);

  fetchDataCustomer(pname, type, price, mdate, edate, quantity, email, sname, sdate, city)
    .then(dbRes => {

      // console.log(dbRes);
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


app.delete('/delete-file/:filename', (req, res) => {
  const filename = req.params.filename;

  fs.unlink(`${filename}`, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error deleting file.');
    } else {
      res.redirect('/');
    }
  });
});









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
          Doc_shift: row[8],
          Doc_speci: row[9]
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

//let GLOBAL_ID='';









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
      res.redirect("/Patient-signup");
    });

})
app.get("/Patient-signup", (req, res) => {
  console.log('AT Patient-signup GET:', GLOBAL_ID);
  res.sendFile(__dirname + "/Patient-signup.html");
})

app.get("/edit", async (req, res) => {
  const patientId = fs.readFileSync('logindata.txt', 'utf8');
  //console.log(patientId);
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
        and p.patient_id='${patientId}'`);

      console.log('At edit get:', result.rows);
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
      //console.log('CHeck: ',jsonData[0].Patient_Name);
      //res.render('edit',{data:patientId});
      res.render('edit', { data: jsonData, username: patientId }); // Corrected: data should be result.rows
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

  await fetchDataCustomer();


})
app.post("/edit", enc, (req, res) => {
  const patientId = fs.readFileSync('logindata.txt', 'utf8');
  console.log("Edit pid:", patientId);
  async function fetchDataCustomer(id, name, email, phone, password1, house, road, city, district, dob) {
    try {
      const connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
        connectString: 'localhost/xepdb1'
      });

      const result = await connection.execute(
        `BEGIN
      
                 UPDATE patient
                  SET patient_name = :name,
                      patient_email = :email,
                      patient_address = addr(:road, :city, :house, :district),
                      patient_dob = to_date(:dob, 'dd-mm-yyyy')
                  WHERE patient_id = :new_login_id;


                  UPDATE login
                  SET password = :password1,
                      USER_TYPE = 'PATIENT'
                  WHERE login_id = :new_login_id;
                  

                  UPDATE phone
                  SET phone_no = :phone
                  WHERE user_id = :new_login_id;
                  
      
                 :message := 'Records updated successfully';
              END;`,
        {
          new_login_id: id,
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

  fetchDataCustomer(patientId, name, email, phone, password1, house, road, city, district, dob)
    .then(dbRes => {
      console.log(dbRes);
      //console.log('AT Updated post:', patientId);
      //res.redirect("/newlog");
      res.redirect('/profile');
    })
    .catch(err => {
      // res.redirect("/regi");
      console.log(err);
      res.redirect("/edit");
    });

})



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
      const result1 = await connection.execute(`SELECT p.Pharmacy_name,p.Pharmacy_address.city,p.Pharmacy_address.District,p.OVERALL_RATING,p.Pharmacy_id FROM Pharmacy p WHERE lower(p.Pharmacy_name) LIKE lower('%${query}%')`);
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
          pro_rating: row[3],
          Pro_id: row[4]


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
  console.log(items);
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
    const countQuery = `select count(unique bill_id) as "total_bills" from order_history
    where patient_id=:1
    group by patient_id`;

    const countRes = await connection.execute(countQuery, { 1: id }, { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT });
    console.log(countRes.rows);
    total_bills = countRes.rows[0].total_bills;

    const countProRes = await connection.execute(`select bill_id,count( product_id) as "total_product" from order_history
    where patient_id=:1
    group by bill_id,patient_id
    order by bill_id`, { 1: id }, { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT });

    // console.log(countProRes.rows);
    proTotal = countProRes.rows;



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
        existItem.subtotal += current.QUANTITY * current.PRODUCT_PRICE;
        existItem.vat = existItem.subtotal * 0.15;
        existItem.discount = existItem.subtotal * 0.05;

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
          PRODUCT: [pr],
          subtotal: current.QUANTITY * current.PRODUCT_PRICE,
          discount: current.QUANTITY * current.PRODUCT_PRICE * 0.05,
          vat: current.QUANTITY * current.PRODUCT_PRICE * 0.15,
          shipping: 20
        });
        // result.PRODUCT.push(pr);
      }
      // result.discount=result.subtotal*0.05;
      // result.shipping=20;
      // result.vat=result.subtotal*0.15;

      // result.discount=result.subtotal*0.05;
      return result;
    }, []);
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

  res.render("order-history", { orderArray, total_bills, proTotal });
})


app.post('/feedback', enc, async (req, res) => {
  try {
    // Extract form data
    const feedback = req.body.feedback;
    const username = fs.readFileSync('logindata.txt', 'utf8');
    console.log("At feedback: ", feedback);

    // Establish a connection to the Oracle database
    const connection = await oracledb.getConnection({
      user: "pharmacy_admin",
      password: "12345",
      connectionString: "localhost/xepdb1"
    });

    // Prepare and execute the SQL statement
    const sql = `insert into feedback(user_id,details) values(:username,:feedback)`;
    const binds = {
      username: username,
      feedback: feedback,
    };
    const result = await connection.execute(sql, binds);

    // Release the connection
    await connection.commit();
    await connection.close();
    res.redirect('/Main2');

    // Send a response back to the client
    //res.send('Data stored successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred.');
  }
});

app.get('/pharmacy', async (req, res) => {
  let k = req.query.pha_id;
  let connection;
  //const username = req.query.username;
  const username = fs.readFileSync('logindata.txt', 'utf8');
  async function fetchDataCustomer() {
    try {
      connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
        connectString: 'localhost/xepdb1'
      });

      const result = await connection.execute(`select p.pharmacy_id,p.pharmacy_name,p.pharmacy_email,p.pharmacy_address.City,
        p.pharmacy_address.house_no,p.pharmacy_address.road_no,p.overall_rating
        from pharmacy p 
         where pharmacy_id='${k}'`);

      console.log('at pharmAcy:', result.rows);
      const jsonData = result.rows.map(row => {
        return {
          pharma_id: row[0],
          pharma_Name: row[1],
          pharma_Email: row[2],
          Road: row[5],
          City: row[3],
          House: row[4],
          District: row[6],
          rating: row[7],


        };
      });
      const result2 = await connection.execute(`select p.pharmacy_id,p.pharmacy_name,pro.product_name,pro.product_type,pro.product_price
        from pharmacy p , stores s,product pro
        where p.pharmacy_id= s.pharmacy_id
        and s.product_id =pro.product_id
        and p.pharmacy_id='${k}'`)
      const jsonData2 = result2.rows.map(row => {
        return {

          pro_Name: row[2],
          pro_type: row[3],
          pro_price: row[4]


        };
      });
      const result3 = await connection.execute(`SELECT d.Doctor_id, d.Doctor_Name, d.Doctor_Email, d.doctor_qualification, d.doctor_hospital,
        h.Consult_day, to_char(s.start_time, 'HH24:MI:SS'), to_char(s.end_time, 'HH24:MI:SS'), s.shift,d.specialization
        FROM doctor d
        JOIN has h ON d.doctor_id = h.doctor_id
        JOIN schedule s ON h.schedule_id = s.schedule_id
        JOIN pharmacy p ON h.doctor_id=p.doctor_id 
        Where p.pharmacy_id='${k}'`)
      const jsonData3 = result3.rows.map(row => {
        return {
          Doc_id: row[0],
          Doc_Name: row[1],
          Doc_email: row[2],
          Doc_qua: row[3],
          Doc_con: row[5],
          Doc_start: row[6],
          Doc_shift: row[8],
          Doc_speci: row[9]


        };
      });
      const result4 = await connection.execute(`select p.patient_name,f.details
        from feedback_pharma f,patient p
        where f.patient_id=p.patient_id
        and f.pharmacy_id='${k}'`)
      const jsonData4 = result4.rows.map(row => {
        return {

          pat_Name: row[0],
          pat_details: row[1]


        };
      });

      console.log('CHeck: ', jsonData3);
      res.render("pharmacy", { data: jsonData, data2: jsonData2, data3: jsonData3, data4: jsonData4, username: username }); // Corrected: data should be result.rows
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

  await fetchDataCustomer();

});
app.post('/feedback_pharma', enc, async (req, res) => {
  try {
    // Extract form data
    const pharma = req.body.pharmacy_id;
    const feedback = req.body.feedback;
    const username = fs.readFileSync('logindata.txt', 'utf8');
    console.log("At feedback_pharmacy: ", feedback);
    console.log("At feedback_pharmacy", pharma);

    // Establish a connection to the Oracle database
    const connection = await oracledb.getConnection({
      user: "pharmacy_admin",
      password: "12345",
      connectionString: "localhost/xepdb1"
    });

    // Prepare and execute the SQL statement
    const sql = `INSERT INTO feedback_pharma (pharmacy_id, patient_id, details) values(:pharma,:username,:feedback)`;
    const binds = {
      pharma: pharma,
      username: username,
      feedback: feedback,
    };
    const result = await connection.execute(sql, binds);
    console.log()
    // Release the connection
    await connection.commit();
    await connection.close();
    res.redirect(`/pharmacy?pha_id=${pharma}`);

    // Send a response back to the client
    //res.send('Data stored successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred.');
  }
});

/*   employee start  */

app.get("/employee", (req, res) => {
  res.sendFile(__dirname + "/employee.html");
})



app.get('/search_product_emp', enc, async (req, res) => {
  const query = req.query.query;
  const patientId = fs.readFileSync('logindata.txt', 'utf8');
  let connection;
  async function fetchDataCustomer(query) {
    try {
      connection = await oracledb.getConnection({
        user: 'pharmacy_admin',
        password: '12345',
        connectString: 'localhost/xepdb1'
      });
      const result = await connection.execute(`select product_id, product_name,pharmacy_id,pharmacy_name,product_price,store_quantity from  employee natural join pharmacy  natural join stores natural join product 
      WHERE lower(product_name) LIKE lower('%${query}%') and employee_id='${patientId}'`);

      //search hocche product name diye
      const result3 = await connection.execute(`select count(product_name)
      from  employee natural join pharmacy  natural join stores natural join product 
      WHERE lower(product_name) LIKE lower('%${query}%') and employee_id='${patientId}' group by product_name
      `);

      //search hocche product name diye
      const result1 = await connection.execute(`select doctor_name,specialization,doctor_hospital,to_char(start_time,'hh24:mi:ss') "start_time",to_char(end_time,'hh24:mi:ss') "end_time",doctor_qualification
      from  employee natural join pharmacy
      natural join doctor natural join has natural join schedule
      WHERE lower(specialization) LIKE lower('%${query}%') and employee_id='${patientId}'`);
      //query te employee_id login theke nis
      //search hocche specialization diye
      const result4 = await connection.execute(`select Doctor_name,patient_name,specialization,serial
      from  employee natural join pharmacy   NATURAL join doctor NATURAL join consults natural join patient
      where employee_id='${patientId}'`);
      const result5 = await connection.execute(`select patient_name,product_name,product_price,quantity,order_date,bill_price,bill_status,bill_id
      from employee NATURAL join pharmacy NATURAL JOIN order_history 
      NATURAL join bill NATURAL join product NATURAL join patient_view
      where employee.employee_id='${patientId}'`);

      console.log(result.rows);
      console.log(result1.rows);
      const jsonData = result.rows.map(row => {
        return {
          Pro_ID: row[0],
          Pro_name: row[1],
          Ph_ID: row[2],
          pharmacy: row[3],
          Pro_price: row[4],
          qua: row[5]

        };
      });
      const jsonData3 = result3.rows.map(row => {
        return {
          count: row[0]

        };
      });
      const jsonData1 = result1.rows.map(row => {
        return {
          Doc_Name: row[0],
          Specialization: row[1],
          Doc_hospital: row[2],
          Start_time: row[3],
          End_time: row[4],
          qua: row[5]
        };
      });
      const jsonData4 = result4.rows.map(row => {
        return {
          Doc_name: row[0],
          Pat_name: row[1],
          spec: row[2],
          serial: row[3]
        };
      });
      const jsonData5 = result5.rows.map(row => {
        return {
          pat_name: row[0],
          pro_order: row[4],
          bill: row[5],
          bill_stat: row[6],
          bill_id: row[7]

        };
      });
      console.log(jsonData5);
      //console.log(jsonData1);
      if (jsonData.length > 0) {
        res.render('employee_search_product', { query, data: jsonData, data3: jsonData3 });
        return result.rows;
      }
      else if (jsonData1.length > 0) {
        res.render('employee_search_doctor', { query, data: jsonData1 });
        return result1.rows;
      }
      else if (query == 'appointment') {
        res.render('show_appoint', { query, data: jsonData4 });
        return result4.rows;
      }
      else if (query == 'bill') {
        res.render('bill_status_employee', { query, data: jsonData5 });
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






app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);
});




