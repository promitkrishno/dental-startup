import { writeFile } from 'node:fs/promises';

const base = 'http://127.0.0.1:9222';
const url = process.env.QA_URL ?? 'http://localhost:4173/';
const widths = [360, 390, 768, 1024, 1280, 1920];

const target = await fetch(`${base}/json/new?about:blank`, { method: 'PUT' }).then((r) => r.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let nextId = 0;
const pending = new Map();
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message.result);
    pending.delete(message.id);
  }
});
const send = (method, params = {}) => new Promise((resolve) => {
  const id = ++nextId;
  pending.set(id, resolve);
  socket.send(JSON.stringify({ id, method, params }));
});

await send('Page.enable');
await send('Runtime.enable');

const results = [];
for (const width of widths) {
  const mobile = width < 768;
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height: 820,
    deviceScaleFactor: mobile ? 2 : 1,
    mobile,
  });
  await send('Page.navigate', { url });
  await new Promise((resolve) => setTimeout(resolve, 900));
  const response = await send('Runtime.evaluate', {
    expression: `(() => {
      const vw = document.documentElement.clientWidth;
      const offenders = [...document.querySelectorAll('body *')]
        .filter((el) => {
          const style = getComputedStyle(el);
          if (style.position === 'fixed' || style.display === 'none') return false;
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && (rect.right > vw + 1 || rect.left < -1);
        })
        .slice(0, 6)
        .map((el) => ({ tag: el.tagName, cls: String(el.className).slice(0, 50), right: Math.round(el.getBoundingClientRect().right), left: Math.round(el.getBoundingClientRect().left) }));
      return { vw, scrollWidth: document.documentElement.scrollWidth, offenders };
    })()`,
    returnByValue: true,
  });
  const value = response.result.value;
  results.push({ width, ...value });
  console.log(`${width}px → clientWidth ${value.vw}, scrollWidth ${value.scrollWidth}, offenders ${value.offenders.length}`);
}

await writeFile('reports/viewport-check.json', JSON.stringify(results, null, 2));
socket.close();
