// var express = require("express");
// var config = require("../../config");
// var sql = require("mssql");
// var router = express.Router();
// const log = require("log-to-file");

// router.get("/api/report-list", async (req, res, next) => {
//   try {
//     let pool = await sql.connect(config);
//     let result = await pool
//       .request()
//       .input("UserID", sql.Int, req.query.UserID)
//       .execute(`ReportListSSP`);

//     res.json(await result.recordset);
//   } catch (e) {
//     ErrorLog(req, e);
//     next(e);
//   }
// });

// router.get("/api/report-setup-list", async (req, res, next) => {
//   try {
//     let pool = await sql.connect(config);
//     let result = await pool.request().input("UserID", sql.Int, req.query.UserID)
//       .query(`Select R.[AutoID], R.[SchoolID], R.[CategoryID], R.[FileName], R.[Name], R.[Description], R.[Status] 
//               From Report R 
//               Inner Join School S On R.[SchoolID] = S.AutoID
// 	            Where R.SchoolID In (Select Schoold From UserWiseSchool Where UserId = @UserID) `);

//     res.json(await result.recordset);
//   } catch (e) {
//     ErrorLog(req, e);
//     next(e);
//   }
// });

// router.get("/api/report-parameter-lookup", async (req, res, next) => {
//   try {
//     let pool = await sql.connect(config);
//     let result = await pool
//       .request()
//       .query(`Select AutoID,Parameter,IndexNo from [dbo].[ReportParameter]`);

//     res.json(await result.recordset);
//   } catch (e) {
//     ErrorLog(req, e);
//     next(e);
//   }
// });

// router.get("/api/report-layout-list", async (req, res, next) => {
//   try {
//     let pool = await sql.connect(config);
//     let result = await pool
//       .request()
//       .input("UserID", sql.Int, req.query.UserID)
//       .execute(`ReportLayoutSSP`);

//     res.json(await result.recordset);
//   } catch (e) {
//     ErrorLog(req, e);
//     next(e);
//   }
// });

// router.post("/api/report-layout", async (req, res, next) => {
//   try {
//     let pool = await sql.connect(config);
//     let result = await pool
//       .request()
//       .input("LayoutID", sql.Int, req.body.LayoutID)
//       .input("LayoutName", sql.NVarChar(50), req.body.LayoutName)
//       .input("Layout", sql.NVarChar(sql.Max), req.body.Layout)
//       .input("Parameter", sql.NVarChar(sql.Max), req.body.Parameter)
//       .input("UserID", sql.Int, parseInt(req.body.UserID))
//       .execute(`ReportLayoutMSP`);

//     res.json(await result);
//   } catch (e) {
//     ErrorLog(req, e);
//     next(e);
//   }
// });

// router.post("/api/report", async (req, res, next) => {
//   try {
//     let pool = await sql.connect(config);
//     let result = await pool
//       .request()
//       .input("ReportID", sql.Int, req.body.ReportID)
//       .input("ReportName", sql.NVarChar(50), req.body.ReportName)
//       .input("Report", sql.NVarChar(sql.Max), req.body.Report)
//       .execute(`ReportMSP`);

//     res.json(await result);
//   } catch (e) {
//     ErrorLog(req, e);
//     next(e);
//   }
// });

// router.get("/api/report-parameter-value", async (req, res, next) => {
//   try {
//     let Respones = [];

//     let pool = await sql.connect(config);
//     let QueryCount = pool
//       .request()
//       .input("ReportID", sql.Int, req.query.ReportID)
//       .query(`SELECT * FROM ReportParameter WHERE ReportID = @ReportID`);

//     let Param = await QueryCount;

//     for (let i = 0; i < Param.recordset.length; i++) {
//       let result = await pool
//         .request()
//         .input("ReportID", sql.Int, Param.recordset[i].AutoID)
//         .execute(`ReportParameterExecSSP`);

//       Respones.push(await result.recordset);
//     }

//     res.json(await Respones);
//   } catch (e) {
//     ErrorLog(req, e);
//     next(e);
//   }
// });

// router.delete("/api/report/:id", async (req, res, next) => {
//   try {
//     let pool = await sql.connect(config);
//     let result = await pool
//       .request()
//       .input("AutoID", sql.Int, req.params.id)
//       .query(`DELETE FROM [Report] WHERE [AutoID] = @AutoID`);

//     res.json(await result.recordset);
//   } catch (e) {
//     ErrorLog(req, e);
//     next(e);
//   }
// });

// module.exports = router;
