import prisma from "../prisma/prismaClient.js";

export const getAllAttendances = async () => {
  return await prisma.attendance.findMany({
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

export const getAttendanceById = async (id) => {
  return await prisma.attendance.findUnique({
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

export const createAttendance = async (data) => {
  return await prisma.attendance.create({
    data: {
      studentId: data.studentId,
      subjectId: data.subjectId,
      date: data.date ? new Date(data.date) : undefined,
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

export const updateAttendance = async (id, data) => {
  return await prisma.attendance.update({
    where: { id },
    data: {
      studentId: data.studentId,
      subjectId: data.subjectId,
      date: data.date ? new Date(data.date) : undefined,
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

export const deleteAttendance = async (id) => {
  return await prisma.attendance.delete({
    where: { id },
  });
};
