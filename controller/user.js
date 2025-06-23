const User=require("../models/user")

module.exports.renderSingupForm=(req, res) => {
  res.render("./users/singup.ejs");
};

module.exports.Singup=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({ email, username });
      let registerUser = await User.register(newUser, password);

      req.login(registerUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "user was succesful created");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/singup");
    }
  };

  module.exports.redderLoginForm= (req, res) => {
  res.render("./users/login.ejs");
};

module.exports.Login= async (req, res) => {
    req.flash("success", "Welcome to wonderlust");
    let redirectUrl=res.locals.redirectUrl || "/listings";

    res.redirect(redirectUrl);
  };

  module.exports.Logout=(req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  req.flash("success", "you are logout");
  res.redirect("/listings");
};