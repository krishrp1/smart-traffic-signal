import { cn } from "@/lib/utils";

interface SignalLightProps {
  active: boolean;
  caution: boolean;
  className?: string;
}

export function SignalLight({ active, caution, className }: SignalLightProps) {
  const color = active ? (caution ? "signal-amber" : "signal-green") : "signal-red";
  return (
    <div
      className={cn(
        "border-border/60 bg-card/80 flex items-center gap-1 rounded-full border px-1.5 py-1 shadow-sm",
        className,
      )}
      aria-hidden="true"
    >
      <span
        className={cn(
          "size-2.5 rounded-full transition-colors duration-300",
          color === "signal-red" && "bg-signal-red shadow-[0_0_8px_var(--signal-red)]",
          color === "signal-amber" && "bg-signal-amber shadow-[0_0_8px_var(--signal-amber)]",
          color === "signal-green" && "bg-signal-green shadow-[0_0_8px_var(--signal-green)]",
        )}
      />
    </div>
  );
}
