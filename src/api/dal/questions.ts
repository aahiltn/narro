'use server'
import { prisma } from "@/lib/prisma";

export async function getQuestions() {
  try {
    const questions = await prisma.question.findMany({
      include: {
        exam: true,
      },
    });
    return questions;
  } catch (error) {
    throw new Error('Failed to fetch questions');
  }
}

export async function createQuestion(data: any) {
  try {
    const question = await prisma.question.create({
      data,
    });
    return question;
  } catch (error) {
    throw new Error('Failed to create question');
  }
}
