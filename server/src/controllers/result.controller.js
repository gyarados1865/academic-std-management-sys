import * as resultService from "../services/result.service.js";

export const getAllResults = async (req, res, next) => {
  try {
    const results = await resultService.getAllResults();

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

export const getResultById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await resultService.getResultById(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const createResult = async (req, res, next) => {
  try {
    const result = await resultService.createResult(req.body);

    res.status(201).json({
      success: true,
      message: "Result created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateResult = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await resultService.updateResult(id, req.body);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Result updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteResult = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await resultService.deleteResult(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Result deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
