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
    console.error("Error fetching units:", error);
    return NextResponse.json(
      { error: "Failed to fetch units" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("BACKEND POST data:", data);

    // Validate required fields
    if (!data.name || !data.language || !data.teacherNotes) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, language and teacherNotes are required",
        },
        { status: 400 }
      );
    }

    try {
      const unit = await prisma.unit.create({
        data: {
          name: data.name,
          language: data.language,
          keywords: data.keywords || [],
          teacherNotes: data.teacherNotes,
        },
      });
      return NextResponse.json(unit);
    } catch (prismaError) {
      // Log the specific Prisma error
      console.error("Prisma Create Error:", {
        error: prismaError,
        message:
          prismaError instanceof Error ? prismaError.message : "Unknown error",
        data: data,
      });

      return NextResponse.json(
        {
          error: "Database error creating unit",
          details:
            prismaError instanceof Error
              ? prismaError.message
              : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Server error in POST /api/units:", error);
    return NextResponse.json(
      {
        error: "Failed to create unit",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
