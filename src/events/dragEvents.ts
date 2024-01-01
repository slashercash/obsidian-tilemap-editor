export default class DragEvents {
  private static dragging = false
  private static moving = false
  private static startX = 0
  private static startY = 0
  private static scrollLeft = 0
  private static scrollTop = 0

  static startDragging(renderer: HTMLElement) {
    return function (e: MouseEvent) {
      if (e.button == 0) {
        DragEvents.dragging = true
        DragEvents.startX = e.pageX - renderer.offsetLeft
        DragEvents.startY = e.pageY - renderer.offsetTop
        DragEvents.scrollLeft = renderer.scrollLeft
        DragEvents.scrollTop = renderer.scrollTop
      }
    }
  }

  static click(onClick: (m: MouseEvent) => void) {
    return function (e: MouseEvent) {
      if (!DragEvents.moving) {
        onClick(e)
      }
      DragEvents.stopDragging(e)
    }
  }

  static stopDragging = (e: MouseEvent) => {
    if (DragEvents.moving) {
      e.stopPropagation()
    }

    DragEvents.dragging = false
    DragEvents.moving = false
  }

  static mouseMove(renderer: HTMLElement) {
    return function (e: MouseEvent) {
      if (DragEvents.dragging) {
        const moveDistanceX = e.pageX - renderer.offsetLeft - DragEvents.startX
        const moveDistanceY = e.pageY - renderer.offsetTop - DragEvents.startY

        renderer.scrollLeft = DragEvents.scrollLeft - moveDistanceX
        renderer.scrollTop = DragEvents.scrollTop - moveDistanceY

        DragEvents.moving = DragEvents.moving || Math.abs(moveDistanceX) > 5 || Math.abs(moveDistanceY) > 5
      }
    }
  }
}
