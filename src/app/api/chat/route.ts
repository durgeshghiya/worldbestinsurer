import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, getAllInsurers } from "@/lib/data";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Build a compact product context summary for the AI.
 * Injected into the system prompt so the AI can reference actual products.
 */
function buildProductContext(countryCode?: string): string {
  const cc = countryCode || "in";
  const products = getAllProducts(cc).slice(0, 30); // top 30 for context window
  const insurers = getAllInsurers(cc);

  if (products.length === 0) return "";

  const productLines = products.map((p) => {
    const csr = p.claimSettlement?.ratio ? ` CSR:${p.claimSettlement.ratio}%` : "";
    const hospitals = p.networkHospitals?.count ? ` Hospitals:${p.networkHospitals.count}` : "";
    return `- ${p.productName} by ${p.insurerName} (${p.category}) | Premium: ${p.premiumRange.illustrativeMin}-${p.premiumRange.illustrativeMax}/yr | Cover: ${p.sumInsured.min}-${p.sumInsured.max}${csr}${hospitals}`;
  });

  const insurerLines = insurers.slice(0, 15).map((i) => {
    const csr = i.claimSettlementRatio?.value ? ` CSR:${i.claimSettlementRatio.value}%` : "";
    return `- ${i.shortName}${csr} (est. ${i.established || "N/A"})`;
  });

  return `\n\n--- PRODUCT DATA (${cc.toUpperCase()}) ---\nTop products:\n${productLines.join("\n")}\n\nKey insurers:\n${insurerLines.join("\n")}\n--- END PRODUCT DATA ---`;
}

const BASE_SYSTEM_PROMPT = `You are Zura, the AI insurance advisor for World Best Insurer (worldbestinsurer.com).

ROLE: Help users compare and understand insurance plans. You have access to real product data from the platform.

COVERAGE: 12 countries (India, USA, UK, UAE, Singapore, Canada, Australia, Germany, Saudi Arabia, Japan, South Korea, Hong Kong) across Health, Term Life, Motor, and Travel insurance.

RULES:
1. Reference actual products from the data provided when answering — cite specific plan names, CSR ratios, and premium ranges
2. Always link to comparison pages: /[cc]/compare/health, /[cc]/compare/term-life, /[cc]/compare/motor, /[cc]/compare/travel
3. For personalized recommendations, suggest the "Find My Plan" quiz: /[cc]/find/[category]
4. Never make up premiums not in the data — say "check the comparison tool for exact estimates"
5. Mention the premium estimator on compare pages for personalized pricing
6. Keep answers under 150 words unless a detailed explanation is needed
7. Be honest about limitations: "I explain insurance features but cannot give personalized financial advice"
8. If user shows purchase intent, mention the free quote form on each product page

IMPORTANT DISCLAIMER: World Best Insurer does not sell insurance. Always remind users to verify details with the insurer directly.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, countryCode } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    // Build context-aware system prompt
    const productContext = buildProductContext(countryCode);
    const systemPrompt = BASE_SYSTEM_PROMPT + productContext;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    // Build history — only user/model pairs, must start with user
    const allButLast = messages.slice(0, -1).filter(
      (m: { role: string; content: string }) => m.role === "user" || m.role === "assistant"
    );
    const firstUserIdx = allButLast.findIndex((m: { role: string }) => m.role === "user");
    const trimmed = firstUserIdx >= 0 ? allButLast.slice(firstUserIdx) : [];
    const history = trimmed.map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Chat API error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
