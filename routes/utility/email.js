var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();
var nodeoutlook = require("nodejs-nodemailer-outlook");
const log = require('log-to-file');

router.get("/api/email-list", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().execute(`EmailListSSP`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.post("/api/email", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmailID", sql.Int, req.body.EmailID)
      .input("Email", sql.NVarChar(sql.Max), req.body.Email)
      .execute(`EmailMSP`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/email", async (req, res, next) => {
  try {
    console.log("EmailID", req.query.EmailID);
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmailID", sql.Int, req.query.EmailID)
      .query(`SELECT * FROM [Email] Where AutoID = @EmailID`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.post("/api/email-sms-update-document", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("AutoID", sql.Int, req.body.AutoID)
      .input("ModuleID", sql.Int, req.body.ModuleID)
      .input("Type", sql.Int, req.body.Type)
      .execute(`ModuleEmailSMSUSP`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/email-send", async (req, res, next) => {
  let pool = await sql.connect(config);
  let result = await pool
    .request()
    .input("AutoID", sql.Int, req.query.AutoID)
    .input("ModuleID", sql.Int, req.query.ModuleID)
    .input("Type", sql.Int, 1)
    .execute(`ModuleFieldValueSSP`);
  let list = await JSON.parse(result.recordset[0].FieldValue);

  let mailList = [];

  if (list.length > 0) {
    for (let i = 0; i < list.length; i++) {
      let Fields = await JSON.parse(result.recordset[0].FieldValue)[i];
      let Message = await JSON.parse(result.recordset[0].EmailMessage)[0];

      let Subject;
      let Email;

      if (Message) {
        Subject = Message.Subject;
        Message = Message.Message;
      } else {
        res.json(await "Message not available");
        return;
      }

      if (Fields) Email = Fields.PrimaryEmail;
      else {
        res.json(await "Email No not available");
        return;
      }

      for (var key of Object.keys(Fields)) {
        Message = Message.replace("#@" + key + "#", Fields[key]);
      }

      mailList.push(
        nodeoutlook.sendEmail({
          auth: {
            user: "noreply@casrilanka.org",
            pass: "Tur70576",
          },
          from: "noreply@casrilanka.org",
          to: Email,
          subject: Subject,
          html: Message,
          text: "IMS Auto Email",
          //replyTo: "email@gmail.com",
          onError: (e) => {
            ErrorLog(req, e);
          },
          onSuccess: async (i) => {
            console.log(i);
          },
        })
      );
    }

    Promise.all(mailList)
      .then((result) => {
        pool
          .request()
          .input("AutoID", sql.Int, req.query.AutoID)
          .input("ModuleID", sql.Int, req.query.ModuleID)
          .input("Type", sql.Int, 1)
          .execute(`ModuleEmailSMSUSP`);
        res.json("sent");
      })
      .catch((error) => {
        console.log(error);

        next(error);
      });
  }

  res.json("sent");
});

module.exports = router;
