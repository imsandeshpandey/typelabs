import { Skeleton } from '../ui/skeleton'

export const DrawerSkeleton = () => {
  return (
    <div className="flex w-[15rem] flex-col gap-4">
      <Skeleton className="mb-4 h-6 w-[8rem]" />
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
    </div>
  )
}
