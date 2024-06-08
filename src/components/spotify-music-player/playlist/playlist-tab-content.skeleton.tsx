import React from 'react'
import { Skeleton } from '../../ui/skeleton'

export const PlaylistTabContentSkeleton = () => {
  return (
    <div className="flex flex-col w-full gap-4">
      <Skeleton className="relative overflow-hidden w-full h-[13rem] min-w-[22rem] bg-cover bg-center flex items-end px-4 py-2 " />
      <div className="flex flex-col gap-2 h-full w-full">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Skeleton
              key={i}
              className="relative overflow-hidden w-full h-14 min-w-[22rem] bg-cover bg-center flex items-end px-4 py-2 "
            />
          ))}
      </div>
    </div>
  )
}
