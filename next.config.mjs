/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "static-cdn.jtvnw.net",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "utfs.io",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "uploadthing.com",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
