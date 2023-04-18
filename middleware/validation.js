const { celebrate } = require("celebrate");
const Joi = require("joi");
// Joi.objectId = require("joi-objectid")(Joi);
const { ObjectId } = require("mongoose");
const { linkRegex } = require("../utils/regex");

const validateObjId = celebrate({
  params: Joi.object().keys({
    id: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (ObjectId.isValid(value)) {
          return value;
        }
        return helpers.message("Invalid id");
      }),
  }),
});

const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length of the 'name' field is 2",
      "string.max": "The maximum length of the 'name' field is 30",
      "string.empty": "The 'name' field must be filled in",
    }),
    link: Joi.string()
      .required()
      .pattern(linkRegex)
      .message("The 'link' field must be a valid URL")
      .messages({
        "string.empty": "The 'link' field must be filled in",
      }),
  }),
});

const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": "The minimum length of the 'name' field is 2",
      "string.max": "The maximum length of the 'name' field is 30",
    }),
    about: Joi.string().min(2).max(30).messages({
      "string.min": "The minimum length of the 'name' field is 2",
      "string.max": "The maximum length of the 'name' field is 30",
    }),
    password: Joi.string().required().messages({
      "string.empty": "The 'password' field must be filled in",
    }),
    email: Joi.string()
      .required()
      .email()
      .message("The 'email' field must be a valid email")
      .messages({
        "string.empty": "The 'email' field must be filled in",
      }),
    avatar: Joi.string()
      .pattern(linkRegex)
      .message("The 'avatar' field must be a valid URL"),
  }),
});

const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .message("The 'email' field must be a valid email")
      .messages({
        "string.empty": "The 'email' field must be filled in",
      }),
    password: Joi.string().required().messages({
      "string.empty": "The 'password' field must be filled in",
    }),
  }),
});

const validateAvatar = celebrate({
  body: {
    avatar: Joi.string()
      .required()
      .pattern(linkRegex)
      .message("The 'avatar' field must be a valid URL")
      .messages({
        "string.empty": "The 'avatar' field must be filled in",
      }),
  },
});

const validateProfile = celebrate({
  body: {
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length of the 'name' field is 2",
      "string.max": "The maximum length of the 'name' field is 30",
      "string.empty": "The 'name' field must be filled in",
    }),
    about: Joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length of the 'about' field is 2",
      "string.max": "The maximum length of the 'about' field is 30",
      "string.empty": "The 'about' field must be filled in",
    }),
  },
});

module.exports = {
  linkRegex,
  validateObjId,
  validateCardBody,
  validateUserBody,
  validateAuthentication,
  validateAvatar,
  validateProfile,
};
