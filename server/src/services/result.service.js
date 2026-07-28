import prisma from "../prisma/prismaClient.js";

export const getAllResults = async () => {
  return await prisma.result.findMany({
    include: {
      student: {
        include: {
          user: true,
        },
      },
      subject: {
        include: {
          semester: true,
        },
      },
    },
  });
};

export const getResultById = async (id) => {
  return await prisma.result.findUnique({
    where: { id },
    include: {
      student: {
        include: {
          user: true,
        },
      },
      subject: {
        include: {
          semester: true,
        },
      },
    },
  });
};

export const createResult = async (data) => {
  return await prisma.result.create({
    data: {
      studentId: data.studentId,
      subjectId: data.subjectId,
      marks: data.marks,
      totalMarks: data.totalMarks,
      grade: data.grade,
      remarks: data.remarks,
    },
    include: {
      student: {
        include: {
          user: true,
        },
      },
      subject: {
        include: {
          semester: true,
        },
      },
    },
  });
};

export const updateResult = async (id, data) => {
  return await prisma.result.update({
    where: { id },
    data: {
      studentId: data.studentId,
      subjectId: data.subjectId,
      marks: data.marks,
      totalMarks: data.totalMarks,
      grade: data.grade,
      remarks: data.remarks,
    },
    include: {
      student: {
        include: {
          user: true,
        },
      },
      subject: {
        include: {
          semester: true,
        },
      },
    },
  });
};

export const deleteResult = async (id) => {
  return await prisma.result.delete({
    where: { id },
  });
};
