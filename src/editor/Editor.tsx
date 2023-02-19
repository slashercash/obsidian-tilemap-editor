import React, { FC, useCallback, useState } from 'react'
import { EditStyle } from 'src/styles/EditStyle'
import { MainStyle } from 'src/styles/MainStyle'
import { ParserStyle } from 'src/styles/ParserStyle'
import { Tilemap, TilemapCell, TilemapElement, TilemapRow } from 'src/types/tilemap'

interface IEditor {
  view: string
  isEditMode: boolean
  onViewChanged: (newView: string) => void
}

const Editor = ({ view, isEditMode, onViewChanged }: IEditor) => {
  return (
    <MainStyle>
      {/* {isEditMode && <Edit view={view} onViewChanged={onViewChanged} />} */}
      <Parser view={view} isEditMode={isEditMode} />
    </MainStyle>
  )
}
export default Editor

interface IEdit {
  view: string
  onViewChanged: (view: string) => void
}

const Edit = ({ view, onViewChanged }: IEdit) => {
  const changeColorTo = (color: string) => {
    const newView = view.replace(/(red|green|yellow)/, color)
    onViewChanged(newView)
  }

  return (
    <EditStyle>
      <div className='red' onClick={() => changeColorTo('red')} />
      <div className='green' onClick={() => changeColorTo('green')} />
      <div className='yellow' onClick={() => changeColorTo('yellow')} />
    </EditStyle>
  )
}

interface ParserProps {
  view: string
  isEditMode: boolean
}

const Parser: FC<ParserProps> = ({ view, isEditMode }) => {
  const [tilemap, setTilemap] = useState(parseTilemap(view))

  const updateTile = useCallback((rowKey: number, cellKey: number) => {
    const hasTile = tilemap.rows[rowKey].cells[cellKey].elements.length > 0
    tilemap.rows[rowKey].cells[cellKey].elements = hasTile ? [] : [{ className: 'tile' }]
    setTilemap({ ...tilemap })
  }, [])

  return (
    <ParserStyle className={isEditMode ? 'tilemap-editmode' : undefined}>
      {tilemap.rows.map((row, rowKey) => (
        <div key={rowKey} className='tilemap-row'>
          {row.cells.map((cell, cellKey) => (
            <div key={cellKey} className='tilemap-cell' onClick={() => isEditMode && updateTile(rowKey, cellKey)}>
              {cell.elements.map((element, elementKey) => (
                <div key={elementKey} className={element.className}></div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </ParserStyle>
  )
}

function parseTilemap(view: string): Tilemap {
  const htmlDoc = new DOMParser().parseFromString(view, 'text/html')
  const tm = htmlDoc.getElementById('tilemap')

  if (tm === null) {
    throw new Error('could not read tilemap')
  }

  const rows: ReadonlyArray<TilemapRow> = Array.from(tm.children).map(parseRow)

  const tilemap: Tilemap = { rows }

  return tilemap
}

function parseRow(row: Element): TilemapRow {
  const cells: ReadonlyArray<TilemapCell> = Array.from(row.children).map(parseCell)
  return { cells }
}

function parseCell(cell: Element): TilemapCell {
  const elements: ReadonlyArray<TilemapElement> = Array.from(cell.children).map(parseElement)
  return { elements }
}

function parseElement(element: Element): TilemapElement {
  return {
    className: element.className
  }
}

// interface InnerHtmlProps {
//   view: string
// }

// const InnerHtml: FC<InnerHtmlProps> = ({ view }) => {
//   const [prevTouchDistance, setPrevTouchDistance] = useState(0)
//   const [size, setSize] = useState(1)

//   const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
//     let y = x2 - x1
//     let x = y2 - y1
//     return Math.sqrt(x * x + y * y)
//   }

//   const setTouches = (touches: React.TouchList) => {
//     if (touches.length === 2) {
//       const tA = touches[0]
//       const tB = touches[1]
//       const distance = getDistance(tA.pageX, tA.pageY, tB.pageX, tB.pageY)

//       const sizeFactor = prevTouchDistance === 0 ? 1 : (1 / prevTouchDistance) * distance

//       setSize(size * sizeFactor)

//       setPrevTouchDistance(distance)
//     } else {
//       setPrevTouchDistance(0)
//     }
//   }

//   return (
//     <>
//       <div
//         style={{ transform: `scale(${size})` }}
//         dangerouslySetInnerHTML={{ __html: view }}
//         onTouchStart={(e) => setTouches(e.touches)}
//         onTouchMove={(e) => setTouches(e.touches)}
//         onTouchEnd={(e) => setTouches(e.touches)}
//         onTouchCancel={(e) => setTouches(e.touches)}
//       />
//       <p>{`Distance --> ${prevTouchDistance}`}</p>
//       <p>{`Size --> ${size}`}</p>
//     </>
//   )
// }
