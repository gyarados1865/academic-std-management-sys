import prisma from "../prisma/prismaClient.js";

export const getAllEnrollments = async () => {
  return await prisma.enrollment.findMany({
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

export const getEnrollmentById = async (id) => {
  return await prisma.enrollment.findUnique({
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

export const createEnrollment = async (data) => {
  return await prisma.enrollment.create({
    data: {
      studentId: data.studentId,
      subjectId: data.subjectId,
      status: data.status,
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

export const updateEnrollment = async (id, data) => {
  return await prisma.enrollment.update({
    where: { id },
    data: {
      status: data.status,
      studentId: data.studentId,
      subjectId: data.subjectId,
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

export const deleteEnrollment = async (id) => {
  return await prisma.enrollment.delete({
    where: { id },
  });
};
