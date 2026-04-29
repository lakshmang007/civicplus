import { useEffect, useState } from 'react';
import { dbService } from '../services/db';
import { Report } from '../types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  MapPin, 
  MessageCircle, 
  Share2, 
  Languages, 
  Loader2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Mail,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { geminiService } from '../services/gemini';
import { toast } from 'sonner';
import { orderBy, Timestamp, where } from 'firebase/firestore';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';

function EscalationDialog({ report }: { report: Report }) {
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEscalate = async () => {
    setLoading(true);
    try {
      const email = await geminiService.draftEscalationEmail(
        report.title, 
        report.description, 
        "Local Authority", 
        report.category
      );
      setDraft(email || '');
    } catch (error) {
      toast.error("Failed to draft email.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draft);
    toast.success("Copied to clipboard!");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="p-3 bg-orange-100 text-orange-800 rounded-lg flex items-center justify-between text-xs border border-orange-200 cursor-pointer hover:bg-orange-200 transition-colors">
          <div className="flex items-center space-x-3">
            <TrendingUp size={16} className="animate-bounce" />
            <div>
              <span className="font-bold">ESCALATION_ACTIVE:</span> This issue has high visibility. Click to draft AI escalation.
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
             <ArrowRight size={14} />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white border-neutral-200 shadow-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <TrendingUp className="text-orange-500" />
            <span>AI Escalation Brain</span>
          </DialogTitle>
          <DialogDescription className="font-mono text-[10px] uppercase tracking-widest pt-1">
            DRAFTING_FORMAL_MESSAGE_FOR: {report.title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!draft && !loading ? (
             <div className="py-12 text-center space-y-4">
                <p className="text-sm text-neutral-500">Ready to draft a professional email to the authorities?</p>
                <Button onClick={handleEscalate} className="rounded-full bg-neutral-900 border-neutral-900">
                  <Mail className="mr-2" size={16} />
                  Draft Formal Email
                </Button>
             </div>
          ) : loading ? (
             <div className="py-24 flex flex-col items-center space-y-4">
                <Loader2 className="animate-spin text-orange-500" size={32} />
                <p className="text-xs font-mono tracking-widest text-neutral-400">THINKING_IN_POLITICS_...</p>
             </div>
          ) : (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="space-y-4"
            >
               <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 max-h-[400px] overflow-y-auto font-serif text-sm whitespace-pre-wrap leading-relaxed">
                  {draft}
               </div>
               <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" className="rounded-full" onClick={copyToClipboard}>
                    <Copy className="mr-2" size={14} />
                    Copy Text
                  </Button>
                  <Button size="sm" className="rounded-full bg-neutral-900" onClick={() => toast.success("Draft Sent to Dashboard!")}>
                    Use this Draft
                  </Button>
               </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ArrowRight({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  );
}

interface FeedProps {
  user: any;
}

export default function Feed({ user }: FeedProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [translations, setTranslations] = useState<Record<string, { text: string; translating: boolean }>>({});

  useEffect(() => {
    const unsubscribe = dbService.listenCollection<Report>(
      'reports', 
      [orderBy('createdAt', 'desc')], 
      (data) => {
        setReports(data);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSupport = async (reportId: string, currentCount: number) => {
    if (!user) {
      toast.error("Please login to support reports.");
      return;
    }
    try {
      await dbService.setDocument(`reports/${reportId}`, { supportsCount: currentCount + 1 });
      await dbService.addDocument(`reports/${reportId}/supports`, {
        userId: user.uid,
        reportId,
        createdAt: Timestamp.now()
      });
      toast.success("Supported!");
    } catch (error) {
      console.error(error);
    }
  };

  const handleTranslate = async (reportId: string, text: string) => {
    setTranslations(prev => ({ ...prev, [reportId]: { text: prev[reportId]?.text || '', translating: true } }));
    try {
      const translated = await geminiService.translateText(text, user?.language || 'English');
      setTranslations(prev => ({ ...prev, [reportId]: { text: translated, translating: false } }));
    } catch (error) {
      toast.error("Translation failed.");
      setTranslations(prev => ({ ...prev, [reportId]: { ...prev[reportId], translating: false } }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Community Feed</h1>
          <p className="text-neutral-500 text-xs">Citizen-reported issues requiring civic attention.</p>
        </div>
        <Badge variant="outline" className="font-mono text-[9px] py-0.5 border-neutral-200 uppercase tracking-widest text-neutral-400">
          LOG_COUNT: {reports.length}
        </Badge>
      </div>

      <div className="high-density-card">
        <div className="card-header-label flex justify-between">
           <span>Live Problem Stream</span>
           <span className="text-[9px] animate-pulse text-emerald-500">SYS_CONNECTED</span>
        </div>
        <AnimatePresence>
          <div className="divide-y divide-neutral-100">
            {reports.map((report, i) => {
              const isTranslated = !!translations[report.id]?.text;
              const isTranslating = !!translations[report.id]?.translating;
              const displayDescription = isTranslated ? translations[report.id]!.text : report.description;
              const isEscalated = report.supportsCount >= 50;

              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-4 grid grid-cols-[48px_1fr_110px] gap-4 items-start hover:bg-neutral-50/50 transition-colors group ${isEscalated ? 'border-l-4 border-amber-500' : ''}`}
                >
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-lg border border-neutral-200">
                    {report.category === 'sanitation' ? '🗑️' : report.category === 'water' ? '💧' : report.category === 'infrastructure' ? '🕳️' : '⚠️'}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest bg-neutral-100 text-neutral-600`}>
                        {report.category}
                      </span>
                      <h4 className="text-sm font-bold text-neutral-900 leading-none">{report.title}</h4>
                    </div>
                    
                    <div className="relative">
                      <p className="text-xs text-neutral-600 leading-relaxed max-w-lg">
                        {isTranslating ? (
                          <span className="flex items-center space-x-2 animate-pulse text-neutral-400 font-mono text-[10px]">
                            <Languages size={10} className="animate-spin" />
                            <span>DECODING_...</span>
                          </span>
                        ) : (
                          displayDescription
                        )}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 pt-1">
                      <div className="flex items-center text-[10px] text-neutral-400 font-mono">
                        <MapPin size={10} className="mr-1" />
                        {report.location.address}
                      </div>
                      <div className="flex items-center text-[10px] text-neutral-400 font-mono">
                        <History size={10} className="mr-1" />
                        {new Date(report.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <button 
                        className="text-[9px] font-bold text-accent hover:underline uppercase tracking-widest"
                        onClick={() => handleTranslate(report.id, report.description)}
                      >
                        {isTranslated ? 'Original' : 'Translate'}
                      </button>
                    </div>

                    {isEscalated && (
                       <div className="mt-2">
                         <EscalationDialog report={report} />
                       </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2">
                    <div className="bg-white border border-neutral-200 rounded p-2 text-center">
                       <div className="text-xs font-bold font-mono text-neutral-900">{report.supportsCount}</div>
                       <div className="text-[8px] text-neutral-400 uppercase font-bold tracking-tighter">Verified Spts</div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`h-7 text-[10px] uppercase font-bold tracking-widest rounded transition-all ${report.supportsCount > 0 ? 'bg-blue-50 text-accent border-blue-100' : ''}`}
                      onClick={() => handleSupport(report.id, report.supportsCount)}
                    >
                      Support
                    </Button>
                    <Badge variant={report.status === 'resolved' ? 'default' : 'secondary'} className="text-[8px] justify-center px-1 py-0 uppercase h-5 font-mono">
                      {report.status}
                    </Badge>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      </div>
      
      {reports.length === 0 && !loading && (
        <Card className="p-12 text-center space-y-4 border-dashed border-neutral-200 bg-neutral-50">
          <AlertTriangle className="mx-auto text-neutral-300" size={48} />
          <div className="space-y-1">
            <h3 className="font-bold">No reports yet</h3>
            <p className="text-sm text-neutral-500">Be the first one to report an issue in your area.</p>
          </div>
          <Link to="/submit">
            <Button className="rounded-full bg-neutral-900 border-neutral-900">Create First Report</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
