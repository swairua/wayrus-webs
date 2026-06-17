import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { copyFileSync } from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
    proxy: {},
    fs: {
      allow: [".", "./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    copyPublicDir: true,
    minify: "esbuild",
    rollupOptions: {
      output: {
        preserveModules: false,
      },
    },
  },
  plugins: [react(), copyApiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  root: ".",
  index: "index.html",
}));

function copyApiPlugin(): Plugin {
  return {
    name: "copy-api-plugin",
    apply: "build", // Only apply during build
    writeBundle() {
      // Copy api.php to dist folder for production deployment
      try {
        copyFileSync(
          path.resolve(__dirname, "api.php"),
          path.resolve(__dirname, "dist", "api.php"),
        );
        console.log("✓ api.php copied to dist folder");
      } catch (err) {
        console.warn("⚠ Could not copy api.php to dist:", err);
      }
    },
  };
}
