import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const response = await fetch("http://127.0.0.1:5002/synthesize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Coqui TTS Error: ${errorText}` }, { status: response.status });
    }

    const audioBuffer = await response.arrayBuffer();
    return new Response(audioBuffer, {
      headers: { "Content-Type": "audio/wav" },
    });
  } catch (error: any) {
    console.error("Coqui TTS Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
