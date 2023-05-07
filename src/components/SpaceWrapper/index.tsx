import type { FC, ReactNode } from 'types'
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
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
  const [editorHeight, setEditorHeight] = useState(0)
  const [editorWidth, setEditorWidth] = useState(0)

  useLayoutEffect(() => {
    const obs = new ResizeObserver(([entry]) => {
      if (entry) {
        const spaceTilesCountHorizontal = Math.floor(entry.contentRect.width / 30) * 2
        const spaceTilesCountVertical = Math.floor(entry.contentRect.height / 30) * 2

        setEditorWidth((spaceTilesCountHorizontal + tilesCountHorizontal) * 30)
        setEditorHeight((spaceTilesCountVertical + tilesCountVertical) * 30)
      }
    })
    if (ref.current) {
      obs.observe(ref.current)
    }
    return () => {
      obs.disconnect()
    }
  }, [])

  return (
    <div ref={ref} className={cn('tilemap-renderer', isEditMode && 'edit')}>
      <ScrollGrid width={editorWidth + 'px'} height={editorHeight + 'px'}>
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
