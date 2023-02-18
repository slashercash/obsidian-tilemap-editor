import styled from 'styled-components'

export const ParserStyle = styled.main`
  display: flex;
  justify-content: center;

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
`
