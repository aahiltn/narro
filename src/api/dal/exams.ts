'use server'
import { prisma } from "@/lib/prisma";

export async function getExams() {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        questions: true,
      },
    });
    return exams;
  } catch (error) {
    throw new Error('Failed to fetch exams');
  }
}

export async function createExam(data: any) {
  try {
    const exam = await prisma.exam.create({
      data,
    });
    return exam;
  } catch (error) {
    throw new Error('Failed to create exam');
  }
}
