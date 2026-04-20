export default function Tag({ children, active, onClick }: {
  children: string
  active?: boolean
  onClick?: () => void
}) {
  const label = children.replace(/[\[\]"']/g, '').trim()
  return (
    <span onClick={onClick} style={{
      fontFamily: 'var(--nl-font-mono)', fontSize: 11, padding: '3px 10px',
      borderRadius: 999,
      border: `1px solid ${active ? 'var(--nl-accent)' : 'var(--nl-line-2)'}`,
      color: active ? 'var(--nl-accent)' : 'var(--nl-fg-2)',
      background: active ? 'var(--nl-accent-wash)' : 'transparent',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'color 80ms, border-color 80ms',
      userSelect: 'none',
    }}>
      #{label}
    </span>
  )
}
