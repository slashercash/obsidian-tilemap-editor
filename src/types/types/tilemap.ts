export type Tilemap = {
  rows: ReadonlyArray<TilemapRow>
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
