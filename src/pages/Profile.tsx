import { useEffect, useState } from 'react';
import { dbService } from '../services/db';
import { UserProfile, Report } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Languages, History, Settings, LogOut, ShieldCheck, Mail, Map, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { where } from 'firebase/firestore';

interface ProfileProps {
  user: any;
}

export default function Profile({ user }: ProfileProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userReports, setUserReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await dbService.getDocument<UserProfile>(`users/${user.uid}`);
      if (data) {
        setProfile(data);
      } else {
        // Create initial profile if missing
        const newProfile = {
          uid: user.uid,
          displayName: user.displayName || 'Citizen',
          email: user.email || '',
          photoURL: user.photoURL || '',
          language: 'en',
          createdAt: new Date()
        };
        await dbService.setDocument(`users/${user.uid}`, newProfile);
        setProfile(newProfile as any);
      }
      
      const reports = await dbService.getCollection<Report>('reports', [where('creatorId', '==', user.uid)]);
      setUserReports(reports || []);
      setLoading(false);
    };

    if (user) fetchProfile();
  }, [user]);

  const handleLanguageChange = async (val: string) => {
    try {
      await dbService.setDocument(`users/${user.uid}`, { language: val });
      setProfile(prev => prev ? { ...prev, language: val as any } : null);
      toast.success("Language preference updated!");
    } catch (error) {
      toast.error("Failed to update language.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="md:w-1/3 space-y-6">
          <Card className="border-neutral-200 shadow-sm overflow-hidden text-center p-6">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-neutral-100">
              <AvatarImage src={user.photoURL || ''} />
              <AvatarFallback>{user.displayName?.[0] || 'C'}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl font-bold tracking-tight">{user.displayName}</CardTitle>
            <p className="text-neutral-500 text-sm font-mono lowercase tracking-tighter mb-4">{user.email}</p>
            <div className="flex justify-center space-x-2">
              <Badge variant="secondary" className="rounded-full">Verified Citizen</Badge>
              <Badge variant="outline" className="rounded-full flex items-center space-x-1">
                <ShieldCheck size={12} className="text-blue-500" />
                <span>Level 1</span>
              </Badge>
            </div>
          </Card>

          <Card className="border-neutral-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-bold mb-2 flex items-center">
                <Settings size={14} className="mr-2" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-xs font-bold text-neutral-500 uppercase tracking-widest">
                   <Languages size={14} className="mr-2" />
                   Preferred Language
                </div>
                <Select value={profile?.language || 'en'} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
                    <SelectItem value="kn">Kannada (ಕನ್ನಡ)</SelectItem>
                    <SelectItem value="te">Telugu (తెలుగు)</SelectItem>
                    <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Profile Area */}
        <div className="flex-1 space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight flex items-center">
                  <History size={24} className="mr-3 text-neutral-400" />
                  My Contributions
                </h2>
                <Badge variant="outline" className="font-mono text-neutral-400">
                  {userReports.length} Reports
                </Badge>
             </div>

             <div className="space-y-4">
                {userReports.map((report) => (
                  <Card key={report.id} className="border-neutral-200 hover:border-neutral-300 transition-all cursor-pointer group">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-bold group-hover:underline">{report.title}</h4>
                        <div className="flex items-center text-xs text-neutral-500 space-x-3">
                           <span className="flex items-center tracking-tighter">
                             <MapPin size={10} className="mr-1" />
                             {report.location.address}
                           </span>
                           <span className="font-mono text-[9px] uppercase bg-neutral-100 px-1.5 py-0.5 rounded">
                             {report.status}
                           </span>
                        </div>
                      </div>
                      <div className="flex -space-x-2">
                          {[1, 2, 3].map(i => (
                             <div key={i} className="w-6 h-6 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center text-[8px] font-bold">
                                +
                             </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {userReports.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-neutral-100 rounded-3xl">
                    <History size={48} className="mx-auto text-neutral-100 mb-2" />
                    <p className="text-neutral-400 text-sm">You haven't reported any issues yet.</p>
                  </div>
                )}
             </div>

             <div className="bg-neutral-900 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <Badge className="bg-white/10 text-white border-white/20 uppercase tracking-widest px-3 py-1">Community Shield</Badge>
                  <h3 className="text-2xl font-bold tracking-tight">Protecting your data</h3>
                  <p className="text-neutral-400 text-sm max-w-md">
                    CivicPulse is built with privacy-respecting algorithms. Your PII is never sold or shared with 3rd parties.
                  </p>
                  <div className="pt-4 flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                       <ShieldCheck className="text-green-500" size={18} />
                       <span className="text-xs font-bold uppercase tracking-widest">End-to-End Secure</span>
                    </div>
                    <div className="flex items-center space-x-2">
                       <Map className="text-blue-500" size={18} />
                       <span className="text-xs font-bold uppercase tracking-widest">Location Masking</span>
                    </div>
                  </div>
                </div>
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
             </div>
        </div>
      </div>
    </div>
  );
}
