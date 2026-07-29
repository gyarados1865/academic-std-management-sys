import Joi from "joi";

export const courseSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Course name is required",
    "string.min": "Course name must be at least 2 characters",
    "any.required": "Course name is required",
  }),
  code: Joi.string().trim().min(2).max(20).required().messages({
    "string.empty": "Course code is required",
    "string.min": "Course code must be at least 2 characters",
    "any.required": "Course code is required",
  }),
  durationYears: Joi.number().integer().min(1).required().messages({
    "number.base": "Duration years must be a number",
    "number.min": "Duration years must be at least 1",
    "any.required": "Duration years is required",
  }),
  totalSemesters: Joi.number().integer().min(1).required().messages({
    "number.base": "Total semesters must be a number",
    "number.min": "Total semesters must be at least 1",
    "any.required": "Total semesters is required",
  }),
  departmentId: Joi.string().trim().required().messages({
    "string.empty": "Department ID is required",
    "any.required": "Department ID is required",
  }),
});
