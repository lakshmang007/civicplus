import { useEffect, useState } from 'react';
import { dbService } from '../services/db';
import { Authority } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Search, MapPin, Phone, Mail, Award, TrendingUp, CheckCircle } from 'lucide-react';
import { Input } from '../components/ui/input';
import { motion } from 'motion/react';

export default function Directory() {
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Seed data if empty (for demo purposes)
  const seedAuthorities = [
    {
      id: 'a1',
      name: 'Dr. Ramesh Kumar',
      department: 'Wastewater Management',
      location: 'Central Zone',
      trustScore: 88.4,
      bio: 'Expert in urban sanitation with 15 years in civic administration.',
      email: 'rkumar@civicpulse.org',
      whatsapp: '+91-9876543210'
    },
    {
      id: 'a2',
      name: 'Smt. Priya Singh',
      department: 'Infrastructure & Roads',
      location: 'East Zone',
      trustScore: 94.1,
      bio: 'Dedicated to building quality roads and durable urban infrastructure.',
      email: 'psingh@civicpulse.org',
      whatsapp: '+91-9876543211'
    },
    {
      id: 'a3',
      name: 'Shri Anand Varma',
      department: 'Public Safety',
      location: 'West Zone',
      trustScore: 72.8,
      bio: 'Liaising between communities and local police for better safety.',
      email: 'avarma@civicpulse.org',
      whatsapp: '+91-9876543212'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const data = await dbService.getCollection<Authority>('authorities');
      if (data && data.length > 0) {
        setAuthorities(data);
      } else {
        setAuthorities(seedAuthorities as unknown as Authority[]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = authorities.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Authority Directory</h1>
          <p className="text-neutral-500 text-xs max-w-xl">
            Live profiles of local officials. Trust Scores generated based on resolution latency and verified citizen feedback.
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
          <Input 
            placeholder="FILTER_RECORDS_..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs rounded-md border-neutral-200 bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((auth, i) => (
          <motion.div
            key={auth.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="high-density-card h-full">
              <div className="card-header-label">{auth.department}</div>
              <div className="p-5 flex-1 flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-2xl overflow-hidden">
                    <Avatar className="w-full h-full rounded-none">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.name}`} />
                      <AvatarFallback>{auth.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">{auth.name}</h3>
                    <div className="flex items-center text-[10px] text-neutral-400 font-mono">
                      <MapPin size={10} className="mr-1" />
                      {auth.location}
                    </div>
                  </div>
                </div>

                <div className="text-center py-4 border-y border-neutral-50">
                  <div className="text-4xl font-bold font-mono text-accent tracking-tighter">{auth.trustScore}</div>
                  <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Trust Score Index</div>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] text-neutral-500 italic leading-relaxed">
                    "{auth.bio}"
                  </p>
                  
                  <div className="space-y-1.5 pt-2 border-t border-neutral-50">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-neutral-400 font-bold uppercase tracking-tighter">Verified Contact</span>
                      <span className="text-neutral-900 font-mono tracking-tight">{auth.email}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-neutral-400 font-bold uppercase tracking-tighter">Response Time</span>
                      <span className="text-neutral-900 font-mono tracking-tight">4.2d (Avg)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-auto">
                  <Button variant="outline" className="w-full h-8 text-[10px] font-bold uppercase tracking-widest bg-neutral-50 border-neutral-200 hover:bg-neutral-900 hover:text-white transition-all">
                    View Verified Ledger
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
