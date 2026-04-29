import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { geminiService } from '../services/gemini';
import { CheckCircle2, FileText, Loader2, Send, Vote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function VoterID() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const data = await geminiService.analyzeVoterID(input);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Voter Roadmap Assistant</h1>
        <p className="text-neutral-500 text-xs text-balance">AI-powered ECI compliance auditor. Describe your situation to generate a certified roadmap.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="high-density-card">
            <div className="card-header-label">Input Terminal</div>
            <div className="p-6 space-y-4">
              <div className="flex gap-3">
                <Input 
                  placeholder="E.g. 'I just turned 18 and live in Bengaluru South'..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 h-10 text-xs rounded-md border-neutral-200 bg-white"
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
                <Button 
                  onClick={handleAnalyze} 
                  disabled={loading} 
                  className="h-10 px-4 bg-accent hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest"
                >
                  {loading ? <Loader2 className="animate-spin" size={14} /> : 'Execute'}
                </Button>
              </div>

              <div className="p-3 bg-neutral-50 border border-neutral-100 rounded text-[10px] text-neutral-400 font-mono">
                [SYSTEM] Ready for situational analysis. Please provide age, current residency status, and previous registration history if applicable.
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {result && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="high-density-card">
                  <div className="card-header-label">Roadmap_Deployment_Manifest</div>
                  <div className="p-6 space-y-6">
                    <div className="flex items-start space-x-4 p-4 rounded-lg bg-neutral-50 border border-neutral-100">
                      <div className={`p-2 rounded ${result.isEligible ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {result.isEligible ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold">{result.isEligible ? 'ELIGIBILITY_VERIFIED' : 'ACTION_REQUIRED'}</h3>
                        <p className="text-xs text-neutral-600 leading-relaxed font-medium">{result.nextStep}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Step-by-Step Execution</h4>
                      <div className="divide-y divide-neutral-50">
                        {result.roadmap?.map((step: string, i: number) => (
                          <div key={i} className="py-3 flex items-start space-x-4">
                            <div className="flex-shrink-0 w-6 h-6 rounded bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[10px] font-bold font-mono text-neutral-400">
                              0{i + 1}
                            </div>
                            <div className="text-xs text-neutral-700 leading-relaxed">
                              {step}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button variant="outline" className="w-full h-9 border-neutral-200 bg-neutral-50 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-all">
                      <FileText size={14} className="mr-2" />
                      Generate Official PDF Checklist
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <div className="high-density-card bg-sidebar text-white border-0">
            <div className="card-header-label text-slate-500 border-slate-800">ECI_Protocol_Reference</div>
            <div className="p-5 space-y-5">
              <div className="space-y-2">
                <Badge variant="outline" className="text-[9px] border-slate-700 text-slate-400 font-mono tracking-widest text-[8px] uppercase">Form_6_New_Entry</Badge>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Required for all new voters or those shifting from another constituency. Ensure scans of age proof (Birth Cert/10th) and identity are &lt;2MB.
                </p>
              </div>
              <div className="space-y-2 border-t border-slate-800 pt-5">
                <Badge variant="outline" className="text-[9px] border-slate-700 text-slate-400 font-mono tracking-widest text-[8px] uppercase">EPIC_Sync</Badge>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Your Electoral Photo Identity Card is your primary civic credential. AI mapping ensures no ghost entries in Ward 142.
                </p>
              </div>
            </div>
          </div>

          <div className="high-density-card border-dashed bg-neutral-50 border-neutral-200">
            <div className="p-5 flex flex-col items-center text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                <Vote size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900">Ward Registration Info</div>
                <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-tighter">Synced with Election Comission Data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
