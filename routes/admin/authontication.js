var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();

router.post("/api/addPermission", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("permission", sql.VarChar(sql.Max), req.body.permission)
      .input(
        "permissionHeader",
        sql.VarChar(sql.Max),
        req.body.permissionHeader
      )
      .input("UserID", sql.VarChar(sql.Max), req.body.UserID)
      .input("UsersID", sql.VarChar(sql.Max), req.body.UsersID)
      .execute(`tblRef_Permission_InsertUpdate`);
    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/api/checkUserNameforUpdate", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query(`SELECT UsersID
    FROM tblRef_User_Permission_Header
    WHERE UserName = ${req.query.UsersID}`);
    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/api/userPermission_Activity_Load", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .query(` SELECT Activity,MenuID, 0 AS UserView ,0 AS UserAdd ,0 AS UserEdit ,
            0 AS UserCancel,0 AS UserHold
            FROM tblRef_User_Permission_Activity  
            ORDER BY ID`);
    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/api/getUserPermissionDetails", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query(
        `SELECT * FROM [tblRef_User_Permission_Line] WHERE UsersID='${req.query.UsersID}' ORDER BY Indexes `
      );
    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/api/getallUserNameforPermission", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query(
      `SELECT UserName
        FROM tblRef_Users  
        WHERE Active = 1;`
    );
    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});
router.get("/api/getSelectedUserID", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query(
        `SELECT UsersID FROM tblRef_User_Permission_Header WHERE UserName='${req.query.UserName}'`
      );
    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

// router.get("/api/user-lookup", function (req, res, next) {
//   sql.connect(config, function (err) {
//     if (err) console.log(err);

//     let request = new sql.Request();

//     request.query(
//       "SELECT * FROM [dbo].[User]",

//       function (err, data) {
//         if (err) console.log(err);

//         console.log(data);

//         res.json({
//           status: true,
//           message: "Success",
//           data: data.recordset,
//         });

//         sql.close();
//       }
//     );
//   });
// });

router.get("/api/password-check", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("CurrentPassword", sql.VarChar, req.query.CurrentPassword)
      .input("UserID", sql.VarChar, req.query.UserID).query(`SELECT *
                FROM [dbo].[User]
                WHERE  convert( nvarchar (Max) ,DECRYPTBYPASSPHRASE('PBSS' ,[Password])) = @CurrentPassword AND Id = @UserID`);

    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.post("/api/password-check", async (req, res, next) => {
  try {
    console.log(req.body.NewPassword);
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("Password", sql.VarChar, req.body.NewPassword)
      .input("UserID", sql.VarChar, req.body.UserID)
      .execute(`UserPasswordRestMSP`);

    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/api/user-lookup", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query(`SELECT * FROM [User] ORDER BY Id DESC`);

    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/api/user-auth-tree", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query(
        `Select [MenuID], [ParentID], [RootParent], [Name], 2 as 'Auth', [Type]  From [UserAuthorizationTree]`
      );

    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/api/CheckUserAuthentication", async (req, res, next) => {
  try {
    console.log("UserGroup",req.query)
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query(
        `SELECT IsEdit FROM [tbl_User_Permisiion] WHERE UserGroup = '${req.query.UserGroup}' AND MenuID = '${req.query.MenuID}' `
      );

    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/api/authontication-login", async (req, res, next) => {
  try {
    console.log("req.query.email", req.query.GroupID);
    console.log("req.query.email", req.query.CurrentPassword);
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("UserName", sql.VarChar, req.query.GroupID)
      .input("Password", sql.VarChar, req.query.CurrentPassword)
      .execute(`[dbo].[UserAuthentication]`);

    console.log("req.query.email", await result.recordset);
    res.json(await result.recordset);
  } catch (e) {
    next(e);
  }
});

router.get("/api/user", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("UserID", sql.Int, parseInt(req.query.UserID))
      .execute(`UserSSP`);
    console.log(result.recordset);
    res.json(await result.recordset);
  } catch (e) {
    next(e);
  }
});

router.post("/api/user", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("UserID", sql.NVarChar, req.body.UserID)
      .input("User", sql.NVarChar, req.body.User)
      .input("School", sql.NVarChar(sql.Max), req.body.School)
      .input("Authorization", sql.NVarChar(sql.Max), req.body.Authorization)
      .input("AdminUserID", sql.Int, parseInt(req.body.AdminUserID))
      .execute(`UserMSP`);

    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.post("/api/user-group", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("GroupID", sql.Int, req.body.GroupID)
      .input("UserGroup", sql.NVarChar(sql.Max), req.body.UserGroup)
      .input("Authorization", sql.NVarChar(sql.Max), req.body.Authorization)
      .execute(`UserGroupMSP`);

    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/api/user-group-lookup", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("UserID", sql.Int, req.body.UserID)
      .execute(`UserGroupListSSP`);

    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/api/user-group-exist", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("AutoID", sql.Int, parseInt(req.query.AutoID))
      .input("Code", sql.NVarChar(sql.Max), req.query.Code)
      .input("Name", sql.NVarChar(sql.Max), req.query.Name)
      .query(`If @AutoID = 0 SELECT IIF (EXISTS (SELECT 1 FROM UserGroup 
                Where ([GroupCode] = @Code Or [GroupName] = @Name)), 1, 0) 'Exist'
              Else SELECT IIF (EXISTS (SELECT 1 FROM UserGroup 
                WHERE AutoID <> @AutoID And ([GroupCode] = @Code Or [GroupName] = @Name)), 1, 0) 'Exist'`);

    res.json(await result.recordset);
  } catch (e) {
    ErrorLog(req, e);
    next(e);
  }
});

router.get("/api/user-group", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("GroupID", sql.Int, req.query.GroupID)
      .execute(`UserGroupSSP`);

    console.log(await result.recordset);

    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

// router.post("/api/user", function (req, res, next) {
//   try {
//     sql.connect(config, function (err) {
//       if (err) console.log(err);

//       let request = new sql.Request();

//       request.input("userId", sql.NVarChar, req.body.userId);
//       request.input("user", sql.NVarChar, req.body.user);
//       request.input("school", sql.NVarChar(sql.Max), req.body.school);
//       request.input(
//         "authorization",
//         sql.NVarChar(sql.Max),
//         req.body.authorization
//       );

//       console.log(req.body.user);

//       request.execute(`UserMSP`, function (err, data) {
//         if (err) console.log(err);

//         // console.log(data.recordset);
//         res.json(data.recordset);
//         sql.close();
//       });
//     });
//   } catch {
//     console.log("error");
//     next(e);
//   }
// });

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
module.exports = router;
