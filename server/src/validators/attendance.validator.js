import Joi from "joi";

export const attendanceSchema = Joi.object({
  studentId: Joi.string().trim().required().messages({
    "string.empty": "Student ID is required",
    "any.required": "Student ID is required",
  }),
  subjectId: Joi.string().trim().required().messages({
    "string.empty": "Subject ID is required",
    "any.required": "Subject ID is required",
  }),
  date: Joi.date().required().messages({
    "date.base": "Date must be a valid date",
    "any.required": "Date is required",
  }),
  status: Joi.string().valid("PRESENT", "ABSENT", "LATE").required().messages({
    "any.only": "Status must be one of PRESENT, ABSENT, or LATE",
    "any.required": "Status is required",
  }),
});
