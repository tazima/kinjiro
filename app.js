
/**
 * Module dependencies.
 */

var express = require("express"),
    Resource = require('express-resource'),
    flash = require("connect-flash");

var app = module.exports = express();

// config

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// middleware

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
// TODO make secret secret!
app.use(express.cookieSession({ secret: 'shhhh, very secret' }));
app.use(flash());

console.log(app.get("env"));

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("sessions/new");
  }
}

// routes

app.all(/^(?!.*sessions).*$/, restrict);

app.get("/", function(req, res) {
  res.redirect("subscribes");
});

app.resource("sessions", require("./resources/session"));

app.resource("subscribes", require("./resources/subscribe"));

// TODO handle 404

if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}

