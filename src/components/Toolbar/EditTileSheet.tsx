import type { FC, TilemapMetadataCustomTile } from 'types'
import React from 'react'

type EditTileSheetProps = {
  tile: TilemapMetadataCustomTile
  onChange: (tile: TilemapMetadataCustomTile) => void
}

const EditTileSheet: FC<EditTileSheetProps> = ({ tile, onChange }) => (
  <div className={'tilemap-toolbar-edit-tile'}>
    {/* <div>
      <label>Name:</label>
      <input type={'text'}></input>
    </div> */}
    <div>
      <label>Shape:</label>
      <Dropdown
        values={['square', 'circle']}
        selectedValue={tile.shape}
        onChange={(shape) => onChange({ ...tile, shape })}
      />
    </div>
    {/* <div>
      <label>Border:</label>
    </div> */}
    <div>
      <label>Color:</label>
      <Dropdown
        values={['red', 'blue']}
        selectedValue={tile.color}
        onChange={(color) => onChange({ ...tile, color })}
      />
    </div>
    {/* <div>
      <label>Border color:</label>
    </div> */}
  </div>
)

export default EditTileSheet

type DropdownProps = {
  values: ReadonlyArray<string>
  selectedValue: string
  onChange: (value: string) => void
}

const Dropdown: FC<DropdownProps> = ({ values, selectedValue, onChange }) => {
  return (
    <select value={selectedValue} onChange={(e) => onChange(e.target.value)}>
      {values.map((value, i) => (
        <option key={i} value={value}>
          {value}
        </option>
      ))}
    </select>
  )
}
