import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@atoms": resolve(__dirname, "./src/components/atoms"),
      "@molecules": resolve(__dirname, "./src/components/molecules"),
      "@organisms": resolve(__dirname, "./src/components/organisms"),
      "@templates": resolve(__dirname, "./src/components/templates"),
      "@hooks": resolve(__dirname, "./src/hooks"),
      "@services": resolve(__dirname, "./src/services"),
      "@models": resolve(__dirname, "./src/models"),
      "@pages": resolve(__dirname, "./src/pages"),
      "@config": resolve(__dirname, "./src/config"),
      "@constants": resolve(__dirname, "./src/utils/constants"),
      "@helpers": resolve(__dirname, "./src/utils/helpers"),
      "@styles": resolve(__dirname, "./src/styles"),
    },
  },
  server: {
    proxy: {
      "/engram-api": {
        target: "http://127.0.0.1:7437",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/engram-api/, ""),
      },
    },
  },
});
