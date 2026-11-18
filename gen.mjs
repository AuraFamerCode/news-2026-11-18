// "The World Today", Wednesday 18 November 2026: a masthead, a dotted world map with the day's
// datelines, three leads and thirty briefs, plus an also-today strip. Rendering poster.html at
// 1024x1024 gives entry.png.
import { writeFileSync } from 'node:fs';

const PAPER = '#F6F1E6';
const CARD = '#FCF8F0';
const INK = '#15120F';
const MUTED = '#6B6255';
const RED = '#A63229';
const BLUE = '#1B3A56';
const GOLD = '#B4862B';
const RULE = '#D9D0BF';
const LAND = '#CFC5B0';

const W = 1024;
const M = 24;
const INNER = W - 2 * M;

const leads = [
  {
    kicker: 'ASIA · APEC SHENZHEN',
    title: ['XI GREETS TRUMP AS', 'PUTIN WARMS UP'],
    fact: 'Shenzhen summit after a Xi–Putin meeting; Beijing says the two should lead a multipolar world',
    icon: 'summit',
  },
  {
    kicker: 'MIDDLE EAST · THE STRAIT',
    title: ['IRAN HITS KUWAIT', 'AND BAHRAIN'],
    fact: 'Strikes on the US-run Ali Al Salem base widen the Hormuz fight; a reported plot in Washington is probed',
    icon: 'drone',
  },
  {
    kicker: 'EUROPE · UKRAINE',
    title: ['REFINERIES BURN', 'BEFORE THE TALKS'],
    fact: 'Drones set Krasnodar’s Afipsky and Ilsky alight, four hurt, as Ramstein pledges air defence and jets',
    icon: 'fire',
  },
];

// [lon, lat, label, side, dy] — side places the label left or right of its dot, dy lifts or drops it.
const datelines = [
  [114, 22, 'SHENZHEN', 'right', 0],
  [48, 29, 'KUWAIT', 'right', -2],
  [39, 45, 'KRASNODAR', 'left', -9],
  [31, 37, 'ANTALYA', 'left', 11],
  [-77, 39, 'WASHINGTON', 'left', 0],
  [39, 9, 'ADDIS', 'right', -9],
  [-46, -23, 'SÃO PAULO', 'left', 0],
  [77, 28, 'DELHI', 'right', -1],
  [15, -4, 'KINSHASA', 'left', 0],
  [45, 2, 'MOGADISHU', 'right', 10],
  [140, 36, 'TOKYO', 'right', -2],
  [-150, 61, 'ANCHORAGE', 'left', 0],
  [33, -26, 'MAPUTO', 'right', 6],
];

