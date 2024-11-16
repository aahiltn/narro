"use server";
import { prisma } from "@/lib/prisma";
import { Prisma, ClassSection } from "@prisma/client";

export async function getSections(): Promise<ClassSection[]> {
  try {
    const sections = await prisma.classSection.findMany({
      include: {
        students: true,
        teacher: true,
        units: true,
      },
    });
    return sections;
  } catch (error) {
    throw new Error("Failed to fetch sections");
  }
}

export async function createSection(
  data: Prisma.ClassSectionCreateInput
): Promise<ClassSection> {
  try {
    const section = await prisma.classSection.create({
      data,
    });
    return section;
  } catch (error) {
    throw new Error("Failed to create section");
  }
}
