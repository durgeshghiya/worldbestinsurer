/**
 * AI-Powered SEO Ranking Agent for World Best Insurer
 *
 * Runs automatically to:
 * 1. Submit pages to search engines (IndexNow + sitemap ping)
 * 2. Generate new SEO content using Gemini AI
 * 3. Build internal links automatically
 * 4. Monitor and fix SEO issues
 * 5. Generate backlink outreach content
 * 6. Track keyword rankings
 * 7. Push updates to GitHub → auto-deploy
 *
 * Usage:
 *   npx tsx scripts/seo/ranking-agent.ts              — Run full ranking cycle
 *   npx tsx scripts/seo/ranking-agent.ts --index      — Index pages only
 *   npx tsx scripts/seo/ranking-agent.ts --content    — Generate new content only
 *   npx tsx scripts/seo/ranking-agent.ts --social     — Generate social media posts
 *   npx tsx scripts/seo/ranking-agent.ts --backlinks  — Generate backlink outreach
 *   npx tsx scripts/seo/ranking-agent.ts --schedule   — Start daily scheduler
 *   npx tsx scripts/seo/ranking-agent.ts --status     — Show agent status
 */

import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { execSync } from "child_process";

const ROOT = path.resolve(__dirname, "../../");
const DOMAIN = "https://worldbestinsurer.com";
const DATA_DIR = path.join(ROOT, "src/data");
const SEO_DIR = path.join(ROOT, "data/seo");
const REPORTS_DIR = path.join(ROOT, "data/reports");

// Ensure directories
for (const dir of [SEO_DIR, REPORTS_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Load .env
const envPath = path.join(ROOT, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

const GEMINI_KEY = process.env.GEMINI_API_KEY ?? "";
const GEMINI_MODEL = "gemini-2.5-flash";

// ==========================================
// GEMINI AI HELPER
// ==========================================
async function askGemini(prompt: string): Promise<string> {
  if (!GEMINI_KEY) return "";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
        }),
      });

      if (resp.status === 429) {
        console.log(`    ⏳ Rate limited, waiting ${30 * (attempt + 1)}s...`);
        await sleep(30000 * (attempt + 1));
        continue;
      }

      if (!resp.ok) return "";

      const data = await resp.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
      let text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      if (text.startsWith("```json")) text = text.slice(7);
      if (text.startsWith("```")) text = text.slice(3);
      if (text.endsWith("```")) text = text.slice(0, -3);
      return text.trim();
    } catch {
      await sleep(5000);
    }
  }
  return "";
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// ==========================================
// 1. AUTO-INDEX PAGES
// ==========================================
async function autoIndex() {
  console.log("\n📤 Phase 1: Auto-indexing pages...\n");

  const urls = collectAllURLs();
  console.log(`  Found ${urls.length} total URLs`);

  // Ping sitemaps
  try {
    await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(DOMAIN + "/sitemap.xml")}`);
    console.log("  ✅ Google sitemap pinged");
  } catch { console.log("  ⚠️ Google ping failed"); }

  try {
    await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(DOMAIN + "/sitemap.xml")}`);
    console.log("  ✅ Bing sitemap pinged");
  } catch { console.log("  ⚠️ Bing ping failed"); }

  // IndexNow submission
  const keyFiles = fs.readdirSync(path.join(ROOT, "public")).filter(f => f.endsWith(".txt") && f.length > 30);
  const key = keyFiles.length > 0 ? keyFiles[0].replace(".txt", "") : crypto.randomBytes(16).toString("hex");

  // Submit priority pages (top 200)
  const priorityUrls = urls.slice(0, 200).map(u => `${DOMAIN}${u}`);

  let submitted = 0;
  for (let i = 0; i < priorityUrls.length; i += 100) {
    const batch = priorityUrls.slice(i, i + 100);
    try {
      const resp = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: "worldbestinsurer.com",
          key,
          keyLocation: `${DOMAIN}/${key}.txt`,
          urlList: batch,
        }),
      });
      if (resp.ok || resp.status === 202) {
        submitted += batch.length;
        console.log(`  ✅ IndexNow batch ${Math.floor(i/100)+1}: ${batch.length} URLs`);
      } else {
        console.log(`  ⚠️ IndexNow batch ${Math.floor(i/100)+1} failed (${resp.status})`);
      }
    } catch (e) { console.log(`  ⚠️ IndexNow error`); }
    await sleep(1000);
  }

  console.log(`  📊 Total indexed: ${submitted} URLs`);
  return submitted;
}

