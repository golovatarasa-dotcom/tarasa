import React, { useRef, useEffect } from 'react';

interface PythonEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const PythonEditor: React.FC<PythonEditorProps> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Sync scrolling of line numbers column with textarea
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Intercept KeyDown to support Tab key (insert 4 spaces) and auto-closing brackets
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;

    // 1. Tab Key
    if (e.key === 'Tab') {
      e.preventDefault();
      const tabSpace = '    ';
      const newValue =
        value.substring(0, selectionStart) + tabSpace + value.substring(selectionEnd);
      
      onChange(newValue);

      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + tabSpace.length;
      }, 0);
    }

    // 2. Auto-close characters
    const pairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
    };

    if (pairs[e.key] !== undefined) {
      e.preventDefault();
      const closingChar = pairs[e.key];
      const newValue =
        value.substring(0, selectionStart) + e.key + closingChar + value.substring(selectionEnd);
      
      onChange(newValue);

      // Put cursor between pairs
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
      }, 0);
    }
  };

  // Generate line numbers array based on value
  const lines = value.split('\n');
  const lineNumbers = Array.from({ length: Math.max(lines.length, 1) }, (_, i) => i + 1);

  return (
    <div className="flex-1 flex bg-slate-950 font-mono text-sm border-t border-slate-900 overflow-hidden relative h-full">
      {/* Line Numbers Column */}
      <div
        ref={lineNumbersRef}
        className="w-12 py-4 select-none text-right pr-3 text-slate-600 bg-slate-950/80 border-r border-slate-900 overflow-hidden text-xs leading-[22px]"
      >
        {lineNumbers.map((num) => (
          <div key={num}>{num}</div>
        ))}
      </div>

      {/* Code Input Area */}
      <div className="flex-1 relative h-full">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="w-full h-full p-4 bg-transparent text-slate-200 resize-none outline-none border-none overflow-y-auto leading-[22px] font-mono text-xs focus:ring-0 focus:outline-none"
          style={{
            fontFamily: 'JetBrains Mono, Courier New, monospace',
            tabSize: 4,
          }}
          placeholder="# Пишите код здесь..."
        />
      </div>
    </div>
  );
};
