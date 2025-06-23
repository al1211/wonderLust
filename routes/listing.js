const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const { isLoggedIn, isOwner, ValidataListing } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload=multer({storage:storage});

router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));
router.get('/search/:query',isLoggedIn,wrapAsync(listingController.searchListing));
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.EditListing)
);


router
.route("/:id")
.get(wrapAsync(listingController.ShowallRouter))
.put(
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  ValidataListing,
  wrapAsync(listingController.EditReviews)
)
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteReviews));

router
.route("/")
.get(wrapAsync(listingController.Index))
.post(isLoggedIn,ValidataListing,upload.single("listing[image]"), wrapAsync(listingController.postAllRoutes));
// .post(upload.single("listing[image]"),(req,res)=>{
  //   res.send(req.file);
  // })




router.get('/category/:category',isLoggedIn,wrapAsync(listingController.filterListings));

module.exports = router;
