import bcrypt from "bcrypt";
import prisma from "../prisma/prismaClient.js";

export const getAllTeachers = async (query = {}) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Number(query.limit) || 10);
  const search = query.search?.trim();
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  const where = {};

  if (search) {
    where.OR = [
      {
        employeeId: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        user: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        user: {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  const orderBy = {};

  if (sortBy === "name") {
    orderBy.user = {
      name: sortOrder,
    };
  } else if (sortBy === "employeeId") {
    orderBy.employeeId = sortOrder;
  } else {
    orderBy.createdAt = sortOrder;
  }

  const [teachers, total] = await Promise.all([
    prisma.teacher.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: true,
        department: true,
      },
    }),
    prisma.teacher.count({ where }),
  ]);

  return {
    teachers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getTeacherById = async (id) => {
  return await prisma.teacher.findUnique({
    where: { id },
    include: {
      user: true,
      department: true,
    },
  });
};

export const createTeacher = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "TEACHER",
      },
    });

    const teacher = await tx.teacher.create({
      data: {
        employeeId: data.employeeId,
        phone: data.phone,
        designation: data.designation,
        qualification: data.qualification,
        joiningDate: data.joiningDate ? new Date(data.joiningDate) : null,
        profileImage: data.profileImage,
        isActive: data.isActive,
        departmentId: data.departmentId,
        userId: user.id,
      },
      include: {
        user: true,
        department: true,
      },
    });

    return teacher;
  });
};

export const updateTeacher = async (id, data) => {
  return await prisma.$transaction(async (tx) => {
    const existingTeacher = await tx.teacher.findUnique({
      where: { id },
    });

    if (!existingTeacher) {
      return null;
    }

    await tx.user.update({
      where: {
        id: existingTeacher.userId,
      },
      data: {
        name: data.name,
        email: data.email,
      },
    });

    const updatedTeacher = await tx.teacher.update({
      where: { id },
      data: {
        employeeId: data.employeeId,
        phone: data.phone,
        designation: data.designation,
        qualification: data.qualification,
        joiningDate: data.joiningDate ? new Date(data.joiningDate) : null,
        profileImage: data.profileImage,
        isActive: data.isActive,
        departmentId: data.departmentId,
      },
      include: {
        user: true,
        department: true,
      },
    });

    return updatedTeacher;
  });
};

export const deleteTeacher = async (id) => {
  return await prisma.$transaction(async (tx) => {
    const teacher = await tx.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      return null;
    }

    await tx.teacher.delete({
      where: { id },
    });

    await tx.user.delete({
      where: {
        id: teacher.userId,
      },
    });

    return teacher;
  });
};
