import type { FC, TilemapMetadataCustomTile } from 'types'
import React from 'react'

type EditTileSheetProps = {
  tile: TilemapMetadataCustomTile
  onCancel: () => void
}

const EditTileSheet: FC<EditTileSheetProps> = ({ tile, onCancel }) => (
  <div className={'tilemap-toolbar-edit-tile'}>
    {/* <div>
      <label>Name:</label>
      <input type={'text'}></input>
    </div> */}
    <div>
      <label>Shape:</label>
      <span>{tile.shape}</span>
    </div>
    {/* <div>
      <label>Border:</label>
    </div> */}
    <div>
      <label>Color:</label>
      <span>{tile.color}</span>
    </div>
    {/* <div>
      <label>Border color:</label>
    </div> */}
    <button onClick={onCancel}>Cancel</button>
  </div>
)

export default EditTileSheet
