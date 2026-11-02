import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://geroserial.com',
  output: 'static',
  adapter: vercel(),
  // English moved to the root and Spanish under /es; the previous URLs keep working.
  redirects: {
    '/en': '/',
    '/en/projects': '/projects',
    '/en/projects/climate': '/projects/climate',
    '/proyectos': '/es/proyectos',
    '/proyectos/clima': '/es/proyectos/clima',
  },
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      RESEND_FROM_EMAIL: envField.string({ context: 'server', access: 'public', optional: true }),
      RESEND_TO_EMAIL: envField.string({ context: 'server', access: 'public', optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
