const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controller/user");

router
  .route("/singup")
  .get(userController.renderSingupForm)
  .post(wrapAsync(userController.Singup));

router
  .route("/login")
  .get(userController.redderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.Login
  );


// logout
router.get("/logout", userController.Logout);

module.exports = router;
