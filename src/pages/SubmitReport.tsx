import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../services/db';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Mic, MicOff, Camera, MapPin, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface SubmitReportProps {
  user: any;
}

export default function SubmitReport({ user }: SubmitReportProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'infrastructure',
    address: '',
    mediaUrl: ''
  });

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setFormData(prev => ({ ...prev, description: transcript }));
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsRecording(!isRecording);
  };

  const handleLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({ 
          ...prev, 
          address: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}` 
        }));
        toast.success("Location captured!");
      }, () => {
        toast.error("Failed to get location.");
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error("Please fill in title and description.");
      return;
    }
    setLoading(true);
    try {
      await dbService.addDocument('reports', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: {
          address: formData.address || "Unknown Location",
          latitude: 0,
          longitude: 0,
        },
        mediaUrl: formData.mediaUrl || `https://picsum.photos/seed/${Math.random()}/800/600`,
        status: 'open',
        supportsCount: 0,
        creatorId: user.uid,
      });
      toast.success("Report submitted successfully!");
      navigate('/feed');
    } catch (error) {
      toast.error("Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'infrastructure', label: 'Infrastructure (Roads, Lights)' },
    { value: 'sanitation', label: 'Sanitation & Waste' },
    { value: 'water', label: 'Water Supply' },
    { value: 'safety', label: 'Public Safety' },
    { value: 'environment', label: 'Environment & Parks' },
  ];

  return (
    <div className="max-w-2xl mx-auto py-4">
      <Card className="border-neutral-200">
        <CardHeader>
          <div className="flex items-center space-x-2 text-neutral-400 mb-2">
            <PlusCircleIcon className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">New_Community_Event_...</span>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Report a Community Issue</CardTitle>
          <CardDescription>
            Your report will be shared with the community and can be escalated to officials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-neutral-500">Issue Title</label>
              <Input 
                placeholder="Brief summary of the issue" 
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="rounded-xl border-neutral-200 focus:ring-neutral-900"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold uppercase tracking-widest text-neutral-500">Description</label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleRecording}
                  className={`rounded-full px-4 h-8 flex items-center space-x-2 ${isRecording ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-neutral-50 text-neutral-500'}`}
                >
                  {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                  <span className="text-[10px] uppercase font-bold tracking-widest">{isRecording ? 'Listening...' : 'Voice Input'}</span>
                </Button>
              </div>
              <Textarea 
                placeholder="Give us more details. What, where, and when?" 
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="rounded-xl border-neutral-200 focus:ring-neutral-900 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-neutral-500">Category</label>
                <Select 
                    value={formData.category} 
                    onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                >
                  <SelectTrigger className="rounded-xl border-neutral-200">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-neutral-500">Location</label>
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Address or GPS" 
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="rounded-xl border-neutral-200"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={handleLocation} className="rounded-xl shrink-0">
                    <MapPin size={20} />
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button type="button" variant="ghost" className="rounded-full space-x-2 text-neutral-400">
                <Camera size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Add Photo</span>
              </Button>
              
              <Button 
                type="submit" 
                disabled={loading} 
                className="rounded-full px-8 bg-neutral-900 hover:bg-neutral-800 text-white min-w-[140px]"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2" size={18} />}
                <span>Submit Report</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="mt-8 flex items-start space-x-4 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
          <CheckCircle2Icon size={16} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-900">Privacy First</h4>
          <p className="text-xs text-blue-700 leading-relaxed">
            Your exact identity is protected. We only share your public profile name and the report details for civic escalation purposes.
          </p>
        </div>
      </div>
    </div>
  );
}

function PlusCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  );
}

function CheckCircle2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