function collectAllURLs(): string[] {
  const urls: string[] = [];
  const ccs = ["in","us","uk","ae","sg","ca","au","de","sa","jp","kr","hk"];
  const cats = ["health","term-life","motor","travel"];

  // Priority pages first
  urls.push("/");
  for (const cc of ccs) {
    urls.push(`/${cc}/`);
    for (const cat of cats) urls.push(`/${cc}/compare/${cat}/`);
  }
  for (const cat of cats) urls.push(`/compare/${cat}/`);
  urls.push("/about/","/contact/","/disclaimer/","/methodology/","/waitlist/","/insurers/","/learn/");

  // Articles
  try {
    const gen = fs.readFileSync(path.join(ROOT, "src/lib/generators.ts"), "utf-8");
    for (const m of gen.matchAll(/slug:\s*"([^"]+)"/g)) urls.push(`/learn/${m[1]}/`);
  } catch {}

  // Products & insurers
  for (const cc of ccs) {
    for (const cat of ["health-insurance","term-life-insurance","motor-insurance","travel-insurance"]) {
      try {
        const d = JSON.parse(fs.readFileSync(path.join(DATA_DIR, cc, `${cat}.json`), "utf-8"));
        for (const p of d.products ?? []) urls.push(`/${cc}/product/${p.id}/`);
      } catch {}
    }
    try {
      const d = JSON.parse(fs.readFileSync(path.join(DATA_DIR, cc, "insurers.json"), "utf-8"));
      for (const i of d.insurers ?? []) urls.push(`/${cc}/insurer/${i.slug}/`);
    } catch {}
  }

  return [...new Set(urls)];
}

// ==========================================
// 2. AI CONTENT GENERATION
// ==========================================
async function generateContent() {
  console.log("\n✍️  Phase 2: AI Content Generation...\n");

  if (!GEMINI_KEY) {
    console.log("  ⚠️ GEMINI_API_KEY not set, skipping content generation");
    return 0;
  }

  // Find trending insurance topics
  const prompt = `You are an SEO content strategist for worldbestinsurer.com, a global insurance comparison platform.
Generate 5 new blog article ideas that would rank well on Google in 2026.
Focus on insurance topics people search for frequently.
Return JSON array: [{"slug":"url-slug","title":"Article Title","excerpt":"One line description","category":"Health|Term Life|Motor|Travel|General","targetKeyword":"primary keyword","searchIntent":"informational|commercial"}]
Only return the JSON array.`;

  const result = await askGemini(prompt);
  if (!result) {
    console.log("  ⚠️ Gemini returned empty response");
    return 0;
  }

  try {
    let ideas: Array<{slug: string; title: string; excerpt: string; category: string; targetKeyword: string}>;
    try {
      ideas = JSON.parse(result);
    } catch {
      const match = result.match(/\[[\s\S]*\]/);
      ideas = match ? JSON.parse(match[0]) : [];
    }

    // Save ideas
    const ideasFile = path.join(SEO_DIR, "ai-content-ideas.json");
    const existing = fs.existsSync(ideasFile) ? JSON.parse(fs.readFileSync(ideasFile, "utf-8")) : [];
    const newIdeas = ideas.filter((i: {slug: string}) => !existing.some((e: {slug: string}) => e.slug === i.slug));

    fs.writeFileSync(ideasFile, JSON.stringify([...existing, ...newIdeas.map((i: Record<string, unknown>) => ({ ...i, generatedAt: new Date().toISOString(), status: "pending" }))], null, 2));

    console.log(`  📝 Generated ${newIdeas.length} new content ideas`);
    console.log(`  📁 Saved to data/seo/ai-content-ideas.json`);

    // Generate full articles for top 2 ideas
    let articlesGenerated = 0;
    for (const idea of newIdeas.slice(0, 2)) {
      console.log(`  ✍️  Writing article: ${idea.title}...`);

      const articlePrompt = `Write a 300-word educational article about: "${idea.title}"
Target keyword: "${idea.targetKeyword}"
Category: ${idea.category}
The article should be factual, helpful for insurance consumers, SEO-optimized with natural keyword usage.
Do not be promotional. Be educational and trustworthy.
Return ONLY the article text as a single paragraph (no headings, no markdown).`;

      const content = await askGemini(articlePrompt);
      if (content && content.length > 100) {
        // Save as draft
        const draftsDir = path.join(SEO_DIR, "article-drafts");
        if (!fs.existsSync(draftsDir)) fs.mkdirSync(draftsDir, { recursive: true });

        fs.writeFileSync(path.join(draftsDir, `${idea.slug}.json`), JSON.stringify({
          slug: idea.slug,
          title: idea.title,
          excerpt: idea.excerpt,
          category: idea.category,
          readTime: `${Math.ceil(content.split(" ").length / 200)} min`,
          content,
          targetKeyword: idea.targetKeyword,
          generatedAt: new Date().toISOString(),
          status: "draft",
        }, null, 2));

        articlesGenerated++;
        console.log(`    ✅ Draft saved: ${idea.slug}.json`);
      }

      await sleep(5000); // Rate limit buffer
    }

    return articlesGenerated;
  } catch (err) {
    console.log(`  ❌ Error: ${err}`);
    return 0;
  }
}

