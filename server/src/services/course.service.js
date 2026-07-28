import prisma from "../prisma/prismaClient.js";

export const getAllCourses = async () => {
  return await prisma.course.findMany({
    include: {
      department: true,
    },
  });
};

export const getCourseById = async (id) => {
  return await prisma.course.findUnique({
    where: { id },
    include: {
      department: true,
      semesters: true,
    },
  });
};

export const createCourse = async (data) => {
  return await prisma.course.create({
    data: {
      name: data.name,
      code: data.code,
      durationYears: data.durationYears,
      totalSemesters: data.totalSemesters,
      departmentId: data.departmentId,
    },
    include: {
      department: true,
    },
  });
};

export const updateCourse = async (id, data) => {
  return await prisma.course.update({
    where: { id },
    data: {
      name: data.name,
      code: data.code,
      durationYears: data.durationYears,
      totalSemesters: data.totalSemesters,
      departmentId: data.departmentId,
    },
    include: {
      department: true,
    },
  });
};

export const deleteCourse = async (id) => {
  return await prisma.course.delete({
    where: { id },
  });
};
