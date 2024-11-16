'use server'
import { prisma } from "@/lib/prisma";

export async function getStudents() {
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
  try {
    const student = await prisma.student.create({
      data,
    });
    return student;
  } catch (error) {
    throw new Error('Failed to create student');
  }
}
