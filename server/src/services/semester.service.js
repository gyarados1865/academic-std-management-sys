import prisma from "../prisma/prismaClient.js";

export const getAllSemesters = async () => {
  return await prisma.semester.findMany({
    include: {
      course: true,
    },
  });
};

export const getSemesterById = async (id) => {
  return await prisma.semester.findUnique({
    where: { id },
    include: {
      course: true,
      subjects: true,
    },
  });
};

export const createSemester = async (data) => {
  return await prisma.semester.create({
    data: {
      name: data.name,
      number: data.number,
      status: data.status,
      courseId: data.courseId,
    },
    include: {
      course: true,
    },
  });
};

export const updateSemester = async (id, data) => {
  return await prisma.semester.update({
    where: { id },
    data: {
      name: data.name,
      number: data.number,
      status: data.status,
      courseId: data.courseId,
    },
    include: {
      course: true,
    },
  });
};

export const deleteSemester = async (id) => {
  return await prisma.semester.delete({
    where: { id },
  });
};
