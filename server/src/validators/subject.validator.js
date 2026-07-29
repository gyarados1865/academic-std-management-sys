import Joi from "joi";

export const subjectSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Subject name is required",
    "string.min": "Subject name must be at least 2 characters",
    "any.required": "Subject name is required",
  }),
  code: Joi.string().trim().min(2).max(20).required().messages({
    "string.empty": "Subject code is required",
    "string.min": "Subject code must be at least 2 characters",
    "any.required": "Subject code is required",
  }),
  creditHours: Joi.number().integer().min(1).required().messages({
    "number.base": "Credit hours must be a number",
    "number.min": "Credit hours must be at least 1",
    "any.required": "Credit hours is required",
  }),
  description: Joi.string().trim().optional(),
  semesterId: Joi.string().trim().required().messages({
    "string.empty": "Semester ID is required",
    "any.required": "Semester ID is required",
  }),
});
