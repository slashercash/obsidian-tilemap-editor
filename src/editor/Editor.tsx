import React from 'react'

interface IDisplay {
  fileContent: string
  isEditMode: boolean
}

const Editor = ({ fileContent, isEditMode }: IDisplay) => (
  <>
    {isEditMode && <div>Edit Mode</div>}
    <main dangerouslySetInnerHTML={{ __html: fileContent }} />
  </>
)
export default Editor
