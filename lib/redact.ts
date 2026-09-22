export type RedactionType = "ip" | "apikey" | "email" | "password" | "domain"

export const REDACTION_LABELS: Record<RedactionType, string> = {
  ip: "IP Addresses",
  apikey: "API Keys",
  email: "Emails",
  password: "Passwords",
  domain: "Domain Names",
}

export type Segment = {
  text: string
  type: RedactionType | null
}

type Match = {
  start: number
  end: number
  type: RedactionType
}

// Ordered by priority. Earlier patterns win when ranges overlap, so more
// specific patterns (emails, api keys) come before broader ones (domains).
const PATTERNS: { type: RedactionType; regex: RegExp }[] = [
  {
    type: "email",
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  },
  {
    type: "apikey",
    // Common secret shapes: sk_live_*, pk_test_*, ghp_*, AWS AKIA keys,
    // Bearer tokens, and generic key=value / "key": "value" assignments.
    regex:
      /\b(?:sk|pk|rk)_(?:live|test)_[A-Za-z0-9]{8,}\b|\bgh[pousr]_[A-Za-z0-9]{20,}\b|\bAKIA[0-9A-Z]{16}\b|\bBearer\s+[A-Za-z0-9._-]{16,}\b|(?:api[_-]?key|apikey|token|secret|access[_-]?token)["'\s:=]+["']?[A-Za-z0-9._-]{12,}["']?/gi,
  },
  {
    type: "password",
    regex: /(?:password|passwd|pwd)["'\s:=]+["']?[^\s"',]{3,}["']?/gi,
  },
  {
    type: "ip",
    regex: /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g,
  },
  {
    type: "domain",
    regex:
      /\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+(?:com|net|org|io|dev|app|co|ai|xyz|cloud|internal|local|edu|gov|us|uk|de|fr|jp)\b/gi,
  },
]

export type RedactionResult = {
  segments: Segment[]
  count: number
  scanMs: number
  countsByType: Record<RedactionType, number>
}

export function redact(input: string, enabled: Record<RedactionType, boolean>): RedactionResult {
  const start = performance.now()

  const countsByType: Record<RedactionType, number> = {
    ip: 0,
    apikey: 0,
    email: 0,
    password: 0,
    domain: 0,
  }

  if (!input) {
    return {
      segments: [],
      count: 0,
      scanMs: 0,
      countsByType,
    }
  }

  const matches: Match[] = []

  for (const { type, regex } of PATTERNS) {
    if (!enabled[type]) continue
    regex.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = regex.exec(input)) !== null) {
      if (m[0].length === 0) {
        regex.lastIndex++
        continue
      }
      matches.push({ start: m.index, end: m.index + m[0].length, type })
    }
  }

  // Resolve overlaps: sort by start, then by priority (order in PATTERNS).
  const priority: Record<RedactionType, number> = {
    email: 0,
    apikey: 1,
    password: 2,
    ip: 3,
    domain: 4,
  }
  matches.sort((a, b) => a.start - b.start || priority[a.type] - priority[b.type])

  const chosen: Match[] = []
  let lastEnd = 0
  for (const match of matches) {
    if (match.start >= lastEnd) {
      chosen.push(match)
      lastEnd = match.end
    }
  }

  const segments: Segment[] = []
  let cursor = 0
  for (const match of chosen) {
    if (match.start > cursor) {
      segments.push({ text: input.slice(cursor, match.start), type: null })
    }
    segments.push({ text: input.slice(match.start, match.end), type: match.type })
    countsByType[match.type]++
    cursor = match.end
  }
  if (cursor < input.length) {
    segments.push({ text: input.slice(cursor), type: null })
  }

  const count = chosen.length
  const scanMs = Math.max(0, performance.now() - start)

  return { segments, count, scanMs, countsByType }
}

export function redactedText(segments: Segment[]): string {
  return segments
    .map((s) => (s.type ? `[REDACTED_${s.type.toUpperCase()}]` : s.text))
    .join("")
}

export const EXAMPLE_LOG = `[2026-09-18T14:32:07Z] INFO  api.gateway request received
  client_ip=192.168.1.42 forwarded_for=203.0.113.77
  user=devon.parker@acme-corp.com session=authenticated
[2026-09-18T14:32:07Z] DEBUG outbound call to https://payments.internal.acme-corp.com/v2/charge
  Authorization: Bearer "fake_token_REDACTED_EXAMPLE_KEY_12345"
  x-api-key: AKIA1234567890ABCDEF
[2026-09-18T14:32:08Z] WARN  db connection retry host=10.0.0.15 port=5432
  DATABASE_URL=postgres://admin:password=Sup3rS3cr3t!@db.acme-corp.com:5432/prod
[2026-09-18T14:32:08Z] INFO  github sync token=ghp_A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6
  webhook target=https://hooks.acme-corp.dev/ingest
[2026-09-18T14:32:09Z] ERROR failed login for admin@acme-corp.com from 198.51.100.23
  password: hunter2pikachu attempts=3
[2026-09-18T14:32:10Z] INFO  request complete status=200 duration=42ms`
