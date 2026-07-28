import prisma from "../prisma/prismaClient.js";

export const getAllSubjects = async (query = {}) => {
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

  const [subjects, total] = await Promise.all([
    prisma.subject.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        semester: true,
      },
    }),
    prisma.subject.count({ where }),
  ]);

  return {
    subjects,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
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
