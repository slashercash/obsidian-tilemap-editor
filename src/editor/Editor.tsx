import React, { FC, useState } from 'react'
import styled from 'styled-components'

interface IEditor {
  view: string
  isEditMode: boolean
  onViewChanged: (newView: string) => void
}

const Editor = ({ view, isEditMode, onViewChanged }: IEditor) => {
  return <Parser view={view}/>

  if (isEditMode) {
    return <Edit view={view} onViewChanged={onViewChanged} />
  } else {
    return <InnerHtml view={view} />
  }
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
      <section>
        <div className='red' onClick={() => changeColorTo('red')} />
        <div className='green' onClick={() => changeColorTo('green')} />
        <div className='yellow' onClick={() => changeColorTo('yellow')} />
      </section>
      <InnerHtml view={view} />
    </EditStyle>
  )
}

const EditStyle = styled.main`
  > section {
    display: flex;
    justify-content: center;
    gap: 10px;

    > div {
      width: 50px;
      height: 50px;
      &:hover {
        cursor: pointer;
      }
    }
    > .red {
      background-color: red;
    }
    > .green {
      background-color: green;
    }
    > .yellow {
      background-color: yellow;
    }
  }
`

interface InnerHtmlProps {
  view: string
}

const InnerHtml: FC<InnerHtmlProps> = ({ view }) => {
  const [prevTouchDistance, setPrevTouchDistance] = useState(0)
  const [size, setSize] = useState(1)

  const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    let y = x2 - x1
    let x = y2 - y1
    return Math.sqrt(x * x + y * y)
  }

  const setTouches = (touches: React.TouchList) => {
    if (touches.length === 2) {
      const tA = touches[0]
      const tB = touches[1]
      const distance = getDistance(tA.pageX, tA.pageY, tB.pageX, tB.pageY)

      const sizeFactor = prevTouchDistance === 0 ? 1 : 1 / prevTouchDistance * distance

      setSize(size * sizeFactor)

      setPrevTouchDistance(distance)
    } else {
      setPrevTouchDistance(0)
    }
  }

  return (
    <>
      <div style={{transform: `scale(${size})`}}
        dangerouslySetInnerHTML={{ __html: view }}
        onTouchStart={(e) => setTouches(e.touches)}
        onTouchMove={(e) => setTouches(e.touches)}
        onTouchEnd={(e) => setTouches(e.touches)}
        onTouchCancel={(e) => setTouches(e.touches)}
      />
      <p>{`Distance --> ${prevTouchDistance}`}</p>
      <p>{`Size --> ${size}`}</p>
    </>
  )
}

interface ParserProps {
  view: string
}

const Parser: FC<ParserProps> = ({view}) => {
  const tilemapStr = getTilemapStr(view)
  const splitRows = getSplitRows(tilemapStr)
  const splitCells = getSplitCells(splitRows)


  console.log(splitCells)
  return <div>{tilemapStr}</div>
}

function getTilemapStr(view: string) {
  const regexp = /<body>[\s+]*<main>[\s+]*<div>(.*)<\/div>[\s+]*<\/main>[\s+]*<\/body>/gs;

  const arr = Array.from(view.matchAll(regexp), m => m[1])

  if (arr.length > 0) {
    return arr[0]
  }

  throw new Error('could not read tilemap') 
}

function getSplitRows(tilemap: string) {
  const regexp = /<\/div>[\s+]*<div class='tilemap-row'>|<div class='tilemap-row'>|<\/div>(?!.*<\/div>)/gs
  

  return tilemap.split(regexp).slice(1, -1)
}

function getSplitCells(splitRows: ReadonlyArray<string>) {
  const regexp = /<\/div>[\s+]*<div class='tilemap-cell'>|<div class='tilemap-cell'>|<\/div>(?!.*<\/div>)/gs

  return splitRows.map(splitRow => splitRow.split(regexp).slice(1, -1))
}


