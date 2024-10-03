import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@node-rs/argon2"],
  },
  eslint: {
    ignoreDuringBuilds: true,
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
    },
    overrides: [
      {
        files: ["./src/components/ui/**/*.{ts,tsx}"],
        rules: {
          "@typescript-eslint/no-empty-object-type": "off",
        },
      },
    ],
  },
};

export default withNextIntl(nextConfig);
