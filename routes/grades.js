const express = require("express");
const fs = require("fs").promises;
const router = express.Router();

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

module.exports = router;
