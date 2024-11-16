import { prisma } from "@/lib/prisma";

export async function getUnits() {
  'use server'
  try {
    const units = await prisma.unit.findMany({
      include: {
        classSection: true,
        teacher: true,
      },
    });
    return units;
  } catch (error) {
    throw new Error('Failed to fetch units');
  }
}

export async function createUnit(data: any) {
  'use server'
  try {
    const unit = await prisma.unit.create({
      data,
    });
    return unit;
  } catch (error) {
    throw new Error('Failed to create unit');
  }
}