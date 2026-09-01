import fs from 'node:fs/promises';
import { defineConfig } from 'vite';
import { sites } from '@openai/sites-vite-plugin';

function sitesWorker() {
  return {
    name: 'sites-worker-output',
    apply: 'build',
    async closeBundle() {
      await fs.mkdir('dist/server', { recursive: true });
      await fs.mkdir('dist/models', { recursive: true });
      await fs.copyFile('worker/index.js', 'dist/server/index.js');
      await fs.copyFile('public/models/connector.glb', 'dist/models/connector.glb');
      await fs.copyFile('public/og.png', 'dist/og.png');
    },
  };
}

export default defineConfig(({ command }) => ({
  plugins: [sites(), sitesWorker()],
  publicDir: command === 'build' ? false : 'public',
  build: {
    chunkSizeWarningLimit: 700,
  },
}));
