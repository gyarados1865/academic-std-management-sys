import prisma from "../prisma/prismaClient.js";

export const getAllDepartments = async (query = {}) => {
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

  const [departments, total] = await Promise.all([
    prisma.department.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        teachers: true,
        students: true,
        courses: true,
      },
    }),
    prisma.department.count({ where }),
  ]);

  return {
    departments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
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
