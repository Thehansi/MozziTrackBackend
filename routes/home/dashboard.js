var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();

router.get("/api/dashboard-info", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("UserID", sql.Int, parseInt(req.query.UserID))
      .execute(`DashboardSSP`);

    res.json(await result.recordset);
    console.log(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports = router;
