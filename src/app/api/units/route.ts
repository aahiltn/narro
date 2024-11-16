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
    return NextResponse.json(
      { error: "Failed to fetch units" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("BACKEND: ", data);

    // Validate required fields
    if (!data.language || !data.teacherNotes) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: language and teacherNotes are required",
        },
        { status: 400 }
      );
    }

    const unit = await prisma.unit.create({
      data: {
        language: data.language,
        keywords: data.keywords || [],
        teacherNotes: data.teacherNotes,
      },
    });

    return NextResponse.json(unit);
  } catch (error) {
    console.error("Server error creating unit:", error);
    return NextResponse.json(
      {
        error: "Failed to create unit",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
