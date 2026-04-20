/** Lightweight markdown → HTML renderer with null.log visual conventions */

function escape(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function renderMarkdown(md: string): string {
  let html = md

  // ── fenced code blocks (must be before inline code) ──────────
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const langAttr = lang ? ` data-lang="${lang}"` : ''
    return `<pre${langAttr}><code>${escape(code.trim())}</code></pre>`
  })

  // ── headings with $ / # visual prefix ────────────────────────
  html = html.replace(/^#{4} (.+)$/gm,
    '<h4><span class="h-prefix">//</span> $1</h4>')
  html = html.replace(/^#{3} (.+)$/gm,
    '<h3><span class="h-prefix">#</span> $1</h3>')
  html = html.replace(/^#{2} (.+)$/gm,
    '<h2><span class="h-prefix">$</span> $1</h2>')
  html = html.replace(/^# (.+)$/gm,
    '<h1>$1</h1>')

  // ── blockquotes ───────────────────────────────────────────────
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')

  // ── horizontal rule ───────────────────────────────────────────
  html = html.replace(/^---$/gm, '<hr/>')

  // ── bold + italic ─────────────────────────────────────────────
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // ── inline code ───────────────────────────────────────────────
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // ── links ─────────────────────────────────────────────────────
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

  // ── wrap paragraphs ───────────────────────────────────────────
  const blockTags = /^<(h[1-6]|pre|blockquote|hr|ul|ol|li)/
  html = html
    .split(/\n{2,}/)
    .map(block => {
      const t = block.trim()
      if (!t) return ''
      if (blockTags.test(t)) return t
      return `<p>${t.replace(/\n/g, '<br/>')}</p>`
    })
    .filter(Boolean)
    .join('\n')

  return html
}
