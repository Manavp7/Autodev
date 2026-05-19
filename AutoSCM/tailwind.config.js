/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent:           'rgb(var(--accent) / <alpha-value>)',
        'accent-fg':      'rgb(var(--accent-fg) / <alpha-value>)',
        success:          'rgb(var(--success) / <alpha-value>)',
        warning:          'rgb(var(--warning) / <alpha-value>)',
        danger:           'rgb(var(--danger) / <alpha-value>)',
        sidebar:          'rgb(var(--sidebar-bg) / <alpha-value>)',
        'sidebar-bg':     'rgb(var(--sidebar-bg) / <alpha-value>)',
        surface:          'rgb(var(--surface) / <alpha-value>)',
        primary:          'rgb(var(--primary-bg) / <alpha-value>)',
        'primary-bg':     'rgb(var(--primary-bg) / <alpha-value>)',
        'text-primary':   'rgb(var(--text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--text-secondary) / <alpha-value>)',
        'border-dark':    'rgb(var(--border-dark) / <alpha-value>)',
        'forest-700':     'rgb(var(--forest-700) / <alpha-value>)',
        'navy-900':       'rgb(var(--navy-900) / <alpha-value>)',
        'teal-50':        'rgb(var(--teal-50) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
