import {
  siAngular,
  siAstro,
  siCloudflare,
  siCoolify,
  siDocker,
  siExpress,
  siFastify,
  siGithubactions,
  siGraphql,
  siJavascript,
  siLinux,
  siModelcontextprotocol,
  siMysql,
  siNextdotjs,
  siNginx,
  siNodedotjs,
  siPostgresql,
  siReact,
  siRedis,
  siTailwindcss,
  siTypescript,
  siVercel,
  type SimpleIcon,
} from 'simple-icons';
import type { UIKey } from '../../i18n/utils';

// Icons are resolved at build time; only the resulting path strings reach the page.
// Icons are decorative (the name sits beside each one), so the 3:1 non-text rule does not apply; only
// near-invisible brand colours (black on dark, near-white on light) fall back to the ink colour.
const BG = { dark: '1f1e21', light: 'ecebee' } as const;
const INK = 'var(--ink)';
const MIN_CONTRAST = 1.8;

function luminance(hex: string): number {
  const value = parseInt(hex, 16);
  const [r, g, b] = [(value >> 16) & 255, (value >> 8) & 255, value & 255].map((channel) => {
    const s = channel / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function brandColour(icon: SimpleIcon, background: string): string {
  return contrast(icon.hex, background) >= MIN_CONTRAST ? `#${icon.hex}` : INK;
}

export interface StackItem {
  name: string;
  icon?: { path: string; dark: string; light: string };
}

export interface StackRow {
  labelKeys: [UIKey, UIKey];
  direction: 'left' | 'right';
  duration: number;
  items: StackItem[];
}

const branded = (name: string, icon: SimpleIcon): StackItem => ({
  name,
  icon: {
    path: icon.path,
    dark: brandColour(icon, BG.dark),
    light: brandColour(icon, BG.light),
  },
});

const concept = (name: string): StackItem => ({ name });

// Source: portfolio.md, "Technical Expertise". Names stay English in both locales.
// AWS and SQL Server have no icon in simple-icons 16.35.0, so they render as concepts.
export const stackRows: StackRow[] = [
  {
    labelKeys: ['stack.cat.frontend', 'stack.cat.backend'],
    direction: 'left',
    duration: 66,
    items: [
      branded('TypeScript', siTypescript),
      branded('JavaScript', siJavascript),
      branded('React', siReact),
      branded('Next.js', siNextdotjs),
      branded('Angular', siAngular),
      branded('Astro', siAstro),
      branded('Tailwind CSS', siTailwindcss),
      branded('Node.js', siNodedotjs),
      branded('Express', siExpress),
      branded('Fastify', siFastify),
      branded('PostgreSQL', siPostgresql),
      concept('SQL Server'),
      branded('MySQL', siMysql),
      branded('Redis', siRedis),
      concept('Kysely'),
      concept('REST APIs'),
      branded('GraphQL', siGraphql),
    ],
  },
  {
    labelKeys: ['stack.cat.cloud', 'stack.cat.devops'],
    direction: 'right',
    duration: 48,
    items: [
      concept('AWS'),
      branded('Cloudflare', siCloudflare),
      branded('Docker', siDocker),
      branded('Coolify', siCoolify),
      branded('Vercel', siVercel),
      branded('Linux', siLinux),
      branded('Nginx', siNginx),
      concept('CI/CD'),
      branded('GitHub Actions', siGithubactions),
      concept('WAF'),
      concept('CDN'),
      concept('Infrastructure Management'),
    ],
  },
  {
    labelKeys: ['stack.cat.ai', 'stack.cat.product'],
    direction: 'left',
    duration: 58,
    items: [
      concept('LLM Integration'),
      concept('AI Agents'),
      branded('MCP', siModelcontextprotocol),
      concept('Agentic Workflows'),
      concept('AI-Assisted Development'),
      concept('Process Automation'),
      concept('Product Engineering'),
      concept('Product Strategy'),
      concept('System Design'),
      concept('Software Architecture'),
      concept('Technical Decision-Making'),
      concept('Scalability'),
      concept('Performance Optimization'),
    ],
  },
];
