if(process.env.NODE_ENV != "production"){

  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverrid = require("method-override");
const path = require("path");
const engine = require("ejs-mate");
const listingsRoutes = require("./routes/listing.js");
const ReviewRoutes = require("./routes/reviews.js");
const userRoutes=require("./routes/user.js");
const session=require("express-session");
const MongoStore=require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const passportlocatStrategy=require("passport-local");
const User=require("./models/user.js")


// const MONGO_URL = "mongodb://localhost:27017/test";
const dburl=process.env.DATA_BASE_URL;

main()
  .then(() => {
    console.log("mongodb connect");
  })
  .catch((err) => {
    console.log("errr", err);
  });

async function main() {
  await mongoose.connect(dburl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverrid("_method"));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")));

const store=MongoStore.create({
  mongoUrl:dburl,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("error in MOngo session store",err);
})
const sessionOption={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+ 1*24*60*60*1000,
    maxAge:1*24*60*60*1000,
    httpOnly:true,
  }
}

  
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportlocatStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
res.locals.success=req.flash("success");
res.locals.error=req.flash("error");
res.locals.currUser=req.user;
  next();
})

app.use("/listings", listingsRoutes);
app.use("/listings/:id/reviews", ReviewRoutes);
app.use('/',userRoutes);


app.use((err, req, res, next) => {
  let { status, message } = err;
  res.render("error.ejs", { message });
});

let PORT = 8080;

app.listen(PORT, () => {
  console.log("server is create");
});
