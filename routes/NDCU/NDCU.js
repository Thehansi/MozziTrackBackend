var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();

router.get("/getRelatedPHI", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query(
        `SELECT UserName FROM [tbl_User] WHERE DiviSector =${req.query.DivisionalSecreter} AND UserGroup ='2'`
      );

    console.log("result", result.recordset);
    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/getPhiDetails", async (req, res, next) => {
  try {
    console.log("phi", req.query.id);
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("ID", sql.NVarChar(sql.Max), req.query.id)
      .query(
        `SELECT FormID ,CusIdentificationNo,HouseOwnerName,ImpotentType,FillDate,Question13,followUpDate,ApprovalStatus FROM [tbl_Dengue_Header] WHERE PhiID = @ID`
      );

    console.log("result", result.recordset);
    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.post("/addNDCU", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("FormID", sql.NVarChar(sql.Max), req.query.FormID)
      .input("ApprovalStatus", sql.NVarChar(sql.Max), req.query.ApprovalStatus)
      .query(
        `UPDATE [tbl_Dengue_Header] SET [ApprovalStatus] =@ApprovalStatus WHERE FormID = @FormID`
      );

    console.log("result", result.recordset);
    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports = router;
