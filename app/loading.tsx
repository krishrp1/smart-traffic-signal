export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3">
        <div className="border-primary size-8 animate-spin rounded-full border-2 border-t-transparent" />
        <p className="text-muted-foreground text-sm">Loading simulation…</p>
      </div>
    </div>
  );
}
