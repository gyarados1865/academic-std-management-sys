import Joi from "joi";

export const resultSchema = Joi.object({
  studentId: Joi.string().trim().required().messages({
    "string.empty": "Student ID is required",
    "any.required": "Student ID is required",
  }),
  subjectId: Joi.string().trim().required().messages({
    "string.empty": "Subject ID is required",
    "any.required": "Subject ID is required",
  }),
  marks: Joi.number().min(0).required().messages({
    "number.base": "Marks must be a number",
    "number.min": "Marks cannot be negative",
    "any.required": "Marks is required",
  }),
  totalMarks: Joi.number().min(0).required().messages({
    "number.base": "Total marks must be a number",
    "number.min": "Total marks cannot be negative",
    "any.required": "Total marks is required",
  }),
  grade: Joi.string().valid("A_PLUS", "A", "B_PLUS", "B", "C_PLUS", "C", "D", "F").required().messages({
    "any.only": "Grade must be one of A_PLUS, A, B_PLUS, B, C_PLUS, C, D, or F",
    "any.required": "Grade is required",
  }),
  remarks: Joi.string().trim().optional(),
});
