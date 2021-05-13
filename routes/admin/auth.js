const express = require("express");
const { check, validationResult } = require("express-validator");
const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});

// The middle array is used for validation/sanitation by express-validator
router.post(
  "/signup",
  [
    check("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .custom(async (email) => {
        const exisitingUser = await usersRepo.getOneBy({ email });
        if (exisitingUser) {
          throw new Error("Email in use");
        }
      }),
    check("password").trim().isLength({ min: 4, max: 20 }),
    check("passwordConfirmation")
      .trim()
      .isLength({ min: 4, max: 20 })
      .custom((passwordConfirmation, { req }) => {
        if (passwordConfirmation !== req.body.password) {
          throw new Error("Passwords must match");
        }
      }),
  ],
  async (req, res) => {
    // results from validation (above array) are attached to the req obj
    const errors = validationResult(req);
    console.log(errors);

    const { email, password, passwordConfirmation } = req.body;

    // Create a user in our user rep to represent this person
    const user = await usersRepo.create({ email, password });

    // Store the id of that user inside the user's cookie
    req.session.userId = user.id; // session obj added to req by Cookie Session

    res.send("Account created!!!");
  }
);

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out.");
});

router.get("/signin", (req, res) => {
  res.send(signinTemplate());
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await usersRepo.getOneBy({ email });

  if (!user) {
    return res.send("Email not found");
  }

  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );
  if (!validPassword) {
    return res.send("Invalid password");
  }

  req.session.userId = user.id;

  res.send("You are signed in!");
});

module.exports = router;
