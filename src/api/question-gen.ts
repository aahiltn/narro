"use server";

import { createQuestion } from "./dal/questions";
import { generateImageFromKeywords } from "./image-gen";
import { GenerateQuestionRequest } from "@/types/question";

export async function createQuestionFromKeywords({
  keywords,
  unitDescription,
  language,
}: GenerateQuestionRequest) {
  try {
    const { imageUrl, description } = await generateImageFromKeywords({
      keywords,
      unitDescription,
    });

    const questionData = {
      image: imageUrl,
      prompt: description,
      language,
      keywords,
    };

    console.log("PAYLOAD: ", questionData);

    const newQuestion = await createQuestion(questionData);

    return {
      success: true,
      data: newQuestion,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
