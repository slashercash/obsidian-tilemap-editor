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
  const filter = /\?raw$/
  return {
    name: 'rawLoader',
    setup(build) {
      build.onResolve({ filter }, (args) => ({ path: path.join(args.resolveDir, args.path) }))
      build.onLoad({ filter }, async (args) => ({
        contents: await readFile(args.path.replace(filter, '')),
        loader: 'text'
      }))
    }
  }
}
