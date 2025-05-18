var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();
const log = require("log-to-file");

router.get("/api/number-series-exist", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("AutoID", sql.Int, parseInt(req.query.AutoID))
      .input("SchoolID", sql.Int, parseInt(req.query.SchoolID))
      .input("Name", sql.NVarChar(sql.Max), req.query.Name)
      .query(`If @AutoID = 0 SELECT IIF (EXISTS (SELECT 1 FROM NumberSeries 
                Where [SchoolID] = @SchoolID And [Name] = @Name), 1, 0) 'Exist'
              Else SELECT IIF (EXISTS (SELECT 1 FROM NumberSeries 
                WHERE AutoID <> @AutoID And [SchoolID] = @SchoolID And [Name] = @Name), 1, 0) 'Exist'`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/number-series-sequence-exist", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("AutoID", sql.Int, parseInt(req.query.AutoID))
      .input("SchoolID", sql.Int, parseInt(req.query.SchoolID))
      .input("DocumentID", sql.Int, req.query.DocumentID)
      .input("Prefix", sql.NVarChar(50), req.query.Prefix)
      .query(`If @AutoID = 0 SELECT IIF (EXISTS (SELECT 1 FROM NumberSeries 
                Where [SchoolID] = @SchoolID And [Prefix] = @Prefix And [DocumentID] = @DocumentID), 1, 0) 'Exist'
              Else SELECT IIF (EXISTS (SELECT 1 FROM NumberSeries 
                WHERE AutoID <> @AutoID And [SchoolID] = @SchoolID And [Prefix] = @Prefix And [DocumentID] = @DocumentID), 1, 0) 'Exist'`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.post("/api/number-series", async (req, res, next) => {
  try {
    console.log("NumberSeriesID", req.body);
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("NumberSeriesID", sql.Int, req.body.NumberSeriesID)
      .input("NumberSeries", sql.NVarChar(sql.Max), req.body.NumberSeries)
      .execute(`NumberSeriesMSP`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/number-series", async (req, res, next) => {
  try {
    console.log("NumberSeriesID", req.query);
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("NumberSeriesID", sql.Int, req.query.NumberSeriesID)
      .execute(`NumberSeriesSSP`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get(
  "/api/number-series-lookup-by-course-without-intake",
  async (req, res, next) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("SchoolID", sql.Int, parseInt(req.query.SchoolID))
        .input("CourseID", sql.Int, parseInt(req.query.CourseID))
        .input("IntakeID", sql.Int, parseInt(req.query.IntakeID))
        .input("ModuleID", sql.Int, parseInt(req.query.ModuleID))
        .query(`Select -1 as AutoID, 'Manual' [Name]
              Union All
              Select AutoID, [Name]
              From NumberSeries
              Where SchoolID = @SchoolID And CourseID = @CourseID And DocumentID = @ModuleID`);

      res.json(await result.recordset);
    } catch (e) {
      ErrorLog(req, e);
      next(e);
    }
  }
);

router.get("/api/number-series-application-lookup", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("SchoolID", sql.Int, parseInt(req.query.SchoolID))
      .input("CourseID", sql.Int, parseInt(req.query.CourseID))
      .input("IntakeID", sql.Int, parseInt(req.query.IntakeID))
      .query(`Select AutoID, [Name]
              From NumberSeries
              Where SchoolID = @SchoolID And IntakeID = @IntakeID And CourseID = @CourseID And DocumentID = 3002`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/number-series-application", async (req, res, next) => {
  try {
    console.log("NumberSeriesID", req.query);
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("RegSetupID", sql.Int, req.query.RegSetupID)
      .query(`Select concat(isnull(N.[Prefix],''), right( POWER(10, N.[Length]) + N.[Number] + 1 , N.[Length]), 
                    isnull(N.[Suffix],'')) [Series] 
              From RegistrationSetup R
              Inner Join NumberSeries N On R.AppSeriesID = N.AutoID
              Where R.AutoID = @RegSetupID`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/number-series-registration", async (req, res, next) => {
  try {
    console.log("NumberSeriesID", req.query);
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("BatchID", sql.Int, req.query.BatchID)
      .query(`Select B.RegSeriesID, concat(isnull(N.[Prefix],''), right( POWER(10, N.[Length]) + N.[Number] + 1 , N.[Length]), 
                    isnull(N.[Suffix],'')) [Series] 
              From Batch B
              Inner Join NumberSeries N On B.RegSeriesID = N.AutoID
              Where B.AutoID = @BatchID`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/number-series-list", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("UserID", sql.Int, req.query.UserID)
      .execute(`NumberSeriesListSSP`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/number-series-lookup", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("SchoolID", sql.Int, parseInt(req.query.SchoolID))
      .input("CourseID", sql.Int, parseInt(req.query.CourseID))
      .input("IntakeID", sql.Int, parseInt(req.query.IntakeID))
      .input("ModuleID", sql.Int, parseInt(req.query.ModuleID))
      .query(`Select -1 as AutoID, 'Manual' [Name]
              Union All
              Select AutoID, [Name]
              From NumberSeries
              Where SchoolID = @SchoolID And IntakeID = @IntakeID And CourseID = @CourseID And DocumentID = @ModuleID`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/number-series-lookup-by-course", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("CourseID", sql.Int, req.query.CourseID)
      .query(
        `Select [AutoID], [Name] From NumberSeries Where CourseID = @CourseID`
      );

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/number-series-lookup-by-school", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("SchoolID", sql.Int, req.query.SchoolID)
      .query(
        `Select [AutoID], [Name] From NumberSeries Where SchoolID = @SchoolID`
      );

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/number-series-genarate-number", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("SchoolID", sql.Int, req.query.SchoolID)
      .input("CourceID", sql.Int, req.query.CourceID)
      .execute(`NumberSeriesGSP`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/number-series-next-number", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("SeriesID", sql.Int, req.query.SeriesID)
      .execute(`NumberSeriesNSP`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/number-series-lookup-by-module", async (req, res, next) => {
  try {
    console.log("req.query.DocumentID", req.query.DocumentID);
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("DocumentID", sql.Int, req.query.DocumentID)
      .query(
        `SELECT TOP 1 CONCAT (
          isnull([Prefix], '')
          ,right(POWER(10, [Length]) + [Number] + 1, [Length])
          ,isnull([Suffix], '')
          ) [Series]
      FROM tblRef_NumberSeries
      WHERE DocumentID = @DocumentID`
      );

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

module.exports = router;
