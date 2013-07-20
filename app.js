
/**
 * Module dependencies.
 */

var express = require("express"),
    flash = require("connect-flash"),
    mongoose = require("mongoose"),
    exec = require("child_process").exec;

var app = module.exports = express();

// config

app.set("views", __dirname + "/server/views");
app.set("view engine", "ejs");

app.configure("production", function() {
  app.set("db connection string", process.env.MONGOLAB_URI);
});

app.configure("development", function() {
  app.set("db connection string", "mongodb://localhost:27017/kinjiro");
});

app.configure("test", function() {
  app.set("db connection string", "mongodb://localhost:27017/kinjiro-test");
});

// middleware

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
// TODO make secret secret!
app.use(express.cookieSession({ secret: 'shhhh, very secret' }));
app.use(flash());
app.use(express.static(__dirname + "/build"));

// db

mongoose.connect(app.get("db connection string"), function(err) {
  if (err) { throw err; }
  console.log("Connected to mongo db");
});

// routes

app.all(/^(?!.*(sessions|users)).*$/, restrict);

app.get("/", function(req, res) {
  res.redirect("feeds");
});

app.use(require("./server/apps/sessions"));
app.use(require("./server/apps/users"));
app.use(require("./server/apps/feeds"));

function restrict(req, res, next) {
  if (req.session.user_id) {
    next();
  } else {
    res.redirect("sessions/new");
  }
}

// TODO handle 404

var port = process.env.PORT || 3000;
if (!module.parent) {
  app.listen(port);
  console.log('Express started on port 3000');
}

