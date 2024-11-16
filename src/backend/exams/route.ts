import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        questions: true,
      },
    });
    return NextResponse.json(exams);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const exam = await prisma.exam.create({
      data: body,
    });
    return NextResponse.json(exam);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
