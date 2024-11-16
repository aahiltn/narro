import { createExam } from "@/api/dal/exams";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.question.deleteMany();
  await prisma.exam.deleteMany();

  const unit = await getUnit("spanish");

  // Create mock exam
  const exam = await createExam({
    id: "test",
    name: "Spanish Language Test - Beginner Level",
    description: "This is a test exam",

    timeLimit: new Date(Date.now() + 45 * 60 * 1000),
    questions: {
      create: [
        {
          prompt: "¿Cómo se dice 'hello' en español?",
        },
        {
          prompt: "Complete la frase: 'Yo ___ estudiante.'",
        },
        {
          prompt: "¿Cuál es el plural de 'casa'?",
        },
        {
          prompt: "¿Qué significa 'gato' en inglés?",
        },
        {
          prompt: "¿Cuál es el número 'three' en español?",
        },
      ],
    },
  });

  console.log("Seeded: ", { exam });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
