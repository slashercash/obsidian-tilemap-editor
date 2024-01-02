export default class ZoomHandler {
  private static prevTouchDistance = 0

  static handleTouch(onZoom: (zoomFactor: number) => void) {
    return function (e: TouchEvent) {
      const tA = e.touches[0]
      const tB = e.touches[1]

      if (e.touches.length === 2 && tA && tB) {
        const distance = Math.sqrt((tB.pageX - tA.pageX) ** 2 + (tB.pageY - tA.pageY) ** 2)
        const zoomFactor = ZoomHandler.prevTouchDistance === 0 ? 1 : (1 / ZoomHandler.prevTouchDistance) * distance
        ZoomHandler.prevTouchDistance = distance
        onZoom(zoomFactor)
      } else {
        ZoomHandler.prevTouchDistance = 0
      }
    }
  }

  static handleWheel(onZoom: (zoomFactor: number) => void) {
    return function (e: WheelEvent) {
      if (e.ctrlKey && e.deltaY) {
        onZoom(e.deltaY > 0 ? 0.95 : 1.05)
      }
    }
  }
}
