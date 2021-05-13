// Required libraries

// Express: web framework for Node.js
const express = require("express");
// Body Parser: Middleware that parses body info from a POST req
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth.js");
const productsRouter = require("./routes/admin/products");

const app = express();

// Middleware setup

// use(): Passes middleware to all route handlers
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["jslfkjdlsajkf;jalk"], // encryption key for cookie data
  })
);

app.use(authRouter);
app.use(productsRouter);

app.listen(3000, () => {
  console.log("listening");
});
