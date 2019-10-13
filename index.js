const feathers = require("@feathersjs/feathers");
const express = require("@feathersjs/express");
const socketio = require("@feathersjs/socketio");
const moment = require("moment");

//Creating sevice for pushing comments
class commentService {
  constructor() {
    this.comments = [];
  }

  async find() {
    return this.comments;
  }

  async create(data) {
    const comment = {
      id: this.comments.length,
      text: data.text,
      viewer: data.viewer
    };
    comment.time = moment().format("h:mm:ss a");
    this.comments.push(comment);
    return comment;
  }
}

const app = express(feathers());

//Parse JSON
app.use(express.json());

//Config Socket.io realtime APIs
app.configure(socketio());

//Enable REST services
app.configure(express.rest());

//Register services
app.use("/comments", new commentService());

//Create channel for new connection to streaming channel
app.on("connection", conn => app.channel("stream").join(conn));

//Publish events to stream
app.publish(data => app.channel("stream"));

const PORT = process.env.PORT || 5000;

app
  .listen(PORT)
  .on("listening", () => console.log(`Listening on port ${PORT}`));

app.service("comments").create({
  text: "Start this stream!",
  viewer: "Johny Walker"
});
