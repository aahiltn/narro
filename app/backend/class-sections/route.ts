import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sections = await prisma.classSection.findMany({
      include: {
        students: true,
        teacher: true,
        units: true,
      },
    });
    return NextResponse.json(sections);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const section = await prisma.classSection.create({
      data: body,
    });
    return NextResponse.json(section);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
