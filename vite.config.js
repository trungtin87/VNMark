import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Cấu hình Vite theo khuyến nghị chính thức của Tauri 2.0:
// - cổng cố định để tiến trình Rust biết đường kết nối lúc `tauri dev`
// - không xoá console.error để dễ gỡ lỗi trên thiết bị di động
export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  // Khi deploy lên GitHub Pages ở dạng project page (username.github.io/ten-repo),
  // toàn bộ asset phải trỏ vào /ten-repo/ chứ không phải /. Đặt biến môi
  // trường VITE_BASE_PATH khi build (xem .github/workflows/deploy-gh-pages.yml).
  base: process.env.VITE_BASE_PATH || "/",
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  build: {
    target: process.env.TAURI_ENV_PLATFORM === "windows" ? "chrome105" : "safari13",
    minify: !process.env.TAURI_ENV_DEBUG ? "esbuild" : false,
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
  },
});
