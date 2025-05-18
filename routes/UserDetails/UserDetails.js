var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();

router.get("/getUserDetails", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("userName", sql.NVarChar(sql.Max), req.query.userName)
      .query(
        `SELECT FormID,ImpotentType,CusIdentificationNo,FillDate,HouseOwnerName,Question13,followUpDate FROM [tbl_Dengue_Header] WHERE CusIdentificationNo = @userName `
      );

    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports = router;
