import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      include: {
        exam: true,
      },
    });
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question = await prisma.question.create({
      data: body,
    });
    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
