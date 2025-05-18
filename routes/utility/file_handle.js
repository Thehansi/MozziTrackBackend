var express = require("express");
var config = require("../../config");
const path = require("path");
var multer = require("multer");
var router = express.Router();
var { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const download = require("download");
var fileupload = require("express-fileupload");
const log = require("log-to-file");

router.use(fileupload());

let Location = {
  Application: path.join(__dirname, "../../uploads/temp"),
  Report: path.join(__dirname, "../../uploads"),
};

let Path = "";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, Path);
  },
  filename: (req, file, callback) => {
    console.log(file);
    callback(null, uuidv4() + path.extname(file.originalname));
  },
});

let upload = multer({ storage: storage }).single("file");

router.post("/api/temp-upload", (req, res, next) => {
  try {
    Path = path.join(__dirname, "../../uploads/temp");
    let upload = multer({ storage: storage }).single("file");

    upload(req, res, function (err) {
      res.send(req.file.filename);
    });
    res.send(req.file.filename);
  } catch (error) {
    ErrorLog(req, e);
  }
});

router.post("/api/report-upload", (req, res, next) => {
  try {
    Path = path.join(__dirname, "../../uploads/layout" /*, req.query.Folder*/);

    console.log("Path", Path);
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json(err);
      } else if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).send(req.file);
    });
    res.send(req.file);
  } catch (error) {
    ErrorLog(req, e);
  }
});

router.post("/api/application-attachment-upload", (req, res, next) => {
  try {
    Path = path.join(
      __dirname,
      "../../uploads/application" /*, req.query.Folder*/
    );

    console.log("Path", Path);
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json(err);
      } else if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).send(req.file);
    });
    res.send(req.file);
  } catch (error) {
    ErrorLog(req, e);
  }
});

router.get("/api/file-delete", async (req, res, next) => {
  try {
    fs.unlinkSync(
      path.join(
        __dirname,
        `../../uploads/${req.query.Folder}/`,
        req.query.FileName
      )
    );

    console.log("File is deleted.");
  } catch (error) {
    ErrorLog(req, e);
  }
});

// router.post("/api/upload/internship", function (req, res, next) {
//   const file = req.files.file;

//   console.log("file", req.files.file);

//   let folder = path.join(__dirname, `../../uploads/${req.query.Folder}/`);

//   file.mv(folder + req.query.FileName, function (err, result) {
//     if (err) throw err;
//     res.send({
//       success: true,
//       message: "File uploaded!",
//       filePath: folder + req.query.FileName,
//     });
//   });
// });

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

router.get("/api/file-move", async (req, res, next) => {
  try {
    let folder = path.join(
      __dirname,
      "../../uploads/application/app" + req.query.ApplicationID
    );

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }

    let currentPath = path.join(
      __dirname,
      "../../uploads/temp/",
      req.query.File
    );
    let destinationPath = path.join(folder, "/", req.query.File);

    fs.rename(currentPath, destinationPath, function (err) {
      if (err) {
        throw err;
      } else {
        console.log("Successfully moved the file!");
      }
    });
  } catch (error) {
    ErrorLog(req, e);
  }
});

// router.get("/api/viewFile", async (req, res, next) => {
//   try {
//     if (req.query.FilePath !== undefined) {
//       let path = req.query.FilePath;
//       res.download(path);
//     } else {
//       // res.download(__dirname + "/Default.pdf");
//     }
//   } catch (e) {
//     console.log(e);
//     next(e);
//   }
// });

router.get("/api/viewFile", (req, res) => {
  const filePath = req.query.FilePath;

  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  const filename = path.basename(filePath);
  res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

router.post("/api/upload", function (req, res, next) {
  const file = req.files.file;

  console.log("file", req.files.file);

  let folder = path.join(__dirname, `../../uploads/${req.query.Folder}/`);

  file.mv(folder + req.query.FileName, function (err, result) {
    if (err) throw err;
    res.send({
      success: true,
      message: "File uploaded!",
    });
  });
});

router.get("/api/file-download", async (req, res, next) => {
  try {
    let FilePath = path.join(
      __dirname,
      "../../uploads/application/",
      req.query.FileName
    );

    res.download(FilePath);
    //res.sendFile(file);
  } catch (error) {
    ErrorLog(req, e);
  }
});

router.get("/api/file-download/internship", async (req, res, next) => {
  try {
    // let FilePath = path.join(
    //   req.query.FileName
    // );
    let FilePath = path.join(
      __dirname,
      "../../uploads/internship/",
      req.query.FileName
    );
    res.download(FilePath);
    //res.sendFile(file);
  } catch (error) {
    ErrorLog(req, e);
  }
});

router.get(
  "/api/file-download/attachment/application",
  async (req, res, next) => {
    try {
      // let FilePath = path.join(
      //   req.query.FileName
      // );
      let FilePath = path.join(
        __dirname,
        `../../uploads/application/`,
        req.query.FileName
      );
      res.download(FilePath);
      //res.sendFile(file);
    } catch (error) {
      ErrorLog(req, e);
    }
  }
);

router.post("/api/upload/profile-image", function (req, res, next) {
  try {
    Path = path.join(__dirname, "../../uploads/image");

    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json(err);
      } else if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).send(req.file);
    });

    res.send(req.file);
  } catch (error) {
    ErrorLog(req, e);
  }
});

router.get("/api/profile-image", async (req, res, next) => {
  try {
    var filePath = path.join(
      __dirname,
      `../../uploads/${req.query.Folder}/${req.query.FileID}.jpg`
    );

    console.log("filePath", filePath);
    res.writeHead(200, {
      "Content-Type": "image/jpeg",
    });

    fs.readFile(filePath, { encoding: "base64" }, function (err, content) {
      res.end(content);
    });

    //res.sendFile(filePath);
  } catch (error) {
    ErrorLog(req, e);
  }
});

module.exports = router;
