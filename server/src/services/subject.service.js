import prisma from "../prisma/prismaClient.js";

export const getAllSubjects = async () => {
  return await prisma.subject.findMany({
    include: {
      semester: true,
    },
  });
};

export const getSubjectById = async (id) => {
  return await prisma.subject.findUnique({
    where: { id },
    include: {
      semester: true,
      enrollments: true,
      attendances: true,
      results: true,
    },
  });
};

export const createSubject = async (data) => {
  return await prisma.subject.create({
    data: {
      name: data.name,
      code: data.code,
      creditHours: data.creditHours,
      description: data.description,
      semesterId: data.semesterId,
    },
    include: {
      semester: true,
    },
  });
};

export const updateSubject = async (id, data) => {
  return await prisma.subject.update({
    where: { id },
    data: {
      name: data.name,
      code: data.code,
      creditHours: data.creditHours,
      description: data.description,
      semesterId: data.semesterId,
    },
    include: {
      semester: true,
    },
  });
};

export const deleteSubject = async (id) => {
  return await prisma.subject.delete({
    where: { id },
  });
};
