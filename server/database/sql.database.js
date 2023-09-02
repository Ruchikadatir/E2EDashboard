const sql = require("mssql");
// const { main } = require('./keyVault.database.js');

async function test() {
  try {
    // const [username, password] = await main();
    const sqlConfig = {
      user: "sql_sb13",
      password: "P@jN5yfhc3",
      database: "DB_sb13",
      server: "sql-am-eastus-prod-sbx.database.windows.net",
      requestTimeout: 999999998,
      pool: {
        max: 20,
        min: 0,
        idleTimeoutMillis: 999999997,
      },
      options: {
        encrypt: true, // for azure
        trustServerCertificate: false, // change to true for local dev / self-signed certs
      },
    };
    // console.log(sqlConfig)
    await sql.connect(sqlConfig);
    // const request = new sql.Request();
    // recordsets = await request.input('majorcategory', sql.VarChar, null).input('category', sql.VarChar, null).execute('get_E2E_Inventory_by_Node');
    // console.log('records: ', recordsets[0])
    // return recordsets[0]
    // const result = await sql.query`select * from dbo.dbx_test`
    // console.dir(result)
  } catch (err) {
    console.log(err);
  }
}

test();
