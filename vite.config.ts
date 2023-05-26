import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import { homedir } from 'os'
import VueI18nPlugin from '@intlify/vite-plugin-vue-i18n'
import * as fs from 'fs'

// https://vitejs.dev/config/

const host = 'website.tracking-app.test'
export default defineConfig({
  plugins: [
    vue(),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/locales/**'),
    }),
  ],
  server: detectServerConfig(host),
})

function detectServerConfig(host: string) {
  const keyPath = resolve(homedir(), `.config/valet/Certificates/${host}.key`)
  const certificatePath = resolve(homedir(), `.config/valet/Certificates/${host}.crt`)

  if (!fs.existsSync(keyPath)) {
    return {}
  }

  if (!fs.existsSync(certificatePath)) {
    return {}
  }

  return {
    hmr: false,
    host,
    https: {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certificatePath),
    },
  }
}
