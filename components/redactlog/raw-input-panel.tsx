"use client"

import { useRef, useState } from "react"
import { FileText, Upload } from "lucide-react"

type Props = {
  value: string
  onChange: (value: string) => void
  onPasteExample: () => void
}

export function RawInputPanel({ value, onChange, onPasteExample }: Props) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function readFile(file: File) {
    const reader = new FileReader()
    reader.onload = () => onChange(String(reader.result ?? ""))
    reader.readAsText(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) readFile(file)
  }

  return (
    <section className="flex min-h-0 flex-col rounded-md border border-zinc-800 bg-black">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800 px-3 py-2">
        <div className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
          <h2 className="font-mono text-[12px] font-medium text-zinc-300">raw input</h2>
        </div>
        <button
          type="button"
          onClick={onPasteExample}
          className="rounded-sm border border-zinc-800 bg-zinc-950 px-2 py-0.5 font-mono text-[11px] text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
        >
          paste example
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 flex-col"
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          placeholder="Paste your raw logs here, or drop a file below…"
          className="min-h-[320px] flex-1 resize-none bg-transparent px-4 py-3 font-mono text-[12.5px] leading-relaxed text-zinc-200 placeholder:font-mono placeholder:text-zinc-600 focus:outline-none"
        />

        <div className="border-t border-zinc-800 p-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={`flex w-full items-center justify-center gap-2.5 rounded-sm border border-dashed px-4 py-3 font-mono text-[12px] transition-colors ${
              dragging
                ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                : "border-zinc-800 bg-zinc-950/40 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
            }`}
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            {dragging ? "Drop file to load" : "Drag & drop a log file, or click to browse"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".log,.txt,.json,text/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) readFile(file)
              e.target.value = ""
            }}
          />
        </div>
      </div>
    </section>
  )
}
