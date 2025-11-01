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

export default nextConfig;
