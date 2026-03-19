/**
 * Smoke test for genspec-portal.
 * Run after every significant change: node scripts/smoke-test.js [url]
 *
 * Navigates to the page, waits for async data to load, takes a full-page
 * screenshot, and asserts that critical elements are present and non-empty.
 * Fails with exit code 1 on any assertion failure.
 */

import { chromium } from "playwright";

const TARGET_URL =
  process.argv[2] ?? "https://jghiringhelli.github.io/genspec-portal/";
const SCREENSHOT_PATH = "screenshot-smoke.png";
const LOAD_TIMEOUT_MS = 15_000;

const CHECKS = [
  {
    id: "hero-heading",
    selector: ".hero h1",
    check: (text) => text.length > 10,
    description: "Hero heading renders",
  },
  {
    id: "stats-loaded",
    selector: "#stat-tags",
    check: (text) => parseInt(text, 10) > 0,
    description: "Project archetype count > 0 (taxonomy.json loaded)",
  },
  {
    id: "tag-grid-populated",
    selector: ".tag-card",
    check: (_, count) => count >= 20,
    description: "At least 20 tag cards rendered",
    multiple: true,
  },
  {
    id: "community-gates-section",
    selector: "#community-gates",
    check: (text) => !text.includes("Loading gates") && text.length > 100,
    description: "Community gates section loaded (not stuck on loading state)",
  },
  {
    id: "no-taxonomy-error",
    selector: "#tag-grid",
    check: (text) => !text.includes("Failed to load taxonomy"),
    description: "Tag grid shows cards, not a load error (taxonomy.json present)",
  },
  {
    id: "flywheel-section",
    selector: "#contribute",
    check: (text) => text.length > 50,
    description: "Flywheel/contribute section present",
  },
];

async function runSmokeTest() {
  console.log(`\n🔍 Smoke test: ${TARGET_URL}\n`);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(LOAD_TIMEOUT_MS);

  let passed = 0;
  let failed = 0;
  const failures = [];

  try {
    await page.goto(TARGET_URL, { waitUntil: "networkidle" });

    // Wait for async data — taxonomy.json and community gates fetch
    await page.waitForFunction(
      () => {
        const statEl = document.getElementById("stat-tags");
        return statEl && statEl.textContent.trim() !== "—" && statEl.textContent.trim() !== "";
      },
      { timeout: LOAD_TIMEOUT_MS }
    );

    for (const check of CHECKS) {
      try {
        if (check.multiple) {
          const count = await page.locator(check.selector).count();
          const ok = check.check("", count);
          if (ok) {
            console.log(`  ✅ ${check.description} (${count} found)`);
            passed++;
          } else {
            console.log(`  ❌ ${check.description} (got ${count})`);
            failures.push(`${check.id}: ${check.description} — got ${count}`);
            failed++;
          }
        } else {
          const el = page.locator(check.selector).first();
          await el.waitFor({ state: "visible", timeout: 5_000 });
          const text = (await el.textContent()) ?? "";
          const ok = check.check(text.trim());
          if (ok) {
            console.log(`  ✅ ${check.description}`);
            passed++;
          } else {
            console.log(`  ❌ ${check.description} — got: "${text.slice(0, 80)}"`);
            failures.push(`${check.id}: got "${text.slice(0, 80)}"`);
            failed++;
          }
        }
      } catch (err) {
        console.log(`  ❌ ${check.description} — ${err.message}`);
        failures.push(`${check.id}: ${err.message}`);
        failed++;
      }
    }

    await page.screenshot({ path: SCREENSHOT_PATH, fullPage: true });
    console.log(`\n📸 Screenshot saved: ${SCREENSHOT_PATH}`);
  } finally {
    await browser.close();
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`  Passed: ${passed}  Failed: ${failed}`);
  if (failures.length > 0) {
    console.log(`\nFailures:`);
    for (const f of failures) console.log(`  • ${f}`);
  }
  console.log();

  process.exit(failed > 0 ? 1 : 0);
}

runSmokeTest().catch((err) => {
  console.error("Smoke test crashed:", err);
  process.exit(1);
});
