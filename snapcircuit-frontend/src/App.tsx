import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, CheckCircle, AlertTriangle, Info, RefreshCw, ArrowRight } from 'lucide-react';

const scenarios = [
  { id: 'correct_led', name: 'Correct LED circuit' },
  { id: 'reversed_led', name: 'Reversed LED' },
  { id: 'missing_resistor', name: 'Missing resistor' },
  { id: 'open_connection', name: 'Open connection' }
];

function App() {
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0].id);
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDiagnosis(selectedScenario);
  }, [selectedScenario]);

  const fetchDiagnosis = async (scenarioId: string) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/analyze', { scenario_id: scenarioId });
      setDiagnosis(response.data.diagnosis);
    } catch (error) {
      console.error("Error fetching diagnosis:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-gray-100 font-sans selection:bg-primary/30 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-surface/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-primary tracking-wider mb-1 flex items-center gap-2">
              <span className="text-red-500">■</span> SNAPDRAGON® AI LAB BUILD & PRESENT CHALLENGE 2026
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              SnapCircuit Lab
            </h1>
          </div>
          <div className="text-xs font-medium px-4 py-1.5 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
            BRIEF PROJECT DESCRIPTION
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8 flex flex-col">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">See the Fault. Understand the Cause. Fix the Circuit.</h2>
          <p className="text-gray-400">From camera input to an explainable electronics diagnosis.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          {/* 01 | SHOW Panel */}
          <section className="bg-[#0f1523] rounded-xl border border-gray-800 shadow-xl flex flex-col overflow-hidden">
             <div className="p-5 border-b border-gray-800/50">
                <h2 className="text-sm font-semibold text-white tracking-wide">01 | SHOW</h2>
             </div>
             
             <div className="p-5 flex-1 flex flex-col gap-6">
                <div className="aspect-video bg-gray-900 rounded-lg border border-gray-700 relative flex flex-col overflow-hidden group">
                   <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-medium text-white border border-gray-700">
                      <Camera className="w-3 h-3" /> LIVE
                   </div>
                   
                   {/* Simplified mock circuit for camera view */}
                   <div className="flex-1 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                      <div className="w-full h-12 border-y border-dashed border-gray-700 relative">
                         <div className="absolute top-1/2 left-0 w-full h-[2px] bg-red-500/50 -translate-y-1/2"></div>
                         <div className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 border-2 rounded-full ${selectedScenario === 'open_connection' ? 'border-red-500/80 left-[30%]' : 'border-transparent left-[30%]'}`}></div>
                      </div>
                   </div>
                   
                   <div className="absolute inset-0 border-2 border-primary/20 m-2 rounded pointer-events-none">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
                   </div>
                </div>

                <div className="flex-1 flex flex-col justify-end">
                  <p className="text-sm text-gray-400 mb-4">Point the camera at the circuit.</p>
                  
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                    <div className="text-xs font-semibold text-gray-500 mb-3">TEST SCENARIOS (PROTOTYPE)</div>
                    <div className="flex flex-col gap-2">
                      {scenarios.map(s => (
                        <button
                          key={s.id}
                          onClick={() => setSelectedScenario(s.id)}
                          className={`px-3 py-2 rounded text-xs font-medium text-left transition-all ${
                            selectedScenario === s.id 
                              ? 'bg-primary/10 text-primary border border-primary/30' 
                              : 'bg-gray-800/30 text-gray-400 hover:bg-gray-800 hover:text-gray-200 border border-transparent'
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto">
                   <div className="inline-flex px-3 py-1 rounded text-[10px] font-semibold tracking-wider border border-primary/30 text-primary bg-primary/5 uppercase">
                      Physical Circuit
                   </div>
                </div>
             </div>
          </section>

          {/* 02 | ANALYZE Panel */}
          <section className="bg-[#0f1523] rounded-xl border border-gray-800 shadow-xl flex flex-col relative overflow-hidden">
             {/* Flow Arrows */}
             <div className="absolute top-1/2 -left-3 -translate-y-1/2 z-10 w-6 h-6 bg-[#0f1523] border-t border-b border-r border-gray-800 rounded-r flex items-center justify-center lg:hidden">
               <ArrowRight className="w-3 h-3 text-gray-500" />
             </div>
             <div className="absolute top-1/2 -right-3 -translate-y-1/2 z-10 w-6 h-6 bg-[#0f1523] border-t border-b border-l border-gray-800 rounded-l flex items-center justify-center lg:hidden">
               <ArrowRight className="w-3 h-3 text-gray-500" />
             </div>

             <div className="p-5 border-b border-gray-800/50">
                <h2 className="text-sm font-semibold text-white tracking-wide">02 | ANALYZE</h2>
             </div>
             
             <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="flex-1 bg-[#151c2c] rounded-lg border border-gray-800 flex items-center justify-center p-6 relative">
                   <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:16px_16px]"></div>
                   
                   {/* Detailed Circuit Graph */}
                   <div className="relative w-full max-w-sm">
                      <div className="flex items-center justify-between gap-4">
                         
                         <div className="flex flex-col items-center">
                           <div className="px-2 py-0.5 bg-primary/20 border border-primary/30 text-[9px] text-primary rounded mb-1 font-mono uppercase">Connection</div>
                           <div className="w-full h-[2px] bg-gray-500"></div>
                         </div>
                         
                         {selectedScenario !== 'missing_resistor' && (
                           <div className="flex flex-col items-center">
                             <div className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-[9px] text-emerald-400 rounded mb-1 font-mono uppercase">Resistor</div>
                             <div className="w-12 h-4 border-2 border-emerald-600 rounded-sm flex items-center">
                                <svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
                                   <polyline points="0,10 10,10 20,2 40,18 60,2 80,18 90,10 100,10" fill="none" stroke="#10b981" strokeWidth="2" strokeLinejoin="miter" />
                                </svg>
                             </div>
                           </div>
                         )}
                         
                         <div className="flex flex-col items-center">
                           <div className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 text-[9px] text-blue-400 rounded mb-1 font-mono uppercase">LED</div>
                           <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${selectedScenario === 'correct_led' ? 'border-blue-500 bg-blue-950/50' : 'border-gray-600 bg-gray-900/50'}`}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={selectedScenario === 'correct_led' ? '#3b82f6' : '#4b5563'} strokeWidth="2">
                                <path d="M12 2v20M7 12h10M17 7l-5 5-5-5" />
                              </svg>
                           </div>
                         </div>
                         
                      </div>
                   </div>
                </div>

                <div className="mt-6 flex flex-col gap-4">
                   <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono font-medium text-primary">
                      <span>VISION</span>
                      <ArrowRight className="w-3 h-3 text-gray-600" />
                      <span>CIRCUIT GRAPH</span>
                      <ArrowRight className="w-3 h-3 text-gray-600" />
                      <span>RULE CHECK</span>
                      <ArrowRight className="w-3 h-3 text-gray-600" />
                      <span>LOCAL AI</span>
                   </div>
                   
                   <p className="text-sm text-gray-400">Extract evidence <span className="text-gray-600 mx-1">→</span> validate <span className="text-gray-600 mx-1">→</span> explain</p>
                </div>
                
                <div className="mt-8">
                   <div className="inline-flex px-3 py-1 rounded text-[10px] font-semibold tracking-wider border border-primary/30 text-primary bg-primary/5 uppercase">
                      Local Analysis
                   </div>
                </div>
             </div>
          </section>

          {/* 03 | DIAGNOSE Panel */}
          <section className="bg-[#11131a] rounded-xl border border-gray-800 shadow-xl flex flex-col relative">
             <div className="p-5 border-b border-gray-800/50 flex justify-between items-center">
                <h2 className="text-sm font-semibold text-white tracking-wide">03 | DIAGNOSE</h2>
                {loading && <RefreshCw className="w-4 h-4 text-gray-500 animate-spin" />}
             </div>

             <div className="p-6 flex-1 flex flex-col">
                {diagnosis ? (
                  <>
                    <div className="relative pl-4 mb-8">
                       {/* Left colored bar */}
                       <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full ${selectedScenario === 'correct_led' ? 'bg-emerald-500' : 'bg-[#e85d22]'}`}></div>
                       
                       <div className="text-[11px] font-bold tracking-wider mb-2 uppercase" style={{ color: selectedScenario === 'correct_led' ? '#10b981' : '#e85d22' }}>
                          POSSIBLE FAULT
                       </div>
                       <div className="text-xl text-white font-bold leading-snug">
                         {diagnosis.possible_fault}
                       </div>
                    </div>

                    <div className="mb-8">
                       <div className="text-[11px] font-semibold text-gray-500 mb-2 tracking-wider">WHY</div>
                       <p className="text-[15px] text-gray-300 leading-relaxed">
                          {diagnosis.why}
                       </p>
                    </div>

                    <div className="mb-10">
                       <div className="text-[11px] font-semibold text-primary mb-2 tracking-wider">NEXT STEP</div>
                       <p className="text-[15px] text-white">
                          {diagnosis.next_step}
                       </p>
                    </div>
                    
                    <div className="mt-auto">
                       <div className="bg-[#151b24] border border-[#1f2937] rounded-lg p-4 flex items-center justify-between">
                          <div>
                            <div className="text-xs font-semibold text-emerald-500 uppercase tracking-wide mb-1">Ready to Retest</div>
                            <div className="text-xs text-gray-400">Corrected physical state</div>
                          </div>
                          <div className="w-16 h-8 bg-[#1f2937] rounded border border-[#374151] flex items-center justify-center">
                             <CheckCircle className="w-4 h-4 text-emerald-500" />
                          </div>
                       </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <p>Awaiting analysis...</p>
                  </div>
                )}
             </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
