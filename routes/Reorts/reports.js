var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();

router.get("/UserPMWise", async (req, res, next) => {
  try {
    console.log("bin", req.query.currencyCode);
    let pool = await sql.connect(config); //  H.ApproveStatus,
    let result = await pool.request().query(` WITH RankedPRs AS (
      SELECT 
          H.PRNumber, 
          H.ItemCategory, 
          H.CreatedDate,
          H.ValidFrom, 
          H.ValidTo, 
          H.EnterDate, 
          H.EnterUser,     
          H.ApproveDate, 
          H.ApproveUser,
          H.RequestorName, 
          H.RequestorsDepartment, 
          H.RequestorsBranch,
          H.ProcurementOfficer, 
          L.ItemCode,
          L.Quantity, 
          L.UnitPrice,
          H.PRHeaderID,
          ROW_NUMBER() OVER (PARTITION BY H.PRHeaderID ORDER BY L.PRHeaderID) AS RowNum
      FROM 
          [tblTrans_Purchase_Requisition_Header] AS H
      INNER JOIN 
          [tblTrans_Purchase_Requisition_Items] AS L
          ON H.PRHeaderID = L.PRHeaderID
      INNER JOIN 
          [dbo].[tblRef_Approval_Level_Mapping] AS A
          ON H.ApproveLevel = A.ApprovalLevel
      INNER JOIN 
          tblRef_User_Group AS UG
          ON A.UserGroup = UG.GroupCode
      INNER JOIN 
          tblRef_Users AS U
          ON UG.GroupCode = U.UserGroup
      WHERE 
          H.RequestorName = '${req.query.UserName}' 
          AND H.ProcurementOfficer = '${req.query.ProcurementOfficer}'
  )
  SELECT 
      PRNumber AS [PR Number] , 
      ItemCategory, 
      CreatedDate,
      ValidFrom, 
      ValidTo, 
      EnterDate, 
      EnterUser,
      ApproveDate, 
      ApproveUser,
      RequestorName, 
      RequestorsDepartment, 
      RequestorsBranch,
      ProcurementOfficer, 
      ItemCode,
      Quantity, 
      UnitPrice AS [Unit Price LKR]
  FROM 
      RankedPRs
  WHERE 
      RowNum = 1
  ORDER BY 
      PRHeaderID;`); //   ApproveStatus,
    // .query(` SELECT   H.PRNumber, H.ItemCategory, H.CreatedDate,
    //                   H.ValidFrom, H.ValidTo, H.EnterDate, H.EnterUser,
    //                   H.ApproveStatus,
    //                   H.ApproveDate, H.ApproveUser,
    //                   H.RequestorName, H.RequestorsDepartment, H.RequestorsBranch,
    //                   H.ProcurementOfficer, L.ItemCode,
    //                   L.Quantity, L.UnitPrice AS UnitPriceLKR
    //              FROM [tblTrans_Purchase_Requisition_Header] AS H
    //              INNER JOIN [tblTrans_Purchase_Requisition_Items] AS L
    //              ON H.PRHeaderID = L.PRHeaderID
    //             Inner Join [dbo].[tblRef_Approval_Level_Mapping] AS A
    //              ON H.ApproveLevel =A.ApprovalLevel
    //              Inner Join tblRef_User_Group AS UG
    //              ON A.UserGroup = UG.GroupCode
    //              Inner Join tblRef_Users AS U
    //              ON UG.GroupCode = U.UserGroup
    //              WHERE H.RequestorName ='${req.query.UserName}' AND H.ProcurementOfficer='${req.query.ProcurementOfficer}'
    //              ORDER BY L.PRHeaderID`);

    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});
router.get("/CategoryWise", async (req, res, next) => {
  try {
    console.log("bin", req.query.currencyCode);
    let pool = await sql.connect(config);
    let result = await pool.request()
      .query(` SELECT H.PRNumber, H.ItemCategory, H.CreatedDate,
    H.ValidFrom, H.ValidTo, L.ItemCode,
    L.Quantity
    FROM [tblTrans_Purchase_Requisition_Header] AS H
    INNER JOIN [tblTrans_Purchase_Requisition_Items] AS L
    ON H.PRHeaderID = L.PRHeaderID
    WHERE H.ItemCategory ='${req.query.ItemCategory}'
    ORDER BY H.ItemCategory`);

    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});
router.get("/DepartmentWise", async (req, res, next) => {
  try {
    console.log("bin", req.query.currencyCode);
    let pool = await sql.connect(config);
    let result = await pool.request()
      .query(` SELECT H.PRNumber, H.ItemCategory, H.CreatedDate,
    H.ValidFrom, H.ValidTo, H.EnterDate, H.EnterUser, H.ApproveUser,
    H.RequestorName, H.RequestorsDepartment, H.RequestorsBranch, L.ItemCode,
    L.Quantity, L.UnitPrice AS UnitPriceLKR
    FROM [tblTrans_Purchase_Requisition_Header] AS H
    INNER JOIN [tblTrans_Purchase_Requisition_Items] AS L
    ON H.PRHeaderID = L.PRHeaderID
    WHERE H.RequestorsDepartment ='${req.query.RequestorsDepartment}'
    ORDER BY H.RequestorsDepartment`);

    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});
router.get("/ApprovallevelTimeWise", async (req, res, next) => {
  try {
    console.log("bin", req.query.currencyCode);
    let pool = await sql.connect(config);
    let result = await pool.request()
      .query(` SELECT   H.PRNumber, H.CreatedDate,
    H.ApproveStatus,
    H.ApproveDate
    FROM [tblTrans_Purchase_Requisition_Header] AS H
    INNER JOIN [tblTrans_Purchase_Requisition_Items] AS L
    ON H.PRHeaderID = L.PRHeaderID
    WHERE H.ApproveDate ='${req.query.ApproveDate}'
    ORDER BY H.ApproveDate DESC`);

    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});
router.get("/PendingApprovalLevelWise", async (req, res, next) => {
  try {
    console.log("bin", req.query.currencyCode);
    let pool = await sql.connect(config);
    let result = await pool.request()
      .query(` SELECT   H.PRNumber, H.CreatedDate,
    H.ValidFrom, H.ValidTo,H.ApproveUser,
    H.RequestorName, H.RequestorsDepartment, H.RequestorsBranch,
    H.ProcurementOfficer, L.ItemCode,
    L.Quantity, L.UnitPrice AS UnitPriceLKR
    FROM [tblTrans_Purchase_Requisition_Header] AS H
    INNER JOIN [tblTrans_Purchase_Requisition_Items] AS L
    ON H.PRHeaderID = L.PRHeaderID
    WHERE H.ApproveLevel ='${req.query.ApproveLevel}'
    ORDER BY H.ApproveLevel DESC`);

    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});
router.get("/UserWise", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query(
      `    	  WITH RankedPRs AS (
        SELECT 
            H.PRNumber, 
            H.CreatedDate,
            H.ValidFrom, 
            H.ValidTo, 
            L.ItemCode,
            L.Quantity, 
            L.UnitPrice AS UnitPriceLKR,
            H.PRHeaderID,
            ROW_NUMBER() OVER (PARTITION BY H.PRHeaderID ORDER BY L.PRHeaderID DESC) AS RowNum
        FROM 
            [tblTrans_Purchase_Requisition_Header] AS H
        INNER JOIN 
            [tblTrans_Purchase_Requisition_Items] AS L
            ON H.PRHeaderID = L.PRHeaderID
        INNER JOIN 
            [dbo].[tblRef_Approval_Level_Mapping] AS A
            ON H.ApproveLevel = A.ApprovalLevel
        INNER JOIN 
            tblRef_User_Group AS UG
            ON A.UserGroup = UG.GroupCode
        INNER JOIN 
            tblRef_Users AS U
            ON UG.GroupCode = U.UserGroup
        WHERE 
            H.RequestorName = '${req.query.UserName}'
    )
    SELECT 
        PRNumber, 
        CreatedDate,
        ValidFrom, 
        ValidTo, 
        ItemCode,
        Quantity, 
        UnitPriceLKR 
    FROM 
        RankedPRs
    WHERE 
        RowNum = 1
    ORDER BY 
        PRHeaderID DESC;`
    );
    // .query(
    //   `    SELECT   H.PRNumber, H.CreatedDate,
    //   H.ValidFrom, H.ValidTo, L.ItemCode,
    //   L.Quantity, L.UnitPrice AS UnitPriceLKR
    //   FROM [tblTrans_Purchase_Requisition_Header] AS H
    //   INNER JOIN [tblTrans_Purchase_Requisition_Items] AS L
    //   ON H.PRHeaderID = L.PRHeaderID
    //   Inner Join [dbo].[tblRef_Approval_Level_Mapping] AS A
    //   ON H.ApproveLevel =A.ApprovalLevel
    //   Inner Join tblRef_User_Group AS UG
    //   ON A.UserGroup = UG.GroupCode
    //   Inner Join tblRef_Users AS U
    //   ON UG.GroupCode = U.UserGroup
    //   WHERE H.RequestorName ='${req.query.UserName}'
    //   ORDER BY L.PRHeaderID DESC`
    // );

    res.json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports = router;

//  Purchase Requisition Creator User-wise/ Purchase Requisition Assigned User wise

//  SELECT   H.PRNumber, H.ItemCategory, H.CreatedDate,
//                       H.ValidFrom, H.ValidTo, H.EnterDate, H.EnterUser,
//                       H.ApproveStatus,
//                       H.ApproveDate, H.ApproveUser,
//                       H.RequestorName, H.RequestorsDepartment, H.RequestorsBranch,
//                       H.ProcurementOfficer, L.ItemCode,
//                       L.Quantity, L.UnitPrice
//                FROM [tblTrans_Purchase_Requisition_Header] AS H
//                INNER JOIN [tblTrans_Purchase_Requisition_Items] AS L
//                ON H.PRHeaderID = L.PRHeaderID
//  	            Inner Join [dbo].[tblRef_Approval_Level_Mapping] AS A
//                ON H.ApproveLevel =A.ApprovalLevel
//                Inner Join tblRef_User_Group AS UG
//                ON A.UserGroup = UG.GroupCode
//                Inner Join tblRef_Users AS U
//                ON UG.GroupCode = U.UserGroup
//                WHERE U.UserName ='PBSS' AND H.ProcurementOfficer='PR0001'
//                ORDER BY L.PRHeaderID

//  Purchase Requisition Category wise

//  SELECT H.PRNumber, H.ItemCategory, H.CreatedDate,
//  H.ValidFrom, H.ValidTo, L.ItemCode,
//  L.Quantity
//  FROM [tblTrans_Purchase_Requisition_Header] AS H
//  INNER JOIN [tblTrans_Purchase_Requisition_Items] AS L
//  ON H.PRHeaderID = L.PRHeaderID
//  WHERE H.ItemCategory ='Capex'
//  ORDER BY H.ItemCategory

//  Purchase Requisition Department wise

//  SELECT H.PRNumber, H.ItemCategory, H.CreatedDate,
//  H.ValidFrom, H.ValidTo, H.EnterDate, H.EnterUser, H.ApproveUser,
//  H.RequestorName, H.RequestorsDepartment, H.RequestorsBranch, L.ItemCode,
//  L.Quantity, L.UnitPrice
//  FROM [tblTrans_Purchase_Requisition_Header] AS H
//  INNER JOIN [tblTrans_Purchase_Requisition_Items] AS L
//  ON H.PRHeaderID = L.PRHeaderID
//  WHERE H.RequestorsDepartment ='D001'
//  ORDER BY H.RequestorsDepartment

//  Purchase Requisition Approval level Time

//  SELECT   H.PRNumber, H.CreatedDate,
//  H.ApproveStatus,
//  H.ApproveDate
//  FROM [tblTrans_Purchase_Requisition_Header] AS H
//  INNER JOIN [tblTrans_Purchase_Requisition_Items] AS L
//  ON H.PRHeaderID = L.PRHeaderID
//  WHERE H.ApproveDate ='2024-05-08 05:18:59.513'
//  ORDER BY H.ApproveDate DESC

//  Purchase Requisition Pending Approval Level wise

//  SELECT   H.PRNumber, H.CreatedDate,
//  H.ValidFrom, H.ValidTo,H.ApproveUser,
//  H.RequestorName, H.RequestorsDepartment, H.RequestorsBranch,
//  H.ProcurementOfficer, L.ItemCode,
//  L.Quantity, L.UnitPrice
//  FROM [tblTrans_Purchase_Requisition_Header] AS H
//  INNER JOIN [tblTrans_Purchase_Requisition_Items] AS L
//  ON H.PRHeaderID = L.PRHeaderID
//  WHERE H.ApproveLevel ='1'
//  ORDER BY H.ApproveLevel DESC

//  Purchase Requisition Creator User-wise

//  SELECT   H.PRNumber, H.CreatedDate,
//  H.ValidFrom, H.ValidTo, L.ItemCode,
//  L.Quantity, L.UnitPrice
//  FROM [tblTrans_Purchase_Requisition_Header] AS H
//  INNER JOIN [tblTrans_Purchase_Requisition_Items] AS L
//  ON H.PRHeaderID = L.PRHeaderID
//  Inner Join [dbo].[tblRef_Approval_Level_Mapping] AS A
//  ON H.ApproveLevel =A.ApprovalLevel
//  Inner Join tblRef_User_Group AS UG
//  ON A.UserGroup = UG.GroupCode
//  Inner Join tblRef_Users AS U
//  ON UG.GroupCode = U.UserGroup
//  WHERE U.UserName ='PBSS'
//  ORDER BY L.PRHeaderID DESC
