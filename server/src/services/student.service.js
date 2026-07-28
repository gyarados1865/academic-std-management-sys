import bcrypt from "bcrypt";
import prisma from "../prisma/prismaClient.js";

export const getAllStudents = async () => {
  return await prisma.student.findMany({
    include: {
      user: true,
      department: true,
    },
  });
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