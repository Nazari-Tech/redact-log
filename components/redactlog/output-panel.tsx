"use client"

import { Fragment } from "react"
import { Braces } from "lucide-react"
import { REDACTION_LABELS, type Segment } from "@/lib/redact"

type Props = {
  segments: Segment[]
  hasInput: boolean
}

export function OutputPanel({ segments, hasInput }: Props) {
  return (
    <section className="flex min-h-0 flex-1 flex-col">
      {hasInput ? (
        <div className="min-h-[320px] flex-1 overflow-auto whitespace-pre-wrap break-words px-4 py-3 font-mono text-[12.5px] leading-relaxed text-zinc-200">
          {segments.map((seg, i) =>
            seg.type ? (
              <span
                key={i}
                title={REDACTION_LABELS[seg.type]}
                className="mx-0.5 inline-flex items-center rounded-sm border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 align-baseline font-mono text-amber-400"
              >
                {seg.text}
              </span>
            ) : (
              <Fragment key={i}>{seg.text}</Fragment>
            ),
          )}
        </div>
      ) : (
        <div className="flex min-h-[320px] flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-zinc-800 bg-zinc-950">
            <Braces className="h-4 w-4 text-zinc-500" aria-hidden="true" />
          </div>
          <p className="max-w-xs font-mono text-[12px] leading-relaxed text-zinc-500">
            Scrubbed output appears here. Matches are marked as inline tokens before you copy.
          </p>
        </div>
      )}
    </section>
  )
}
