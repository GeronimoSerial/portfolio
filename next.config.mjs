import { withContentlayer } from "next-contentlayer";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  experimental: {
    mdxRs: true,
  },
  async redirects() {
    return [
      {
        source: "/perfil",
        destination: "/#about",
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

export default withContentlayer(nextConfig);