const briefs = [
  { region: 'AFRICA', head: 'Ethiopia and Eritrea mass forces on the border', fact: 'Tigray monitors warn war fears are rising' },
  { region: 'ECONOMY', head: 'Nvidia beats, lifts, and rejects a Huang return', fact: 'Huang says he would come back if asked' },
  { region: 'UNITED STATES', head: 'Democrats flip Alaska’s Senate seat', fact: 'Mary Peltola wins the race' },
  { region: 'CLIMATE', head: 'COP31 draft splits Antalya over fossil fuels', fact: 'Phase-out call heads the cover decision' },
  { region: 'SOUTH ASIA', head: 'India denies visas to 115 before a Congress event', fact: 'Roughly a third of the invited list' },
  { region: 'AFRICA', head: 'DR Congo’s Ebola outbreak passes 11,000 cases', fact: 'Kenya discharged its last patient' },
  { region: 'TRADE', head: 'Thailand scraps tariffs on American goods', fact: 'Manila talks add billions in farm buying' },
  { region: 'SCIENCE', head: 'Voyager 1 reaches one light-day from Earth', fact: 'The first craft to cross that line' },
  { region: 'ASIA', head: 'Xi and Lee hold a 34-minute summit', fact: 'The third meeting of the two leaders' },
  { region: 'LATIN AMERICA', head: 'Brazil weighs ending Enel São Paulo’s contract', fact: 'The six-day week is also ending' },
  { region: 'EUROPE', head: 'Ramstein pledges air defence and fighter jets', fact: 'Zelensky also asks for drone financing' },
  { region: 'AFRICA', head: 'South Africa reprimands Nigeria’s envoy', fact: 'Fani-Kayode summoned over a broadcast' },
  { region: 'MARKETS', head: 'Asia stocks choppy; the 10-year sits at 5.08%', fact: 'Brent $92.52, copper off 1.4%' },
  { region: 'MIDDLE EAST', head: 'Two US carriers sail together in the Arabian Sea', fact: 'Roosevelt joins the George Washington' },
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
  { region: 'TECHNOLOGY', head: 'A UN report warns on everyday chemicals', fact: 'A growing threat to health, it says' },
  { region: 'EUROPE', head: 'The EU puts its Ukraine support at €237.6bn', fact: '€3.8bn comes from frozen Russian assets' },
  { region: 'AFRICA', head: 'Mondlane’s trial opens without cameras', fact: 'Maputo bars live coverage' },
  { region: 'SPACE', head: 'Starship is caught by the tower arms', fact: 'A first for the launch pad' },
  { region: 'MIDDLE EAST', head: 'Trump weighs a Kim meeting in China', fact: 'Rubio says nothing is confirmed' },
  { region: 'AFRICA', head: 'The Gambia clears nine candidates', fact: 'The vote falls on 5 December' },
];

const also = ['Alcaraz beats Tiafoe', 'Senegal near AFCON 2027', 'Wirtz doubles for Germany', 'Erasmus banned six games'];

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

// A dotted world map: land is a union of ellipses in lon/lat, drawn as a dot grid.
const LANDMASSES = [
  [-100, 47, 27, 15], // North America
  [-93, 33, 13, 9], // the southern United States and Mexico
  [-42, 72, 11, 7], // Greenland
  [-62, -12, 11, 18], // South America
  [-66, -32, 6, 8], // the southern cone
  [14, 52, 13, 8], // Europe
  [18, 4, 18, 19], // Africa
  [88, 48, 42, 17], // Asia
  [58, 62, 26, 9], // Siberia
  [78, 21, 8, 10], // India
  [106, 12, 11, 9], // South-East Asia
  [134, -25, 13, 10], // Australia
  [174, -41, 4, 4], // New Zealand
];

function worldMap(x0, y0, w, h) {
  const dots = [];
  const step = 7.4;
  const inside = (lon, lat) =>
    LANDMASSES.some(([clon, clat, rlon, rlat]) => {
      const dx = (lon - clon) / rlon;
      const dy = (lat - clat) / rlat;
      return dx * dx + dy * dy <= 1;
    });
  for (let lat = 78; lat >= -56; lat -= 3.2) {
    for (let lon = -174; lon <= 180; lon += 3.2) {
      if (!inside(lon, lat)) continue;
      const x = x0 + ((lon + 180) / 360) * w;
      const y = y0 + ((78 - lat) / 134) * h;
      dots.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.2" fill="${LAND}"/>`);
    }
  }
  const marks = datelines
    .map(([lon, lat, label, side, dy]) => {
      const x = x0 + ((lon + 180) / 360) * w;
      const y = y0 + ((78 - lat) / 134) * h;
      const lx = side === 'right' ? x + 7 : x - 7;
      const anchor = side === 'right' ? 'start' : 'end';
      return `
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.8" fill="${RED}"/>
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7.6" fill="none" stroke="${RED}" stroke-width="1" opacity="0.5"/>
      <text x="${lx.toFixed(1)}" y="${(y + 2.7 + (dy || 0)).toFixed(1)}" text-anchor="${anchor}" font-family="Helvetica Neue, Helvetica, Arial" font-size="7.8" letter-spacing="0.9" font-weight="700" fill="${BLUE}">${label}</text>`;
    })
    .join('');
  return `${dots.join('')}${marks}`;
}

