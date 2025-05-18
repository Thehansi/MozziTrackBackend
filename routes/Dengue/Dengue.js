var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();
const app = express();
const path = require("path");

router.post("/addDengueForm", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("jFeedback", sql.VarChar(sql.Max), req.body.Feedback)
      .input(
        "FeedbackAConcerns",
        sql.VarChar(sql.Max),
        req.body.FeedbackAConcerns
      )
      .input(
        "ApplicationAttachment",
        sql.VarChar(sql.Max),
        req.body.ApplicationAttachment
      )
      .execute(`SP_Dengue_InsertUpdate`);
    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/getPRTypes", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query(
      `SELECT PRTypeCode , Discription 
        FROM tblRef_PR_Type `
    );

    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/getAllFormData", async (req, res, next) => {
  try {
    console.log("getAllFormData", req.query);
    let pool = await sql.connect(config);
    let result = await pool.request().query(
      `SELECT * FROM
        tbl_Dengue_Header WHERE PhiID = '${req.query.PhiID}'`
    );

    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/getHeadrerDetails", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query(
      `SELECT * FROM
        tbl_Dengue_Header WHERE FormID ='${req.query.FormID}' `
    );

    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/getConserns", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query(
      `SELECT * 
        FROM tbl_Dengue_AddConcerns WHERE FormID ='${req.query.FormID}'  `
    );

    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/getAttachment", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query(
      `SELECT * 
        FROM tbl_Dengue_Attachment WHERE FormID ='${req.query.FormID}' `
    );

    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/gePHIDetails", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query(
        `SELECT UserName As Name , Province ,District,DiviSector FROM tbl_User WHERE UserGroup ='2' AND UserName = '${req.query.UserName}'`
      );

    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.post("/api/upload/attachment", function (req, res, next) {
  try {
    const file = req.files.file;
    let folder = path.join(__dirname, `../../uploads/${req.query.Folder}/`);
    console.log(folder);
    file.mv(folder + req.query.FileName, function (err, result) {
      console.error(err);
      console.log(result);
      if (err) {
        console.error(err);
      }
      res.send({
        success: true,
        message: "File uploaded!",
        filePath: folder + req.query.FileName,
      });
    });
  } catch (error) {
    console.error(error);
  }
});

// router.get("/viewFile", async (req, res, next) => {
//   try {
//     if (req.query.FilePath !== undefined) {
//       let path = req.query.FilePath;
//       // let path = result.recordset[0].Path.replace(/\\/g, "\\\\");
//       res.download(path);
//     } else {
//       res.download(__dirname + "/Default.pdf");
//     }
//   } catch (e) {
//     console.log(e);
//     next(e);
//   }
//   // try {
//   //   let FilePath = path.join(__dirname, "../../uploads/PR", req.query.FileName);
//   //   console.log("__dirname", __dirname);
//   //   console.log("filePath", FilePath);
//   //   res.download(FilePath);
//   //   //res.sendFile(file);
//   // } catch (error) {
//   //   ErrorLog(req, e);
//   // }
//   // try {
//   //   const port = 8000;
//   //   const fileURL = `http://localhost:${port}/files/${req.query.FileName}`;
//   //   console.log("File URL:", fileURL);
//   //   res.json({ fileURL });
//   // } catch (e) {
//   //   console.log(e);
//   //   next(e);
//   // }
// });
/*
router.delete("/deleteRow", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query(
      ` DELETE FROM [tblTrans_Purchase_Requisition_Items]
        WHERE PRHeaderID='${req.query.PRHeaderID}' AND ItemCode ='${req.query.ItemCode}'`
    );
    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});*/

module.exports = router;
