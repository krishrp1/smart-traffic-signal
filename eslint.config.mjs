import nextConfig from "eslint-config-next";

// Merge the stricter unused-vars rule into the config object that already
// registers the @typescript-eslint plugin, since flat config rules only
// resolve against plugins declared in the same config object.
const withUnusedVarsIgnore = nextConfig.map((config) =>
  config.plugins?.["@typescript-eslint"]
    ? {
        ...config,
        rules: {
          ...config.rules,
          "@typescript-eslint/no-unused-vars": [
            "error",
            { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
          ],
        },
      }
    : config,
);

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "docs/**",
      "coverage/**",
    ],
  },
  ...withUnusedVarsIgnore,
];

export default eslintConfig;
