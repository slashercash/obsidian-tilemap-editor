import type { FC, ReactNode } from 'types'
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { cn } from 'helper/className'

type SpaceWrapperProps = {
  isEditMode: boolean
  tilemapSizeVertical: number
  tilemapSizeHorizontal: number
  children: ReactNode
}

export const SpaceWrapper: FC<SpaceWrapperProps> = ({
  isEditMode,
  tilemapSizeVertical,
  tilemapSizeHorizontal,
  children
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [editorSizeVertical, setEditorSizeVertical] = useState(0)
  const [editorSizeHorizontal, setEditorSizeHorizontal] = useState(0)

  useLayoutEffect(() => {
    const obs = new ResizeObserver(([entry]) => {
      if (entry) {
        setEditorSizeHorizontal(Math.floor(entry.contentRect.width / 30))
        setEditorSizeVertical(Math.floor(entry.contentRect.height / 30))
      }
    })
    if (ref.current) {
      obs.observe(ref.current)
    }
    return () => {
      obs.disconnect()
    }
  }, [])

  const EdgeSpace: FC = createSpace(editorSizeHorizontal, editorSizeVertical)
  const HorizontSpace: FC = createSpace(editorSizeHorizontal, tilemapSizeVertical)
  const VerticalSpace: FC = createSpace(tilemapSizeHorizontal, editorSizeVertical)

  return (
    <div ref={ref} className={cn('tilemap-renderer', isEditMode && 'edit')}>
      <section>
        <EdgeSpace />
        <VerticalSpace />
        <EdgeSpace />
      </section>
      <section>
        <HorizontSpace />
        {children}
        <HorizontSpace />
      </section>
      <section>
        <EdgeSpace />
        <VerticalSpace />
        <EdgeSpace />
      </section>
    </div>
  )
}

function createSpace(x: number, y: number): FC {
  return () => (
    <div className={'space'}>
      {[...Array(y)].map((_, rowKey) => (
        <div key={rowKey} className='space-row'>
          {[...Array(x)].map((_, cellKey) => (
            <div key={cellKey} className='space-cell'></div>
          ))}
        </div>
      ))}
    </div>
  )
}
