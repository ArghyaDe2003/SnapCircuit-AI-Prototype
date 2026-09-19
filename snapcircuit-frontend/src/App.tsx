import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, CheckCircle, AlertTriangle, Info, RefreshCw } from 'lucide-react';

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
    <div className="min-h-screen bg-background text-gray-100 font-sans selection:bg-primary/30">
      {/* Header */}
      <header className="border-b border-gray-800 bg-surface/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              SnapCircuit Lab
            </h1>
            <p className="text-sm text-gray-400 mt-1">Offline AI Electronics Troubleshooting Assistant</p>
          </div>
          <div className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
            Prototype
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Controls */}
        <section className="mb-8 p-6 bg-surface rounded-xl border border-gray-800 shadow-xl">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Select Test Scenario
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {scenarios.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedScenario(s.id)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  selectedScenario === s.id 
                    ? 'bg-primary text-background shadow-[0_0_15px_rgba(56,189,248,0.3)] border border-primary' 
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 border border-gray-700'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vision/Circuit Panel */}
          <section className="p-6 bg-surface rounded-xl border border-gray-800 shadow-xl flex flex-col">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">01 | ANALYZE</h2>
             </div>
             
             <div className="flex-1 bg-gray-900 rounded-lg border border-gray-800 flex items-center justify-center p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]"></div>
                
                {/* Mock Circuit Visuals based on scenario */}
                <div className="relative z-10 w-full max-w-md">
                   <div className="flex items-center justify-between border-b-2 border-gray-700 pb-4 mb-4">
                      <div className="text-xs text-gray-500 font-mono">VCC (5V)</div>
                      <div className="text-xs text-gray-500 font-mono">GND</div>
                   </div>
                   
                   <div className="flex items-center justify-center gap-8 py-8">
                      {/* Resistor */}
                      {selectedScenario !== 'missing_resistor' && (
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-6 bg-amber-700/80 rounded-sm border border-amber-900 flex justify-around items-center px-2">
                             <div className="w-1 h-full bg-red-500"></div>
                             <div className="w-1 h-full bg-black"></div>
                             <div className="w-1 h-full bg-red-500"></div>
                             <div className="w-1 h-full bg-yellow-500"></div>
                          </div>
                          <span className="text-[10px] text-gray-500 mt-2 font-mono">220Ω</span>
                        </div>
                      )}
                      
                      {/* Wire / Break */}
                      <div className="flex-1 h-1 bg-gray-600 relative">
                         {selectedScenario === 'open_connection' && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gray-900 border-2 border-red-500/50 rounded-full flex items-center justify-center">
                               <div className="w-4 h-[2px] bg-red-500 rotate-45 absolute"></div>
                            </div>
                         )}
                         {selectedScenario !== 'open_connection' && (
                            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-primary shadow-[0_0_8px_rgba(56,189,248,0.5)]"></div>
                         )}
                      </div>

                      {/* LED */}
                      <div className="flex flex-col items-center">
                         <div className={`w-10 h-10 rounded-t-full rounded-b-md border-b-4 ${
                           selectedScenario === 'correct_led' 
                              ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)] border-red-700' 
                              : 'bg-red-950 border-red-900'
                         } relative flex justify-center`}>
                            {/* Anode/Cathode indicators */}
                            <div className={`absolute -bottom-6 w-1 h-6 bg-gray-400 ${selectedScenario === 'reversed_led' ? 'left-2' : 'right-2'}`}></div>
                            <div className={`absolute -bottom-8 w-1 h-8 bg-gray-400 ${selectedScenario === 'reversed_led' ? 'right-2' : 'left-2'}`}></div>
                         </div>
                         <span className="text-[10px] text-gray-500 mt-10 font-mono">LED</span>
                      </div>
                   </div>
                   
                   {/* Rule engine mock UI overlay */}
                   <div className="mt-8 grid grid-cols-3 gap-2">
                      <div className="bg-gray-800/80 rounded px-2 py-1 text-[10px] font-mono text-center text-primary/80 border border-primary/20">VISION → GRAPH</div>
                      <div className="bg-gray-800/80 rounded px-2 py-1 text-[10px] font-mono text-center text-primary/80 border border-primary/20">RULE CHECK</div>
                      <div className="bg-gray-800/80 rounded px-2 py-1 text-[10px] font-mono text-center text-primary/80 border border-primary/20">LOCAL AI</div>
                   </div>
                </div>
             </div>
          </section>

          {/* Diagnosis Panel */}
          <section className="p-6 bg-surface rounded-xl border border-gray-800 shadow-xl flex flex-col">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">02 | DIAGNOSIS</h2>
                {loading && <RefreshCw className="w-5 h-5 text-gray-500 animate-spin" />}
             </div>

             <div className="flex-1 flex flex-col gap-4">
                {diagnosis ? (
                  <>
                    <div className="bg-gray-900/50 rounded-lg p-5 border border-gray-800">
                       <div className="text-xs font-semibold text-primary mb-1 tracking-wider">POSSIBLE FAULT</div>
                       <div className="text-xl text-white font-medium flex items-start gap-3">
                         {selectedScenario === 'correct_led' ? (
                            <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 shrink-0" />
                         ) : (
                            <AlertTriangle className="w-6 h-6 text-amber-500 mt-0.5 shrink-0" />
                         )}
                         {diagnosis.possible_fault}
                       </div>
                    </div>

                    <div className="bg-gray-900/50 rounded-lg p-5 border border-gray-800">
                       <div className="text-xs font-semibold text-gray-400 mb-2 tracking-wider">WHY</div>
                       <p className="text-gray-300 leading-relaxed">
                          {diagnosis.why}
                       </p>
                    </div>

                    <div className="mt-auto bg-primary/5 rounded-lg p-5 border border-primary/20">
                       <div className="text-xs font-semibold text-primary mb-2 tracking-wider">NEXT STEP</div>
                       <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-white font-medium">
                             {diagnosis.next_step}
                          </p>
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
