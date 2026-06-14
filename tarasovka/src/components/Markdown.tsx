import React from 'react';

interface MarkdownProps {
  content: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  if (!content) return null;

  // Split content by block components to render them cleanly
  const paragraphs = content.split(/\n\n+/);

  return (
    <div className="space-y-4 text-slate-300 leading-relaxed text-sm">
      {paragraphs.map((para, index) => {
        const trimmed = para.trim();

        // 1. Headers (### Header)
        if (trimmed.startsWith('###')) {
          const headerText = trimmed.replace(/^###\s*/, '');
          return (
            <h3 key={index} className="text-lg font-bold text-white mt-6 mb-2 tracking-tight">
              {renderInline(headerText)}
            </h3>
          );
        }

        // 2. Alerts (> [!NOTE] or > [!IMPORTANT] etc.)
        if (trimmed.startsWith('>')) {
          const lines = trimmed.split('\n');
          const firstLine = lines[0] || '';
          
          let type: 'note' | 'important' | 'warning' | 'caution' = 'note';
          let title = 'Примечание';
          let borderClass = 'border-cyan-500/30 bg-cyan-950/10 text-cyan-200';
          
          if (firstLine.includes('[!IMPORTANT]')) {
            type = 'important';
            title = 'Важно';
            borderClass = 'border-purple-500/30 bg-purple-950/10 text-purple-200';
          } else if (firstLine.includes('[!WARNING]')) {
            type = 'warning';
            title = 'Внимание';
            borderClass = 'border-amber-500/30 bg-amber-950/10 text-amber-200';
          } else if (firstLine.includes('[!CAUTION]')) {
            type = 'caution';
            title = 'Опасно';
            borderClass = 'border-red-500/30 bg-red-950/10 text-red-200';
          }

          // Clean up first line header and extract content lines
          const contentLines = lines.slice(1).map(l => l.replace(/^>\s?/, ''));
          const bodyText = contentLines.join('\n');

          return (
            <div key={index} className={`p-4 rounded-xl border ${borderClass} my-4`}>
              <div className="font-bold text-xs uppercase tracking-wider mb-1">
                {title}
              </div>
              <div className="text-xs leading-relaxed">{renderInline(bodyText)}</div>
            </div>
          );
        }

        // 3. Bullet points
        if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
          const items = trimmed.split('\n').map(item => item.replace(/^[*+-]\s*/, ''));
          return (
            <ul key={index} className="list-disc pl-5 space-y-1.5 my-2">
              {items.map((item, i) => (
                <li key={i}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }

        // 4. Code Blocks (```python ... ```)
        if (trimmed.startsWith('```')) {
          // Extract language and code content
          const lines = trimmed.split('\n');
          const codeLines = lines.slice(1, lines.length - 1); // remove first and last line containing ```
          const code = codeLines.join('\n');

          return (
            <pre key={index} className="bg-slate-950 p-4 rounded-xl border border-slate-900 overflow-x-auto my-3 text-xs font-mono text-slate-300 shadow-inner">
              <code>{code}</code>
            </pre>
          );
        }

        // Default: standard paragraph
        return <p key={index}>{renderInline(trimmed)}</p>;
      })}
    </div>
  );
};

// Simple helper to replace inline markdown syntax: **bold**, `code`, etc.
function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let currentText = text;
  let keyIdx = 0;

  // We find formatting using regex loop
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const splitParts = currentText.split(regex);

  return splitParts.map((part) => {
    keyIdx++;
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={keyIdx} className="text-white font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={keyIdx}
          className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-400 font-mono text-xs border border-slate-800"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
