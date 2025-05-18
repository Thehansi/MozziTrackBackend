var mssql = require("mssql");

var config = {
  user: "sa",
  password: "Admin@1234",
  server: "DESKTOP-6IMPDAO",
  database: "MozziTrack",
  port: 1433,
  options: {
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};

// module.exports = config;
// var config = {
//   user: "sa",
//   password: "Admin@1234",
//   server: "DESKTOP-OMNJ060", // or "DESKTOP-OMNJ060\\SQLEXPRESS"
//   database: "MozziTrack",
//   port: 1433, // Optional if you're using a named instance or custom port
//   options: {
//     enableArithAbort: true,
//     trustServerCertificate: true,
//   },
//   connectionTimeout: 30000, // 30 seconds
//   requestTimeout: 30000,
// };

// var config = new mssql.ConnectionPool({
//   user: "sa",
//   password: "Admin@1234",
//   server: "DESKTOP-OMNJ060",
//   database: "MozziTrack",
//   port: 1433,
//   pool: {
//     idleTimeoutMillis: 60000,
//   },
//   requestTimeout: 60000,
//   options: {
//     encrypt: true,
//   },
// });

module.exports = config;
