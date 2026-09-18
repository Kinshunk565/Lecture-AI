import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, ExternalLink, Code2, Columns, Rows } from 'lucide-react';
import type { LectureCurriculum } from '../data/lectureCurriculum';

interface CodePlaygroundProps {
  lectureNumber: string;
  curriculum?: LectureCurriculum | null;
}

export default function CodePlayground({ curriculum }: CodePlaygroundProps) {
  // Extract initial code from curriculum or default starter
  const initialCode = curriculum?.code_samples?.[0]?.code || `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Lecture Demo</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 24px;
      background: #0f172a;
      color: #f8fafc;
      text-align: center;
    }
    .card {
      background: #1e293b;
      padding: 24px;
      border-radius: 16px;
      max-width: 380px;
      margin: 20px auto;
      border: 1px solid #334155;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    }
    button {
      background: #4a7c6f;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    button:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Interactive Lab</h2>
    <p>Edit the HTML/CSS in this sandbox and click Run!</p>
    <button onclick="greet()">Click Me</button>
  </div>

  <script>
    function greet() {
      console.log('Button clicked at ' + new Date().toLocaleTimeString());
      alert('Hello from LectureAI Sandbox!');
    }
  </script>
</body>
</html>`;

  const [code, setCode] = useState(initialCode);
  const [activePane, setActivePane] = useState<'preview' | 'console'>('preview');
  const [copied, setCopied] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [splitLayout, setSplitLayout] = useState<'stacked' | 'sideBySide'>('stacked');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Re-initialize code when curriculum updates
  useEffect(() => {
    if (curriculum?.code_samples?.[0]?.code) {
      setCode(curriculum.code_samples[0].code);
    }
  }, [curriculum]);

  // Execute and render the code in the sandboxed iframe
  const runCode = () => {
    if (!iframeRef.current) return;

    // Inject console.log interceptor into the code
    const consoleInterceptor = `
      <script>
        (function() {
          const oldLog = console.log;
          console.log = function(...args) {
            window.parent.postMessage({ type: 'SANDBOX_CONSOLE', data: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }, '*');
            oldLog.apply(console, args);
          };
          window.onerror = function(msg, url, line) {
            window.parent.postMessage({ type: 'SANDBOX_ERROR', data: msg + ' (line ' + line + ')' }, '*');
          };
        })();
      </script>
    `;

    const fullDoc = code.replace('<head>', '<head>' + consoleInterceptor);
    iframeRef.current.srcdoc = fullDoc.includes('<head>') ? fullDoc : consoleInterceptor + code;
  };

  // Run automatically on first mount
  useEffect(() => {
    const timer = setTimeout(runCode, 300);
    return () => clearTimeout(timer);
  }, []);

  // Listen to messages from the sandbox iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SANDBOX_CONSOLE') {
        setConsoleLogs((prev) => [...prev.slice(-40), `[LOG] ${event.data.data}`]);
      } else if (event.data?.type === 'SANDBOX_ERROR') {
        setConsoleLogs((prev) => [...prev.slice(-40), `[ERROR] ${event.data.data}`]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(initialCode);
    setConsoleLogs([]);
    setTimeout(runCode, 100);
  };

  const loadLessonSample = (snippetCode: string) => {
    setCode(snippetCode);
    setTimeout(runCode, 100);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)] overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between p-2.5 border-b border-[var(--color-border)] bg-[var(--color-background)]/50 gap-2 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[var(--color-primary)] flex items-center gap-1.5">
            <Code2 size={15} className="text-[var(--color-accent)]" />
            Sandbox Playground
          </span>

          {curriculum?.code_samples && curriculum.code_samples.length > 0 && (
            <select
              onChange={(e) => {
                const sample = curriculum.code_samples[parseInt(e.target.value, 10)];
                if (sample) loadLessonSample(sample.code);
              }}
              className="px-2 py-1 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-[11px] text-[var(--color-secondary)] focus:outline-none cursor-pointer"
            >
              <option value="">Load Lesson Snippet...</option>
              {curriculum.code_samples.map((s, idx) => (
                <option key={idx} value={idx}>
                  {s.caption.slice(0, 32)}...
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Orientation Toggle */}
          <button
            onClick={() => setSplitLayout(splitLayout === 'stacked' ? 'sideBySide' : 'stacked')}
            className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-background)] text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
            title={splitLayout === 'stacked' ? 'Switch to Side-by-Side view' : 'Switch to Stacked view'}
          >
            {splitLayout === 'stacked' ? <Columns size={13} /> : <Rows size={13} />}
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-background)] text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
            title="Copy code"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-background)] text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
            title="Reset code"
          >
            <RotateCcw size={13} />
          </button>
          <button
            onClick={runCode}
            className="btn-accent text-xs font-semibold py-1 px-3 rounded-lg flex items-center gap-1 cursor-pointer shadow-sm"
          >
            <Play size={12} className="fill-white" /> Run
          </button>
        </div>
      </div>

      {/* Main Split: Code Editor + Live Preview */}
      <div className={`flex-1 flex min-h-0 overflow-hidden ${splitLayout === 'sideBySide' ? 'flex-row' : 'flex-col'}`}>
        {/* Code Editor TextArea */}
        <div className={`relative flex flex-col bg-zinc-950 min-h-0 ${splitLayout === 'sideBySide' ? 'flex-1 border-r border-[var(--color-border)]' : 'flex-1 border-b border-[var(--color-border)]'}`}>
          <div className="px-3 py-1 bg-zinc-900 border-b border-zinc-800 text-[10px] text-zinc-400 font-mono flex items-center justify-between">
            <span>INDEX.HTML (HTML · CSS · JAVASCRIPT)</span>
            <span className="text-[9px] text-zinc-500">Live Browser Engine</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 w-full p-3 font-mono text-xs text-zinc-200 bg-transparent resize-none focus:outline-none leading-relaxed selection:bg-[var(--color-accent)]/30"
            placeholder="Type your HTML and CSS code here..."
          />
        </div>

        {/* Output Section: Tabs between Live Preview and Console */}
        <div className={`flex flex-col bg-[var(--color-background)] min-h-0 ${splitLayout === 'sideBySide' ? 'flex-1' : 'h-[45%]'}`}>
          <div className="flex items-center justify-between px-3 py-1 border-b border-[var(--color-border)] bg-[var(--color-surface)] text-[11px]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActivePane('preview')}
                className={`font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                  activePane === 'preview' ? 'text-[var(--color-accent)]' : 'text-[var(--color-secondary)]'
                }`}
              >
                <ExternalLink size={12} /> Live Preview
              </button>
              <button
                onClick={() => setActivePane('console')}
                className={`font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                  activePane === 'console' ? 'text-[var(--color-accent)]' : 'text-[var(--color-secondary)]'
                }`}
              >
                <Terminal size={12} /> Console ({consoleLogs.length})
              </button>
            </div>
            {activePane === 'console' && consoleLogs.length > 0 && (
              <button
                onClick={() => setConsoleLogs([])}
                className="text-[10px] text-[var(--color-secondary)] hover:text-red-400 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Tab 1: Live Iframe Preview */}
          <div className={`flex-1 bg-white relative ${activePane !== 'preview' ? 'hidden' : 'block'}`}>
            <iframe
              ref={iframeRef}
              title="Code Preview"
              sandbox="allow-scripts allow-modals allow-same-origin"
              className="w-full h-full border-none"
            />
          </div>

          {/* Tab 2: Virtual Console */}
          <div className={`flex-1 p-3 font-mono text-[11px] overflow-y-auto bg-zinc-950 text-zinc-300 space-y-1 ${activePane !== 'console' ? 'hidden' : 'block'}`}>
            {consoleLogs.length === 0 ? (
              <p className="text-zinc-500 italic text-[11px]">No console logs recorded yet. Call console.log(...) in your scripts to inspect values.</p>
            ) : (
              consoleLogs.map((log, i) => (
                <div key={i} className="text-emerald-400 leading-snug">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
