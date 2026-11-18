// Draws "The World Today" — Wednesday 18 November 2026 — as one dense 1024x1024 front page:
// a masthead, three lead stories with icons, 25 briefs in five columns, and a closing strip.
import { writeFileSync } from 'node:fs';

const PAPER = '#F6F1E6';
const INK = '#15120F';
const MUTED = '#6B6255';
const RED = '#A63229';
const BLUE = '#1B3A56';
const GOLD = '#B4862B';
const RULE = '#D8CFBE';

const W = 1024;
const M = 26;
const INNER = W - 2 * M;

const leads = [
  {
    kicker: 'ASIA · APEC SHENZHEN',
    title: ['XI GREETS TRUMP', 'AS PUTIN WARMS UP'],
    fact: 'Xi welcomed Trump in Shenzhen hours after meeting Putin; Beijing says Russia and China should lead a multipolar world, and a Trump–Kim meeting is left open.',
    icon: 'summit',
  },
  {
    kicker: 'MIDDLE EAST · HORMUZ',
    title: ['IRAN STRIKES', 'KUWAIT AND BAHRAIN'],
    fact: 'Iran hit the US-run Ali Al Salem base in Kuwait and targets in Bahrain as the fight over the Strait widens; US intelligence weighs a reported plot in Washington.',
    icon: 'drone',
  },
  {
    kicker: 'EUROPE · UKRAINE',
    title: ['REFINERIES BURN', 'BEFORE THE SUMMIT'],
    fact: 'Ukrainian drones set the Afipsky and Ilsky refineries alight in Krasnodar, four hurt, a day before Trump raises Ukraine; the Kerch bridge is badly damaged.',
    icon: 'fire',
  },
];

const briefs = [
  { region: 'AFRICA', head: 'Ethiopia and Eritrea mass forces on the border', fact: 'Tigray monitors warn war fears are rising' },
  { region: 'ECONOMY', head: 'Nvidia beats and lifts, then rejects a Huang return', fact: 'Huang says he would come back if asked' },
  { region: 'UNITED STATES', head: 'Democrats flip Alaska’s Senate seat', fact: 'Mary Peltola wins the race' },
  { region: 'CLIMATE', head: 'COP31 draft splits Antalya over fossil fuels', fact: 'Phase-out call heads the cover decision' },
  { region: 'SOUTH ASIA', head: 'India denies visas to 115 before a Congress event', fact: 'Roughly a third of the invited list' },
  { region: 'AFRICA', head: 'DR Congo Ebola passes 11,000 confirmed cases', fact: 'Kenya discharged its last patient' },
  { region: 'WORLD TRADE', head: 'Thailand scraps tariffs on US goods', fact: 'Manila talks add billions in farm buying' },
  { region: 'SCIENCE', head: 'Voyager 1 reaches one light-day from Earth', fact: 'The first craft to cross that line' },
  { region: 'ASIA', head: 'Xi and Lee hold a 34-minute summit', fact: 'Third meeting of the two leaders' },
  { region: 'LATIN AMERICA', head: 'Brazil weighs ending Enel São Paulo’s contract', fact: 'The six-day week is also ending' },
  { region: 'EUROPE', head: 'Ramstein pledges air defence and jets', fact: 'Zelensky also asks for drone financing' },
  { region: 'AFRICA', head: 'South Africa reprimands Nigeria’s envoy', fact: 'Fani-Kayode summoned over a broadcast' },
  { region: 'MARKETS', head: 'Asia stocks choppy; the 10-year sits at 5.08%', fact: 'Brent $92.52, copper off 1.4%' },
  { region: 'MIDDLE EAST', head: 'US carriers sail together in the Arabian Sea', fact: 'Roosevelt joins the George Washington' },
  { region: 'AFRICA', head: 'Somalia’s president accuses the UAE', fact: 'Mogadishu cites ports and Somaliland' },
  { region: 'HEALTH', head: 'A leukaemia vaccine passes a key trial', fact: 'Another win in a strong cancer year' },
  { region: 'ASIA', head: 'India and Japan open 2+2 defence talks', fact: 'Tokyo hosts the fourth round' },
  { region: 'EUROPE', head: 'Kyiv counts two bridges hit in a day', fact: 'Strikes follow the raid on Crimea' },
  { region: 'NORTH AMERICA', head: 'Mamdani flags attacks on Hindu temples', fact: 'He urges a rejection of hate politics' },
  { region: 'AFRICA', head: 'Nigeria’s inflation eases to 14.06%', fact: 'Food inflation falls to 19.13%' },
  { region: 'TRADE', head: 'AGOA leaves out South Africa and Rwanda', fact: 'Africa pushes its own integration' },
  { region: 'SOUTH ASIA', head: 'PTI leaders held after bail in Peshawar', fact: 'Two former ministers taken in' },
  { region: 'LATIN AMERICA', head: 'Colombia’s strike tests the new government', fact: 'Talks resume in Bogotá' },
  { region: 'AFRICA', head: 'Besigye’s wife renews pleas for his release', fact: 'She cites his failing health' },
  { region: 'TECHNOLOGY', head: 'A UN report warns on everyday chemicals', fact: 'Growing threat to health, it says' },
];

