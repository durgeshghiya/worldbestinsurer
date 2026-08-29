# AdSense activation runbook

Everything on the code side is done. Ad placements exist across all the
high-inventory page types and are **env-gated**: each `<AdSlot>` renders
absolutely nothing until its `NEXT_PUBLIC_AD_SLOT_*` variable is set in
Vercel. That means placements ship safely while the account is still under
review — the live site is byte-for-byte unchanged until you flip them on.

## Current placement map

| Env variable | Page type | Pages | Position |
| --- | --- | --: | --- |
| `NEXT_PUBLIC_AD_SLOT_PRODUCT_MID` | `/product/[id]`, `/[country]/product/[id]` | ~2,130 | Between spec tables and editorial |
| `NEXT_PUBLIC_AD_SLOT_PRODUCT_END` | same | ~2,130 | After editorial, before reviews |
| `NEXT_PUBLIC_AD_SLOT_INSURER_END` | `/insurer/[slug]`, `/[country]/insurer/[slug]` | ~496 | After insurer editorial |
| `NEXT_PUBLIC_AD_SLOT_VS_END` | `/vs/[slug]`, `/[country]/vs/[slug]`, `/[country]/vs/insurer/[slug]` | ~1,800 | After comparison editorial |
| `NEXT_PUBLIC_AD_SLOT_COMPARE_MID` | `/compare/[category]`, `/[country]/compare/[category]` | ~52 | Between comparison table and plan grid |
| `NEXT_PUBLIC_AD_SLOT_LEARN_ARTICLE_END` | `/learn/[slug]` | ~133 | End of article |
| `NEXT_PUBLIC_AD_SLOT_FINANCE_ARTICLE_END` | `/finance/[slug]` | growing | End of article |
| `NEXT_PUBLIC_AD_SLOT_REPORT_END` | `/reports/[slug]` | 4 | End of report body |
| `NEXT_PUBLIC_AD_SLOT_INSURERS_TOP` | `/insurers` | 1 | Above directory grid |

Deliberately **not** monetised: the homepage (immersive artwork — an ad
would wreck it and it is the AdSense reviewer's first impression), tier-3
city pages (they are `noindex`, so no organic traffic to monetise), and
every policy page (privacy, disclaimer, methodology, contact).

Density is one to two units per page against 700–950 words of content,
which sits comfortably inside AdSense's "content must exceed ads"
expectation. Do not add more without re-reading the policy.

## Activation steps (once the account is approved)

1. **AdSense → Ads → By ad unit → Display ads.** Create one unit per row in
   the table above. Name them to match the variable so they stay traceable,
   e.g. `product-mid`, `product-end`, `insurer-end`, `vs-end`,
   `compare-mid`, `learn-article-end`, `finance-article-end`, `report-end`,
   `insurers-top`. Choose **Responsive**. Copy the `data-ad-slot` digits
   from each snippet — that number is the whole value, not the full snippet.

2. **Set the variables in Vercel** (project `worldbestinsurer-m9hn`,
   Production). Either paste them in the dashboard under Settings →
   Environment Variables, or from the repo root:

   ```bash
   vercel env add NEXT_PUBLIC_AD_SLOT_PRODUCT_MID production
   ```

   Repeat per variable. They are `NEXT_PUBLIC_*`, so they are inlined at
   build time and are not secrets.

3. **Redeploy.** `NEXT_PUBLIC_*` values bake into the bundle, so a rebuild
   is mandatory — setting the variable alone changes nothing.

   ```bash
   vercel --prod
   ```

4. **Verify.** After the deploy, a placement is live when the rendered HTML
   contains a real ad unit rather than only the loader script:

   ```bash
   curl -sL https://worldbestinsurer.com/in/product/hdfc-ergo-optima-secure/ \
     | grep -c '<ins class="adsbygoogle"'
   ```

   Expect `2` on a product page once both product variables are set. Ads
   may show blank for the first few hours while Google crawls the new
   inventory — that is normal, not a misconfiguration.

You can activate incrementally. Setting only `PRODUCT_MID` turns on that
one placement across ~2,130 pages and leaves everything else dormant.

## Auto ads

Auto ads are configured in the AdSense console (Ads → By site), not in this
repo — the loader script is already on every page, so enabling them takes
effect without a deploy. They are the fastest path to first revenue but
place units algorithmically, which on this site means they will land on the
immersive homepage. If you enable Auto ads, exclude the homepage in the
console, or accept that the artwork gets an ad dropped into it.

Manual placements generally earn more per impression than Auto ads on
content pages, and the two can run together.

## Notes on revenue mechanics

- **Insurance is a high-CPM vertical.** Product and comparison pages carry
  commercial intent, which is why they are placed first here.
- **The loader fires on first interaction, browser idle, or a 1.5s cap** —
  whichever comes first (`src/app/layout.tsx`). It used to wait for `load`
  plus a flat 2 seconds, which meant short sessions ended before any ad
  requested. Do not push that delay back out without a reason.
- **`AdSlot` reserves height** before the ad fills, so a filling ad does not
  shove content down and damage Cumulative Layout Shift.
- **Consent Mode v2 governs personalisation** in the EEA/UK/CH. Ads still
  serve there when consent is denied, just non-personalised and at lower
  rates. That is expected and compliant.
