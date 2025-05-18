var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();
const log = require('log-to-file');

router.get("/api/layout-list", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().execute(`LayoutSSP`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/layout-list-by-module", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("SchoolID", sql.Int, req.query.SchoolID)
      .input("SubModule", sql.Int, req.query.SubModule)
      .query(
        `Select * From Layout Where [SchoolID] = @SchoolID And [SubModule] = @SubModule `
      );
        console.log("req.query.SchoolID", req.query.SchoolID)
        console.log("req.query.SubModule", req.query.SubModule)
    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/layout-list-by-module2", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("SubModule", sql.Int, req.query.SubModule)
      .query(`Select * From Layout Where [SubModule] = @SubModule `);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/layout-list-by-school", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("SchoolID", sql.Int, req.body.SchoolID)
      .query(`Select * From Layout Where [SchoolID] = @SchoolID`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.post("/api/layout", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("LayoutID", sql.Int, req.body.LayoutID)
      .input("LayoutName", sql.NVarChar(50), req.body.LayoutName)
      .input("Layout", sql.NVarChar(sql.Max), req.body.Layout)
      .input("UserID", sql.Int, parseInt(req.body.UserID))
      .execute(`LayoutMSP`);

    res.json(await result);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.delete("/api/layout/:id", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("AutoID", sql.Int, req.params.id)
      .query(`DELETE FROM [Layout] WHERE [AutoID] = @AutoID`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.delete("/api/report/:id", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("AutoID", sql.Int, req.params.id)
      .query(`DELETE FROM [ReportLayout] WHERE [AutoID] = @AutoID`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

module.exports = router;
