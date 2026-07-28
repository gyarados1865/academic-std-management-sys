import bcrypt from "bcrypt";
import prisma from "../prisma/prismaClient.js";

export const getAllStudents = async (query = {}) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Number(query.limit) || 10);
  const search = query.search?.trim();
  const departmentId = query.departmentId?.trim();
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  const where = {};

  if (search) {
    where.OR = [
      {
        registrationNumber: {
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

  if (departmentId) {
    where.departmentId = departmentId;
  }

  const orderBy = {};

  if (sortBy === "name") {
    orderBy.user = {
      name: sortOrder,
    };
  } else if (sortBy === "registrationNumber") {
    orderBy.registrationNumber = sortOrder;
  } else {
    orderBy.createdAt = sortOrder;
  }

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: true,
        department: true,
      },
    }),
    prisma.student.count({ where }),
  ]);

  return {
    students,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getStudentById = async (id) => {
  return await prisma.student.findUnique({
    where: { id },
    include: {
      user: true,
      department: true,
      enrollments: {
        include: {
          subject: true,
        },
      },
      attendances: true,
      results: true,
    },
  });
};

export const createStudent = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "STUDENT",
      },
    });

    const student = await tx.student.create({
      data: {
        registrationNumber: data.registrationNo,
        gender: data.gender,
        departmentId: data.departmentId,
        userId: user.id,
      },
      include: {
        user: true,
        department: true,
      },
    });

    return student;
  });
};

export const updateStudent = async (id, data) => {
  return await prisma.$transaction(async (tx) => {
    const existingStudent = await tx.student.findUnique({
      where: { id },
    });

    if (!existingStudent) {
      return null;
    }

    await tx.user.update({
      where: {
        id: existingStudent.userId,
      },
      data: {
        name: data.name,
        email: data.email,
      },
    });

    const updatedStudent = await tx.student.update({
      where: { id },
      data: {
        registrationNumber: data.registrationNo,
        gender: data.gender,
        phone: data.phone,
        address: data.address,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        profileImage: data.profileImage,
        isActive: data.isActive,
        departmentId: data.departmentId,
      },
      include: {
        user: true,
        department: true,
      },
    });

    return updatedStudent;
  });
};

export const deleteStudent = async (id) => {
  return await prisma.$transaction(async (tx) => {
    const student = await tx.student.findUnique({
      where: { id },
    });

    if (!student) {
      return null;
    }

    await tx.student.delete({
      where: { id },
    });

    await tx.user.delete({
      where: {
        id: student.userId,
      },
    });

    return student;
  });
};