import * as semesterService from "../services/semester.service.js";

export const getAllSemesters = async (req, res, next) => {
  try {
    const semesters = await semesterService.getAllSemesters();

    res.status(200).json({
      success: true,
      count: semesters.length,
      data: semesters,
    });
  } catch (error) {
    next(error);
  }
};

export const getSemesterById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const semester = await semesterService.getSemesterById(id);

    if (!semester) {
      return res.status(404).json({
        success: false,
        message: "Semester not found",
      });
    }

    res.status(200).json({
      success: true,
      data: semester,
    });
  } catch (error) {
    next(error);
  }
};

export const createSemester = async (req, res, next) => {
  try {
    const semester = await semesterService.createSemester(req.body);

    res.status(201).json({
      success: true,
      message: "Semester created successfully",
      data: semester,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSemester = async (req, res, next) => {
  try {
    const { id } = req.params;

    const semester = await semesterService.updateSemester(id, req.body);

    if (!semester) {
      return res.status(404).json({
        success: false,
        message: "Semester not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Semester updated successfully",
      data: semester,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSemester = async (req, res, next) => {
  try {
    const { id } = req.params;

    const semester = await semesterService.deleteSemester(id);

    if (!semester) {
      return res.status(404).json({
        success: false,
        message: "Semester not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Semester deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
