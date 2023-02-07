import React, { FC, useState } from 'react'
import styled from 'styled-components'

interface IEditor {
  view: string
  isEditMode: boolean
  onViewChanged: (newView: string) => void
}

const Editor = ({ view, isEditMode, onViewChanged }: IEditor) => {
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
  const [touchA, setTouchA] = useState((): { x: number; y: number } => ({ x: 0, y: 0 }))
  const [touchB, setTouchB] = useState((): { x: number; y: number } => ({ x: 0, y: 0 }))

  return (
    <>
      <div
        dangerouslySetInnerHTML={{ __html: view }}
        onTouchStart={(e) => {
          if (e.touches.length === 2) {
            const tA = e.touches[0]
            const tB = e.touches[1]
            setTouchA({ x: tA.pageX, y: tA.pageY })
            setTouchB({ x: tB.pageX, y: tB.pageY })
          }
        }}
      />
      <p>{`TouchA --> X: ${Math.trunc(touchA.x)} | Y: ${Math.trunc(touchA.y)}`}</p>
      <p>{`TouchB --> X: ${Math.trunc(touchB.x)} | Y: ${Math.trunc(touchB.y)}`}</p>
    </>
  )
}
