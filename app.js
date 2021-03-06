
/**
 * Module dependencies.
 */

var express = require("express"),
    flash = require("connect-flash"),
    mongoose = require("mongoose"),
    debug = require("debug")("http"),
    staticAsset = require("static-asset");

var app = module.exports = express();

// config

app.set("views", __dirname + "/server/views");
app.set("view engine", "ejs");

app.configure("production", function() {
  app.set("db connection string", process.env.MONGOLAB_URI);
  app.set("session secret", process.env.SESSION_SECRET);
  app.use(express.logger());
});

app.configure("development", function() {
  app.set("db connection string", "mongodb://localhost:27017/kinjiro");
  app.set("session secret", "shhhh, very secret");
  app.use(express.logger("dev"));
});

app.configure("test", function() {
  app.set("db connection string", "mongodb://localhost:27017/kinjiro-test");
  app.set("session secret", "shhhh, very secret");
  app.use(express.logger("dev"));
});

// middleware

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieSession({ secret: app.set("session secret") }));
app.use(flash());
app.use(express.compress());
app.use(express.static(__dirname + "/build"));
app.use(staticAsset(__dirname + "/build"));
app.use(express.errorHandler());

// db

mongoose.connect(app.get("db connection string"), function(err) {
  if (err) { throw err; }
  debug("Connected to mongo db");
});

// routes

app.all(/^(?!.*(sessions|users)).*$/, restrict);

app.get("/", function(req, res) {
  res.redirect("feeds");
});

app.use(require("./server/apps/sessions"));
app.use(require("./server/apps/users"));
app.use(require("./server/apps/feeds"));
app.use(require("./server/apps/posts"));
app.use(require("./server/apps/reads"));

function restrict(req, res, next) {
  if (req.session.user_id) {
    next();
  } else {
    res.redirect("sessions/new");
  }
}

var port = process.env.PORT || 3000;
if (!module.parent) {
  app.listen(port);
  debug('Express started on port 3000');
}

