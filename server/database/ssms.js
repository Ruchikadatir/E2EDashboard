// var sql = require('mssql');
// const config = {
//     server: 'sql-am-eastus-prod-sbx.database.windows.net',
//     database: 'DB_sb13',
//     user: 'sql_sb13',
//     password: 'P@jN5yfhc3',
//     port: 1433
// }

// function executeStoredProc() {
//     //2. 
//     var dbConn = new sql.connect(config);
//     dbConn.connect().then(function () {
         
//         //3.
//         var request = new sql.Request(dbConn);
//         request.input('Salary', sql.Int, 50000)
//         .execute("GetAllEmployeesBySalary").then(function (recordSet) {
//             //4.
//             console.log(recordSet);
//             dbConn.close();
//         }).catch(function (err) {
//             //5.
//             console.log(err);
//             dbConn.close();
//         });
//     }).catch(function (err) {
//         //6.
//         console.log(err);
//     });
// }
// //7.
// executeStoredProc();