// Icons draw inside a 100x100 box.
const icons = {
  summit: `
    <g stroke="${INK}" stroke-width="5" stroke-linecap="round" fill="none">
      <path d="M6 86 H94" stroke-width="4" opacity="0.4"/>
      <path d="M30 86 V42 M70 86 V42"/>
      <path d="M20 42 H40 M60 42 H80"/>
    </g>
    <rect x="60" y="10" width="24" height="24" rx="3" fill="${BLUE}"/>
    <rect x="18" y="16" width="24" height="18" rx="3" fill="${RED}"/>
    <circle cx="50" cy="52" r="9" fill="${GOLD}"/>`,
  drone: `
    <g stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round">
      <path d="M32 68 L68 32 M32 32 L68 68"/>
      <circle cx="32" cy="32" r="10" fill="${PAPER}"/>
      <circle cx="68" cy="32" r="10" fill="${PAPER}"/>
      <circle cx="32" cy="68" r="10" fill="${PAPER}"/>
      <circle cx="68" cy="68" r="10" fill="${PAPER}"/>
    </g>
    <rect x="41" y="41" width="18" height="18" rx="4" fill="${RED}"/>
    <path d="M86 62 A22 22 0 0 1 86 88" stroke="${RED}" stroke-width="4" fill="none"/>`,
  fire: `
    <path d="M50 6 C62 28 80 34 74 58 C70 76 60 90 50 94 C40 90 30 76 26 58 C20 34 38 28 50 6 Z" fill="${RED}"/>
    <path d="M50 40 C58 54 66 58 62 72 C59 82 54 88 50 90 C46 88 41 82 38 72 C34 58 42 54 50 40 Z" fill="${GOLD}"/>
    <path d="M8 92 H92" stroke="${INK}" stroke-width="4" stroke-linecap="round" opacity="0.6"/>`,
};

const also = [
  'Alcaraz sweeps Tiafoe at the ATP Finals',
  'Senegal edge closer to AFCON 2027',
  'Wirtz scores twice as Germany win',
  'Erasmus given a six-match ban',
];

