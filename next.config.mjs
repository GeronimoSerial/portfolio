import createNextIntlPlugin from "next-intl/plugin";
import createMDX from "@next/mdx";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  // Optionally, add any other Next.js config below
  async redirects() {
    return [
      {
        source: "/perfil",
        destination: "/portfolio",
        permanent: true,
      },
      {
        source: "/contacto",
        destination: "/#contact",
        permanent: true,
      },
    ];
  },
};

// MDX configuration
const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
export default withNextIntl(withMDX(nextConfig));
