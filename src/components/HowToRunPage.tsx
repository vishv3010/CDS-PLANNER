/* ============================================================
   How To Run Page – Instructions for downloading & running
   the project locally. Also explains tech stack.
   ============================================================ */
import {
  HelpCircle, Terminal,
  CheckCircle2, Lightbulb, Monitor, Smartphone,
  Code, FileText, Zap, Package
} from 'lucide-react';

export default function HowToRunPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <HelpCircle className="text-emerald-600" size={28} />
          How to Run This Project
        </h1>
        <p className="text-slate-500 mt-2">
          Complete guide to download, run, and modify this study planner on your computer
        </p>
      </div>

      {/* Quick Answer */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-white mb-8">
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          <Zap size={20} /> Quickest Way (No Setup Needed)
        </h2>
        <p className="text-emerald-100 mb-4">
          This website is built as a <strong className="text-white">single HTML file</strong> (dist/index.html). 
          You can just double-click it to open in any browser!
        </p>
        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
          <ol className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">1</span>
              <span>Download the <code className="bg-white/20 px-1.5 py-0.5 rounded text-xs">dist/index.html</code> file</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">2</span>
              <span>Double-click it → Opens in your browser</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">3</span>
              <span>That's it! Everything works offline. Your progress saves in your browser.</span>
            </li>
          </ol>
        </div>
      </div>

      {/* Detailed Methods */}
      <div className="space-y-6">

        {/* Method 1: Direct File */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-blue-50">
            <h3 className="font-bold text-blue-900 text-lg flex items-center gap-2">
              <FileText size={20} className="text-blue-600" />
              Method 1: Open the Built File (Easiest)
            </h3>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              <Step num={1} title="Locate the file">
                <p>After building, the complete website is bundled into a single file:</p>
                <CodeBlock>dist/index.html</CodeBlock>
              </Step>
              <Step num={2} title="Open in browser">
                <p>Simply double-click <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">index.html</code> or drag it into your browser (Chrome, Firefox, Edge, etc.)</p>
              </Step>
              <Step num={3} title="Done!">
                <p>The entire app runs locally in your browser. All data is saved in your browser's localStorage.</p>
              </Step>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
              <Lightbulb size={16} className="text-amber-600 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-800">
                <strong>Tip:</strong> You can even put this file on a USB drive and use it on any computer!
              </p>
            </div>
          </div>
        </div>

        {/* Method 2: Dev Server */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-purple-50">
            <h3 className="font-bold text-purple-900 text-lg flex items-center gap-2">
              <Terminal size={20} className="text-purple-600" />
              Method 2: Run with Development Server (For Developers)
            </h3>
          </div>
          <div className="p-5">
            <p className="text-sm text-slate-600 mb-4">
              If you want to modify the code and see live changes, follow these steps:
            </p>

            <div className="space-y-4">
              <Step num={1} title="Prerequisites – Install Node.js">
                <p>Download and install <strong>Node.js</strong> (v18 or higher) from:</p>
                <CodeBlock>https://nodejs.org</CodeBlock>
                <p className="mt-2">Verify installation:</p>
                <CodeBlock>node --version{'\n'}npm --version</CodeBlock>
              </Step>

              <Step num={2} title="Download / Clone the project">
                <p>If you have the project as a ZIP, extract it. Or clone from git:</p>
                <CodeBlock>git clone &lt;your-repo-url&gt;{'\n'}cd cds-study-planner</CodeBlock>
              </Step>

              <Step num={3} title="Install dependencies">
                <p>Open a terminal/command prompt in the project folder and run:</p>
                <CodeBlock>npm install</CodeBlock>
                <p className="mt-1 text-xs text-slate-500">This installs React, Vite, Tailwind CSS, and other packages.</p>
              </Step>

              <Step num={4} title="Start the development server">
                <CodeBlock>npm run dev</CodeBlock>
                <p className="mt-1">This will show something like:</p>
                <CodeBlock>  VITE v7.x.x  ready{'\n'}{'\n'}  ➜  Local:   http://localhost:5173/</CodeBlock>
              </Step>

              <Step num={5} title="Open in browser">
                <p>Open <strong>http://localhost:5173</strong> in your browser. Changes to code will auto-refresh!</p>
              </Step>
            </div>
          </div>
        </div>

        {/* Method 3: Build & Serve */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-emerald-50">
            <h3 className="font-bold text-emerald-900 text-lg flex items-center gap-2">
              <Package size={20} className="text-emerald-600" />
              Method 3: Build for Production
            </h3>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              <Step num={1} title="Build the project">
                <CodeBlock>npm run build</CodeBlock>
                <p className="mt-1">This creates an optimized <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">dist/index.html</code> file.</p>
              </Step>

              <Step num={2} title="Preview the build">
                <CodeBlock>npm run preview</CodeBlock>
                <p className="mt-1">Opens a local server to preview the production build.</p>
              </Step>

              <Step num={3} title="Deploy (optional)">
                <p>Upload <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">dist/index.html</code> to any web hosting:</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> GitHub Pages (free)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Netlify (free tier)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Vercel (free tier)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Any static file hosting</li>
                </ul>
              </Step>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Code size={20} className="text-slate-600" />
              Tech Stack & Project Structure
            </h3>
          </div>
          <div className="p-5">
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="font-semibold text-blue-900 text-sm">React 19</div>
                <div className="text-xs text-blue-600">UI Components</div>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                <div className="font-semibold text-purple-900 text-sm">Vite 7</div>
                <div className="text-xs text-purple-600">Build Tool</div>
              </div>
              <div className="p-3 rounded-lg bg-cyan-50 border border-cyan-100">
                <div className="font-semibold text-cyan-900 text-sm">Tailwind CSS 4</div>
                <div className="text-xs text-cyan-600">Styling</div>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                <div className="font-semibold text-amber-900 text-sm">TypeScript</div>
                <div className="text-xs text-amber-600">Type Safety</div>
              </div>
            </div>

            <h4 className="font-semibold text-slate-700 text-sm mb-2">Key Files:</h4>
            <div className="bg-slate-900 rounded-xl p-4 text-sm font-mono text-slate-300 overflow-x-auto">
              <pre>{`📁 src/
├── App.tsx          ← Main app with routing
├── main.tsx         ← Entry point
├── index.css        ← Global styles
├── context/
│   └── PlanContext  ← Dynamic plan state
├── data/
│   └── schedule.ts  ← Schedule generator + topics
├── hooks/
│   └── useLocalStorage.ts
└── components/
    ├── SetupPage    ← ⭐ Configure dates & hours
    ├── HomePage     ← Strategy overview
    ├── SchedulePage ← Day-wise calendar
    ├── SubjectPage  ← Topic checklists
    ├── MockTestPage ← Score tracker
    ├── ProgressPage ← Overall progress
    └── HowToRunPage ← This page`}</pre>
            </div>
          </div>
        </div>

        {/* How to Modify */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-orange-50">
            <h3 className="font-bold text-orange-900 text-lg flex items-center gap-2">
              <Lightbulb size={20} className="text-orange-600" />
              How to Customize / Modify
            </h3>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <h4 className="font-semibold text-slate-800 text-sm mb-1">Change Topics:</h4>
              <p className="text-sm text-slate-600">Edit <code className="bg-slate-100 px-1.5 py-0.5 rounded">src/data/schedule.ts</code> → Look for <code className="bg-slate-100 px-1.5 py-0.5 rounded">englishTopics</code>, <code className="bg-slate-100 px-1.5 py-0.5 rounded">mathsTopics</code>, <code className="bg-slate-100 px-1.5 py-0.5 rounded">gkTopics</code> arrays.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm mb-1">Change Daily Schedule Content:</h4>
              <p className="text-sm text-slate-600">Edit the <code className="bg-slate-100 px-1.5 py-0.5 rounded">englishPool</code>, <code className="bg-slate-100 px-1.5 py-0.5 rounded">mathsPool</code>, <code className="bg-slate-100 px-1.5 py-0.5 rounded">gkPool</code> arrays in <code className="bg-slate-100 px-1.5 py-0.5 rounded">schedule.ts</code>.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm mb-1">Change Colors/Styling:</h4>
              <p className="text-sm text-slate-600">All styling uses Tailwind CSS classes directly in the components. Edit the className props.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm mb-1">Change Phase Distribution:</h4>
              <p className="text-sm text-slate-600">In <code className="bg-slate-100 px-1.5 py-0.5 rounded">generateSchedule()</code> function, modify the <code className="bg-slate-100 px-1.5 py-0.5 rounded">0.35 / 0.35 / 0.30</code> ratios.</p>
            </div>
          </div>
        </div>

        {/* Compatibility */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Monitor size={18} /> <Smartphone size={18} /> Compatibility
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-slate-700 mb-2">✅ Works On:</h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• Chrome, Firefox, Edge, Safari</li>
                <li>• Windows, macOS, Linux</li>
                <li>• Android & iOS (mobile browsers)</li>
                <li>• Tablets & iPads</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-700 mb-2">💾 Data Storage:</h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• All data saved in browser localStorage</li>
                <li>• Works completely offline</li>
                <li>• No server or internet needed</li>
                <li>• Data stays until you clear browser data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Helper Components */
function Step({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
        {num}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-slate-800 text-sm mb-1">{title}</h4>
        <div className="text-sm text-slate-600">{children}</div>
      </div>
    </div>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-slate-900 text-emerald-400 rounded-lg p-3 text-sm font-mono overflow-x-auto mt-1">
      {children}
    </pre>
  );
}