const wrap = (text, chars) => {
  const out = [];
  let line = '';
  for (const word of text.split(' ')) {
    if (line && (line + ' ' + word).length > chars) {
      out.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) out.push(line);
  return out;
};

function masthead() {
  return `
  <g>
    <rect x="${M}" y="${M}" width="${INNER}" height="104" fill="${INK}"/>
    <text x="${M + 20}" y="${M + 46}" font-family="Georgia, Times New Roman, serif" font-size="44" font-weight="700" fill="${PAPER}">The World Today</text>
    <text x="${M + 22}" y="${M + 76}" font-family="Helvetica Neue, Helvetica, Arial" font-size="15" letter-spacing="3.6" fill="${RED}" font-weight="700">WEDNESDAY 18 NOVEMBER 2026</text>
    <text x="${M + INNER - 20}" y="${M + 46}" text-anchor="end" font-family="Helvetica Neue, Helvetica, Arial" font-size="11" letter-spacing="2.4" fill="#9C9285">THE DAY IN ONE IMAGE</text>
    <text x="${M + INNER - 20}" y="${M + 76}" text-anchor="end" font-family="Helvetica Neue, Helvetica, Arial" font-size="11" letter-spacing="2.4" fill="#9C9285">33 STORIES · SIX CONTINENTS</text>
  </g>`;
}

function leadBlock() {
  const y = M + 104 + 14;
  const h = 226;
  const gap = 14;
  const w = (INNER - 2 * gap) / 3;
  return leads
    .map((lead, i) => {
      const x = M + i * (w + gap);
      // Fit the headline to the card: shrink a step rather than let a line run past the edge.
      const longest = Math.max(...lead.title.map((line) => line.length));
      const size = longest > 20 ? 20.5 : longest > 17 ? 22 : 24;
      const head = lead.title;
      const facts = wrap(lead.fact, 42);
      return `
  <g transform="translate(${x} ${y})">
    <rect width="${w}" height="${h}" fill="#FCF8F0"/>
    <rect width="${w}" height="3" fill="${RED}"/>
    <text x="16" y="30" font-family="Helvetica Neue, Helvetica, Arial" font-size="9.5" letter-spacing="1.9" fill="${RED}" font-weight="700">${lead.kicker}</text>
    <g transform="translate(${(w - 84) / 2} 38) scale(0.84)">${icons[lead.icon]}</g>
    ${head
      .map(
        (line, k) =>
          `<text x="16" y="${140 + k * (size + 4)}" font-family="Georgia, Times New Roman, serif" font-size="${size}" font-weight="700" fill="${INK}">${line}</text>`,
      )
      .join('')}
    ${facts
      .map(
        (line, k) =>
          `<text x="16" y="${196 + k * 13}" font-family="Helvetica Neue, Helvetica, Arial" font-size="10.5" fill="${MUTED}">${line}</text>`,
      )
      .join('')}
  </g>`;
    })
    .join('');
}

function briefGrid() {
  const top = M + 104 + 14 + 226 + 16;
  const cols = 5;
  const rows = 5;
  const gap = 12;
  const cellW = (INNER - (cols - 1) * gap) / cols;
  const cellH = 100;
  return briefs
    .map((brief, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const x = M + c * (cellW + gap);
      const y = top + r * (cellH + gap);
      const head = wrap(brief.head, 25).slice(0, 3);
      const facts = wrap(brief.fact, 30).slice(0, 2);
      return `
  <g transform="translate(${x} ${y})">
    <line x1="0" y1="0" x2="${cellW}" y2="0" stroke="${RULE}" stroke-width="1.4"/>
    <text x="0" y="17" font-family="Helvetica Neue, Helvetica, Arial" font-size="8.5" letter-spacing="1.5" fill="${RED}" font-weight="700">${brief.region}</text>
    ${head
      .map(
        (line, k) =>
          `<text x="0" y="${36 + k * 15}" font-family="Georgia, Times New Roman, serif" font-size="12.6" font-weight="700" fill="${INK}">${line}</text>`,
      )
      .join('')}
    ${facts
      .map(
        (line, k) =>
          `<text x="0" y="${36 + head.length * 15 + 3 + k * 12}" font-family="Helvetica Neue, Helvetica, Arial" font-size="9.4" fill="${MUTED}">${line}</text>`,
      )
      .join('')}
  </g>`;
    })
    .join('');
}

function alsoStrip() {
  const y = M + 104 + 14 + 226 + 16 + 5 * (100 + 12) + 4;
  return `
  <g>
    <line x1="${M}" y1="${y}" x2="${M + INNER}" y2="${y}" stroke="${INK}" stroke-width="1.6"/>
    <text x="${M}" y="${y + 19}" font-family="Helvetica Neue, Helvetica, Arial" font-size="9.5" letter-spacing="2" fill="${RED}" font-weight="700">ALSO TODAY</text>
    <text x="${M + 84}" y="${y + 19}" font-family="Helvetica Neue, Helvetica, Arial" font-size="9.8" fill="${MUTED}">${also.join('  ·  ')}</text>
  </g>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">
  <rect width="${W}" height="${W}" fill="${PAPER}"/>
  ${masthead()}
  ${leadBlock()}
  ${briefGrid()}
  ${alsoStrip()}
</svg>`;

writeFileSync(new URL('./poster.svg', import.meta.url), svg);
writeFileSync(
  new URL('./poster.html', import.meta.url),
  `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;width:${W}px;height:${W}px;overflow:hidden;background:${PAPER}}</style></head><body>${svg}</body></html>`,
);
console.log(`wrote poster.svg and poster.html: ${leads.length} leads, ${briefs.length} briefs, ${also.length} also`);
