const Listing = require("../models/listing");
const Review=require('../models/review')


module.exports.CreateReview=async(req,res)=>{
let listing=await Listing.findById(req.params.id);
let newRevies=new Review(req.body.review);
 newRevies.author=req.user._id;
 listing.reviews.push(newRevies);

 await listing.save();
 await newRevies.save();

 res.redirect(`/listings/${listing._id}`)
};



module.exports.deleteReview=async(req,res)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
  await Review.findByIdAndDelete(reviewId);
 res.redirect(`/listings/${id}`)
};