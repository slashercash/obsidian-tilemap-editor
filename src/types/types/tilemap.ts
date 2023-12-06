export type TilemapMetadata = {
  customTiles: Array<TilemapMetadataCustomTile>
}

export type TilemapMetadataCustomTile = {
  id: number
  shape: string
  color: string
}
