import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const units = await prisma.unit.findMany({
      include: {
        classSection: true,
        teacher: true,
      },
    });
    return NextResponse.json(units);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const unit = await prisma.unit.create({
      data: body,
    });
    return NextResponse.json(unit);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
