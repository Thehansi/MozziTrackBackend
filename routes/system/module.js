var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();
const log = require('log-to-file');

router.get("/api/module-main", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query(`Select * From ModuleMain`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/module-sub", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query(`Select * From ModuleSub`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/module-sub-communication", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query(`Select * From ModuleSub Where Communication = 1`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/module-sub-series", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query(
        `Select ModuleID as AutoID, [Name] From ModuleSub Where SeriesAvailable = 1 Order By [Name]`
      );

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/module-sub-audit-trial", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query(
        `Select ModuleID as AutoID, [Name] From ModuleSub Where AuditTrial = 1 Order By [Name]`
      );

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/module-field", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("ModuleID", sql.Int, parseInt(req.query.ModuleID))
      .execute(`ModuleFieldSSP`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/module-field-value", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("ModuleID", sql.Int, parseInt(req.query.ModuleID))
      .input("AutoID", sql.Int, parseInt(req.query.AutoID))
      .execute(`ModuleFieldValueSSP`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

module.exports = router;
