// Generates the default Open Graph image (public/og-default.png).
// Run: node scripts/generate-og-image.mjs
import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, '..', 'public', 'og-default.png');

// Uses the dark theme palette from tokens.css
const bg = '#16191c';
const surface = '#1e2226';
const accent = '#f5b301';
const text = '#f4f6f8';
const muted = '#9aa4ad';
const line = '#2e343a';

// Hazard stripe band (matches HazardRule)
const stripeHeight = 10;
const stripeWidth = 20;
let stripePattern = '';
for (let x = -stripeWidth; x < 1200 + stripeWidth; x += stripeWidth * 2) {
  stripePattern += `<rect x="${x}" y="0" width="${stripeWidth}" height="${stripeHeight}" fill="${accent}" />`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${bg}" />

  <!-- Top hazard stripe -->
  <g transform="skewX(-30)">
    ${stripePattern}
  </g>

  <!-- Bottom hazard stripe -->
  <g transform="translate(0,620) skewX(-30)">
    ${stripePattern}
  </g>

  <!-- Wheel icon (from favicon) -->
  <g transform="translate(600,220)">
    <circle cx="0" cy="0" r="60" fill="none" stroke="${line}" stroke-width="6" />
    <circle cx="0" cy="0" r="20" fill="${accent}" />
  </g>

  <!-- Brand name -->
  <text x="600" y="348" text-anchor="middle"
    font-family="'Barlow Condensed','Arial Narrow',sans-serif"
    font-weight="700" font-size="80" fill="${text}"
    letter-spacing="-1.5">Peça Testada</text>

  <!-- Tagline -->
  <text x="600" y="400" text-anchor="middle"
    font-family="Inter,system-ui,sans-serif"
    font-weight="600" font-size="22" fill="${muted}"
    letter-spacing="3.5"
    text-transform="uppercase">ACESSÓRIOS TESTADOS POR QUEM ANDA</text>

  <!-- Subtle surface card behind the content area -->
  <rect x="100" y="440" width="1000" height="1" fill="${line}" rx="0" />

  <!-- Domain -->
  <text x="600" y="490" text-anchor="middle"
    font-family="'Courier New',monospace"
    font-size="20" fill="${muted}">peca-testada.github.io</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ quality: 90 }).toFile(out);
console.log(`OG image written to ${out}`);
