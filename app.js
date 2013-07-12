
/**
 * Module dependencies.
 */

var express = require("express"),
    Resource = require('express-resource');

var app = module.exports = express();

// config

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// middleware

app.use(express.bodyParser());
app.use(express.cookieParser('shhhh, very secret'));
app.use(express.session());

app.all("*", restrict);

function restrict(req, res, next) {
  // exclude sessions intractions.
  if (req.path.match("sessions")) return next();

  if (req.session.user) {
    next();
  } else {
    res.redirect("sessions/new");
  }
}

app.get("/", function(req, res) {
  res.redirect("subscribes");
});

// resources

app.resource("sessions", require("./resources/session"));

if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}

