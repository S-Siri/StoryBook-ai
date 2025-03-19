import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.FAL_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Fal AI API key is missing" }, { status: 500 });
    }
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Set up Fal AI client with API Key
    fal.config({
      credentials: apiKey,
    });

    console.log("Requesting image with prompt:", prompt);

    // Request AI-generated image
    const result = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt,
        image_size: "landscape_4_3",
        num_inference_steps: 4,
        num_images: 1,
        enable_safety_checker: true,
      },
      logs: true,
    });

    console.log("Fal AI Response:", JSON.stringify(result, null, 2));

    const imageUrl = result?.data?.images?.[0]?.url;
    if (!imageUrl) {
      console.error("Error: No image URL in response");
      return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
    }

    console.log("Generated Image URL:", imageUrl);
    return NextResponse.json({ imageUrl });

  } catch (error: any) {
    console.error("Fal AI Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
