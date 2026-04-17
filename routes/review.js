const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utility/wrapAsync");
const expressError = require("../utility/expressError");
const { joiReviewSchema } = require("../joiSchema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLogIn, isReviewAuthor} = require("../middleware.js");

//joi schema validate function for review
const joiReviewValidateSchema = (req, res, next) => {
  let { error } = joiReviewSchema.validate(req.body);
  if (error) {
    throw new expressError(400, error);
  } else {
    next();
  }
};

//Review post route
router.post(
  "/",
  isLogIn,
  joiReviewValidateSchema,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
  
    listing.review.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success", "New Review Created Successfully");
    res.redirect(`/listings/${id}`);
  })
);

//Delete review route

router.delete("/:reviewId",
  isLogIn,
  isReviewAuthor,
  async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Delete Successfully");
  res.redirect(`/listings/${id}`);
});

module.exports = router;
