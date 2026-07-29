import Joi from "joi";

export const departmentSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Department name is required",
    "string.min": "Department name must be at least 2 characters",
    "any.required": "Department name is required",
  }),
  code: Joi.string().trim().min(2).max(20).required().messages({
    "string.empty": "Department code is required",
    "string.min": "Department code must be at least 2 characters",
    "any.required": "Department code is required",
  }),
  description: Joi.string().trim().optional(),
});