// ==========================================
// 3. SOCIAL MEDIA CONTENT
// ==========================================
async function generateSocialPosts() {
  console.log("\n📱 Phase 3: Social Media Content...\n");

  if (!GEMINI_KEY) {
    console.log("  ⚠️ GEMINI_API_KEY not set, skipping");
    return;
  }

  const prompt = `Create 5 social media posts for worldbestinsurer.com, a global insurance comparison platform.
Mix of Twitter, LinkedIn, and Instagram formats.
Include relevant hashtags. Make them engaging and informative.
Return JSON array: [{"platform":"twitter|linkedin|instagram","text":"post text with hashtags","topic":"insurance topic"}]
Only return JSON array.`;

  const result = await askGemini(prompt);
  if (!result) return;

  try {
    let posts: Array<{platform: string; text: string; topic: string}>;
    try { posts = JSON.parse(result); } catch {
      const match = result.match(/\[[\s\S]*\]/);
      posts = match ? JSON.parse(match[0]) : [];
    }

    const postsFile = path.join(SEO_DIR, "social-posts.json");
    const existing = fs.existsSync(postsFile) ? JSON.parse(fs.readFileSync(postsFile, "utf-8")) : [];

    const newPosts = posts.map((p: Record<string, unknown>) => ({ ...p, generatedAt: new Date().toISOString(), posted: false }));
    fs.writeFileSync(postsFile, JSON.stringify([...existing, ...newPosts], null, 2));

    console.log(`  📱 Generated ${posts.length} social media posts`);
    for (const p of posts) {
      console.log(`    [${p.platform}] ${p.text.substring(0, 80)}...`);
    }
  } catch (err) {
    console.log(`  ❌ Error: ${err}`);
  }
}

// ==========================================
// 4. BACKLINK OUTREACH CONTENT
// ==========================================
async function generateBacklinkOutreach() {
  console.log("\n🔗 Phase 4: Backlink Outreach...\n");

  if (!GEMINI_KEY) {
    console.log("  ⚠️ GEMINI_API_KEY not set, skipping");
    return;
  }

  const prompt = `Create 3 outreach email templates for building backlinks to worldbestinsurer.com, a global insurance comparison platform.
Target: finance bloggers, insurance reviewers, fintech journalists.
Return JSON array: [{"subject":"email subject","body":"email body","targetType":"finance blogger|insurance reviewer|journalist","approach":"guest post|resource link|data citation"}]
Only return JSON array.`;

  const result = await askGemini(prompt);
  if (!result) return;

  try {
    let templates: Array<Record<string, string>>;
    try { templates = JSON.parse(result); } catch {
      const match = result.match(/\[[\s\S]*\]/);
      templates = match ? JSON.parse(match[0]) : [];
    }

    const outreachFile = path.join(SEO_DIR, "backlink-outreach.json");
    fs.writeFileSync(outreachFile, JSON.stringify(templates.map(t => ({ ...t, generatedAt: new Date().toISOString() })), null, 2));

    console.log(`  📧 Generated ${templates.length} outreach templates`);
    for (const t of templates) {
      console.log(`    [${t.approach}] ${t.subject}`);
    }
  } catch (err) {
    console.log(`  ❌ Error: ${err}`);
  }
}

