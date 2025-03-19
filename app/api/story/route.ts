import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { characterName, theme, genre, language } = await req.json();

    if (!characterName || !theme || !genre || !language) {
      return NextResponse.json({ error: "All fields (characterName, theme, genre, language) are required" }, { status: 400 });
    }

    const prompt = `Create a children's story about ${characterName} who embarks on a ${theme} in the ${genre} genre. The story should be in ${language}. Include a moral lesson at the end.`;

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "mistral-tiny",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Mistral API Error: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ story: data.choices[0].message.content });

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
