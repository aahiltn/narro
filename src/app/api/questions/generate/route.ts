import { createQuestionFromKeywords } from "@/api/question-gen";
import { GenerateQuestionRequest } from "@/types/question";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body: GenerateQuestionRequest = await request.json();
    console.log("QUESTION BODY: ", body);

    if (!body.keywords || !body.unitDescription || !body.language) {
      return NextResponse.json(
        { error: "Keywords and unit description are required" },
        { status: 400 }
      );
    }

    const question = await createQuestionFromKeywords({
      keywords: body.keywords,
      unitDescription: body.unitDescription,
      language: body.language,
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error("Error generating question:", error);
    return NextResponse.json(
      { error: "Failed to generate question" },
      { status: 500 }
    );
  }
}
