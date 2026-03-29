import { NextResponse } from "next/server";
export async function GET() {
  const key = process.env.GEMINI_API_KEY;

  // Test the key directly via fetch
  let apiTest = "not tested";
  if (key) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] }),
        }
      );
      apiTest = `HTTP ${res.status}`;
    } catch (e) {
      apiTest = `fetch error: ${e}`;
    }
  }

  return NextResponse.json({
    hasKey: !!key,
    keyLength: key?.length,
    keyPrefix: key?.substring(0, 8),
    apiTest,
  });
}