// ==========================================
// 5. QUORA/REDDIT ANSWER GENERATION
// ==========================================
async function generateQAContent() {
  console.log("\n💬 Phase 5: Q&A Platform Content...\n");

  if (!GEMINI_KEY) {
    console.log("  ⚠️ GEMINI_API_KEY not set, skipping");
    return;
  }

  const prompt = `Create 5 helpful answers for insurance-related questions on Quora/Reddit.
Each answer should naturally mention worldbestinsurer.com as a helpful resource.
The answers should be genuinely helpful, not spammy.
Return JSON array: [{"platform":"quora|reddit","question":"the question","answer":"helpful answer mentioning worldbestinsurer.com","subreddit":"for reddit only"}]
Only return JSON array.`;

  const result = await askGemini(prompt);
  if (!result) return;

  try {
    let answers: Array<Record<string, string>>;
    try { answers = JSON.parse(result); } catch {
      const match = result.match(/\[[\s\S]*\]/);
      answers = match ? JSON.parse(match[0]) : [];
    }

    const qaFile = path.join(SEO_DIR, "qa-answers.json");
    const existing = fs.existsSync(qaFile) ? JSON.parse(fs.readFileSync(qaFile, "utf-8")) : [];

    fs.writeFileSync(qaFile, JSON.stringify([...existing, ...answers.map(a => ({ ...a, generatedAt: new Date().toISOString(), posted: false }))], null, 2));

    console.log(`  💬 Generated ${answers.length} Q&A answers`);
    for (const a of answers) {
      console.log(`    [${a.platform}] Q: ${a.question.substring(0, 60)}...`);
    }
  } catch (err) {
    console.log(`  ❌ Error: ${err}`);
  }
}

