'use client'
import { useEffect } from 'react'

/** Adds language label + copy button to every .prose pre element */
export default function CodeCopyButtons() {
  useEffect(() => {
    const proseEls = document.querySelectorAll<HTMLElement>('.prose pre')
    const cleanups: (() => void)[] = []

    proseEls.forEach(pre => {
      if (pre.querySelector('.copy-btn')) return

      const lang = pre.getAttribute('data-lang')

      // ── language badge (top-left) ─────────────────────────────
      if (lang) {
        const badge = document.createElement('span')
        badge.className = 'code-lang'
        badge.textContent = lang
        pre.insertBefore(badge, pre.firstChild)
      }

      // ── copy button (top-right) ───────────────────────────────
      const btn = document.createElement('button')
      btn.className = 'copy-btn'
      btn.textContent = '$ copy'
      pre.appendChild(btn)

      const onClick = async () => {
        const code = pre.querySelector('code')?.innerText ?? pre.innerText
        try {
          await navigator.clipboard.writeText(code)
          btn.textContent = '✓ copied'
          btn.classList.add('copied')
        } catch {
          btn.textContent = '✗ failed'
        }
        setTimeout(() => {
          btn.textContent = '$ copy'
          btn.classList.remove('copied')
        }, 2000)
      }

      btn.addEventListener('click', onClick)
      cleanups.push(() => btn.removeEventListener('click', onClick))
    })

    return () => cleanups.forEach(fn => fn())
  })

  return null
}
