// @ts-ignore:next-line
import tilemapRenderer from './tilemapRenderer.css?raw'

let style: string

export function getRawStyle() {
  if (!style) {
    style = removePrefix(tilemapRenderer)
    style = format(style)
    style = wrapStyleElement(style)
  }
  return style
}

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
