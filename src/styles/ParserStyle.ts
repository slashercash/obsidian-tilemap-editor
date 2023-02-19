import styled from 'styled-components'

export const ParserStyle = styled.div`
  .tilemap-row {
    display: flex;
  }
  .tilemap-cell {
    display: grid;
    height: 30px;
    width: 30px;
    box-shadow: inset 0 0 0 1px lightgray;
  }
  .tilemap-cell > div {
    grid-row-start: 1;
    grid-column-start: 1;
  }
  .tile {
    background-color: rgb(93, 0, 255);
    box-shadow: inset 0 0 0 1px black;
  }

  &.tilemap-editmode .tilemap-cell:hover {
    box-shadow: inset 0 0 0 1px red;
    cursor: pointer;
    > div {
      box-shadow: inset 0 0 0 1px red;
    }
  }
`
