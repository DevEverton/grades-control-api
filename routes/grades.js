const express = require("express");
const fs = require("fs").promises;
const router = express.Router();
let time = new Date();

router.get("/", async (_, res) => {
  try {
    let data = await getGrades();
    delete data.nextId;
    res.send(data);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  let grade = req.body;
  try {
    let data = await getGrades();
    grade = { id: data.nextId++, ...grade, timestamp: time.toISOString() };
    data.grades.push(grade);

    await fs.writeFile(fileName, JSON.stringify(data));
    res.end();
    //   logger.info(`POST /account - ${JSON.stringify(account)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    //   logger.error(`POST /account - ${err.message}`);
  }
});

router.put("/:id", async (req, res) => {
  let newGrade = req.body;
  try {
    let data = await getGrades();

    const grade = data.grades.find(
      (grade) => grade.id === parseInt(req.params.id, 10)
    );

    if (grade) {
      let index = data.grades.findIndex(
        (grade) => grade.id === parseInt(req.params.id, 10)
      );
      data.grades[index].student = newGrade.student;
      data.grades[index].subject = newGrade.subject;
      data.grades[index].type = newGrade.type;
      data.grades[index].value = newGrade.value;
      data.grades[index].timestamp = time.toISOString();
      await fs.writeFile(fileName, JSON.stringify(data));
    } else {
      throw new Error("User not found.");
    }
    res.end();
    // logger.info(`PUT accounts/${JSON.stringify(newAccount.id)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    // logger.error(
    //   `PUT accounts/${JSON.stringify(newAccount.id)} - ${err.message}`
    // );
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let data = await getGrades();
    console.log(data);
    console.log(req.params.id);

    const grades = data.grades.filter(
      (grade) => grade.id !== parseInt(req.params.id, 10)
    );

    data.grades = grades;

    await fs.writeFile(fileName, JSON.stringify(data));

    res.end();
    // logger.info(`PUT accounts/${JSON.stringify(newAccount.id)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    // logger.error(
    //   `PUT accounts/${JSON.stringify(newAccount.id)} - ${err.message}`
    // );
  }
});

async function getGrades() {
  try {
    let data = await fs.readFile(fileName, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return err;
  }
}

module.exports = router;
