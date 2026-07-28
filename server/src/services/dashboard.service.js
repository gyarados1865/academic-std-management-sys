import prisma from "../prisma/prismaClient.js";

export const getDashboardStats = async () => {
  const [
    totalStudents,
    totalTeachers,
    totalDepartments,
    totalCourses,
    totalSemesters,
    totalSubjects,
    totalEnrollments,
    totalAttendanceRecords,
    totalResults,
  ] = await Promise.all([
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.department.count(),
    prisma.course.count(),
    prisma.semester.count(),
    prisma.subject.count(),
    prisma.enrollment.count(),
    prisma.attendance.count(),
    prisma.result.count(),
  ]);

  return {
    totalStudents,
    totalTeachers,
    totalDepartments,
    totalCourses,
    totalSemesters,
    totalSubjects,
    totalEnrollments,
    totalAttendanceRecords,
    totalResults,
  };
};
