
/**
 * Module dependencies.
 */

var express = require("express"),
    Resource = require('express-resource'),
    flash = require("connect-flash"),
    mongoose = require("mongoose"),
    exec = require("child_process").exec;

var app = module.exports = express();

// config

app.set("views", __dirname + "/server/views");
app.set("view engine", "ejs");

app.configure("development", function() {
  app.set("db connection string", "mongodb://localhost:27017/kinjiro");
});

// middleware

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
// TODO make secret secret!
app.use(express.cookieSession({ secret: 'shhhh, very secret' }));
app.use(flash());
app.use(express.static(__dirname + "/build"));

function restrict(req, res, next) {
  if (req.session.walker_id) {
    next();
  } else {
    res.redirect("sessions/new");
  }
}

function build(req, res, next) {
  exec("grunt", next);  
}

// db

mongoose.connect(app.get("db connection string"), function(err) {
  if (err) { throw err; }
  console.log("Connected to mongo db");
});

// routes

app.all(/^(?!.*(sessions|users)).*$/, restrict, build);

app.get("/", function(req, res) {
  res.redirect("subscribes");
});

app.resource("sessions", require("./server/resources/session"));

app.resource("users", require("./server/resources/user"));

app.resource("subscribes", require("./server/resources/subscribe"));

// TODO handle 404

if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}

