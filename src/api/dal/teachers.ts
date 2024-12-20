"use server";
import { prisma } from "@/lib/prisma";

export async function getTeachers() {
  "use server";
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        sections: true,
        units: true,
      },
    });
    return teachers;
  } catch (error) {
    throw new Error("Failed to fetch teachers");
  }
}

export async function createTeacher(data: any) {
  "use server";
  try {
    const teacher = await prisma.teacher.create({
      data,
    });
    return teacher;
  } catch (error) {
    throw new Error("Failed to create teacher");
  }
}
