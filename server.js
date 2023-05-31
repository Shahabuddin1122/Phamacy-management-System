
const express = require('express');
const oracledb = require('oracledb');
const app = express();
const PORT = 8000;
outFormat : oracledb.OUT_FORMAT_OBJECT;

app.get('/',(req,res)=>{
    res.send('Hello Shahabuddin!!');
})
app.get('/EMPLOYEE_TABLE', (req,res)=>{
    async function fetchDataCustomers(){
        try {
            const connection = await oracledb.getConnection({
                user      : 'SHAHABUDDIN',
                password       : '123456',
                connectString   : 'localhost/xe'
            });
            
            const result = await connection.execute(`SELECT EMPLOYEE_ID AS "ID" FROM EMPLOYEE_TABLE `);

            return result;
        } catch (error) {
            return error;
        }
    }
    fetchDataCustomers()
    .then(dbRes =>{
        res.send(dbRes);
        console.log(dbRes);
        
    })
    .catch(err=>{
        res.send(err)
    })
})
app.listen(PORT,
    () => {
        console.log(`listen to port ${PORT}`);
    })




//const oracledb = require('oracledb')
//async function abc()
//{

//let conn =await oracledb.getConnection (
//    {
//        user      : 'SHAHABUDDIN',
//        password       : '123456',
//        connectString   : 'localhost/xe'
//    }
//)
//console.log('success');
//let x= 100;
//result = await conn.execute (`SELECT * from EMPLOYEE_TABLE Where EMPLOYEE_ID= ${x}`,[],{
//    resultSet : true ,
    //outFormat : oracledb.OUT_FORMAT_OBJECT

    
//})

//let rs = result.resultSet;
//let row;
//while( (row = await rs.getRow()) )
//{
//    console.log(`Hi ${row}`);
//}

//}

//abc()