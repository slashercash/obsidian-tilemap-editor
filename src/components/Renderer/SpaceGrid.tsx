import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

export function SpaceGrid(
  width: number,
  height: number,
  overflowHorizontal: number,
  overflowVertical: number,
  tileSize: number
) {
  const svg = (
    <svg width='100%' height='100%'>
      <defs>
        <pattern id='grid' width={tileSize} height={tileSize} patternUnits='userSpaceOnUse'>
          <path d={`M ${tileSize} 0 L 0 0 0 ${tileSize}`} fill='none' stroke='gray' strokeWidth='1' />
        </pattern>
      </defs>
      <g transform={`translate(${overflowHorizontal - tileSize}, ${overflowVertical - tileSize})`}>
        <rect width={width} height={height} fill='url(#grid)' />
      </g>
    </svg>
  )

  const output = document.createElement('div')
  output.style.height = '100%'
  output.innerHTML = renderToStaticMarkup(svg)
  return output
}

// var path = document.createElement('path')
// path.setAttribute('d', `M ${tileSize} 0 L 0 0 0 ${tileSize}`)
// path.setAttribute('fill', 'none')
// path.setAttribute('stroke', 'gray')
// path.setAttribute('stroke-width', '1')

// var pattern = document.createElement('pattern')
// pattern.setAttribute('id', 'grid')
// pattern.setAttribute('width', `${tileSize}`)
// pattern.setAttribute('height', `${tileSize}`)
// pattern.setAttribute('patternUnits', 'userSpaceOnUse')

// var rect = document.createElement('rect')
// rect.setAttribute('width', `${(spaceTilesCount.horizontal * 2 + tilesCountHorizontal) * tileSize}`)
// rect.setAttribute('height', `${(spaceTilesCount.vertical * 2 + tilesCountVertical) * tileSize}`)
// rect.setAttribute('fill', 'url(#grid)')

// var g = document.createElement('g')
// g.setAttribute('transform', `translate(${overflow.horizontal - tileSize}, ${overflow.vertical - tileSize})`)

// var defs = document.createElement('defs')

// var svg = document.createElement('svg')
// svg.setAttribute('width', '100%')
// svg.setAttribute('height', '100%')

// g.appendChild(rect)
// pattern.appendChild(path)
// defs.appendChild(pattern)
// svg.appendChild(defs)
// svg.appendChild(g)
