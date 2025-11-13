import createNextIntlPlugin from "next-intl/plugin";
import createMDX from "@next/mdx";
//1
const withNextIntl = createNextIntlPlugin("./i18n.ts");
/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  experimental: {
    mdxRs: true,
  },
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
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      //
    ],
    rehypePlugins: [
      //
    ],
  },
});

export default withNextIntl(withMDX(nextConfig));
