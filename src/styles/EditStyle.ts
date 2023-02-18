import styled from 'styled-components'

export const EditStyle = styled.section`
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
`
