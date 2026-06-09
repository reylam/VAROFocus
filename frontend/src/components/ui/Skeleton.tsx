import React from 'react'

type SkeletonProps = {
  className?: string
  muted?: boolean
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', muted = false }) => (
  <div className={`skeleton ${muted ? 'skeleton-muted' : ''} ${className}`} aria-hidden />
)

export default Skeleton
