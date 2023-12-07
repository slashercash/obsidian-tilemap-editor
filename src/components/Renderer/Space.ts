export function Space(
  width: number,
  height: number,
  overflowHorizontal: number,
  overflowVertical: number,
  tileSize: number,
  onSpaceClicked: (spaceTileX: number, spaceTileY: number) => void
): HTMLDivElement {
  const overflowHorizontalInverted = tileSize - overflowHorizontal
  const overflowVerticalInverted = tileSize - overflowVertical

  const div = document.createElement('div')

  div.style.width = width - 2 * overflowHorizontalInverted + 'px'
  div.style.height = height - 2 * overflowVerticalInverted + 'px'
  div.style.position = 'relative'

  let moved = false
  div.addEventListener('mousedown', () => (moved = false))
  div.addEventListener('mousemove', () => (moved = true))
  div.addEventListener('click', (e) => {
    if (moved) {
      return
    }

    // TODO: This will only be div.parentElement in the future
    const parent = div.parentElement?.parentElement
    if (parent) {
      const boundingClientRect = parent.getBoundingClientRect()
      const spaceTileX = Math.floor(
        (e.clientX - boundingClientRect.left + overflowHorizontalInverted + parent.scrollLeft) / tileSize
      )
      const spaceTileY = Math.floor(
        (e.clientY - boundingClientRect.top + overflowVerticalInverted + parent.scrollTop) / tileSize
      )
      onSpaceClicked(spaceTileX, spaceTileY)
    }
  })

  return div
}
