export function addDragEvents(renderer: HTMLElement) {
  let dragging = false
  let moving = false
  let startX: number
  let startY: number
  let scrollLeft: number
  let scrollTop: number

  const startDragging = (e: MouseEvent) => {
    dragging = true
    startX = e.pageX - renderer.offsetLeft
    startY = e.pageY - renderer.offsetTop
    scrollLeft = renderer.scrollLeft
    scrollTop = renderer.scrollTop
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

    const moveDistanceX = e.pageX - renderer.offsetLeft - startX
    const moveDistanceY = e.pageY - renderer.offsetTop - startY

    renderer.scrollLeft = scrollLeft - moveDistanceX
    renderer.scrollTop = scrollTop - moveDistanceY

    moving = moving || Math.abs(moveDistanceX) > 5 || Math.abs(moveDistanceY) > 5
  }

  renderer.addEventListener('mousedown', (e) => e.button == 0 && startDragging(e))
  renderer.addEventListener('click', stopDragging)
  renderer.addEventListener('mouseleave', stopDragging)
  renderer.addEventListener('mousemove', mouseMove)
}
