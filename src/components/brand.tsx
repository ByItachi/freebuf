import { cn } from "@/lib/utils";

/**
 * The real Lovable mark (rounded "L" filled with the brand gradients) and
 * wordmark lockup. The mark is the actual favicon.svg from lovable.dev,
 * rendered via <img> so its gradient IDs never collide.
 */
export function LovableMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/favicon.svg"
      alt=""
      aria-hidden="true"
      className={cn("h-[22px] w-[22px]", className)}
    />
  );
}

export function LovableLogo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <LovableMark className={markClassName} />
      <span className="text-[19px] font-bold leading-none tracking-[-0.45px] text-inherit">
        Lovable
      </span>
    </span>
  );
}
