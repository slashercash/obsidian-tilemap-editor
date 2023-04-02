import esbuild from 'esbuild'
import process from 'process'
import path from 'path'
import { readFile } from 'fs/promises'

const prod = process.argv[2] === 'production'

esbuild
  .build({
    entryPoints: ['src/main.ts', 'src/styles.css'],
    outdir: '.',
    bundle: true,
    external: ['obsidian'],
    format: 'cjs',
    watch: !prod,
    target: 'es2018',
    logLevel: 'info',
    sourcemap: prod ? false : 'inline',
    treeShaking: true,
    plugins: [rawLoader()]
  })
  .catch(() => process.exit(1))

function rawLoader() {
  return {
    name: 'raw',
    setup(build) {
      build.onResolve({ filter: /\?raw$/ }, (args) => {
        return {
          path: args.path,
          pluginData: {
            isAbsolute: path.isAbsolute(args.path),
            resolveDir: args.resolveDir
          },
          namespace: 'raw-loader'
        }
      })
      build.onLoad({ filter: /\?raw$/, namespace: 'raw-loader' }, async (args) => {
        const fullPath = args.pluginData.isAbsolute ? args.path : path.join(args.pluginData.resolveDir, args.path)
        return {
          contents: await readFile(fullPath.replace(/\?raw$/, '')),
          loader: 'text'
        }
      })
    }
  }
}
