import Joi from "joi";

export const enrollmentSchema = Joi.object({
  studentId: Joi.string().trim().required().messages({
    "string.empty": "Student ID is required",
    "any.required": "Student ID is required",
  }),
  subjectId: Joi.string().trim().required().messages({
    "string.empty": "Subject ID is required",
    "any.required": "Subject ID is required",
  }),
  status: Joi.string().valid("ENROLLED", "DROPPED", "COMPLETED").optional().messages({
    "any.only": "Status must be one of ENROLLED, DROPPED, or COMPLETED",
  }),
});
