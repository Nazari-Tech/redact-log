import { Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TopNav() {
  return (
    <header className="flex h-10 items-center justify-between gap-4 border-b border-zinc-800 bg-black px-3 font-mono text-[12px] sm:px-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex items-center gap-2 text-zinc-200">
          <Terminal className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
          <span className="font-medium tracking-tight">redactlog</span>
        </span>
        <span className="hidden text-zinc-700 sm:inline" aria-hidden="true">
          /
        </span>
        <span className="hidden text-zinc-500 sm:inline">log scrubber</span>
        <span className="hidden border border-zinc-800 bg-zinc-950 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-zinc-500 sm:inline">
          local
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-[11px] text-zinc-600 md:inline">no network · client-side</span>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 rounded-sm border border-zinc-800 bg-transparent px-2.5 font-mono text-[11px] text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
        >
          Upgrade
        </Button>
      </div>
    </header>
  )
}
