const { Connection, Request } = require('tedious');

// Create connection to database

const config = {
  authentication: {
    options: {
      userName: '',
      password: ''
    },
    type: 'default'
  },
  server: 'sql-am-eastus-prod-sbx.database.windows.net',
  options: {
    database: 'DB_sb13',
    encrypt: true
  }
};

const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
  if (err) {
    console.log('-----------------------got erorr while connecting to SQL db ............................................')
    console.error(err.message);
  } else {
    queryDatabase();
  }
  connection.close();
});


function queryDatabase() {
  console.log("Reading rows from the Table...................................................");

  // Read all rows from table
  const request = new Request(
    `SELECT * from dbo.dbx_test`,
    (err, rowCount) => {
      if (err) {
        console.log('-----------------Error reading database table-------------------------------')
        console.log(err)
        console.error(err.message);
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );

  request.on("row", columns => {
    columns.forEach(column => {
      console.log("%s\t%s", column.metadata.colName, column.value);
    });
  });

  connection.execSql(request);
}

connection.connect();
