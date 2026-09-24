import { cn } from "@/lib/utils";

/**
 * Freebuff brand mark: rounded square with a green-to-sky gradient and a
 * lightning glyph (public/freebuff.svg). Rendered via <img> so its gradient
 * IDs never collide across instances.
 */
export function FreebuffMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/freebuff.svg"
      alt=""
      aria-hidden="true"
      className={cn("h-[22px] w-[22px]", className)}
    />
  );
}

export function FreebuffLogo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <FreebuffMark className={markClassName} />
      <span className="text-[19px] font-bold leading-none tracking-[-0.45px] text-inherit">
        Freebuff
      </span>
    </span>
  );
}

/** @deprecated legacy name kept so old imports keep working. */
export const LovableMark = FreebuffMark;

/** @deprecated legacy name kept so old imports keep working. */
export function LovableLogo(props: {
  className?: string;
  markClassName?: string;
}) {
  return <FreebuffLogo {...props} />;
}
