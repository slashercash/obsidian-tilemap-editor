import React from 'react'
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
    return <main dangerouslySetInnerHTML={{ __html: view }} />
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
      <div dangerouslySetInnerHTML={{ __html: view }} />
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
