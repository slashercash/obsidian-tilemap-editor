import type { FC, ReactNode } from 'types'
import React, { useLayoutEffect, useEffect, useRef, useState } from 'react'
import { cn } from 'helper/className'

type SpaceWrapperProps = {
  isEditMode: boolean
  tilesCountVertical: number
  tilesCountHorizontal: number
  children: ReactNode
}

export const SpaceWrapper: FC<SpaceWrapperProps> = ({
  isEditMode,
  tilesCountVertical,
  tilesCountHorizontal,
  children
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [editorDimensions, setEditorDimensions] = useState({ width: 0, height: 0 })
  const [doCenter, setDoCenter] = useState<boolean>(true)

  useLayoutEffect(() => {
    const obs = new ResizeObserver(([entry]) => {
      if (entry) {
        const spaceTilesCountHorizontal = Math.floor(entry.contentRect.width / 30) * 2
        const spaceTilesCountVertical = Math.floor(entry.contentRect.height / 30) * 2
        setEditorDimensions({
          width: (spaceTilesCountHorizontal + tilesCountHorizontal) * 30,
          height: (spaceTilesCountVertical + tilesCountVertical) * 30
        })
      }
    })
    if (ref.current) {
      obs.observe(ref.current)
    }
    return () => {
      obs.disconnect()
    }
  }, [])

  useEffect(() => {
    if (doCenter && editorDimensions.width != 0 && editorDimensions.height != 0 && ref.current) {
      setDoCenter(false)
      ref.current.scrollLeft = (ref.current.scrollWidth - ref.current.clientWidth) / 2
      ref.current.scrollTop = (ref.current.scrollHeight - ref.current.clientHeight) / 2
    }
  }, [editorDimensions])

  return (
    <div ref={ref} className={cn('tilemap-renderer', isEditMode && 'edit')}>
      <ScrollGrid width={editorDimensions.width + 'px'} height={editorDimensions.height + 'px'}>
        {children}
      </ScrollGrid>
    </div>
  )
}

type ScrollGridProps = {
  width: string
  height: string
  children: ReactNode
}

const ScrollGrid: FC<ScrollGridProps> = ({ width, height, children }) => (
  <div style={{ width, height, position: 'relative' }}>
    <svg width='100%' height='100%'>
      <defs>
        <pattern id='grid' width='30' height='30' patternUnits='userSpaceOnUse'>
          <path d='M 30 0 L 0 0 0 30' fill='none' stroke='gray' strokeWidth='1' />
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='url(#grid)' />
    </svg>
    {children}
  </div>
)
