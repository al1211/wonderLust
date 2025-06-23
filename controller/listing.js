const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_API_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.Index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", {
    allListing,
    category: undefined,
    query: undefined,
  });
};
module.exports.renderNewForm = async (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.ShowallRouter = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("eroor", "No listing available");
    res.render("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.postAllRoutes = async (req, res) => {
 let response= await  geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1,
}).send()


 


  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);

  console.log(newListing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry=response.body.features[0].geometry;
  let admap= await newListing.save();
  console.log(admap);
  req.flash("success", "succesfull added product");
  res.redirect("/listings");
};

module.exports.EditListing = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let oringnalUrl=listing.image.url;
 oringnalUrl= oringnalUrl.replace("upload/","upload/h_200,w_200/")
  console.log(oringnalUrl);
  res.render("listings/edit.ejs", { listing ,oringnalUrl});
};

module.exports.EditReviews = async (req, res) => {
  let { id } = req.params;

 let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });

 if(typeof req.file !== "undefined"){
   let url=req.file.path;
   let filename=req.file.filename;
   listing.image={url,filename};
   await listing.save();
  }

  req.flash("success", "succesfull update product");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteReviews = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("error", "succesfull Delete product");
  res.redirect("/listings");
};


module.exports.filterListings = async (req, res) => {
  const { category } = req.params;
  const allListing = await Listing.find({ category });

  if (allListing.length === 0) {
    req.flash("error", `No listings found in category "${category}".`);
    return res.redirect("/"); // or render the same page with an empty message
  }

  res.render("listings/index.ejs", {
    allListing,
    category,
    query: undefined,
  });
};

module.exports.searchListing = async (req, res) => {
  const { query } = req.params;
  console.log("Search Query:", query);

  const allListing = await Listing.find({
    country: { $regex: new RegExp(query, "i") }, // case-insensitive
  });

  if (allListing.length === 0) {
    req.flash("error", `No listings found in country "${query}".`);
    return res.redirect("/listings");
  }

  res.render("listings/index.ejs", {
    allListing,
    category: undefined,
    query,
  });
};