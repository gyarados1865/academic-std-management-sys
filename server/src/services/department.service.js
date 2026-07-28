import prisma from "../prisma/prismaClient.js";

export const getAllDepartments = async () => {
  return await prisma.department.findMany({
    include: {
      teachers: true,
      students: true,
      courses: true,
    },
  });
};

export const getDepartmentById = async (id) => {
  return await prisma.department.findUnique({
    where: { id },
    include: {
      teachers: true,
      students: true,
      courses: true,
    },
  });
};

export const createDepartment = async (data) => {
  return await prisma.department.create({
    data: {
      name: data.name,
      code: data.code,
      description: data.description,
    },
    include: {
      teachers: true,
      students: true,
      courses: true,
    },
  });
};

export const updateDepartment = async (id, data) => {
  return await prisma.department.update({
    where: { id },
    data: {
      name: data.name,
      code: data.code,
      description: data.description,
    },
    include: {
      teachers: true,
      students: true,
      courses: true,
    },
  });
};

export const deleteDepartment = async (id) => {
  return await prisma.department.delete({
    where: { id },
  });
};
