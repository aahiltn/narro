import { generateImageFromKeywords } from './image-gen.js';

async function runExample() {
  const keywords = ["airplane", "terminal", "luggage", "boarding gate"];
  const unitDescription = "describing an airport scene in Spanish";

  try {
    const result = await generateImageFromKeywords({
      keywords,
      unitDescription,
    });

    console.log("Generated Image:");
    console.log("Image URL:", result.imageUrl);
    console.log("Description:", result.description);
  } catch (error) {
    console.error("Failed to generate image:", error);
  }
}

runExample();
