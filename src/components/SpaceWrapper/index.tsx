import type { FC, ReactNode } from 'types'
import React, { useLayoutEffect, useRef } from 'react'
import { cn } from 'helper/className'

type SpaceWrapperProps = {
  isEditMode: boolean
  tilemapVertical: number
  tilemapHorizontal: number
  children: ReactNode
}

export const SpaceWrapper: FC<SpaceWrapperProps> = ({ isEditMode, tilemapVertical, tilemapHorizontal, children }) => {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    console.log('effect ')
    const obs = new ResizeObserver(([entry]) => {
      if (entry) {
        console.log(`height: ${entry.contentRect.height} | width: ${entry.contentRect.width}`)
      }
    })

    if (ref.current) {
      obs.observe(ref.current)
    }
    return () => {
      console.log('disconnect ')
      obs.disconnect()
    }
  }, [])

  const spaceVertical = 13
  const spaceHorizontal = 8

  const EdgeSpace: FC = createSpace(spaceHorizontal, spaceVertical)
  const HorizontSpace: FC = createSpace(spaceHorizontal, tilemapVertical)
  const VerticalSpace: FC = createSpace(tilemapHorizontal, spaceVertical)

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
