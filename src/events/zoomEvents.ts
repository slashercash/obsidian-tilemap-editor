export function addZoomEvents(renderer: HTMLElement, onZoom: (newTileSize: number) => void) {
  let tileSize = 30
  let prevTouchDistance = 0

  const onTouchEvent = (e: globalThis.TouchEvent) => {
    const tA = e.touches[0]
    const tB = e.touches[1]

    if (e.touches.length === 2 && tA && tB) {
      const distance = getDistance(tA.pageX, tA.pageY, tB.pageX, tB.pageY)

      const zoomFactor = prevTouchDistance === 0 ? 1 : (1 / prevTouchDistance) * distance

      tileSize = tileSize * zoomFactor
      prevTouchDistance = distance
      onZoom(tileSize)
    } else {
      prevTouchDistance = 0
    }
  }

  const onWheel = (e: globalThis.WheelEvent) => {
    if (!e.ctrlKey) {
      return
    }

    if (e.deltaY > 0) {
      tileSize = tileSize * 0.95
      onZoom(tileSize)
      return
    }

    if (e.deltaY < 0) {
      tileSize = tileSize * 1.05
      onZoom(tileSize)
      return
    }
  }

  renderer.addEventListener('touchstart', onTouchEvent, { passive: true })
  renderer.addEventListener('touchmove', onTouchEvent, { passive: true })
  renderer.addEventListener('touchend', onTouchEvent, { passive: true })
  renderer.addEventListener('touchcancel', onTouchEvent, { passive: true })
  renderer.addEventListener('wheel', onWheel, { passive: true })
}

function getDistance(x1: number, y1: number, x2: number, y2: number) {
  const y = x2 - x1
  const x = y2 - y1
  return Math.sqrt(x * x + y * y)
}
