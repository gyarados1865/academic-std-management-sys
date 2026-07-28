import prisma from "../prisma/prismaClient.js";

export const getAllCourses = async (query = {}) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Number(query.limit) || 10);
  const search = query.search?.trim();
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  const where = {};

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        code: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const orderBy = {};

  if (sortBy === "name") {
    orderBy.name = sortOrder;
  } else if (sortBy === "code") {
    orderBy.code = sortOrder;
  } else {
    orderBy.createdAt = sortOrder;
  }

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        department: true,
      },
    }),
    prisma.course.count({ where }),
  ]);

  return {
    courses,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
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
