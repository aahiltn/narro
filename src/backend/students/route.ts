import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        classSections: true,
      },
    });
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const student = await prisma.student.create({
      data: body,
    });
    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
