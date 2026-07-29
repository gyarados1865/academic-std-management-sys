import Joi from "joi";

export const studentSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.email": "Email must be a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().trim().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
  registrationNo: Joi.string().trim().required().messages({
    "string.empty": "Registration number is required",
    "any.required": "Registration number is required",
  }),
  gender: Joi.string().valid("MALE", "FEMALE", "OTHER").required().messages({
    "any.only": "Gender must be one of MALE, FEMALE, or OTHER",
    "any.required": "Gender is required",
  }),
  departmentId: Joi.string().trim().required().messages({
    "string.empty": "Department ID is required",
    "any.required": "Department ID is required",
  }),
});
