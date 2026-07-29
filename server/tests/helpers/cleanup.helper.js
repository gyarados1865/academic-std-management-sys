import prisma from "../../src/prisma/prismaClient.js";

export const cleanupUsersByEmails = async (emails = []) => {
  if (!emails.length) return;

  await prisma.user.deleteMany({
    where: {
      email: {
        in: emails,
      },
    },
  });
};

export const cleanupStudentsByIds = async (ids = []) => {
  if (!ids.length) return;

  await prisma.student.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

export const cleanupTeachersByIds = async (ids = []) => {
  if (!ids.length) return;

  await prisma.teacher.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

export const cleanupDepartmentsByIds = async (ids = []) => {
  if (!ids.length) return;

  await prisma.department.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

export const cleanupCoursesByIds = async (ids = []) => {
  if (!ids.length) return;

  await prisma.course.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

export const cleanupSemestersByIds = async (ids = []) => {
  if (!ids.length) return;

  await prisma.semester.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

export const cleanupSubjectsByIds = async (ids = []) => {
  if (!ids.length) return;

  await prisma.subject.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

export const cleanupEnrollmentsByIds = async (ids = []) => {
  if (!ids.length) return;

  await prisma.enrollment.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

export const cleanupAttendancesByIds = async (ids = []) => {
  if (!ids.length) return;

  await prisma.attendance.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

export const cleanupResultsByIds = async (ids = []) => {
  if (!ids.length) return;

  await prisma.result.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};
