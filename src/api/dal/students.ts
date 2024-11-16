import { prisma } from "@/lib/prisma";

export async function getStudents() {
  'use server'
  try {
    const students = await prisma.student.findMany({
      include: {
        classSections: true,
      },
    });
    return students;
  } catch (error) {
    throw new Error('Failed to fetch students');
  }
}

export async function createStudent(data: any) {
  'use server'
  try {
    const student = await prisma.student.create({
      data,
    });
    return student;
  } catch (error) {
    throw new Error('Failed to create student');
  }
}
