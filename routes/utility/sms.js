var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();
const request = require("request");
const log = require('log-to-file');

router.get("/api/sms-list", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().execute(`SMSListSSP`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.post("/api/sms", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("SMSID", sql.Int, req.body.SMSID)
      .input("SMS", sql.NVarChar(sql.Max), req.body.SMS)
      .execute(`SMSMSP`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/sms", async (req, res, next) => {
  try {
    console.log("SMSID", req.query.SMSID);
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("SMSID", sql.Int, req.query.SMSID)
      .query(`SELECT * FROM [SMS] Where AutoID = @SMSID`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/sms-send", async (req, res, next) => {
  let pool = await sql.connect(config);
  let result = await pool
    .request()
    .input("AutoID", sql.Int, req.query.AutoID)
    .input("ModuleID", sql.Int, req.query.ModuleID)
    .input("Type", sql.Int, 2)
    .execute(`ModuleFieldValueSSP`);

  let list = await JSON.parse(result.recordset[0].FieldValue);

  let mailList = [];

  console.log("length", list.length);
  if (list.length > 0) {
    for (let i = 0; i < list.length; i++) {
      let Fields = await JSON.parse(result.recordset[0].FieldValue)[i];
      let Message = await JSON.parse(result.recordset[0].SMSMessage)[0];
      let Phone;

      console.log(Message.Message);

      if (Message) Message = Message.Message;
      else {
        res.json(await "Message not available");
        return;
      }

      if (Fields) Phone = Fields.PrimaryContact;
      else {
        res.json(await "Phone No not available");
        return;
      }

      for (var key of Object.keys(Fields)) {
        //console.log(key + " -> " + Fields[key]);
        Message = Message.replace("#@" + key + "#", Fields[key]);
      }

      console.log("list", list);
      console.log("Message", Message);
      mailList.push(
        request(
          `http://sms.textware.lk:5000/sms/send_sms.php?username=caschool&password=FU5YatE2vV&src=CA-NEWS&dst=${Phone}&msg=${Message}&dr=1`,

          async function (error, response, body) {
            if (!error && response.statusCode === 200) {
            } else {
            }
          }
        )
      );
    }

    Promise.all(mailList)
      .then((result) => {
        pool
          .request()
          .input("AutoID", sql.Int, req.query.AutoID)
          .input("ModuleID", sql.Int, req.query.ModuleID)
          .input("Type", sql.Int, 2)
          .execute(`ModuleEmailSMSUSP`);
        res.json("sent");
      })
      .catch((error) => {
        next(error);
      });
  }
  res.json("nothing to sent");

  //res.json(await "Done");
});

module.exports = router;
