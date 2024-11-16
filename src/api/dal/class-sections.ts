import { prisma } from "@/lib/prisma";

export async function getSections() {
  "use server";
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

export async function createSection(data: any) {
  "use server";
  try {
    const section = await prisma.classSection.create({
      data,
    });
    return section;
  } catch (error) {
    throw new Error("Failed to create section");
  }
}
