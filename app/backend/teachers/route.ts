import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        sections: true,
        units: true,
      },
    });
    return NextResponse.json(teachers);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const teacher = await prisma.teacher.create({
      data: body,
    });
    return NextResponse.json(teacher);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
