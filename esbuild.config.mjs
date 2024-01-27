import esbuild from 'esbuild'
import process from 'process'

const prod = process.argv[2] === 'production'

esbuild
  .build({
    entryPoints: ['src/main.ts'],
    outdir: '.',
    bundle: true,
    external: ['obsidian'],
    format: 'cjs',
    watch: !prod,
    target: 'es2018',
    logLevel: 'info',
    sourcemap: prod ? false : 'inline',
    treeShaking: true
  })
  .catch(() => process.exit(1))
