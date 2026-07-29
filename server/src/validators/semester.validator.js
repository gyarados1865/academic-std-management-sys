import Joi from "joi";

export const semesterSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Semester name is required",
    "string.min": "Semester name must be at least 2 characters",
    "any.required": "Semester name is required",
  }),
  number: Joi.number().integer().min(1).required().messages({
    "number.base": "Semester number must be a number",
    "number.min": "Semester number must be at least 1",
    "any.required": "Semester number is required",
  }),
  status: Joi.string().valid("UPCOMING", "ACTIVE", "COMPLETED").optional().messages({
    "any.only": "Status must be one of UPCOMING, ACTIVE, or COMPLETED",
  }),
  courseId: Joi.string().trim().required().messages({
    "string.empty": "Course ID is required",
    "any.required": "Course ID is required",
  }),
});
