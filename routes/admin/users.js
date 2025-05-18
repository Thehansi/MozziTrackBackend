var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();
var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();

router.post("/addUser", async (req, res, next) => {
  try {
    console.log("user", config);

    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("user", sql.VarChar(sql.Max), req.body.group)
      .input("UserID", sql.VarChar(sql.Max), req.body.UserID)
      .execute(`SP_User_InsertUpdate`);
    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

//all group details
router.get("/getalluser", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query(`
      SELECT TOP (1000) [UserName]
      ,[UserGroup]
      ,[Province]
      ,[District]
      ,[Password]
      ,[DiviSector]
      ,[Email]
      ,[ContactNo]
      ,[Active]
  FROM [tbl_User]
  ORDER BY UserName desc`);
    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports = router;
