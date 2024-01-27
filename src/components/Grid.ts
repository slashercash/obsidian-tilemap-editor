export default class Grid {
  public readonly root = document.createElement('div')

  private readonly pattern = createSvgElement('pattern', {
    id: 'grid',
    patternUnits: 'userSpaceOnUse'
  })

  private readonly path = createSvgElement('path', {
    fill: 'none',
    stroke: 'gray',
    'troke-width': '1'
  })

  private readonly g = createSvgElement('g')

  private readonly rect = createSvgElement('rect', {
    fill: 'url(#grid)'
  })

  constructor() {
    // TODO: Remove inline-style here and at every other place
    this.root.style.height = '100%'

    var defs = createSvgElement('defs')

    const svg = createSvgElement('svg', {
      width: '100%',
      height: '100%'
    })

    this.g.appendChild(this.rect)
    this.pattern.appendChild(this.path)
    defs.appendChild(this.pattern)
    svg.appendChild(defs)
    svg.appendChild(this.g)

    this.root.appendChild(svg)
  }

  // TODO: Use CSS if possible or more generic approach
  public update(width: number, height: number, overflowHorizontal: number, overflowVertical: number, tileSize: number) {
    this.pattern.setAttrs({
      width: `${tileSize}`,
      height: `${tileSize}`
    })

    this.path.setAttrs({
      d: `M ${tileSize} 0 L 0 0 0 ${tileSize}`
    })

    this.g.setAttrs({
      transform: `translate(${overflowHorizontal}, ${overflowVertical})`
    })

    this.rect.setAttrs({
      width,
      height
    })
  }
}

function createSvgElement<K extends keyof SVGElementTagNameMap>(
  tagName: K,
  obj?: { [key: string]: string }
): SVGElementTagNameMap[K] {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tagName)
  obj && element.setAttrs(obj)
  return element
}
