import { NextResponse } from "next/server";
export async function GET() {
  const key = process.env.GEMINI_API_KEY;
  return NextResponse.json({
    hasKey: !!key,
    keyLength: key?.length,
    keyPrefix: key?.substring(0, 8),
  });
}
