import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import lighthouse from 'lighthouse';

const root = path.resolve(import.meta.dirname, '..');
const reportDir = path.join(root, 'reports');
const url = process.env.LH_URL ?? 'http://localhost:4173/';
const port = Number(process.env.LH_PORT ?? 9222);

await mkdir(reportDir, { recursive: true });

const mobileThrottling = {
  rttMs: 150,
  throughputKbps: 1638.4,
  cpuSlowdownMultiplier: 4,
  requestLatencyMs: 562.5,
  downloadThroughputKbps: 1474.56,
  uploadThroughputKbps: 675,
};

const desktopThrottling = {
  rttMs: 40,
  throughputKbps: 10240,
  cpuSlowdownMultiplier: 1,
  requestLatencyMs: 0,
  downloadThroughputKbps: 0,
  uploadThroughputKbps: 0,
};

for (const formFactor of ['mobile', 'desktop']) {
  const isMobile = formFactor === 'mobile';
  const result = await lighthouse(url, {
    port,
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor,
    screenEmulation: isMobile
      ? { mobile: true, width: 360, height: 800, deviceScaleFactor: 2, disabled: false }
      : { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
    throttling: isMobile ? mobileThrottling : desktopThrottling,
    throttlingMethod: 'simulate',
  });

  const report = JSON.parse(result.report);
  await writeFile(path.join(reportDir, `lighthouse-${formFactor}.json`), result.report);
  await writeFile(path.join(reportDir, `lighthouse-${formFactor}.html`), result.reportHtml ?? '');

  const audits = report.audits;
  const categories = Object.fromEntries(
    Object.entries(report.categories).map(([key, value]) => [key, Math.round(value.score * 100)]),
  );
  console.log(`${formFactor.toUpperCase()} ${JSON.stringify(categories)}`);
  console.log(JSON.stringify({
    lcp: audits['largest-contentful-paint']?.displayValue,
    cls: audits['cumulative-layout-shift']?.displayValue,
    tbt: audits['total-blocking-time']?.displayValue,
    fcp: audits['first-contentful-paint']?.displayValue,
    speedIndex: audits['speed-index']?.displayValue,
  }));
  console.log(`report: reports/lighthouse-${formFactor}.json`);
}
