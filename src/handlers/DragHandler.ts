export default class DragHandler {
  private static dragging = false
  private static moving = false
  private static startX = 0
  private static startY = 0
  private static scrollLeft = 0
  private static scrollTop = 0

  static startDragging(renderer: HTMLElement) {
    return function (e: MouseEvent) {
      if (e.button == 0) {
        DragHandler.dragging = true
        DragHandler.startX = e.pageX - renderer.offsetLeft
        DragHandler.startY = e.pageY - renderer.offsetTop
        DragHandler.scrollLeft = renderer.scrollLeft
        DragHandler.scrollTop = renderer.scrollTop
      }
    }
  }

  static click(onClick: (m: MouseEvent) => void) {
    return function (e: MouseEvent) {
      if (!DragHandler.moving) {
        onClick(e)
      }
      DragHandler.stopDragging(e)
    }
  }

  static stopDragging = (e: MouseEvent) => {
    if (DragHandler.moving) {
      e.stopPropagation()
    }

    DragHandler.dragging = false
    DragHandler.moving = false
  }

  static mouseMove(renderer: HTMLElement) {
    return function (e: MouseEvent) {
      if (DragHandler.dragging) {
        const moveDistanceX = e.pageX - renderer.offsetLeft - DragHandler.startX
        const moveDistanceY = e.pageY - renderer.offsetTop - DragHandler.startY

        renderer.scrollLeft = DragHandler.scrollLeft - moveDistanceX
        renderer.scrollTop = DragHandler.scrollTop - moveDistanceY

        DragHandler.moving = DragHandler.moving || Math.abs(moveDistanceX) > 5 || Math.abs(moveDistanceY) > 5
      }
    }
  }
}
