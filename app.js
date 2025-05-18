var createError = require("http-errors");
var express = require("express");
var cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
    "x-forwarded-for"
  );
  next();
});

// NOTE Start Router require
var indexRouter = require("./routes/index");

var authontication = require("./routes/admin/authontication");
var moduleRouter = require("./routes/system/module");

var userDetails = require("./routes/UserDetails/UserDetails");
var fileHandleRouter = require("./routes/utility/file_handle");
var smsRouter = require("./routes/utility/sms");
var emailRouter = require("./routes/utility/email");
var communicationRouter = require("./routes/utility/communication");

var dashboardRouter = require("./routes/home/dashboard");
var errorLogdRouter = require("./routes/error-log/error-log");

var NDCU = require("./routes/NDCU/NDCU");
var dengue = require("./routes/Dengue/Dengue");

var users = require("./routes/admin/users");
var passwordreset = require("./routes/admin/PasswordReset");
var Reports = require("./routes/Reorts/reports");

// NOTE view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));
app.use("/images", express.static("images"));

// // NOTE Start Router
app.use("/", indexRouter);
app.use("/", authontication);
app.use("/api", users);
app.use("/api", passwordreset);

//app.use("/", reportRouter);

app.use("/", fileHandleRouter);
// app.use("/", smsRouter);
// app.use("/", emailRouter);
// app.use("/", communicationRouter);

app.use("/", dashboardRouter);
app.use("/", errorLogdRouter);
app.use("/api", userDetails);
app.use("/api", dengue);
app.use("/api", NDCU);

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(process.env.PORT || 30024, "0.0.0.0", () => {
  console.log(`Successfully Running.`);
});
