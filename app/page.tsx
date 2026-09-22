"use client"

import { useMemo, useState } from "react"
import { EXAMPLE_LOG, redact, redactedText, type RedactionType } from "@/lib/redact"
import { TopNav } from "@/components/redactlog/top-nav"
import { RawInputPanel } from "@/components/redactlog/raw-input-panel"
import { OutputPanel } from "@/components/redactlog/output-panel"
import { RedactionToolbar } from "@/components/redactlog/redaction-toolbar"
import { StatusFooter } from "@/components/redactlog/status-footer"

export default function Page() {
  const [input, setInput] = useState("")
  const [copied, setCopied] = useState(false)
  const [enabled, setEnabled] = useState<Record<RedactionType, boolean>>({
    ip: true,
    apikey: true,
    email: true,
    password: true,
    domain: true,
  })

  const result = useMemo(() => redact(input, enabled), [input, enabled])

  function toggle(type: RedactionType) {
    setEnabled((prev) => ({ ...prev, [type]: !prev[type] }))
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(redactedText(result.segments))
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard unavailable; silently ignore.
    }
  }

  return (
    <div className="flex h-dvh flex-col bg-black text-zinc-100">
      <TopNav />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 overflow-hidden p-4 sm:p-6">
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
          <RawInputPanel
            value={input}
            onChange={setInput}
            onPasteExample={() => setInput(EXAMPLE_LOG)}
          />

          <section className="flex min-h-0 flex-col rounded-md border border-zinc-800 bg-black">
            <RedactionToolbar
              enabled={enabled}
              onToggle={toggle}
              onCopy={handleCopy}
              copied={copied}
              canCopy={input.length > 0}
            />
            <OutputPanel segments={result.segments} hasInput={input.length > 0} />
          </section>
        </div>
      </main>

      <StatusFooter count={result.count} scanMs={result.scanMs} countsByType={result.countsByType} />
    </div>
  )
}
