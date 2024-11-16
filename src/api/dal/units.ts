<<<<<<< HEAD
"use client";

=======
'use server'
>>>>>>> c5e3a9678663a7872cc63e0654785f9191c87520
import { prisma } from "@/lib/prisma";

export async function getUnits() {
  try {
    const units = await prisma.unit.findMany({
      include: {
        classSection: true,
        teacher: true,
      },
    });
    return units;
  } catch (error) {
    throw new Error("Failed to fetch units");
  }
}

export async function createUnit(data: any) {
<<<<<<< HEAD
  console.log("BACKEND: ", data);
=======
>>>>>>> c5e3a9678663a7872cc63e0654785f9191c87520
  try {
    const unit = await prisma.unit.create({
      data,
    });
    return unit;
  } catch (error) {
    throw new Error("Failed to create unit");
  }
}
