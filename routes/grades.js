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

router.get("/:id", async (req, res) => {
  try {
    let data = await getGrades();

    const grade = data.grades.find(
      (grade) => grade.id === parseInt(req.params.id, 10)
    );

    if (grade) {
      res.send(grade);
    } else {
      throw new Error("User not found.");
    }
    res.end();
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
  } catch (err) {
    res.status(400).send({ error: err.message });
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
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let data = await getGrades();
    const grades = data.grades.filter(
      (grade) => grade.id !== parseInt(req.params.id, 10)
    );
    data.grades = grades;
    await fs.writeFile(fileName, JSON.stringify(data));

    res.end();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get("/sum/:student/:subject", async (req, res) => {
  try {
    let data = await getGrades();
    let sumOfGrades = data.grades
      .filter((grade) => grade.student === req.params.student)
      .filter((student) => student.subject === req.params.subject)
      .reduce((acc, curr) => {
        return acc + curr.value;
      }, 0);

    let result = {
      student: req.params.student,
      subject: req.params.subject,
      sumOfGrades,
    };
    res.send(result);
    res.end();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get("/average/:subject/:type", async (req, res) => {
  try {
    let data = await getGrades();
    let grades = data.grades
      .filter((grade) => grade.subject === req.params.subject)
      .filter((grade) => grade.type === req.params.type);
    let total = grades.length;
    let average =
      grades.reduce((acc, curr) => {
        return acc + curr.value;
      }, 0) / total;

    let result = {
      subject: req.params.subject,
      type: req.params.type,
      average,
    };
    res.send(result);
    res.end();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get("/top3/:subject/:type", async (req, res) => {
  try {
    let data = await getGrades();
    let top3 = data.grades
      .filter((grade) => grade.subject === req.params.subject)
      .filter((grade) => grade.type === req.params.type)
      .sort((a, b) => {
        return b.value - a.value;
      })
      .slice(0, 3);
    res.send(top3);
    res.end();
  } catch (err) {
    res.status(400).send({ error: err.message });
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
