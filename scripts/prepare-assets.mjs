import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'public', 'images');
const fontDir = path.join(root, 'public', 'fonts');
const sourceDir = path.join(root, 'tmp', 'source');

await Promise.all([
  mkdir(outDir, { recursive: true }),
  mkdir(fontDir, { recursive: true }),
  mkdir(sourceDir, { recursive: true }),
]);

// Freely licensed editorial photography from Unsplash. Credits in docs/IMAGE_CREDITS.md.
const sources = {
  clinic: 'photo-1629909613654-28e377c37b09',
  care: 'photo-1588776814546-1ffcf47267a5',
  detail: 'photo-1629909615184-74f495363b67',
  team: 'photo-1559839734-2b71ea197ec2',
  smile: 'photo-1606811841689-23dfddce3e95',
};

const widths = [640, 1280];
const maxBytes = 200 * 1024;

async function download(id) {
  const url = `https://images.unsplash.com/${id}?w=2000&q=85&fit=max&fm=jpg`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${id}: ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

async function encode(image, format, width) {
  const resized = image.clone().resize({ width, withoutEnlargement: true });
  const qualities = format === 'avif' ? [52, 46, 40, 34] : [78, 72, 66, 60];
  for (const quality of qualities) {
    const buffer = format === 'avif'
      ? await resized.avif({ quality, effort: 4 }).toBuffer()
      : await resized.webp({ quality, effort: 5 }).toBuffer();
    if (buffer.length <= maxBytes) return buffer;
  }
  return format === 'avif'
    ? await resized.avif({ quality: 30, effort: 6 }).toBuffer()
    : await resized.webp({ quality: 52, effort: 6 }).toBuffer();
}

async function emit(name, image) {
  const meta = await image.metadata();
  for (const width of widths) {
    if (meta.width < width) continue;
    for (const format of ['webp', 'avif']) {
      const buffer = await encode(image, format, width);
      const file = path.join(outDir, `${name}-${width}.${format}`);
      await writeFile(file, buffer);
      console.log(`${path.basename(file)} ${(buffer.length / 1024).toFixed(0)} KB`);
    }
  }
}

const downloads = new Map();
for (const [name, id] of Object.entries(sources)) {
  const buffer = await download(id);
  downloads.set(name, buffer);
  await writeFile(path.join(sourceDir, `${name}.jpg`), buffer);
}

for (const [name, buffer] of downloads) {
  await emit(name, sharp(buffer));
}

// The "before" frame is a deliberately subtle, warm-shifted variant of the same
// supplied smile photograph, so the comparer stays perfectly registered.
const smile = sharp(downloads.get('smile'));
const { width, height } = await smile.metadata();
const warmLayer = {
  input: {
    create: {
      width,
      height,
      channels: 4,
      background: { r: 166, g: 139, b: 96, alpha: 0.2 },
    },
  },
  blend: 'over',
};
const beforeBuffer = await sharp(downloads.get('smile'))
  .modulate({ saturation: 0.58, brightness: 0.96 })
  .composite([warmLayer])
  .webp({ quality: 92 })
  .toBuffer();
await emit('smile-before', sharp(beforeBuffer));

const fonts = [
  ['@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2', 'fraunces-latin-wght-normal.woff2'],
  ['@fontsource-variable/fraunces/files/fraunces-latin-wght-italic.woff2', 'fraunces-latin-wght-italic.woff2'],
  ['@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', 'inter-latin-wght-normal.woff2'],
];
for (const [from, to] of fonts) {
  await copyFile(path.join(root, 'node_modules', from), path.join(fontDir, to));
  console.log(`fonts/${to}`);
}
