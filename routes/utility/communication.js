var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();
const log = require('log-to-file');

router.get("/api/communication-lookup-list", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("SchoolID", sql.Int, req.query.SchoolID)
      .execute(`CommunicationLookupSSP`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

module.exports = router;