function masthead() {
  return `
  <g>
    <rect x="${M}" y="${M}" width="${INNER}" height="88" fill="${INK}"/>
    <text x="${M + 18}" y="${M + 42}" font-family="Georgia, Times New Roman, serif" font-size="40" font-weight="700" fill="${PAPER}">The World Today</text>
    <text x="${M + 20}" y="${M + 68}" font-family="Helvetica Neue, Helvetica, Arial" font-size="13.5" letter-spacing="3.2" fill="${RED}" font-weight="700">WEDNESDAY 18 NOVEMBER 2026</text>
    <text x="${M + INNER - 18}" y="${M + 40}" text-anchor="end" font-family="Helvetica Neue, Helvetica, Arial" font-size="10" letter-spacing="2.2" fill="#9C9285">THE DAY IN ONE IMAGE</text>
    <text x="${M + INNER - 18}" y="${M + 68}" text-anchor="end" font-family="Helvetica Neue, Helvetica, Arial" font-size="10" letter-spacing="2.2" fill="#9C9285">38 STORIES · SIX CONTINENTS</text>
  </g>`;
}

const MAP_Y = M + 88 + 10;
const MAP_H = 186;

function mapBlock() {
  return `
  <g>
    <rect x="${M}" y="${MAP_Y}" width="${INNER}" height="${MAP_H}" fill="${CARD}"/>
    <text x="${M + 12}" y="${MAP_Y + 18}" font-family="Helvetica Neue, Helvetica, Arial" font-size="9" letter-spacing="1.9" fill="${RED}" font-weight="700">THE DAY ON THE MAP</text>
    ${worldMap(M + 12, MAP_Y + 22, INNER - 24, MAP_H - 30)}
  </g>`;
}

const LEAD_Y = MAP_Y + MAP_H + 10;
const LEAD_H = 158;

function leadBlock() {
  const gap = 12;
  const w = (INNER - 2 * gap) / 3;
  return leads
    .map((lead, i) => {
      const x = M + i * (w + gap);
      // Icon left, headline right: wrap to the space the icon leaves and keep the type inside it.
      const size = 17;
      const head = lead.title.flatMap((line) => wrap(line, 17)).slice(0, 3);
      const facts = wrap(lead.fact, 44);
      return `
  <g transform="translate(${x} ${LEAD_Y})">
    <rect width="${w}" height="${LEAD_H}" fill="${CARD}"/>
    <rect width="${w}" height="3" fill="${RED}"/>
    <text x="14" y="26" font-family="Helvetica Neue, Helvetica, Arial" font-size="9" letter-spacing="1.7" fill="${RED}" font-weight="700">${lead.kicker}</text>
    <g transform="translate(10 40) scale(0.5)">${icons[lead.icon]}</g>
    ${head
      .map(
        (line, k) =>
          `<text x="70" y="${56 + k * 19}" font-family="Georgia, Times New Roman, serif" font-size="${size}" font-weight="700" fill="${INK}">${line}</text>`,
      )
      .join('')}
    ${facts
      .map(
        (line, k) =>
          `<text x="12" y="${118 + k * 11.4}" font-family="Helvetica Neue, Helvetica, Arial" font-size="9.2" fill="${MUTED}">${line}</text>`,
      )
      .join('')}
  </g>`;
    })
    .join('');
}

const GRID_Y = LEAD_Y + LEAD_H + 12;
const COLS = 6;
const ROWS = 5;
const GAP = 10;
const CELL_W = (INNER - (COLS - 1) * GAP) / COLS;
const CELL_H = 84;

