export function Footer() {
  return (
    <footer className="border-border/60 border-t">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center text-sm sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <p>
          Built by{" "}
          <a
            href="https://github.com/krishrp1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            Krish Ramesh Pareet
          </a>{" "}
          — a queue-based priority scheduler, from a C console program to an interactive simulation.
        </p>
        <p>MIT Licensed</p>
      </div>
    </footer>
  );
}
