var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();
var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();

router.post("/addResetPassword", async (req, res, next) => {
  try {
    // console.log("passwordreset", req.body);
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("user", sql.VarChar(sql.Max), req.body.user)
      .input("UserID", sql.VarChar(sql.Max), req.body.UserName)
      // .input("CreatedUserID", sql.VarChar(sql.Max), req.body.CreatedUserID)
      .execute(`tbl_User_PasswordReset_Update`);
    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/getallPasswordDetails", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await // .input("Password", sql.VarChar, req.query.Password)
    // .input("UserName", sql.VarChar, req.query.UserName)
    pool.request().query(`SELECT UserName
                  FROM tbl_User 
                  WHERE Active = 1  `);

    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

//all group details
router.post("/getcurrentpassword", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query(`SELECT Password
      FROM tbl_User 
      WHERE UserName = '${req.body.UserName}'`);
    // .query(`SELECT * FROM tblRef_User_Group order by GroupCode desc`);
    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports = router;
