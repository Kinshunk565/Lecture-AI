import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, ExternalLink, Code2 } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [activePane, setActivePane] = useState<'preview' | 'console'>('preview');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const runCode = () => {
    if (!iframeRef.current) return;

    // Inject console capturing script into user code
    const consoleCaptureScript = `
      <script>
        const originalLog = console.log;
        console.log = function(...args) {
          window.parent.postMessage({ type: 'PLAYGROUND_LOG', message: args.join(' ') }, '*');
          originalLog.apply(console, args);
        };
      </script>
    `;

    const fullHtml = code.includes('<head>')
      ? code.replace('<head>', `<head>${consoleCaptureScript}`)
      : `${consoleCaptureScript}${code}`;

    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(fullHtml);
      iframeDoc.close();
    }
  };

  useEffect(() => {
    runCode();
  }, []);

  // Listen for iframe console logs
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'PLAYGROUND_LOG') {
        setConsoleLogs((prev) => [...prev.slice(-20), `[${new Date().toLocaleTimeString()}] ${e.data.message}`]);
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
    setTimeout(() => runCode(), 50);
  };

  const loadLessonSample = (sampleCode: string) => {
    setCode(sampleCode);
    setConsoleLogs([]);
    setTimeout(() => runCode(), 50);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)]">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between p-2.5 border-b border-[var(--color-border)] bg-[var(--color-background)]/50 gap-2 text-xs">
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

      {/* Main Split: Code Editor (Top/Left) + Live Preview (Bottom/Right) */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Code Editor TextArea */}
        <div className="flex-1 relative flex flex-col border-b border-[var(--color-border)] bg-zinc-950">
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
        <div className="h-[45%] flex flex-col bg-[var(--color-background)]">
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
