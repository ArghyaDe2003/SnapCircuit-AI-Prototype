import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Camera, CheckCircle, AlertTriangle, ArrowRight, Cpu, Zap, Activity, ShieldCheck, Microchip, Eye, Gauge, Terminal, PlaySquare, Hexagon } from 'lucide-react';

const scenarios = [
  { id: 'correct_led', name: 'Correct LED Circuit', desc: 'Valid configuration', icon: <CheckCircle size={14} />, color: '#10b981' },
  { id: 'reversed_led', name: 'Reversed LED', desc: 'Polarity error', icon: <AlertTriangle size={14} />, color: '#eab308' },
  { id: 'missing_resistor', name: 'Missing Resistor', desc: 'Current protection missing', icon: <AlertTriangle size={14} />, color: '#f97316' },
  { id: 'open_connection', name: 'Open Connection', desc: 'Circuit broken', icon: <Terminal size={14} />, color: '#ef4444' }
];

function App() {
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0].id);
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [npuLoad, setNpuLoad] = useState(12);
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Fake NPU load fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setNpuLoad(prev => loading ? Math.min(98, prev + Math.random() * 25) : Math.max(8, prev + (Math.random() * 6 - 3)));
    }, 400);
    return () => clearInterval(interval);
  }, [loading]);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    fetchDiagnosis(selectedScenario);
  }, [selectedScenario]);

  const addLog = (msg: string, delay: number) => {
    setTimeout(() => {
      setLogs(prev => [...prev.slice(-15), `[${new Date().toISOString().split('T')[1].slice(0,-1)}] ${msg}`]);
    }, delay);
  };

  const fetchDiagnosis = async (scenarioId: string) => {
    setLoading(true);
    setAnimating(true);
    setLogs([]); // clear logs
    
    // Simulate terminal output
    addLog(`INIT Hexagon™ NPU offload...`, 100);
    addLog(`Loading vision model weights (INT8)...`, 300);
    addLog(`Capturing frame 1080p @ 60fps...`, 500);
    addLog(`Running YOLOv8_nano bounding box...`, 700);
    addLog(`Detected objects: [VCC, R1, D1, GND]`, 900);
    addLog(`Constructing directed circuit graph...`, 1100);
    addLog(`Evaluating Kirchoff's rules...`, 1300);
    
    try {
      const response = await axios.post('http://localhost:8000/api/analyze', { scenario_id: scenarioId });
      
      setTimeout(() => {
        addLog(`INFERENCE COMPLETE. Latency: 12ms`, 1500);
        setDiagnosis(response.data.diagnosis);
        setLoading(false);
        setTimeout(() => setAnimating(false), 300);
      }, 1600);
    } catch {
      addLog(`ERROR: Pipeline failure!`, 1500);
      setLoading(false);
      setAnimating(false);
    }
  };

  const isGood = selectedScenario === 'correct_led';
  const current = scenarios.find(s => s.id === selectedScenario)!;

  return (
    <div className="min-h-screen flex flex-col text-slate-200 overflow-hidden" style={{ background: '#020617', backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(14, 165, 233, 0.08), transparent 50%), radial-gradient(circle at 100% 100%, rgba(232, 93, 34, 0.05), transparent 50%)', fontFamily: "'Inter', sans-serif" }}>
      
      {/* App Header */}
      <header className="border-b border-white/5 bg-slate-950/50 backdrop-blur-xl relative z-50">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-10 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e85d22] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e85d22]"></span>
              </div>
              <span className="text-[#e85d22] text-[11px] font-black tracking-[0.2em] uppercase">Snapdragon® AI Lab Challenge</span>
            </div>
            <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck size={12} className="text-emerald-400" />
              <span className="text-emerald-400 text-[10px] font-bold tracking-wider">SYSTEM SECURE</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Telemetry */}
            <div className="flex items-center gap-4 px-4 py-1.5 rounded-full bg-slate-900/80 border border-white/5 hidden md:flex">
              <div className="flex items-center gap-2">
                <Activity size={12} className="text-sky-400" />
                <span className="text-[10px] font-mono text-slate-400">INFERENCE:</span>
                <span className="text-[10px] font-mono font-bold text-sky-400">12.4ms</span>
              </div>
              <div className="h-3 w-px bg-white/10"></div>
              <div className="flex items-center gap-2">
                <Gauge size={12} className="text-fuchsia-400" />
                <span className="text-[10px] font-mono text-slate-400">NPU UTIL:</span>
                <span className="text-[10px] font-mono font-bold text-fuchsia-400 w-8">{Math.round(npuLoad)}%</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.15)] hover:bg-sky-500/20 transition-colors cursor-default">
              <Hexagon size={14} className="text-sky-400" />
              <span className="text-sky-400 text-[10px] font-bold tracking-wide">HEXAGON™ NPU</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="max-w-[1800px] mx-auto px-6 lg:px-10 py-6 w-full flex-1 flex flex-col relative z-10">
        
        {/* Title area inside the layout to save vertical space */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-white/5 border border-white/5 text-[9px] font-bold tracking-widest text-slate-400 mb-3 uppercase">
              <Eye size={12} className="text-sky-400" /> EDGE AI VISION PROTOTYPE
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 tracking-tight">
              SnapCircuit Lab
            </h1>
          </div>
          <div className="hidden lg:flex gap-3">
             {['VISION', 'RULE ENGINE', 'LOCAL LLM'].map(tag => (
               <div key={tag} className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-[9px] font-bold text-slate-500 tracking-widest uppercase">{tag}</div>
             ))}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
          
          {/* ========================================== */}
          {/* COLUMN 1: SHOW (Camera Feed) - span 4      */}
          {/* ========================================== */}
          <div className="lg:col-span-4 bg-slate-900/40 border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl backdrop-blur-xl relative group hover:border-white/20 transition-all duration-500">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <Camera size={12} className="text-indigo-400" />
                </div>
                <span className="text-[11px] font-bold text-slate-300 tracking-[0.15em]">01 | CAMERA FEED</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono text-slate-500">1080p / 60fps</span>
              </div>
            </div>

            {/* Camera Viewport */}
            <div className="m-5 bg-[#02040a] rounded-xl border border-white/5 aspect-[4/3] relative overflow-hidden shadow-inner flex flex-col group-hover:border-indigo-500/30 transition-colors duration-500">
              
              {/* Grid overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              
              {/* Scanning animation */}
              {loading && (
                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                  <div className="w-full h-[2px] bg-sky-400/80 shadow-[0_0_20px_rgba(56,189,248,1)] absolute top-0 left-0 animate-[scan_1.5s_ease-in-out_infinite]"></div>
                </div>
              )}

              {/* Corner Markers */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-indigo-500/50"></div>
              <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-indigo-500/50"></div>
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-indigo-500/50"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-indigo-500/50"></div>

              {/* "Live" Indicator */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md rounded border border-white/10 px-2 py-1 flex items-center gap-2 z-20">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                <span className="text-[9px] font-bold text-white tracking-wider">REC</span>
              </div>

              {/* Simulated Breadboard / Circuit */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8">
                <div className={`relative flex items-center transition-all duration-700 ${loading ? 'opacity-40 scale-95 blur-[1px]' : 'opacity-100 scale-100'}`}>
                  
                  {/* Resistor Component */}
                  <div className="flex flex-col items-center group/comp">
                    <div className={`w-28 h-12 rounded-lg flex items-center justify-around px-3 relative transition-all duration-300 ${selectedScenario === 'missing_resistor' ? 'border-2 border-dashed border-red-500/30 bg-red-500/5' : 'border border-[#b47828] bg-[#d97706]/90 shadow-xl'}`}>
                      {selectedScenario !== 'missing_resistor' ? (
                        <>
                          <div className="w-2 h-full bg-red-600"></div>
                          <div className="w-2 h-full bg-red-600"></div>
                          <div className="w-2 h-full bg-amber-950"></div>
                          <div className="w-2 h-full bg-amber-400"></div>
                        </>
                      ) : (
                        <span className="text-red-500/50 text-[10px] font-bold">MISSING</span>
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 mt-2 opacity-0 group-hover/comp:opacity-100 transition-opacity">R1 (220Ω)</span>
                  </div>

                  {/* Connecting Wire */}
                  <div className="w-20 h-1.5 relative flex items-center justify-between">
                    <div className={`h-full transition-all duration-300 rounded-full ${selectedScenario === 'open_connection' ? 'w-8 bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]' : 'w-full bg-slate-400'}`}></div>
                    {selectedScenario === 'open_connection' && (
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                      </div>
                    )}
                    {selectedScenario === 'open_connection' && (
                      <div className="h-full w-8 bg-red-500/80 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div>
                    )}
                  </div>

                  {/* LED Component */}
                  <div className="flex flex-col items-center group/comp">
                    <div className="relative">
                      <div className={`w-12 h-14 rounded-t-full rounded-b-md transition-all duration-500 relative z-10 ${
                        isGood ? 'bg-red-500 border border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.8)]' : 'bg-slate-700 border border-slate-600 opacity-80'
                      }`} style={{ transform: selectedScenario === 'reversed_led' ? 'rotate(180deg)' : 'none' }}>
                        {isGood && <div className="absolute inset-2 rounded-full bg-white/40 blur-[2px]"></div>}
                      </div>
                      {/* LED Legs */}
                      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-3 z-0" style={{ transform: selectedScenario === 'reversed_led' ? 'scaleX(-1)' : 'none' }}>
                        <div className="w-1 h-6 bg-slate-300"></div>
                        <div className="w-1 h-4 bg-slate-400"></div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 mt-8 opacity-0 group-hover/comp:opacity-100 transition-opacity">D1 (LED)</span>
                  </div>
                </div>

                {/* Bounding Box Overlay */}
                {!loading && (
                  <div className="absolute inset-6 border border-sky-400/40 rounded pointer-events-none flex flex-col justify-between p-1">
                    <div className="flex justify-between">
                      <span className="text-[7px] font-mono text-sky-400 bg-sky-400/10 px-1 backdrop-blur-sm">CLASS: CIRCUIT_BREADBOARD</span>
                      <span className="text-[7px] font-mono text-sky-400 bg-sky-400/10 px-1 backdrop-blur-sm">CONF: 99.8%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Scenario Selector */}
            <div className="px-5 pb-5 mt-auto flex-1 flex flex-col">
              <h3 className="text-[10px] font-bold text-slate-500 tracking-[0.15em] mb-3 flex items-center gap-2">
                <PlaySquare size={12} />
                SIMULATION CONTROLS
              </h3>
              <div className="grid grid-cols-1 gap-2 flex-1">
                {scenarios.map(s => {
                  const active = selectedScenario === s.id;
                  return (
                    <button 
                      key={s.id} 
                      onClick={() => setSelectedScenario(s.id)} 
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 group ${
                        active 
                          ? 'bg-indigo-500/15 border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                          : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-white/10 hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div style={{ color: active ? s.color : '#475569' }} className="transition-colors p-1.5 rounded-md bg-white/5">
                          {s.icon}
                        </div>
                        <div className="flex flex-col items-start">
                          <span className={`text-[11px] font-bold ${active ? 'text-slate-100' : 'text-slate-400 group-hover:text-slate-300'}`}>
                            {s.name}
                          </span>
                          <span className="text-[9px] text-slate-500">{s.desc}</span>
                        </div>
                      </div>
                      {active && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* COLUMN 2: ANALYZE & LOGS - span 4          */}
          {/* ========================================== */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Circuit Graph Card */}
            <div className="bg-slate-900/40 border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl backdrop-blur-xl relative group hover:border-white/20 transition-all duration-500 flex-1">
              <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
                    <Cpu size={12} className="text-sky-400" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-300 tracking-[0.15em]">02 | NPU GRAPH</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-sky-400 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}></div>
                  <span className="text-[9px] font-mono text-slate-500">{loading ? 'PROCESSING' : 'IDLE'}</span>
                </div>
              </div>

              {/* Logic Graph */}
              <div className="m-5 bg-slate-950 rounded-xl border border-white/5 flex-1 relative overflow-hidden flex flex-col justify-center shadow-inner group-hover:border-sky-500/20 transition-colors duration-500">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03)_0%,transparent_80%)]"></div>
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: loading ? 0.2 : 1 }}>
                  {/* Default faint background path */}
                  <path d="M 15% 50% L 85% 50%" stroke="rgba(148,163,184,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                  
                  {/* Good state flowing path */}
                  {isGood && !loading && (
                    <path d="M 15% 50% L 85% 50%" stroke="rgba(14,165,233,0.4)" strokeWidth="2" className="animate-[dash_1s_linear_infinite]" strokeDasharray="10 10" />
                  )}

                  {/* Broken state path */}
                  {selectedScenario === 'open_connection' && !loading && (
                    <>
                      {/* Active data flowing to the break */}
                      <path d="M 15% 50% L 48% 50%" stroke="rgba(239,68,68,0.8)" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_1s_linear_infinite]" />
                      <circle cx="48%" cy="50%" r="3" fill="#ef4444" className="animate-pulse" />
                      
                      {/* Dead path after the break */}
                      <path d="M 52% 50% L 85% 50%" stroke="rgba(71,85,105,0.3)" strokeWidth="2" strokeDasharray="2 4" />
                      <circle cx="52%" cy="50%" r="3" fill="#475569" />
                    </>
                  )}
                </svg>

                <div className={`relative z-10 flex items-center justify-between px-6 w-full transition-all duration-500 ${loading ? 'opacity-30 scale-90 blur-sm' : 'opacity-100 scale-100'}`}>
                  
                  {/* 5V Node */}
                  <div className="flex flex-col items-center gap-2 relative group/node hover:scale-110 transition-transform cursor-crosshair">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center shadow-lg relative">
                      <span className="text-[9px] font-black text-slate-300">5V</span>
                      <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></div>
                    </div>
                  </div>

                  {/* Resistor Node */}
                  <div className="flex flex-col items-center gap-2 relative group/node hover:scale-110 transition-transform cursor-crosshair">
                    <div className={`w-14 h-10 rounded-lg border flex items-center justify-center shadow-lg transition-colors duration-300 ${
                      selectedScenario === 'missing_resistor' 
                        ? 'bg-red-500/10 border-red-500/40 border-dashed' 
                        : 'bg-slate-800 border-slate-600'
                    }`}>
                      {selectedScenario === 'missing_resistor' ? (
                        <span className="text-red-500 text-xs">⚠</span>
                      ) : (
                        <svg width="24" height="10" viewBox="0 0 32 12"><polyline points="0,6 4,6 6,1 10,11 14,1 18,11 22,1 26,11 28,6 32,6" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinejoin="round" /></svg>
                      )}
                    </div>
                  </div>

                  {/* High-Tech Break Indicator */}
                  {selectedScenario === 'open_connection' && (
                    <div className="absolute left-[50%] bottom-[30px] -translate-x-1/2 flex flex-col items-center z-20">
                      <div className="flex items-center gap-1.5 bg-red-950/90 border border-red-500/50 px-3 py-1.5 rounded-sm text-red-400 text-[10px] font-mono tracking-widest backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.4)] relative">
                        <AlertTriangle className="w-3 h-3 text-red-500 animate-pulse" />
                        <span>LINK_SEVERED</span>
                        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-red-500"></div>
                        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-red-500"></div>
                      </div>
                      <div className="w-px h-6 bg-gradient-to-b from-red-500/80 to-transparent"></div>
                      {/* Radar ping exactly at the gap */}
                      <div className="absolute bottom-[-16px] w-10 h-10 border border-red-500/40 rounded-full animate-ping"></div>
                    </div>
                  )}

                  {/* LED Node */}
                  <div className={`flex flex-col items-center gap-2 relative group/node hover:scale-110 transition-all duration-300 cursor-crosshair ${selectedScenario === 'open_connection' ? 'opacity-30' : ''}`}>
                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center shadow-lg transition-all duration-500 ${
                      isGood ? 'bg-sky-500/15 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]' : 'bg-slate-800 border-slate-600'
                    }`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isGood ? '#38bdf8' : '#94a3b8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                           style={{ transform: selectedScenario === 'reversed_led' ? 'rotate(180deg)' : 'none', transition: 'transform 0.5s' }}>
                        <polygon points="5,20 19,12 5,4" fill={isGood ? 'rgba(56,189,248,0.3)' : 'transparent'} />
                        <line x1="19" y1="4" x2="19" y2="20" />
                      </svg>
                    </div>
                  </div>

                  {/* GND Node */}
                  <div className={`flex flex-col items-center gap-2 relative group/node hover:scale-110 transition-all duration-300 cursor-crosshair ${selectedScenario === 'open_connection' ? 'opacity-30' : ''}`}>
                    <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-600 flex flex-col items-center justify-center shadow-lg relative">
                      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                      <div className="w-4 h-[1.5px] bg-slate-400 mb-[3px]"></div>
                      <div className="w-2.5 h-[1.5px] bg-slate-400 mb-[3px]"></div>
                      <div className="w-1.5 h-[1.5px] bg-slate-400"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Terminal Window */}
            <div className="bg-[#02040a] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl h-48 relative group hover:border-slate-500/30 transition-colors duration-500">
              <div className="px-4 py-2 border-b border-white/5 bg-slate-900/80 flex items-center gap-2">
                <Terminal size={10} className="text-slate-400" />
                <span className="text-[9px] font-mono text-slate-400">root@snapdragon-ai-edge:~</span>
              </div>
              <div className="p-4 flex-1 overflow-y-auto font-mono text-[10px] leading-relaxed relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#02040a] pointer-events-none opacity-20 z-10"></div>
                {logs.map((log, i) => (
                  <div key={i} className="mb-1">
                    <span className="text-slate-600 mr-2">›</span>
                    <span className={log.includes('ERROR') ? 'text-red-400' : log.includes('COMPLETE') ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                      {log}
                    </span>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-sky-400 mt-2">
                    <span>_</span>
                    <span className="animate-pulse">processing node graph...</span>
                  </div>
                )}
                <div ref={logsEndRef} />
              </div>
            </div>

          </div>

          {/* ========================================== */}
          {/* COLUMN 3: DIAGNOSE (Output) - span 4       */}
          {/* ========================================== */}
          <div className="lg:col-span-4 bg-slate-900/40 border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl backdrop-blur-xl relative group hover:border-white/20 transition-all duration-500">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors duration-300 ${
                  loading ? 'bg-slate-800 border-slate-700' : 
                  isGood ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-orange-500/20 border-orange-500/40'
                }`}>
                  {loading ? <Activity size={12} className="text-slate-500" /> : 
                   isGood ? <CheckCircle size={12} className="text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" /> : <AlertTriangle size={12} className="text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />}
                </div>
                <span className="text-[11px] font-bold text-slate-300 tracking-[0.15em]">03 | DIAGNOSIS</span>
              </div>
              
              {loading && (
                <div className="flex gap-1.5">
                  {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-sky-400/80 animate-bounce" style={{ animationDelay: `${i * 150}ms` }}></div>)}
                </div>
              )}
            </div>

            {/* Results Content */}
            <div className="p-8 flex-1 flex flex-col relative overflow-hidden">
              
              {/* Background glow for result */}
              {!loading && diagnosis && (
                <div className={`absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-bl rounded-full blur-[100px] opacity-[0.15] pointer-events-none transition-colors duration-1000 ${
                  isGood ? 'from-emerald-400 to-transparent' : 'from-orange-500 to-transparent'
                }`}></div>
              )}

              <div className={`flex flex-col h-full transition-all duration-700 ease-out z-10 ${
                loading || animating ? 'opacity-0 translate-y-8 scale-[0.98]' : 'opacity-100 translate-y-0 scale-100'
              }`}>
                
                {diagnosis ? (
                  <>
                    {/* Fault Title */}
                    <div className="mb-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`h-4 w-1 rounded-full ${isGood ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]'}`}></div>
                        <span className={`text-[10px] font-black tracking-[0.2em] ${isGood ? 'text-emerald-400' : 'text-orange-400'}`}>
                          {isGood ? 'SYSTEM VERIFIED' : 'FAULT DETECTED'}
                        </span>
                      </div>
                      <h2 className={`text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight ${!isGood && !loading && !animating ? 'animate-[glitch_0.4s_ease-in-out]' : ''}`}>
                        {diagnosis.possible_fault}
                      </h2>
                    </div>

                    {/* Reasoning (Why) */}
                    <div className="mb-10 group/reason cursor-default">
                      <div className="flex items-center gap-2 mb-4">
                        <Microchip size={14} className="text-sky-400" />
                        <span className="text-[9px] font-bold tracking-[0.2em] text-sky-400">LLM REASONING</span>
                      </div>
                      <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 group-hover/reason:border-slate-600 transition-colors duration-300">
                        <p className="text-[15px] text-slate-300 leading-relaxed font-medium">
                          {diagnosis.why}
                        </p>
                      </div>
                    </div>

                    {/* Next Step */}
                    <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-6 mb-4 mt-auto">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap size={14} className="text-sky-400 animate-pulse" />
                        <span className="text-[10px] font-bold tracking-[0.15em] text-sky-400">RECOMMENDED ACTION</span>
                      </div>
                      <p className="text-lg lg:text-xl text-sky-100 font-semibold leading-tight">
                        {diagnosis.next_step}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                    <Activity size={40} className="mb-4 opacity-20" />
                    <p className="font-mono text-[11px] tracking-widest">AWAITING TELEMETRY...</p>
                  </div>
                )}
              </div>
              
              {/* Loading Overlay */}
              {loading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#020617]/60 backdrop-blur-md rounded-b-xl">
                  <div className="relative flex items-center justify-center mb-6">
                    <div className="absolute inset-0 border-4 border-sky-900 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-transparent border-t-sky-400 border-r-sky-400 rounded-full animate-spin shadow-[0_0_30px_rgba(56,189,248,0.4)]"></div>
                    <Cpu size={20} className="text-sky-400 absolute animate-pulse" />
                  </div>
                  <div className="text-sky-400 font-mono text-[11px] font-bold tracking-[0.3em] animate-pulse">EVALUATING RULES</div>
                </div>
              )}
            </div>
            
            {/* Footer Status */}
            <div className="px-5 py-3 bg-black/40 border-t border-white/5 relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500/70" />
                <span className="text-[9px] font-mono text-slate-400">EDGE INFERENCE ONLY</span>
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-500 bg-white/5 px-2 py-1 rounded">0 MS CLOUD LATENCY</span>
            </div>
          </div>

        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        @keyframes scan {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
        
        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }
        
        @keyframes glitch {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 2px); filter: hue-rotate(90deg); }
          40% { transform: translate(-2px, -2px); filter: blur(1px); }
          60% { transform: translate(2px, 2px); filter: invert(20%); }
          80% { transform: translate(2px, -2px); filter: contrast(200%); }
          100% { transform: translate(0) }
        }
        
        body { margin: 0; padding: 0; background-color: #020617; }
        
        /* Custom scrollbar for terminal */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}

export default App;
