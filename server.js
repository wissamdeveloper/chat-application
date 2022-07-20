var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var mongoose = require("mongoose");
require("dotenv").config();
var entities = require("html-entities");
const internal = require("stream");
const hostname = process.env.HOST_NAME;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const port = process.env.PORT;
const dbname = process.env.DB_NAME;
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var Message = mongoose.model("Message", {
  id: Number,
  name: String,
  message: String,
});

const dbUrl = `mongodb://${username}:${password}@${hostname}:${port}/${dbname}?retryWrites=true&w=majority`;
app.get("/messages", (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});
app.post("/messages", (req, res) => {
  console.log("name ta3i", req.body.name);
  if (!req.body.name || !req.body.message || req.body.name.length < 3) {
    res.send("name and messaged are requirens ");
    res.sendStatus(404);
    return;
  }
  console.log("req.body", req.body);
  console.log("entities.decode(req.body.name)", entities.encode(req.body.name));
  console.log(
    "entities.decode(req.body.message)",
    entities.encode(req.body.message)
  );
  var message = new Message(req.body);

  message.save((err) => {
    if (err) {
      console.log("error", err);
      res.sendStatus(500);
    }

    res.sendStatus(200);
  });
});
app.post("/delete", (req, res) => {
  console.log(req.body.id);
  Message.findByIdAndDelete({ _id: req.body.id }, function (err, id) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted : ", id);
    }
  });
});
app.post("/search", (req, res) => {
  console.log("req.body.search_query", req.body.search_query);
  Message.find({ name: req.body.search_query }, (err, result) => {
    if (err) {
      console.log("error", err);
      res.sendStatus(500);
      res.write("search name");
    }
    res.send(result);
  });
});
app.post("/searchmessage", (req, res) => {
  console.log("req.body.search_query", req.body.search_query);
  Message.find({ message: req.body.search_query }, (err, result) => {
    if (err) {
      console.log("error", err);
      res.sendStatus(500);
    }
    res.send(result);
  });
});
io.on("connection", () => {
  console.log("a user is connected");
});
mongoose.connect(
  dbUrl,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    console.log("mongodb connected", err);
  }
);
var server = http.listen(3000, () => {
  console.log("server is running on port", server.address().port);
});
http.createServeur;
