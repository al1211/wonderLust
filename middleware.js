const Listing = require("./models/listing");
const Review=require('./models/review.js');
const ExpressError = require("./utils/ExpressError");
const { listingSchemal, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
      if (!req.isAuthenticated()) {
        req.session.redirectUrl=req.originalUrl
      req.flash("error", "you must be loged in");

     return res.redirect("/login");
    }
    next()
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next()
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
     if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error","you are not owner");
     return res.redirect(`/listings/${id}`);
    }

    next();
}


module.exports.ValidataListing = (req, res, next) => {
  let { error } = listingSchemal.validate(req.body);
  if (error) {
    let errMsg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.ValidateReview=(req,res,next)=>{
   let {error} = reviewSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((e)=>e.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next(); 
  }
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
     if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error","you are not author");
     return res.redirect(`/listings/${id}`);
    }

    next();
}