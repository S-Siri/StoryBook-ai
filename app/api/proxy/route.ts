import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const imageUrl = url.searchParams.get("imageUrl");

  if (!imageUrl) {
    return NextResponse.json({ error: "Image URL is missing" }, { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const headers = new Headers(response.headers);
    return new Response(blob, { status: response.status, headers });
  } catch (error) {
    console.error("Image Proxy Error:", error);
    return NextResponse.json({ error: "Failed to load image" }, { status: 500 });
  }
}
