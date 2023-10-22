export type Tilemap = {
  rows: ReadonlyArray<TilemapRow>
  metadata: TilemapMetadata
}

export type TilemapRow = {
  cells: ReadonlyArray<TilemapCell>
}

export type TilemapCell = {
  elements: ReadonlyArray<TilemapElement>
}

export type TilemapElement = {
  className: string
}

export type TilemapMetadata = {
  customTiles: Array<TilemapMetadataCustomTile>
}

export type TilemapMetadataCustomTile = {
  id: string
  shape: string
  color: string
}
