import express from "express";
import { UserRepository } from "./user-repository";

const app = express();
app.use(express.json());

const PORT = process.env.PORT ?? 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/login", (req, res) => {});

app.post("/register", async(req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  try {
    const id = await UserRepository.create({ username, password });
    res.send({ id });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/logout", (req, res) => {});

app.get("/protected", (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server runing on port ${PORT}`);
});
