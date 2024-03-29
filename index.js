// Required libraries

// Express: web framework for Node.js
const express = require("express");
// Body Parser: Middleware that parses body info from a POST req
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth.js");
const adminProductsRouter = require("./routes/admin/products");
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");

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
app.use(adminProductsRouter);
app.use(cartsRouter);

app.listen(3000, () => {
  console.log("listening");
});
