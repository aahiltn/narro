"use server";
import { prisma } from "@/lib/prisma";
import { Question } from "@prisma/client";

export async function getQuestions() {
  try {
    const questions = await prisma.question.findMany({
      include: {
        exam: true,
      },
    });
    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw new Error("Failed to fetch questions");
  }
}

export async function createQuestion(data: {
  prompt: string;
  image?: string | null;
  language: string;
  keywords: string[];
}): Promise<Question> {
  try {
    const question = await prisma.question.create({
      data: {
        prompt: data.prompt,
        image: data.image || null,
        language: data.language,
        keywords: data.keywords,
      },
    });

    // Return a plain object instead of the Prisma model
    return {
      keywords: question.keywords,
      id: question.id,
      prompt: question.prompt,
      image: question.image,
      language: question.language,
      timeLimit: question.timeLimit,
      examId: question.examId,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  } catch (error) {
    console.error("Prisma error:", error);
    throw new Error("Failed to create question in database");
  }
}
