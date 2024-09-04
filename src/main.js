import express from "express";
import { users} from "./users.js";
import fs from "fs";
import { config } from "./config/env.js";
import { createUserTable } from "./user/user.model.js";

const app = express();

app.use(express.json());

const logger = (req, res, next) => {
  const id = parseInt(req.params.id);

  if (id < 1) {
    return res.status(400).json({ message: "id must be greater than 0" });
  }
  console.log("i am a middleware and i am greeting you");
  next();
};

app.get("/get-users", logger, (req, res) => {
  // res.send("Hello this is the home page");
  return res.json({
    message: "this are the users",
    data: users,
  });
});

app.get("/get-user/:id", (req, res) => {
  const { id } = req.params;

  console.log(req.params);

  // const user = users.find((user) => user.id == parseInt(id));
  // console.log(user)

  res.json({
    message: "this is the user",
    // data: user,
  });
});

const validateEmail = (req, res, next) => {
  const email = req.body.email;

  const userExist = users.find((user) => user.email === email);

  if(userExist) {
    return res.status(409).json({
      message: "user with this email already exist"
    })
  }

  next();
}

const validateUsername = (req, res, next) => {
  const username = req.body.username;

  const userExist = users.find((user) => user.username === username);

  if(userExist) {
    return res.status(409).json({
      message: "user with this username already exist"
    })
  }

  next();
}

app.post("/signup",validateEmail, validateUsername, (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;

  const id = users.length + 1;

  const newUser = {
    id,
    username,
    email,
    password,
  };

  users.push(newUser);

  const stringUsers = JSON.stringify(users);

  fs.writeFileSync(
    "/Users/mac/nitdev3.2/src/users.js",
    `export let users = ${stringUsers}`
  );

  return res.status(201).json({
    message: "user has been created",
    data: JSON.parse(stringUsers),
  });
});

app.listen(config.port, () => {
  // const content = fs.readFileSync("/Users/mac/nitdev3.2/src/fsRead.txt", "utf-8");
  createUserTable();
  console.log(`server is running on http://localhost:${config.port}`);
});
