// @ts-ignore:next-line
import tilemapRenderer from './tilemapRenderer.css?raw'

let str = removePrefix(tilemapRenderer)
str = format(str)
export const cssStyle = wrapStyleElement(str)

function removePrefix(str: string): string {
  return str.replace(/\.view-content-tilemap-editor\s/gm, '')
}

function format(str: string): string {
  return str
    .trim()
    .replace(/\n\s*\n/g, '\n')
    .replace(/\n/g, '\n  ')
}

function wrapStyleElement(css: string): string {
  return `<style>
  main {
    display: flex;
    justify-content: center;
  }
  ${css}
</style>
`
}
