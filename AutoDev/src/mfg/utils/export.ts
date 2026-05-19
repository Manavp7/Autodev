export function downloadCSV(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return
  const keys = Object.keys(data[0])
  const rows = [
    keys.join(','),
    ...data.map(row => keys.map(k => `"${String(row[k] ?? '').replace(/"/g, '""')}"`).join(','))
  ]
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadPDF(title: string, content: string) {
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(`<html><head><title>${title}</title><style>body{font-family:monospace;white-space:pre-wrap;padding:2rem;}</style></head><body><pre>${content}</pre></body></html>`)
  win.document.close() // Close the document to ensure it renders
  win.focus()
  // Give it a moment to render before printing
  setTimeout(() => {
    win.print()
    win.close()
  }, 250)
}
