import { prisma } from "@/lib/prisma";
import axios from "axios";

export async function getExams() {
  "use server";
  try {
    const exams = await prisma.exam.findMany({
      include: {
        questions: true,
      },
    });
    return exams;
  } catch (error) {
    throw new Error("Failed to fetch exams");
  }
}

export async function createExam(data: any) {
  "use server";
  try {
    const exam = await prisma.exam.create({
      data,
    });
    return exam;
  } catch (error) {
    throw new Error("Failed to create exam");
  }
}

export async function getExam(id: string) {
  "use server";
  const exam = await prisma.exam.findUnique({
    where: { id },
  });
  return exam;
}
