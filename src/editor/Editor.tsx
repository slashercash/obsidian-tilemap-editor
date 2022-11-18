import React from 'react'
import styled from 'styled-components'

interface IEditor {
  fileContent: string
  isEditMode: boolean
}

const Editor = ({ fileContent, isEditMode }: IEditor) => {
  if (isEditMode) {
    return <Edit fileContent={fileContent} />
  } else {
    return <main dangerouslySetInnerHTML={{ __html: fileContent }} />
  }
}
export default Editor

const Edit = ({ fileContent }: { fileContent: string }) => {
  const changeColorTo = (color: string) => {
    console.log(color)
  }

  return (
    <EditStyle>
      <section>
        <div className='red' onClick={() => changeColorTo('red')} />
        <div className='green' onClick={() => changeColorTo('green')} />
        <div className='yellow' onClick={() => changeColorTo('yellow')} />
      </section>
      <div dangerouslySetInnerHTML={{ __html: fileContent }} />
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
