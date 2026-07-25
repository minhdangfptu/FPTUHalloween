'use client'

import { useLayoutEffect, useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion
} from 'framer-motion'
import { cn } from '../../lib/utils'
import './scroll-based-velocity.scss'

const COPY_COUNT = 2

function ParallaxText({
  children,
  baseVelocity = 100,
  className
}) {
  const baseX = useMotionValue(0)
  const prefersReducedMotion = useReducedMotion()
  const trackRef = useRef(null)
  const loopWidth = useRef(0)

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    const measureTrack = () => {
      loopWidth.current = track.scrollWidth / COPY_COUNT
    }

    measureTrack()
    const resizeObserver = new ResizeObserver(measureTrack)
    resizeObserver.observe(track)

    return () => resizeObserver.disconnect()
  }, [])

  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion || loopWidth.current <= 0) return

    const moveBy = Math.abs(baseVelocity) * (delta / 1000)
    const nextX = baseX.get() - moveBy
    baseX.set(nextX <= -loopWidth.current ? nextX + loopWidth.current : nextX)
  })

  return (
    <div className="scroll-velocity__viewport">
      <motion.div
        ref={trackRef}
        className={cn('scroll-velocity__track', className)}
        style={{ x: baseX }}
      >
        {Array.from({ length: COPY_COUNT }).map((_, index) => (
          <span
            key={index}
            className="scroll-velocity__copy"
            aria-hidden={index > 0 ? 'true' : undefined}
            inert={index > 0}
          >
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export function ScrollBasedVelocity({
  text,
  default_velocity = 60,
  className
}) {
  return (
    <section className="scroll-velocity">
      <ParallaxText
        baseVelocity={default_velocity}
        className={className}
      >
        {text}
      </ParallaxText>
    </section>
  )
}
