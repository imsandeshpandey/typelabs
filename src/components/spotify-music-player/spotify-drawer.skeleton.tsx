import { Skeleton } from '../ui/skeleton'

export const DrawerSkeleton = () => {
  return (
    <div className="flex flex-col w-[15rem] gap-4">
      <Skeleton className="w-[8rem] h-6 mb-4" />
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="w-full h-10" />
        ))}
    </div>
  )
}
