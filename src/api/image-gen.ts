import 'dotenv/config';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure the API key is securely set as an environment variable
});

interface ImageGenParams {
  keywords: string[];
  unitDescription: string;
}

export async function generateImageFromKeywords({
  keywords,
  unitDescription,
}: ImageGenParams): Promise<{ imageUrl: string; description: string }> {
  try {
    // Generate a description using ChatGPT
    const descriptionResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant creating image descriptions for language learning materials.",
        },
        {
          role: "user",
          content: `Create a detailed image description (2-3 sentences) that incorporates these keywords: ${keywords.join(
            ", "
          )}. This is for a ~9th grade level language learning unit about: ${unitDescription}. 
          The description should be clear, visual, and appropriate for DALL-E to generate an image from. There should never be
          any text included in these images.`,
        },
      ],
      temperature: 0.7,
    });

    const imageDescription = descriptionResponse.choices[0]?.message?.content;

    if (!imageDescription) {
      throw new Error("Failed to generate image description");
    }

    // Generate an image using DALL-E
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a clear, educational image suitable for language learning: ${imageDescription}`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural",
    });

    const imageUrl = imageResponse.data[0]?.url;

    if (!imageUrl) {
      throw new Error("Failed to generate image");
    }

    return {
      imageUrl,
      description: imageDescription,
    };
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}
