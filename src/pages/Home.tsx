import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowRight, CheckCircle, MapPin, TrendingUp, Users, Vote } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeProps {
  user: any;
}

export default function Home({ user }: HomeProps) {
  const stats = [
    { label: 'Active Reports', value: '142', icon: TrendingUp, color: 'text-blue-500' },
    { label: 'Resolved 24h', value: '18', icon: CheckCircle, color: 'text-emerald-500' },
    { label: 'Days to Election', value: '45', icon: Vote, color: 'text-amber-500' },
  ];

  const recentIssues = [
    { id: 1, title: 'Road Pothole', location: 'Malleshwaram', support: 52, status: 'escalated', category: 'Urgent' },
    { id: 2, title: 'Water Leak', location: 'Indiranagar', support: 28, status: 'open', category: 'Utility' },
    { id: 3, title: 'Street Light', location: 'Jayanagar', support: 12, status: 'verified', category: 'Safety' },
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Left Column: Stats & Reports */}
      <div className="lg:col-span-2 space-y-6">
        {/* Stat Grid */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col">
              <small className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{stat.label}</small>
              <div className={`text-2xl font-bold font-mono tracking-tighter ${stat.color}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Community Problem Feed Card */}
        <div className="high-density-card">
          <div className="card-header-label flex justify-between items-center">
            <span>Community Problem Feed</span>
            <Link to="/submit" className="text-accent hover:underline lowercase tracking-normal font-medium flex items-center">
              + New Report
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentIssues.map((issue) => (
              <div key={issue.id} className="p-4 grid grid-cols-[40px_1fr_100px] gap-4 items-start hover:bg-neutral-50/50 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-lg text-blue-600">
                  {issue.id === 1 ? '🕳️' : issue.id === 2 ? '💧' : '💡'}
                </div>
                <div className="space-y-1">
                   <div className="flex items-center space-x-2">
                     <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${issue.category === 'Urgent' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'}`}>
                       {issue.category}
                     </span>
                     <h4 className="text-sm font-bold group-hover:text-accent transition-colors">{issue.title}</h4>
                   </div>
                   <p className="text-xs text-neutral-500 line-clamp-1 leading-relaxed">
                     Pothole causing issues in {issue.location}. Reported via Voice-to-Text.
                   </p>
                </div>
                <div className={`text-center p-2 rounded-md font-mono text-[10px] ${issue.status === 'escalated' ? 'bg-red-50 text-red-700 border border-red-100 animate-pulse' : 'bg-neutral-100 text-neutral-500'}`}>
                  <div className="font-bold">{issue.support} Supports</div>
                  <div className="text-[8px] opacity-70 uppercase">{issue.status === 'escalated' ? 'ESCALATED' : `Needs +${50 - issue.support}`}</div>
                </div>
              </div>
            ))}
          </div>
          <Link to="/feed" className="p-3 text-center text-xs text-neutral-400 hover:text-accent font-bold uppercase tracking-widest border-t border-neutral-50">
            View Expanded Feed
          </Link>
        </div>
      </div>

      {/* Right Column: Authority & Logs */}
      <div className="space-y-6">
        <div className="high-density-card">
          <div className="card-header-label">Local Authority Profile</div>
          <div className="p-5 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-3xl">
                👤
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-neutral-900">Mr. Ramesh Kumar</h3>
                <p className="text-xs text-neutral-400 tracking-tight">BBMP Commissioner, Zone 4</p>
              </div>
            </div>
            
            <div className="text-center py-4 border-y border-neutral-50">
               <div className="text-5xl font-bold font-mono text-accent leading-none tracking-tighter">84.2</div>
               <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-2">Community Trust Score</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-neutral-50 p-3 rounded-lg text-center border border-neutral-100">
                  <div className="text-lg font-bold font-mono">120</div>
                  <div className="text-[9px] text-neutral-400 uppercase font-bold">Resolved</div>
               </div>
               <div className="bg-neutral-50 p-3 rounded-lg text-center border border-neutral-100">
                  <div className="text-lg font-bold font-mono">4.2d</div>
                  <div className="text-[9px] text-neutral-400 uppercase font-bold">Avg Response</div>
               </div>
            </div>
          </div>
        </div>

        {/* Tech Log UI */}
        <div className="high-density-card bg-sidebar text-white border-0 shadow-xl">
           <div className="card-header-label border-slate-800 text-slate-500">Real-time Translation Log</div>
           <div className="p-4 font-mono text-[10px] space-y-2.5 leading-relaxed opacity-80">
              <div className="text-emerald-400 flex items-center space-x-2">
                <span className="opacity-50">[09:12:04]</span>
                <span>INBOUND: Kannada voice detected...</span>
              </div>
              <div className="text-blue-400 flex items-center space-x-2">
                <span className="opacity-50">[09:12:05]</span>
                <span>GEMINI: Translating to English...</span>
              </div>
              <div className="text-white flex items-center space-x-2">
                <span className="opacity-50">[09:12:06]</span>
                <span>SUCCESS: "Broken drainage pipe in HSR"</span>
              </div>
              <div className="text-slate-500 flex items-center space-x-2">
                <span className="opacity-50">[09:14:22]</span>
                <span>SYNC: Pushing report to PubWorks DB...</span>
              </div>
              <div className="text-amber-400 flex items-center space-x-2 pt-2">
                <span className="opacity-50">[ALERT]</span>
                <span>Report #3421 hit 50 supports.</span>
              </div>
              <div className="text-amber-300">
                [SYSTEM] AI Brain drafting escalation email...
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
