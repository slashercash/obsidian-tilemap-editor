export function addDragEvents(tilemapRendererDiv: HTMLElement) {
  if (!tilemapRendererDiv) {
    return
  }

  let dragging = false
  let moving = false
  let startX: number
  let startY: number
  let scrollLeft: number
  let scrollTop: number

  const startDragging = (e: MouseEvent) => {
    dragging = true
    startX = e.pageX - tilemapRendererDiv.offsetLeft
    startY = e.pageY - tilemapRendererDiv.offsetTop
    scrollLeft = tilemapRendererDiv.scrollLeft
    scrollTop = tilemapRendererDiv.scrollTop
  }

  const stopDragging = (e: MouseEvent) => {
    if (moving) {
      e.stopPropagation()
    }

    dragging = false
    moving = false
  }

  const mouseMove = (e: MouseEvent) => {
    if (!dragging) {
      return
    }

    const moveDistanceX = e.pageX - tilemapRendererDiv.offsetLeft - startX
    const moveDistanceY = e.pageY - tilemapRendererDiv.offsetTop - startY

    tilemapRendererDiv.scrollLeft = scrollLeft - moveDistanceX
    tilemapRendererDiv.scrollTop = scrollTop - moveDistanceY

    moving = moving || Math.abs(moveDistanceX) > 5 || Math.abs(moveDistanceY) > 5
  }

  tilemapRendererDiv.addEventListener('mousedown', (e) => e.button == 0 && startDragging(e))
  tilemapRendererDiv.addEventListener('click', stopDragging)
  tilemapRendererDiv.addEventListener('mouseleave', stopDragging)
  tilemapRendererDiv.addEventListener('mousemove', mouseMove)
}
