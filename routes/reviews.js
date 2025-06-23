const express = require("express");
const router= express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const { ValidateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController=require("../controller/review.js")


// post review route
router.post("/",isLoggedIn, ValidateReview,wrapAsync(reviewController.CreateReview));

// Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview))

module.exports=router;

