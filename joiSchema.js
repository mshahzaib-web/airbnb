const Joi = require("joi");

const joiListingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().min(1).required(), // ⬅️ Not empty
    description: Joi.string().min(1).required(), // ⬅️ Not empty

    image: Joi.string().allow("", null), // ⬅️ Must not be empty

    price: Joi.number().required().min(0),
    location: Joi.string().min(1).required(), // ⬅️ Not empty
    country: Joi.string().min(1).required(), // ⬅️ Not empty
  }).required(),
});

const joiReviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
  }).required(),
});
module.exports = { joiListingSchema, joiReviewSchema };
