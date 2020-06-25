import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index";

import Agenda from "agenda";

const mongoConnectionString = "mongodb://127.0.0.1/test-agenda";

const agenda = new Agenda({ db: { address: mongoConnectionString } });

agenda.define("test job", async (job) => {
  console.log("this is the job data:");
  console.log(job.attrs);
  // await User.remove({ lastLogIn: { $lt: twoDaysAgo } });
  return Promise.resolve({ message: "job is done" });
});

(async function () {
  // IIFE to give access to async/await
  await agenda.start();

  await agenda.every("5 seconds", "test job");
})();

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

module.exports = app;