function briefGrid() {
  return briefs
    .map((brief, i) => {
      const c = i % COLS;
      const r = Math.floor(i / COLS);
      const x = M + c * (CELL_W + GAP);
      const y = GRID_Y + r * (CELL_H + GAP);
      const head = wrap(brief.head, 23).slice(0, 3);
      const facts = wrap(brief.fact, 26).slice(0, 2);
      return `
  <g transform="translate(${x.toFixed(1)} ${y})">
    <line x1="0" y1="0" x2="${CELL_W.toFixed(1)}" y2="0" stroke="${RULE}" stroke-width="1.3"/>
    <text x="0" y="14" font-family="Helvetica Neue, Helvetica, Arial" font-size="7.6" letter-spacing="1.3" fill="${RED}" font-weight="700">${brief.region}</text>
    ${head
      .map(
        (line, k) =>
          `<text x="0" y="${30 + k * 13.2}" font-family="Georgia, Times New Roman, serif" font-size="11.1" font-weight="700" fill="${INK}">${line}</text>`,
      )
      .join('')}
    ${facts
      .map(
        (line, k) =>
          `<text x="0" y="${30 + head.length * 13.2 + 2 + k * 10.6}" font-family="Helvetica Neue, Helvetica, Arial" font-size="8.4" fill="${MUTED}">${line}</text>`,
      )
      .join('')}
  </g>`;
    })
    .join('');
}

function alsoStrip() {
  const y = GRID_Y + ROWS * (CELL_H + GAP) + 2;
  return `
  <g>
    <line x1="${M}" y1="${y}" x2="${M + INNER}" y2="${y}" stroke="${INK}" stroke-width="1.5"/>
    <text x="${M}" y="${y + 17}" font-family="Helvetica Neue, Helvetica, Arial" font-size="9" letter-spacing="1.9" fill="${RED}" font-weight="700">ALSO TODAY</text>
    <text x="${M + 80}" y="${y + 17}" font-family="Helvetica Neue, Helvetica, Arial" font-size="9.6" fill="${MUTED}">${also.join('  ·  ')}  ·  Mexico draw Jamaica</text>
  </g>`;
}

const icons = {
  summit: `
    <g stroke="${INK}" stroke-width="7" stroke-linecap="round" fill="none">
      <path d="M6 86 H94" stroke-width="5" opacity="0.4"/>
      <path d="M32 86 V44 M68 86 V44"/>
      <path d="M20 44 H44 M56 44 H80"/>
    </g>
    <rect x="58" y="10" width="26" height="26" rx="3" fill="${BLUE}"/>
    <rect x="16" y="16" width="26" height="20" rx="3" fill="${RED}"/>
    <circle cx="50" cy="54" r="10" fill="${GOLD}"/>`,
  drone: `
    <g stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round">
      <path d="M32 68 L68 32 M32 32 L68 68"/>
      <circle cx="32" cy="32" r="10" fill="${PAPER}"/>
      <circle cx="68" cy="32" r="10" fill="${PAPER}"/>
      <circle cx="32" cy="68" r="10" fill="${PAPER}"/>
      <circle cx="68" cy="68" r="10" fill="${PAPER}"/>
    </g>
    <rect x="41" y="41" width="18" height="18" rx="4" fill="${RED}"/>
    <path d="M88 62 A22 22 0 0 1 88 88" stroke="${RED}" stroke-width="5" fill="none"/>`,
  fire: `
    <path d="M50 6 C62 28 80 34 74 58 C70 76 60 90 50 94 C40 90 30 76 26 58 C20 34 38 28 50 6 Z" fill="${RED}"/>
    <path d="M50 40 C58 54 66 58 62 72 C59 82 54 88 50 90 C46 88 41 82 38 72 C34 58 42 54 50 40 Z" fill="${GOLD}"/>`,
};

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">
  <rect width="${W}" height="${W}" fill="${PAPER}"/>
  ${masthead()}
  ${mapBlock()}
  ${leadBlock()}
  ${briefGrid()}
  ${alsoStrip()}
</svg>`;

writeFileSync(new URL('./poster.svg', import.meta.url), svg);
writeFileSync(
  new URL('./poster.html', import.meta.url),
  `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;width:${W}px;height:${W}px;overflow:hidden;background:${PAPER}}</style></head><body>${svg}</body></html>`,
);
console.log(`wrote poster.svg and poster.html: ${leads.length} leads, ${briefs.length} briefs, ${datelines.length} datelines`);
