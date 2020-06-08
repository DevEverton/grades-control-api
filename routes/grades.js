const express = require("express");
const fs = require("fs").promises;
const router = express.Router();
let time = new Date();

router.get("/", async (_, res) => {
  try {
    let data = await fs.readFile(fileName, "utf8");
    let json = JSON.parse(data);
    delete json.nextId;
    res.send(json);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  let grade = req.body;
  try {
    let data = await fs.readFile(fileName, "utf8");
    let json = JSON.parse(data);
    grade = { id: json.nextId++, ...grade, timestamp: time.toISOString() };
    json.grades.push(grade);
    await fs.writeFile(fileName, JSON.stringify(json));
    res.end();
    //   logger.info(`POST /account - ${JSON.stringify(account)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    //   logger.error(`POST /account - ${err.message}`);
  }
});

module.exports = router;
