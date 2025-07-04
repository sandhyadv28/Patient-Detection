import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import * as path from 'path';

export default defineConfig(({ mode }) => {
  // Load env files based on mode
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
  plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      open: true
    },
    base: '/',
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, './src') },
        { find: '@components', replacement: path.resolve(__dirname, './src/components') },
        { find: '@assets', replacement: path.resolve(__dirname, './src/assets') },
        { find: '@store', replacement: path.resolve(__dirname, './src/store') },
        { find: '@slice', replacement: path.resolve(__dirname, './src/store/slice') },
        { find: '@hooks', replacement: path.resolve(__dirname, './src/hooks') },
        { find: '@lib', replacement: path.resolve(__dirname, './src/lib') },
        { find: '@utils', replacement: path.resolve(__dirname, './src/utils') },
        { find: '@constants', replacement: path.resolve(__dirname, './src/constants') },
        { find: '@enums', replacement: path.resolve(__dirname, './src/enums') },
        { find: '@types', replacement: path.resolve(__dirname, './src/types') }
      ]
    },
    envPrefix: 'VITE_',
    envDir: './Frontend',  // Or remove if your .env files are in the root
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html')
        }
      },
      outDir: 'dist'
    }
  };
});
