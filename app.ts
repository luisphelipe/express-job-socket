import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index";

// import Queue from "bull";

// const testQueue = new Queue("test");

// testQueue.process(function (job, done) {
//   console.log("this is the test queue current job");
//   console.log(job.data);

//   // Add a socketio.emit here

//   done();
// });

// testQueue.add(
//   { message: "job data" },
//   { repeat: { every: 5000 }, removeOnComplete: true }
// );

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

module.exports = app;
