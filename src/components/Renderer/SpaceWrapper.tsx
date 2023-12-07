import { Space } from './Space'
import { SpaceGrid } from './SpaceGrid'

export function SpaceWrapper(
  ref: HTMLDivElement,
  tilemap: Element,
  tilemapRendererDiv: HTMLDivElement,
  tilesCountVertical: number,
  tilesCountHorizontal: number,
  tileSize: number,
  onSpaceClicked: (offsetX: number, offsetY: number, tileSize: number) => void
): void {
  // TODO: Initially scroll to center
  // tilemapRendererDiv.scrollLeft = (tilemapRendererDiv.scrollWidth - tilemapRendererDiv.clientWidth) / 2
  // tilemapRendererDiv.scrollTop = (tilemapRendererDiv.scrollHeight - tilemapRendererDiv.clientHeight) / 2

  const width = tilesCountHorizontal * tileSize
  const height = tilesCountVertical * tileSize

  let space = Space(width, height, 0, 0, tileSize, (x, y) => onSpaceClicked(x, y, tileSize))
  space.appendChild(SpaceGrid(width, height, 0, 0, tileSize))
  space.appendChild(tilemap)

  const obs = new ResizeObserver(([entry]) => {
    if (!entry) return

    const horizontal = entry.contentRect.width / tileSize
    const vertical = entry.contentRect.height / tileSize
    const spaceTilesCountHorizontal = Math.floor(horizontal)
    const spaceTilesCountVertical = Math.floor(vertical)
    const overflowHorizontal = (horizontal % 1) * tileSize
    const overflowVertical = (vertical % 1) * tileSize

    space = Space(
      (spaceTilesCountHorizontal * 2 + tilesCountHorizontal) * tileSize,
      (spaceTilesCountVertical * 2 + tilesCountVertical) * tileSize,
      overflowHorizontal,
      overflowVertical,
      tileSize,
      (spaceTileX, spaceTileY) => {
        const offsetX = spaceTileX - spaceTilesCountHorizontal
        const offsetY = spaceTileY - spaceTilesCountVertical
        onSpaceClicked(offsetX, offsetY, tileSize)
      }
    )

    const spaceGrid = SpaceGrid(
      (spaceTilesCountHorizontal * 2 + tilesCountHorizontal) * tileSize,
      (spaceTilesCountVertical * 2 + tilesCountVertical) * tileSize,
      overflowHorizontal,
      overflowVertical,
      tileSize
    )

    space.appendChild(spaceGrid)
    space.appendChild(tilemap)
    ref.replaceChildren(space)
  })
  obs.observe(tilemapRendererDiv)

  ref.replaceChildren(space)
}
