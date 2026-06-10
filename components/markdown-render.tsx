import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export const CodeBlock = ({
  node,
  inline,
  className,
  children,
  ...props
}: any) => {
  const match = /language-(\w+)/.exec(className || '')

  // Jika inline code (misal: `const x = 1`), jangan pakai highlighter, pakai style biasa
  if (inline) {
    return (
      <code
        className="bg-zinc-800 px-1.5 py-0.5 rounded text-emerald-400 font-mono text-sm"
        {...props}
      >
        {children}
      </code>
    )
  }

  // Jika block code (```javascript ... ```), pakai SyntaxHighlighter
  return (
    <div className="not-prose my-4 rounded-lg overflow-hidden border border-zinc-800">
      <SyntaxHighlighter
        language={match ? match[1] : 'text'}
        style={vscDarkPlus}
        customStyle={{ margin: 0, padding: '1.5rem', background: '#09090b' }}
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  )
}
