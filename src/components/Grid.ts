export default class Grid {
  public readonly root = document.createElement('div')

  constructor() {
    // TODO: Remove inline-style here and at every other place
    this.root.style.height = '100%'
    this.root.appendChild(grid())
  }
}

function grid(): SVGSVGElement {
  const tileSize = 30

  const path = createSvgElement('path', {
    d: `M ${tileSize} 0 L 0 0 0 ${tileSize}`,
    fill: 'none',
    stroke: 'gray',
    'troke-width': '1'
  })

  var pattern = createSvgElement('pattern', {
    id: 'grid',
    width: `${tileSize}`,
    height: `${tileSize}`,
    patternUnits: 'userSpaceOnUse'
  })

  var rect = createSvgElement('rect', {
    width: `${tileSize * 10}`,
    height: `${tileSize * 10}`,
    fill: 'url(#grid)'
  })

  var g = createSvgElement('g', {
    transform: `translate(${-tileSize}, ${-tileSize})`
  })

  var defs = createSvgElement('defs')

  const svg = createSvgElement('svg', {
    width: '100%',
    height: '100%'
  })

  g.appendChild(rect)
  pattern.appendChild(path)
  defs.appendChild(pattern)
  svg.appendChild(defs)
  svg.appendChild(g)

  return svg
}

function createSvgElement<K extends keyof SVGElementTagNameMap>(
  tagName: K,
  obj?: { [key: string]: string }
): SVGElementTagNameMap[K] {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tagName)
  obj && element.setAttrs(obj)
  return element
}
