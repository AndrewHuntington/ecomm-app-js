// Express: web framework for Node.js
const express = require("express");
// Body Parser: Middleware that parses body info from a POST req
const bodyParser = require("body-parser");
const usersRepo = require("./repositories/users");

const app = express();

// use(): Passes middleware to all route handlers
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="password confirmation" />
        <button>Sign Up</button>
      </form>
    </div>
  `);
});

app.post("/", async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  const exisitingUser = await usersRepo.getOneBy({ email });
  if (exisitingUser) {
    return res.send("Email in use");
  }

  if (password !== passwordConfirmation) {
    return res.send("Passwords must match");
  }

  res.send("Account created!!!");
});

app.listen(3000, () => {
  console.log("listening");
});
