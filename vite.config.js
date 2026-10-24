import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages 项目站点部署在 /qianxun/ 子路径下，构建时需要该 base；
  // 本地 dev 仍使用根路径，保持 http://localhost:5173/ 预览不变
  base: command === 'build' ? '/qianxun/' : '/',
  plugins: [react()],
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
}))
