// Express: web framework for Node.js
const express = require("express");
// Body Parser: Middleware that parses body info from a POST req
const bodyParser = require("body-parser");

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

app.post("/", (req, res) => {
  console.log(req.body);
  res.send("Account created!!!");
});

app.listen(3000, () => {
  console.log("listening");
});
