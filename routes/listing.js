const express = require("express");
const router = express.Router();
const wrapAsync = require("../utility/wrapAsync");
const expressError = require("../utility/expressError");
const { joiListingSchema } = require("../joiSchema.js");
const Listing = require("../models/listing.js");
const { isLogIn, isOwner } = require("../middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });
const geocoder = require("../utility/geocoder.js");

//joi schema validate function for listing
const joiValidateSchema = (req, res, next) => {
  let { error } = joiListingSchema.validate(req.body);
  if (error) {
    throw new expressError(400, error);
  } else {
    next();
  }
};


router.get("/search", async(req, res) => {
  let {search} = req.query;
  if(!search){
    req.flash("error", "You cannot search any listing");
    return res.redirect("/listings");
  };
  let allListings = await Listing.find(
    {$text: {$search: search}},
    {score: {$meta:"textScore" }}
  ).sort({score: {$meta: "textScore"}});
  res.render("listings/index.ejs", {allListings});
});

//Category route
router.get("/category", async(req, res) => {
  let categoryName = req.query.category;  // this will be "city"
  let allListings = await Listing.find({category: categoryName});
  console.log(allListings);
  if(allListings.length <= 0){
    req.flash("error", "In this category cannot add any listing");
    return res.redirect("/listings");
  }
  res.render("listings/index.ejs", { allListings });
   });

//show listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({}).sort({ createdAt: -1 });
    res.render("listings/index.ejs", { allListings }); 
  })
);

//create new listing
router.get("/new", isLogIn, (req, res) => {
  res.render("listings/create.ejs");
});

router.post(
  "/",
  isLogIn,
  joiValidateSchema,
  upload.single("listing[image]"),
  wrapAsync(async (req, res, next) => {
    let location = req.body.listing.location;
    const coordinateResult = await geocoder.geocode(location);;
    let latitude = coordinateResult[0].latitude;
    let longitude = coordinateResult[0].longitude;
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.coordinate = {latitude, longitude};
    await newListing.save();
    req.flash("success", "New Listing Created Successfully");
    res.redirect("/listings");
  })
);


//show list details
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
      .populate({ path: "review", populate: { path: "author", }, })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing not exits that you request");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

//edit listing
router.get(
  "/:id/edit",
  isLogIn,
  isOwner,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not exits that you request");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

//update listing
router.put(
  "/:id",
  isLogIn,
  isOwner,
  upload.single("listing[image]"),
  joiValidateSchema,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if(typeof req.file !== "undefined"){
      let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    req.flash("success", "Listing Update Successfully");
    res.redirect(`/listings/${id}`);
  })
);

//Delete the listings
router.delete(
  "/:id",
  isLogIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Delete Successfully");
    res.redirect("/listings");
  })
);



module.exports = router;
