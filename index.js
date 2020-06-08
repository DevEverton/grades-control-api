const express = require("express");
const app = express();
const gradesRouter = require("./routes/grades.js");

global.fileName = "grades.json";

app.use(express.json());
app.use("/grades", gradesRouter);

app.listen(5000, async () => {
  try {
    console.log("Api Started!");
  } catch (err) {
    console.log(err);
  }
});
