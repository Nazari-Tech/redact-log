"use client"

import { Check, Copy, ShieldCheck } from "lucide-react"
import { REDACTION_LABELS, type RedactionType } from "@/lib/redact"

type Props = {
  enabled: Record<RedactionType, boolean>
  onToggle: (type: RedactionType) => void
  onCopy: () => void
  copied: boolean
  canCopy: boolean
}

const ORDER: RedactionType[] = ["ip", "apikey", "email", "password", "domain"]

export function RedactionToolbar({ enabled, onToggle, onCopy, copied, canCopy }: Props) {
  return (
    <div className="flex flex-col gap-2.5 border-b border-zinc-800 px-3 py-2 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden="true" />
        <h2 className="mr-1 font-mono text-[12px] font-medium text-zinc-300">output</h2>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Redaction toggles">
          {ORDER.map((type) => {
            const active = enabled[type]
            return (
              <button
                key={type}
                type="button"
                aria-pressed={active}
                onClick={() => onToggle(type)}
                className={`rounded-sm border px-1.5 py-0.5 font-mono text-[11px] transition-colors ${
                  active
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                    : "border-zinc-800 bg-black text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                }`}
              >
                {REDACTION_LABELS[type]}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={onCopy}
          disabled={!canCopy}
          className="inline-flex items-center gap-1.5 rounded-sm border border-zinc-700 bg-zinc-100 px-2.5 py-1 font-mono text-[11px] font-medium text-zinc-950 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              Copy Clean Log
            </>
          )}
        </button>
      </div>
    </div>
  )
}
