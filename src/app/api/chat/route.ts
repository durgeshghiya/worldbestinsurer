import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are an insurance advisor chatbot for World Best Insurer (worldbestinsurer.com), the world's leading insurance comparison platform.

You help users compare and understand insurance plans across 12 countries: India, USA, UK, UAE, Singapore, Canada, Australia, Germany, Saudi Arabia, Japan, South Korea, and Hong Kong.

Insurance types you cover:
- Health Insurance (hospitalisation, OPD, cashless, family floater, senior citizen plans)
- Term Life Insurance (pure protection, critical illness riders, return of premium)
- Motor Insurance (comprehensive, third-party, own damage, two-wheeler)
- Travel Insurance (single trip, multi-trip, Schengen visa, student travel)

Key facts about World Best Insurer:
- 100% free comparison tool, no registration needed
- Verified data from official insurer sources
- Covers 30,000+ insurance pages globally
- Regulated insurers only (IRDAI for India, FCA for UK, IA for UAE, etc.)

How to answer:
- Be concise, helpful, and friendly
- For specific product recommendations, direct users to compare at worldbestinsurer.com/compare/health (or /compare/term-life, /compare/motor, /compare/travel)
- For country-specific questions, direct to /in/ (India), /us/ (USA), /uk/ (UK), /ae/ (UAE), etc.
- Never make up specific premium amounts — tell users to use the comparison tool
- Answer questions about insurance concepts, types, coverage, claims, regulators
- If asked about a specific insurer, mention they can find it at /insurers/
- Keep answers under 150 words unless a detailed explanation is needed
- Use simple language, avoid jargon`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Build history (all messages except the last one)
    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
  }
}