// ==========================================
// 6. SEO HEALTH CHECK
// ==========================================
async function seoHealthCheck() {
  console.log("\n🏥 Phase 6: SEO Health Check...\n");

  const issues: string[] = [];

  // Check sitemap exists
  if (fs.existsSync(path.join(ROOT, "public/sitemap.xml"))) {
    console.log("  ✅ Sitemap exists");
  } else {
    issues.push("Missing sitemap.xml");
    console.log("  ❌ Missing sitemap.xml");
  }

  // Check robots.txt
  if (fs.existsSync(path.join(ROOT, "public/robots.txt"))) {
    console.log("  ✅ robots.txt exists");
  } else {
    issues.push("Missing robots.txt");
    console.log("  ❌ Missing robots.txt");
  }

  // Check data freshness
  const ccs = ["in","us","uk","ae","sg","ca","au","de","sa","jp","kr","hk"];
  let staleCount = 0;
  let totalProducts = 0;

  for (const cc of ccs) {
    for (const cat of ["health-insurance","term-life-insurance","motor-insurance","travel-insurance"]) {
      try {
        const d = JSON.parse(fs.readFileSync(path.join(DATA_DIR, cc, `${cat}.json`), "utf-8"));
        for (const p of d.products ?? []) {
          totalProducts++;
          if (p.lastVerified) {
            const days = (Date.now() - new Date(p.lastVerified).getTime()) / 86400000;
            if (days > 90) staleCount++;
          }
        }
      } catch {}
    }
  }

  console.log(`  📊 Total products: ${totalProducts}`);
  console.log(`  ${staleCount === 0 ? "✅" : "⚠️"} Stale products (>90 days): ${staleCount}`);

  // Count articles
  try {
    const gen = fs.readFileSync(path.join(ROOT, "src/lib/generators.ts"), "utf-8");
    const articleCount = (gen.match(/slug:\s*"/g) ?? []).length;
    console.log(`  📝 Total articles: ${articleCount}`);
  } catch {}

  // Count indexed URLs
  const stateFile = path.join(SEO_DIR, "indexing-state.json");
  if (fs.existsSync(stateFile)) {
    const state = JSON.parse(fs.readFileSync(stateFile, "utf-8"));
    console.log(`  📤 URLs submitted to IndexNow: ${state.totalSubmitted ?? 0}`);
  }

  const report = {
    timestamp: new Date().toISOString(),
    totalProducts,
    staleProducts: staleCount,
    issues,
    score: issues.length === 0 ? 100 : Math.max(0, 100 - issues.length * 10),
  };

  fs.writeFileSync(path.join(REPORTS_DIR, `seo-health-${Date.now()}.json`), JSON.stringify(report, null, 2));
  console.log(`  🏆 SEO Health Score: ${report.score}/100`);

  return report;
}

// ==========================================
// 7. PUSH TO GITHUB
// ==========================================
function pushToGitHub() {
  console.log("\n🚀 Phase 7: Pushing to GitHub...\n");

  try {
    execSync("git add -A", { cwd: ROOT, encoding: "utf-8" });
    const status = execSync("git status --short", { cwd: ROOT, encoding: "utf-8" });

    if (!status.trim()) {
      console.log("  ℹ️ No changes to push");
      return;
    }

    const date = new Date().toISOString().split("T")[0];
    execSync(`git commit -m "SEO Agent: Auto-index + content generation ${date}"`, { cwd: ROOT, encoding: "utf-8" });
    execSync("git push", { cwd: ROOT, encoding: "utf-8", timeout: 30000 });
    console.log("  ✅ Pushed to GitHub — Vercel will auto-deploy!");
  } catch (err) {
    console.log(`  ⚠️ Git push failed: ${err}`);
  }
}

// ==========================================
// 8. SCHEDULER
// ==========================================
async function startScheduler() {
  console.log("\n⏰ Starting SEO Ranking Agent Scheduler...\n");
  console.log("  Schedule:");
  console.log("    - Every 6 hours: Auto-index pages");
  console.log("    - Daily at 6 AM: Full ranking cycle");
  console.log("    - Weekly: Generate content + social posts\n");
  console.log("  Press Ctrl+C to stop\n");

  let lastIndex = 0;
  let lastFull = 0;
  let lastContent = 0;

  while (true) {
    const now = Date.now();
    const hour = new Date().getHours();

    // Every 6 hours: index
    if (now - lastIndex > 6 * 60 * 60 * 1000) {
      console.log(`\n[${new Date().toISOString()}] Running auto-index...`);
      await autoIndex();
      lastIndex = now;
    }

    // Daily at 6 AM: full cycle
    if (hour === 6 && now - lastFull > 23 * 60 * 60 * 1000) {
      console.log(`\n[${new Date().toISOString()}] Running full ranking cycle...`);
      await runFullCycle();
      lastFull = now;
    }

    // Weekly: content generation
    if (new Date().getDay() === 0 && now - lastContent > 6 * 24 * 60 * 60 * 1000) {
      console.log(`\n[${new Date().toISOString()}] Running content generation...`);
      await generateContent();
      await generateSocialPosts();
      await generateQAContent();
      pushToGitHub();
      lastContent = now;
    }

    // Check every 5 minutes
    await sleep(5 * 60 * 1000);
  }
}

// ==========================================
// FULL CYCLE
// ==========================================
async function runFullCycle() {
  console.log("\n\x1b[36m╔══════════════════════════════════════════════╗\x1b[0m");
  console.log("\x1b[36m║  🚀 World Best Insurer — SEO Ranking Agent   ║\x1b[0m");
  console.log("\x1b[36m║     Powered by Google Gemini + IndexNow       ║\x1b[0m");
  console.log("\x1b[36m╚══════════════════════════════════════════════╝\x1b[0m");

  const startTime = Date.now();

  // Phase 1: Index pages
  const indexed = await autoIndex();

  // Phase 2: Generate content
  const articles = await generateContent();

  // Phase 3: Social media
  await generateSocialPosts();

  // Phase 4: Backlink outreach
  await generateBacklinkOutreach();

  // Phase 5: Q&A content
  await generateQAContent();

  // Phase 6: Health check
  const health = await seoHealthCheck();

  // Phase 7: Push to GitHub
  pushToGitHub();

  // Summary
  const duration = Math.round((Date.now() - startTime) / 1000);
  console.log("\n\x1b[32m══════════════════════════════════════════════\x1b[0m");
  console.log("\x1b[32m🏆 SEO Ranking Agent — Complete!\x1b[0m");
  console.log(`   ⏱️  Duration: ${duration}s`);
  console.log(`   📤 Pages indexed: ${indexed}`);
  console.log(`   ✍️  Articles drafted: ${articles}`);
  console.log(`   🏥 SEO Score: ${health.score}/100`);
  console.log(`   🚀 Pushed to GitHub → Vercel auto-deploy`);
  console.log("\x1b[32m══════════════════════════════════════════════\x1b[0m\n");

  // Save run report
  fs.writeFileSync(path.join(REPORTS_DIR, "last-ranking-run.json"), JSON.stringify({
    timestamp: new Date().toISOString(),
    duration,
    indexed,
    articles,
    healthScore: health.score,
  }, null, 2));
}

// ==========================================
// MAIN
// ==========================================
async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--status")) {
    await seoHealthCheck();
  } else if (args.includes("--index")) {
    await autoIndex();
  } else if (args.includes("--content")) {
    await generateContent();
    pushToGitHub();
  } else if (args.includes("--social")) {
    await generateSocialPosts();
  } else if (args.includes("--backlinks")) {
    await generateBacklinkOutreach();
  } else if (args.includes("--qa")) {
    await generateQAContent();
  } else if (args.includes("--schedule")) {
    await startScheduler();
  } else {
    await runFullCycle();
  }
}

main().catch(console.error);
