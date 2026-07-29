import prisma from "../../src/prisma/prismaClient.js";

export const cleanupUsersByEmails = async (emails = []) => {
  const uniqueEmails = [...new Set((emails || []).filter(Boolean))];
  if (!uniqueEmails.length) return { count: 0 };

  console.log("[cleanup] cleanupUsersByEmails", uniqueEmails);
  const result = await prisma.user.deleteMany({
    where: {
      email: {
        in: uniqueEmails,
      },
    },
  });
  console.log("[cleanup] cleanupUsersByEmails result", result);

  return result;
};

export const cleanupStudentsByIds = async (ids = []) => {
  const uniqueIds = [...new Set((ids || []).filter(Boolean))];
  if (!uniqueIds.length) return { count: 0 };

  console.log("[cleanup] cleanupStudentsByIds", uniqueIds);

  const students = await prisma.student.findMany({
    where: {
      id: {
        in: uniqueIds,
      },
    },
    select: {
      userId: true,
    },
  });

  const userIds = students.map((student) => student.userId);
  console.log("[cleanup] cleanupStudentsByIds userIds", userIds);

  const attendanceResult = await prisma.attendance.deleteMany({
    where: {
      studentId: {
        in: uniqueIds,
      },
    },
  });
  console.log("[cleanup] cleanupStudentsByIds attendanceResult", attendanceResult);

  const resultResult = await prisma.result.deleteMany({
    where: {
      studentId: {
        in: uniqueIds,
      },
    },
  });
  console.log("[cleanup] cleanupStudentsByIds resultResult", resultResult);

  const enrollmentResult = await prisma.enrollment.deleteMany({
    where: {
      studentId: {
        in: uniqueIds,
      },
    },
  });
  console.log("[cleanup] cleanupStudentsByIds enrollmentResult", enrollmentResult);

  const studentResult = await prisma.student.deleteMany({
    where: {
      id: {
        in: uniqueIds,
      },
    },
  });
  console.log("[cleanup] cleanupStudentsByIds studentResult", studentResult);

  if (userIds.length > 0) {
    const userResult = await prisma.user.deleteMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
    console.log("[cleanup] cleanupStudentsByIds userResult", userResult);
  }

  return studentResult;
};

export const cleanupTeachersByIds = async (ids = []) => {
  const uniqueIds = [...new Set((ids || []).filter(Boolean))];
  if (!uniqueIds.length) return { count: 0 };

  console.log("[cleanup] cleanupTeachersByIds", uniqueIds);

  const teachers = await prisma.teacher.findMany({
    where: {
      id: {
        in: uniqueIds,
      },
    },
    select: {
      userId: true,
    },
  });

  const userIds = teachers.map((teacher) => teacher.userId);
  console.log("[cleanup] cleanupTeachersByIds userIds", userIds);

  const teacherResult = await prisma.teacher.deleteMany({
    where: {
      id: {
        in: uniqueIds,
      },
    },
  });
  console.log("[cleanup] cleanupTeachersByIds teacherResult", teacherResult);

  if (userIds.length > 0) {
    const userResult = await prisma.user.deleteMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
    console.log("[cleanup] cleanupTeachersByIds userResult", userResult);
  }

  return teacherResult;
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
