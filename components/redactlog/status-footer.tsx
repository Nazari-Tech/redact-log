import { REDACTION_LABELS, type RedactionType } from "@/lib/redact"

type Props = {
  count: number
  scanMs: number
  countsByType: Record<RedactionType, number>
}

export function StatusFooter({ count, scanMs, countsByType }: Props) {
  const clean = count > 0
  const active = (Object.keys(countsByType) as RedactionType[]).filter((t) => countsByType[t] > 0)

  return (
    <footer className="flex h-9 flex-wrap items-center justify-between gap-3 border-t border-zinc-800 bg-black px-3 font-mono text-[11px] sm:px-4">
      <div className="flex items-center gap-2 text-zinc-500">
        <span
          className={`h-1.5 w-1.5 ${clean ? "bg-amber-400" : "bg-zinc-700"}`}
          aria-hidden="true"
        />
        <span className={clean ? "text-amber-400" : "text-zinc-400"}>
          {count} item{count === 1 ? "" : "s"} redacted
        </span>
        <span className="text-zinc-700">|</span>
        <span>Scanned in {scanMs < 1 ? scanMs.toFixed(2) : scanMs.toFixed(1)}ms</span>
      </div>

      {active.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-zinc-500">
          {active.map((t) => (
            <span key={t} className="rounded-sm border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-amber-400">
              {countsByType[t]} {REDACTION_LABELS[t]}
            </span>
          ))}
        </div>
      )}
    </footer>
  )
}
