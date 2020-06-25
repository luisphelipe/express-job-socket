import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index";

import Agenda from "agenda";
const io = require("socket.io")(3001);

const mongoConnectionString = "mongodb://127.0.0.1/test-agenda";

const agenda = new Agenda({ db: { address: mongoConnectionString } });

agenda.define("test job", async (job) => {
  console.log(`running job at ${job.attrs.lastRunAt}`);
  return Promise.resolve({ message: "job is done" });
});

(async function () {
  await agenda.start();
  await agenda.every("3 seconds", "test job");
})();

io.on("connection", (socket) => {
  const socketInterval = setInterval(() => {
    console.log("emitting ping data");

    socket.emit("ping", { message: "ping" });
  }, 1000);

  socket.on("disconnect", () => {
    clearInterval(socketInterval);
  });
});

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

module.exports = app;
